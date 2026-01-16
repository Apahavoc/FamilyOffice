import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Heart,
    HandHeart,
    Users2,
    Sprout,
    GraduationCap,
    Stethoscope,
    Globe
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { MOCK_PHILANTHROPY_PROJECTS } from '../constants';
import { X } from 'lucide-react';

const MOCK_PHILANTHROPY_METRICS = {
    totalDonated: 450000,
    budget: 600000,
    activeProjects: 8,
    beneficiaries: 12500
};

const ODS_ALLOCATION = [
    { name: 'Educación (SDG 4)', value: 40, color: '#facc15' },
    { name: 'Salud (SDG 3)', value: 30, color: '#4ade80' },
    { name: 'Medio Ambiente (SDG 13)', value: 20, color: '#22d3ee' },
    { name: 'Cultura', value: 10, color: '#f472b6' },
];

const DONATION_HISTORY = [
    { year: '2021', amount: 320000 },
    { year: '2022', amount: 480000 },
    { year: '2023', amount: 510000 },
    { year: '2024', amount: 550000 },
    { year: '2025', amount: 450000 }, // YTD
];

export const Philanthropy: React.FC = () => {
    const { t } = useTranslation();

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    const [selectedProject, setSelectedProject] = React.useState<typeof MOCK_PHILANTHROPY_PROJECTS[0] | null>(null);

    return (
        <div className="space-y-8 animate-fade-in mb-8 relative">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Heart className="w-8 h-8 text-rose-500" />
                    {t('menu.philanthropy')}
                </h2>
                <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase">{t('philanthropy_section.foundation_name')}</p>
                        <p className="text-sm font-semibold text-slate-200">Presupuesto 2025</p>
                    </div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="text-lg font-mono font-bold text-emerald-400">{formatCurrency(MOCK_PHILANTHROPY_METRICS.budget)}</div>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title={t('philanthropy_section.total_donated')}
                    value={formatCurrency(MOCK_PHILANTHROPY_METRICS.totalDonated)}
                    subtext={`${((MOCK_PHILANTHROPY_METRICS.totalDonated / MOCK_PHILANTHROPY_METRICS.budget) * 100).toFixed(0)}% del Presupuesto`}
                    icon={<HandHeart className="w-6 h-6" />}
                />
                <KPICard
                    title={t('philanthropy_section.projects_active')}
                    value={MOCK_PHILANTHROPY_METRICS.activeProjects.toString()}
                    subtext="Iniciativas Globales"
                    icon={<Globe className="w-6 h-6" />}
                />
                <KPICard
                    title={t('philanthropy_section.beneficiaries')}
                    value={MOCK_PHILANTHROPY_METRICS.beneficiaries.toLocaleString()}
                    subtext="Impacto Directo"
                    icon={<Users2 className="w-6 h-6" />}
                />
                {/* Budget Utilization Bar */}
                <div className="bg-slate-800 py-6 px-6 rounded-2xl border border-slate-700 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-medium text-slate-400">{t('philanthropy_section.budget_used')}</span>
                        <span className="text-xl font-bold text-white">75%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: '75%' }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ODS Alignment Chart */}
                <div className="lg:col-span-1">
                    <ZenChartWrapper title={t('philanthropy_section.ods_alignment')}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={ODS_ALLOCATION}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {ODS_ALLOCATION.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ZenChartWrapper>
                </div>

                {/* Donation History & Projects */}
                <div className="lg:col-span-2 space-y-6">
                    <ZenChartWrapper title="Evolución de Donaciones">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={DONATION_HISTORY}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Bar dataKey="amount" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Donación Anual" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ZenChartWrapper>

                </div>
            </div>

            {/* Featured Projects List - Full Width Grouped by Category */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Desglose de Proyectos ({MOCK_PHILANTHROPY_PROJECTS.length})
                </h3>

                {['Educación', 'Salud', 'Medio Ambiente', 'Cultura'].map((category) => {
                    const categoryProjects = MOCK_PHILANTHROPY_PROJECTS.filter(p => p.category === category);
                    if (categoryProjects.length === 0) return null;

                    return (
                        <div key={category} className="space-y-4">
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-1 border-l-2 border-slate-600 ml-1">{category}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {categoryProjects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition-all flex flex-col items-start gap-4 text-left group h-full"
                                    >
                                        <div className="flex w-full justify-between items-start">
                                            <div className={`p-3 rounded-lg ${category === 'Educación' ? 'bg-yellow-500/10 text-yellow-500' :
                                                category === 'Salud' ? 'bg-blue-500/10 text-blue-500' :
                                                    category === 'Medio Ambiente' ? 'bg-emerald-500/10 text-emerald-500' :
                                                        'bg-pink-500/10 text-pink-500'
                                                }`}>
                                                {category === 'Educación' && <GraduationCap className="w-5 h-5" />}
                                                {category === 'Salud' && <Stethoscope className="w-5 h-5" />}
                                                {category === 'Medio Ambiente' && <Sprout className="w-5 h-5" />}
                                                {category === 'Cultura' && <Heart className="w-5 h-5" />}
                                            </div>
                                            <span className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-400 text-[10px] whitespace-nowrap">{project.sdg.split(':')[0]}</span>
                                        </div>

                                        <div className="flex-1 w-full">
                                            <h4 className="text-slate-200 font-semibold text-sm group-hover:text-emerald-400 transition-colors line-clamp-2 min-h-[40px]">{project.title}</h4>
                                            <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> {project.location}
                                            </p>
                                        </div>

                                        <div className="w-full pt-3 border-t border-slate-700/50 mt-auto">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500">Asignado</span>
                                                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(project.budget)}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedProject(null)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative h-32 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center px-8">
                            <div className={`p-4 rounded-xl mr-6 ${selectedProject.category === 'Educación' ? 'bg-yellow-500/20 text-yellow-500' :
                                selectedProject.category === 'Salud' ? 'bg-blue-500/20 text-blue-500' :
                                    selectedProject.category === 'Medio Ambiente' ? 'bg-emerald-500/20 text-emerald-500' :
                                        'bg-pink-500/20 text-pink-500'
                                }`}>
                                {selectedProject.category === 'Educación' && <GraduationCap className="w-8 h-8" />}
                                {selectedProject.category === 'Salud' && <Stethoscope className="w-8 h-8" />}
                                {selectedProject.category === 'Medio Ambiente' && <Sprout className="w-8 h-8" />}
                                {selectedProject.category === 'Cultura' && <Heart className="w-8 h-8" />}
                            </div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{selectedProject.category}</div>
                                <h3 className="text-2xl font-bold text-white">{selectedProject.title}</h3>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <p className="text-slate-300 text-lg leading-relaxed">
                                {selectedProject.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div className="text-sm text-slate-500 mb-1">Impacto Esperado</div>
                                    <div className="font-semibold text-emerald-400">{selectedProject.impact}</div>
                                </div>
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                    <div className="text-sm text-slate-500 mb-1">Alineación ODS</div>
                                    <div className="font-semibold text-blue-400">{selectedProject.sdg}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-400 text-sm">{selectedProject.location}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500 uppercase block mb-1">Presupuesto Asignado</span>
                                    <span className="text-xl font-mono font-bold text-white">{formatCurrency(selectedProject.budget)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
