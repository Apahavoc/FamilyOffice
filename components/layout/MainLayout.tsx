import React, { useState } from 'react';
import {
    Building,
    Briefcase,
    Landmark,
    Menu,
    Search,
    Bell,
    LogOut,
    ChevronLeft,
    Settings,
    LayoutDashboard,
    Target,
    Leaf,
    Building2,
    ShieldAlert,
    Gem,
    Heart,
    FileText,
    Bitcoin
} from 'lucide-react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_NAME, USER_NAME, USER_ROLE } from '../../constants';
import { cn } from '../../lib/utils';
import { Crypto } from '../Crypto';
import { NexusAssistant } from '../ai/NexusAssistant';

export const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const { t } = useTranslation();

    const NavItem = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => {
        const isActive = location.pathname === to;
        return (
            <NavLink
                to={to}
                className={({ isActive }) => cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                )}
            >
                <span className={cn(isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300')}>
                    {icon}
                </span>
                {isSidebarOpen && <span className="font-medium text-sm tracking-wide">{label}</span>}
                {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
            </NavLink>
        );
    };

    return (
        <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 relative z-20 shadow-2xl",
                    isSidebarOpen ? 'w-72' : 'w-20'
                )}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-8 bg-slate-800 border border-slate-700 text-slate-400 rounded-full p-1 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", !isSidebarOpen && 'rotate-180')} />
                </button>

                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                        <span className="font-bold text-white text-lg">N</span>
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-3 overflow-hidden whitespace-nowrap">
                            <h1 className="font-bold text-sm tracking-widest text-slate-100">NEXUS</h1>
                            <p className="text-[10px] font-medium text-slate-500 tracking-wider">FAMILY OFFICE</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <NavItem to="/" label={t('menu.dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} />
                    <NavItem to="/family-business" label={t('menu.family_business')} icon={<Building2 className="w-5 h-5" />} />
                    <NavItem to="/real-estate" label={t('menu.real_estate')} icon={<Building className="w-5 h-5" />} />
                    <NavItem to="/portfolio" label={t('menu.portfolio')} icon={<Briefcase className="w-5 h-5" />} />
                    <NavItem to="/treasury" label={t('menu.treasury')} icon={<Landmark className="w-5 h-5" />} />
                    <NavItem to="/private-equity" label={t('menu.private_equity')} icon={<Target className="w-5 h-5" />} />
                    <NavItem to="/environmental" label={t('menu.environmental')} icon={<Leaf className="w-5 h-5" />} />
                    <NavItem to="/crypto" label={t('menu.crypto')} icon={<Bitcoin className="w-5 h-5" />} />
                    <NavItem to="/risk-management" label={t('menu.risk_management')} icon={<ShieldAlert className="w-5 h-5" />} />
                    <NavItem to="/passion-assets" label={t('menu.passion_assets')} icon={<Gem className="w-5 h-5" />} />
                    <NavItem to="/philanthropy" label={t('menu.philanthropy')} icon={<Heart className="w-5 h-5" />} />
                    <NavItem to="/reporting" label={t('menu.reporting')} icon={<FileText className="w-5 h-5" />} />
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className={cn("flex items-center", isSidebarOpen ? 'gap-3' : 'justify-center')}>
                        <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden shrink-0">
                            {/* Placeholder Avatar */}
                            <img src="https://picsum.photos/40/40" alt="User" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-200 truncate">{USER_NAME}</p>
                                <p className="text-xs text-slate-500 truncate">{USER_ROLE}</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <button
                                className="text-slate-500 hover:text-slate-300"
                                onClick={() => alert("Cerrando sesión de usuario...")}
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">

                {/* Header */}
                <header className="h-20 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <button
                            className="md:hidden text-slate-400"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* Search Bar */}
                        <div className="relative w-full max-w-md hidden md:block group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar activo, ISIN, o documento..."
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => alert("Centro de Notificaciones: Sin nuevas alertas")}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-slate-950"></span>
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => alert("Perfil de Usuario: Configuración no disponible en demo")}
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-px bg-slate-800 mx-1"></div>
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Última act.</p>
                            <p className="text-xs text-emerald-500 font-mono">14:05:32 CET</p>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {/* Tab Content */}
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* AI Assistant */}
                <NexusAssistant />
            </div>
        </div>
    );
};
