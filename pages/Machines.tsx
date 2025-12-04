import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Machine } from '../types';
import { Monitor, RefreshCw, MoreVertical, Plus } from 'lucide-react';

export const Machines: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await api.getMachines();
        setMachines(data);
      } catch (error) {
        console.error("Error cargando máquinas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'offline': return 'bg-rose-500/20 text-rose-400 border-rose-500/20';
      case 'warning': return 'bg-amber-500/20 text-amber-400 border-amber-500/20';
      case 'backup_in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/20 animate-pulse';
      default: return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Máquinas Conectadas</h2>
          <p className="text-slate-400">Inventario de dispositivos gestionados</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Máquina
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Nombre del Dispositivo</th>
                <th className="px-6 py-4 font-semibold">Dirección IP</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Almacenamiento</th>
                <th className="px-6 py-4 font-semibold">Última Conexión</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Cargando inventario...</td></tr>
              ) : machines.length === 0 ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No hay máquinas registradas en la base de datos.</td></tr>
              ) : machines.map((machine) => (
                <tr key={machine.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-slate-800 text-slate-300 mr-3">
                        <Monitor size={18} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">{machine.name}</div>
                        <div className="text-xs text-slate-500">{machine.os}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                    {machine.ip_address || '--'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(machine.status)} capitalize flex w-fit items-center`}>
                       {machine.status === 'backup_in_progress' && <RefreshCw size={10} className="mr-1 animate-spin" />}
                       {machine.status ? machine.status.replace(/_/g, ' ') : 'Desconocido'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="w-full max-w-[120px]">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                           <span>{machine.used_storage || '0'}</span>
                           <span>{machine.total_storage || '0'}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                           {/* Nota: Para que la barra funcione realmente, used_storage debería ser numérico en la DB, aqui es string */}
                           <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {machine.last_seen ? new Date(machine.last_seen).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors">
                      <MoreVertical size={18} />
                    </button>
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