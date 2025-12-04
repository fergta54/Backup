export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role: string;
}

export interface Machine {
  id: string;
  name: string;
  ip_address: string;
  os: string;
  status: 'online' | 'offline' | 'warning' | 'backup_in_progress';
  total_storage: string;
  used_storage: string;
  last_seen: string;
  created_at?: string;
}

export interface BackupJob {
  id: string;
  machine_id: string;
  name: string;
  schedule_cron: string;
  target_directories: string[];
  retention_days: number;
  is_active: boolean;
}

export interface BackupLog {
  id: string;
  job_id?: string;
  machine_id: string;
  // Campos calculados para la UI (joins)
  machine_name?: string; 
  job_name?: string;
  
  status: 'success' | 'failed' | 'warning';
  size_mb: number;
  duration_seconds: number;
  message: string;
  created_at: string;
}

export interface Alert {
  id: string;
  machine_id?: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  is_resolved: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalBackups: number;
  successRate: number;
  totalDataProtected: string;
  activeAlerts: number;
}