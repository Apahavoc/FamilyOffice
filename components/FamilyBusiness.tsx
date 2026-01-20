import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Building2,
    Users,
    TrendingUp,
    Activity,
    Briefcase,
    ScrollText,
    ArrowDown,
    PiggyBank,
    Gavel,
    HeartHandshake
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { MOCK_BUSINESS_METRICS } from '../constants';
import { cn } from '../lib/utils';

const MOCK_FINANCIAL_HISTORY = [
    { year: '2019', revenue: 32000000, ebitda: 7500000 },
    { year: '2020', revenue: 29500000, ebitda: 6200000 },
    { year: '2021', revenue: 35000000, ebitda: 8800000 },
    { year: '2022', revenue: 41000000, ebitda: 10500000 },
    { year: '2023', revenue: 45000000, ebitda: 12000000 },
];

export const FamilyBusiness: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'operations' | 'legacy'>('operations');

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in mb-8 h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                        <Building2 className="w-8 h-8 text-indigo-500" />
                        {t('menu.family_business')}
                    </h2>
                    {/* TAB SWITCHER */}
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 ml-6">
                        <button
                            onClick={() => setActiveTab('operations')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                activeTab === 'operations' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            <Activity className="w-4 h-4" />
                            Operativa
                        </button>
                        <button
                            onClick={() => setActiveTab('legacy')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                activeTab === 'legacy' ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            <ScrollText className="w-4 h-4" />
                            Legado & Sucesión
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 border border-slate-700">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300 font-medium">{MOCK_BUSINESS_METRICS.sector}</span>
                </div>
            </div>

            {activeTab === 'operations' ? (
                // --- OPERATIONS VIEW (Existing) ---
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <KPICard
                            title={t('business_section.revenue')}
                            value={formatCurrency(MOCK_BUSINESS_METRICS.revenue)}
                            subtext="FY 2023"
                            icon={<Activity className="w-6 h-6" />}
                            trend={`+${MOCK_BUSINESS_METRICS.growth}% YoY`}
                        />
                        <KPICard
                            title={t('business_section.ebitda')}
                            value={formatCurrency(MOCK_BUSINESS_METRICS.ebitda)}
                            subtext={`${((MOCK_BUSINESS_METRICS.ebitda / MOCK_BUSINESS_METRICS.revenue) * 100).toFixed(1)}% Margin`}
                            icon={<TrendingUp className="w-6 h-6" />}
                        />
                        <KPICard
                            title={t('business_section.valuation')}
                            value={formatCurrency(MOCK_BUSINESS_METRICS.valuation)}
                            subtext="8x EBITDA Multiple"
                            icon={<Building2 className="w-6 h-6" />}
                        />
                        <KPICard
                            title={t('business_section.employees')}
                            value={MOCK_BUSINESS_METRICS.employees.toString()}
                            subtext="FTEs Global"
                            icon={<Users className="w-6 h-6" />}
                            trend="+15 this year"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                        <div className="lg:col-span-2">
                            <ZenChartWrapper title="Evolución Financiera (5 Años)" className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={MOCK_FINANCIAL_HISTORY}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <YAxis
                                            stroke="#94a3b8"
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                            formatter={(value: number) => formatCurrency(value)}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar dataKey="revenue" name={t('business_section.revenue')} fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="ebitda" name={t('business_section.ebitda')} fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ZenChartWrapper>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-slate-200 mb-4">Detalles Operativos</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                        <span className="text-slate-400">Año de Fundación</span>
                                        <span className="text-slate-200 font-medium">1985</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                        <span className="text-slate-400">Sede Central</span>
                                        <span className="text-slate-200 font-medium">Valencia, ES</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                                        <span className="text-slate-400">Participación Familia</span>
                                        <span className="text-slate-200 font-medium">100%</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-slate-400">Auditor</span>
                                        <span className="text-slate-200 font-medium">Deloitte</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                // --- LEGACY SUCCESSION VIEW ---
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 animate-fade-in">
                    {/* Visual Sankey-style Waterfall */}
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
                        <h3 className="text-xl font-bold text-slate-200 mb-8 flex items-center gap-2 z-10">
                            <HeartHandshake className="w-6 h-6 text-amber-500" />
                            Puente Generacional (Simulación)
                        </h3>

                        <div className="flex flex-col items-center space-y-2 relative z-10 w-full max-w-lg mx-auto">
                            {/* Current Gen */}
                            <div className="w-full bg-indigo-600/20 border border-indigo-500 rounded-xl p-4 text-center relative group cursor-pointer hover:bg-indigo-600/30 transition-colors">
                                <p className="text-xs text-indigo-300 uppercase font-bold mb-1">Generación Actual</p>
                                <p className="text-2xl font-mono font-bold text-white">125.0M € (Total Wealth)</p>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-slate-500">
                                    <ArrowDown className="w-6 h-6 animate-bounce" />
                                </div>
                            </div>

                            <div className="h-8 border-l-2 border-dashed border-slate-600"></div>

                            {/* Tax Bite */}
                            <div className="w-3/4 bg-rose-500/10 border border-rose-500/50 rounded-xl p-3 text-center ml-auto mr-12 relative">
                                <p className="text-xs text-rose-300 uppercase font-bold mb-1 flex items-center justify-center gap-1">
                                    <Gavel className="w-3 h-3" /> Impacto Fiscal (Estimado)
                                </p>
                                <p className="text-lg font-mono font-bold text-rose-400">- 4.5M €</p>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-8 h-[2px] bg-slate-600"></div>
                            </div>

                            <div className="h-8 border-l-2 border-dashed border-slate-600"></div>

                            {/* Next Gen */}
                            <div className="w-full bg-emerald-600/20 border border-emerald-500 rounded-xl p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                                <div className="flex justify-center mb-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-xs">🦁</div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-300 uppercase font-bold mb-1">Next Gen (3 Herederos)</p>
                                <p className="text-3xl font-mono font-bold text-white">120.5M €</p>
                                <p className="text-sm text-slate-400 mt-2">~40.1M € por heredero</p>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Governance */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-200 mb-4">Estructura de Gobernanza</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <span className="text-slate-300 text-sm">Protocolo Familiar</span>
                                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30 font-bold">FIRMADO 2022</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <span className="text-slate-300 text-sm">Consejo de Familia</span>
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">ACTIVO (Trimestral)</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <span className="text-slate-300 text-sm">Plan de Sucesión CEO</span>
                                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded border border-amber-500/30">EN PROCESO</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <PiggyBank className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-slate-200">Recomendación Ariete</h4>
                                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                                        La estructura actual optimiza el 95% de la bonificación de Empresa Familiar. Sin embargo, se recomienda revisar la liquidez de los herederos para afrontar el "Impuesto sobre Sucesiones" sin necesidad de desinvertir activos estratégicos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
