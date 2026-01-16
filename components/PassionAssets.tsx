import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Gem,
    Trophy,
    Watch,
    Palette,
    Car,
    Wine,
    TrendingUp
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';

import { MOCK_PASSION_METRICS, PASSION_PORTFOLIO } from '../constants';

const PERFORMANCE_DATA = [
    { year: '2019', portfolio: 100, index: 100 },
    { year: '2020', portfolio: 108, index: 105 },
    { year: '2021', portfolio: 125, index: 118 },
    { year: '2022', portfolio: 142, index: 125 },
    { year: '2023', portfolio: 158, index: 135 },
];

export const PassionAssets: React.FC = () => {
    const { t } = useTranslation();

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-fade-in mb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Gem className="w-8 h-8 text-fuchsia-500" />
                    {t('menu.passion_assets')}
                </h2>
                <div className="flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 border border-slate-700">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">Top Performance: <strong>Arte (+22%)</strong></span>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title={t('passion_section.collection_value')}
                    value={formatCurrency(MOCK_PASSION_METRICS.totalValue)}
                    subtext="Valor Mercado Estimado"
                    icon={<Gem className="w-6 h-6" />}
                />
                <KPICard
                    title={t('passion_section.appreciation')}
                    value={`+${MOCK_PASSION_METRICS.appreciation}%`}
                    subtext="Rentabilidad Anual"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="vs Purchase Price"
                />
                <KPICard
                    title={t('passion_section.items')}
                    value={MOCK_PASSION_METRICS.items.toString()}
                    subtext="Activos Catalogados"
                    icon={<Palette className="w-6 h-6" />}
                />
            </div>

            {/* Performance Chart - Full Width */}
            <div className="w-full">
                <ZenChartWrapper title="Rendimiento vs Knight Frank Luxury Index" className="h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={PERFORMANCE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />
                            <Legend />
                            <Line type="monotone" dataKey="portfolio" name="Nuestra Colección" stroke="#d946ef" strokeWidth={3} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="index" name={t('passion_section.kf_index')} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ZenChartWrapper>
            </div>

            {/* Asset Gallery - Grid Layout */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-fuchsia-400" />
                    {t('passion_section.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PASSION_PORTFOLIO.map(asset => (
                        <div key={asset.id} className="group relative bg-slate-900/50 rounded-2xl overflow-hidden aspect-[4/5] border border-slate-800 hover:border-fuchsia-500/50 hover:shadow-2xl hover:shadow-fuchsia-900/20 transition-all duration-300">
                            <img
                                src={asset.image}
                                alt={asset.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                            <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="space-y-1 mb-2">
                                    <span className="inline-block px-2 py-1 rounded bg-fuchsia-500/10 border border-fuchsia-500/20 text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest backdrop-blur-sm">
                                        {t(`passion_section.${asset.category}` as any)}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-fuchsia-200 transition-colors">{asset.name}</h4>
                                <div className="flex justify-between items-end border-t border-slate-800/50 pt-3">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Valoración</p>
                                        <p className="text-slate-100 font-mono font-semibold">{formatCurrency(asset.value)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider">Trend</p>
                                        <p className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-1.5 py-0.5 rounded">{asset.trend}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card Placeholder */}
                    <button className="group relative bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-800 hover:border-fuchsia-500/30 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center gap-3 aspect-[4/5] text-slate-500 hover:text-fuchsia-400" onClick={() => alert("Funcionalidad de añadir activo en desarrollo")}>
                        <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-fuchsia-500/10 flex items-center justify-center transition-colors">
                            <Gem className="w-6 h-6" />
                        </div>
                        <span className="font-medium">Añadir Pieza</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
