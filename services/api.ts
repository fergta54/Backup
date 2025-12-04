import { supabase, isSupabaseConfigured } from './supabase';
import { Machine, BackupLog, Alert, DashboardStats, UserProfile, BackupJob } from '../types';

/*
  SERVICIO API CONECTADO A SUPABASE
  =================================
  Este servicio asume que las tablas (profiles, machines, backup_jobs, backup_logs, system_alerts)
  existen en tu proyecto de Supabase tal como se especificó en el script SQL.
*/

export const api = {
  // 1. OBTENER MÁQUINAS
  getMachines: async (): Promise<Machine[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];
    
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
    return data as Machine[];
  },

  // 2. OBTENER LOGS (Con Joins a Machines y Jobs)
  getLogs: async (limit = 50): Promise<BackupLog[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('backup_logs')
      .select(`
        *,
        machines:machine_id (name),
        backup_jobs:job_id (name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }

    // Mapeo para aplanar la estructura de respuesta de Supabase
    return data.map((log: any) => ({
      id: log.id,
      machine_id: log.machine_id,
      machine_name: log.machines?.name || 'Dispositivo Desconocido',
      job_id: log.job_id,
      job_name: log.backup_jobs?.name || 'Manual',
      status: log.status,
      size_mb: log.size_mb,
      duration_seconds: log.duration_seconds,
      message: log.message,
      created_at: log.created_at
    }));
  },

  // 3. OBTENER ALERTAS NO RESUELTAS
  getAlerts: async (): Promise<Alert[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
    return data as Alert[];
  },

  // 4. CALCULAR ESTADÍSTICAS DEL DASHBOARD (Agregaciones en tiempo real)
  getStats: async (): Promise<DashboardStats> => {
    if (!isSupabaseConfigured() || !supabase) {
      return { totalBackups: 0, successRate: 0, totalDataProtected: '0 GB', activeAlerts: 0 };
    }

    // Total Backups
    const { count: totalBackups } = await supabase
      .from('backup_logs')
      .select('*', { count: 'exact', head: true });

    // Success Count
    const { count: successBackups } = await supabase
      .from('backup_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'success');

    // Alertas Activas
    const { count: activeAlerts } = await supabase
      .from('system_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('is_resolved', false);

    // Suma de datos (Obtenemos los últimos 100 para estimar, o usamos una RPC si fuera necesario)
    const { data: sizeData } = await supabase
      .from('backup_logs')
      .select('size_mb')
      .eq('status', 'success')
      .limit(1000);

    const totalMb = sizeData?.reduce((acc, curr) => acc + (curr.size_mb || 0), 0) || 0;
    let totalDataStr = '';
    if (totalMb > 1024 * 1024) totalDataStr = `${(totalMb / (1024 * 1024)).toFixed(1)} TB`;
    else if (totalMb > 1024) totalDataStr = `${(totalMb / 1024).toFixed(1)} GB`;
    else totalDataStr = `${totalMb} MB`;

    const successRate = totalBackups ? Math.round((successBackups! / totalBackups!) * 100) : 0;

    return {
      totalBackups: totalBackups || 0,
      successRate,
      totalDataProtected: totalDataStr,
      activeAlerts: activeAlerts || 0
    };
  },

  // 5. OBTENER PERFIL DE USUARIO
  getUserProfile: async (userId: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) return null;
    return data as UserProfile;
  },

  // 6. OBTENER JOBS (Configuraciones de Backup)
  getBackupJobs: async (): Promise<BackupJob[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];
    
    const { data, error } = await supabase.from('backup_jobs').select('*');
    if (error) throw error;
    return data as BackupJob[];
  }
};