import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BackupLog } from '../types';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.getLogs(100); // Traemos más registros
        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Historial de Operaciones</h2>
          <p className="text-slate-400">Auditoría completa de copias de seguridad</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 flex items-center text-sm border border-slate-700">
             <Filter size={16} className="mr-2" /> Filtros
           </button>
           <button className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 flex items-center text-sm border border-slate-700">
             <Calendar size={16} className="mr-2" /> Fecha
           </button>
           <button className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 flex items-center text-sm border border-slate-700">
             <Download size={16} className="mr-2" /> Exportar CSV
           </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Máquina / Tarea</th>
                <th className="px-6 py-4 font-semibold">Fecha y Hora</th>
                <th className="px-6 py-4 font-semibold">Duración</th>
                <th className="px-6 py-4 font-semibold">Tamaño</th>
                <th className="px-6 py-4 font-semibold">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Cargando registros...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No hay registros encontrados.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 
                        log.status === 'failed' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                         ${log.status === 'success' ? 'bg-emerald-400' : 
                           log.status === 'failed' ? 'bg-rose-400' : 'bg-amber-400'}
                      `}></span>
                      {log.status === 'success' ? 'Exitoso' : log.status === 'failed' ? 'Fallido' : 'Alerta'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-200">
                    <div className="font-medium">{log.machine_name}</div>
                    <div className="text-xs text-slate-500">{log.job_name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {log.duration_seconds}s
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {log.size_mb > 1024 ? `${(log.size_mb / 1024).toFixed(2)} GB` : `${log.size_mb} MB`}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};