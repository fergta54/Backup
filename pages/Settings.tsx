import React, { useState } from 'react';
import { User, Bell, Shield, Database, Save, Mail, Moon, Globe, Server } from 'lucide-react';

export const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>
          <p className="text-slate-400">Gestiona tus preferencias, alertas y políticas de retención.</p>
        </div>
        <button className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Column */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
               <User className="w-5 h-5 mr-2 text-blue-500" /> Perfil de Administrador
             </h3>
             <div className="flex flex-col items-center mb-6">
               <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white mb-3 shadow-lg">
                 AD
               </div>
               <h4 className="text-white font-medium">Administrador General</h4>
               <p className="text-sm text-slate-500">admin@previcor.com</p>
               <span className="mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20">
                 Acceso Total
               </span>
             </div>
             
             <div className="space-y-4">
               <div>
                 <label className="text-sm text-slate-400 block mb-1">Nombre para mostrar</label>
                 <input type="text" defaultValue="Admin" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none" />
               </div>
               <div>
                 <label className="text-sm text-slate-400 block mb-1">Correo Electrónico</label>
                 <input type="email" defaultValue="admin@previcor.com" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none" />
               </div>
               <button className="w-full py-2 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors text-sm">
                 Cambiar Contraseña
               </button>
             </div>
          </div>
        </div>

        {/* Configuration Columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notifications */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-amber-500" /> Notificaciones y Alertas
            </h3>
            <div className="space-y-4 divide-y divide-slate-800/50">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-slate-200 font-medium">Alertas por Correo Electrónico</p>
                  <p className="text-xs text-slate-500">Recibe un email inmediato cuando falle un backup crítico.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-2 pt-4">
                <div>
                  <p className="text-slate-200 font-medium">Resumen Diario</p>
                  <p className="text-xs text-slate-500">Un reporte consolidado de la actividad de las últimas 24h.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={dailyDigest} onChange={() => setDailyDigest(!dailyDigest)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

               <div className="flex items-center justify-between py-2 pt-4">
                <div>
                  <p className="text-slate-200 font-medium">Notificaciones de Espacio en Disco</p>
                  <p className="text-xs text-slate-500">Avisar cuando el almacenamiento supere el 90%.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={true} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Backup Policies */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-500" /> Políticas de Backup
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Retención de Datos (Días)</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-2">
                   <input 
                     type="number" 
                     value={retentionDays}
                     onChange={(e) => setRetentionDays(Number(e.target.value))}
                     className="bg-transparent w-full text-white outline-none pl-2"
                   />
                   <span className="text-slate-500 text-sm pr-2">días</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Los logs antiguos se archivarán automáticamente.</p>
              </div>

               <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">Ventana de Mantenimiento</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:border-emerald-500 outline-none">
                  <option>02:00 AM - 04:00 AM (Recomendado)</option>
                  <option>12:00 AM - 06:00 AM</option>
                  <option>Fines de semana solamente</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Horario preferido para tareas pesadas del servidor.</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
               <h4 className="text-sm font-medium text-white mb-3">Rutas Críticas por Defecto</h4>
               <div className="space-y-2">
                 {['C:/Usuarios/Documentos', 'D:/Data/Finance', '/var/www/html'].map((path, idx) => (
                   <div key={idx} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded text-sm text-slate-300">
                     <span className="font-mono">{path}</span>
                     <button className="text-rose-400 hover:text-rose-300 text-xs">Eliminar</button>
                   </div>
                 ))}
                 <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium mt-2 flex items-center">
                   + Añadir ruta global
                 </button>
               </div>
            </div>
          </div>

          {/* System */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2 text-slate-400" /> Configuración del Servidor TrueNAS
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">Dirección IP del Servidor</label>
                    <input type="text" defaultValue="192.168.1.200" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm" />
                 </div>
                 <div>
                    <label className="text-sm text-slate-400 block mb-1">Puerto SSH</label>
                    <input type="text" defaultValue="22" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-sm" />
                 </div>
              </div>
              <div className="flex items-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Shield className="w-5 h-5 text-amber-500 mr-3" />
                <div className="text-sm">
                  <p className="text-amber-200 font-medium">Claves SSH Configuradas</p>
                  <p className="text-amber-500/80">La conexión con el servidor TrueNAS está encriptada y verificada.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};