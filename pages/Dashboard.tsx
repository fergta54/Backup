import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { HardDrive, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { BackupLog, Alert, DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<BackupLog[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Datos simulados para el gráfico ya que requeriría una query compleja de agregación por fecha
  // que es mejor hacerla con una función RPC en Supabase, pero por ahora mantenemos el visual.
  const chartData = [
    { name: 'Lun', success: 40, failed: 2 },
    { name: 'Mar', success: 30, failed: 1 },
    { name: 'Mie', success: 45, failed: 3 },
    { name: 'Jue', success: 50, failed: 0 },
    { name: 'Vie', success: 35, failed: 2 },
    { name: 'Sab', success: 20, failed: 0 },
    { name: 'Dom', success: 15, failed: 0 },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, logsData, alertsData] = await Promise.all([
          api.getStats(),
          api.getLogs(5), // Solo los últimos 5
          api.getAlerts()
        ]);
        setStats(statsData);
        setRecentLogs(logsData);
        setAlerts(alertsData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
          <p className="text-slate-400">Monitorización en tiempo real del servidor TrueNAS (8TB)</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 hover:bg-slate-700 text-sm font-medium transition-colors">
            Exportar CSV
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 text-sm font-medium transition-colors">
            Nuevo Job
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Backups Totales" 
          value={stats?.totalBackups || 0} 
          icon={HardDrive} 
          color="text-blue-500" 
          bg="bg-blue-500/10" 
          trend="Histórico completo"
        />
        <StatCard 
          title="Tasa de Éxito" 
          value={`${stats?.successRate || 0}%`} 
          icon={CheckCircle} 
          color="text-emerald-500" 
          bg="bg-emerald-500/10"
          trend="Últimos 30 días"
        />
        <StatCard 
          title="Alertas Activas" 
          value={stats?.activeAlerts || 0} 
          icon={AlertTriangle} 
          color="text-rose-500" 
          bg="bg-rose-500/10"
          trend="Requieren acción inmediata"
        />
        <StatCard 
          title="Datos Protegidos" 
          value={stats?.totalDataProtected || '0 MB'} 
          icon={Activity} 
          color="text-purple-500" 
          bg="bg-purple-500/10"
          trend="Acumulado Exitoso"
        />
      </div>

      {/* System Alerts Banner */}
      {alerts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start space-x-3">
          <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-rose-400 font-medium">Alertas del Sistema</h3>
            <ul className="mt-1 space-y-1">
              {alerts.map(alert => (
                 <li key={alert.id} className="text-sm text-rose-300/80">
                   • <strong>{alert.severity.toUpperCase()}:</strong> {alert.title} - {alert.description}
                 </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Actividad de la semana</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSuccess)" name="Exitosos" />
                <Area type="monotone" dataKey="failed" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorFailed)" name="Fallidos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-4">Últimos Backups</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentLogs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No hay actividad reciente registrada.</p>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                  <div className={`mt-1 p-1.5 rounded-full ${
                    log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                    log.status === 'failed' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {log.status === 'success' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-white truncate">{log.machine_name}</p>
                      <span className="text-xs text-slate-500">{(log.size_mb / 1024).toFixed(2)} GB</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{log.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => navigate('/logs')}
            className="mt-4 w-full py-2 text-sm text-center text-slate-400 hover:text-emerald-400 border-t border-slate-800 pt-3 transition-colors"
          >
            Ver Historial Completo
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, bg, trend }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
      <Icon size={80} className={color} />
    </div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className={`p-3 rounded-lg ${bg} ${color}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="relative z-10">
      <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{trend}</p>
    </div>
  </div>
);