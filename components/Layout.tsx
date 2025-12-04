import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Server, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  Bell,
  Search
} from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
  userEmail: string;
}

export const Layout: React.FC<LayoutProps> = ({ onLogout, userEmail }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Escritorio' },
    { to: '/machines', icon: Server, label: 'Máquinas' },
    { to: '/logs', icon: History, label: 'Historial de Backups' },
    { to: '/settings', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="flex h-screen bg-background text-slate-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden glass-panel"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-center h-16 border-b border-slate-800 bg-slate-900/50">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mr-2" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            BackupPro
          </span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Administrador</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden md:flex items-center relative w-96">
            <Search className="w-4 h-4 absolute left-3 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar máquina, log o error..." 
              className="w-full bg-slate-800/50 border border-slate-700 text-sm rounded-full py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
           <Outlet />
        </main>
      </div>
    </div>
  );
};