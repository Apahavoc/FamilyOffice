import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Building2,
    Users,
    TrendingUp,
    Activity,
    Briefcase
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { MOCK_BUSINESS_METRICS } from '../constants';

const MOCK_FINANCIAL_HISTORY = [
    { year: '2019', revenue: 32000000, ebitda: 7500000 },
    { year: '2020', revenue: 29500000, ebitda: 6200000 },
    { year: '2021', revenue: 35000000, ebitda: 8800000 },
    { year: '2022', revenue: 41000000, ebitda: 10500000 },
    { year: '2023', revenue: 45000000, ebitda: 12000000 },
];

export const FamilyBusiness: React.FC = () => {
    const { t } = useTranslation();

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Building2 className="w-8 h-8 text-indigo-500" />
                    {t('menu.family_business')}
                </h2>
                <div className="flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 border border-slate-700">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300 font-medium">{MOCK_BUSINESS_METRICS.sector}</span>
                </div>
            </div>

            {/* KPIs */}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Chart */}
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

                {/* Business Summary / Details */}
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
        </div>
    );
};
