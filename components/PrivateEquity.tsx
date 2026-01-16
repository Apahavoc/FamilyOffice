import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Briefcase,
    TrendingUp,
    DollarSign,
    Target,
    ArrowUpRight
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { generatePrivateEquityReport } from '../services/reportGenerator';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { MOCK_PE_FUNDS } from '../constants';

const STRATEGY_DATA = [
    { name: 'Buyout', value: 45, color: '#6366f1' },
    { name: 'Growth', value: 30, color: '#10b981' },
    { name: 'Venture', value: 15, color: '#f59e0b' },
    { name: 'Secondaries', value: 10, color: '#ec4899' },
];

export const PrivateEquity: React.FC = () => {
    const { t } = useTranslation();

    const totalCommitted = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.committed, 0);
    const totalCalled = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.called, 0);
    const uncalled = totalCommitted - totalCalled;
    const avgIRR = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.irr, 0) / MOCK_PE_FUNDS.length;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100">{t('menu.private_equity')}</h2>
                <button
                    className="bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={generatePrivateEquityReport}
                >
                    Descargar Informe Q4
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Compromiso Total"
                    value={formatCurrency(totalCommitted)}
                    subtext="Capital Comprometido"
                    icon={<Briefcase className="w-6 h-6" />}
                />
                <KPICard
                    title="Capital Llamado"
                    value={`${((totalCalled / totalCommitted) * 100).toFixed(1)}%`}
                    subtext={formatCurrency(totalCalled)}
                    icon={<DollarSign className="w-6 h-6" />}
                />
                <KPICard
                    title="Net IRR (Media)"
                    value={`${avgIRR.toFixed(1)}%`}
                    subtext="TIR Neta Ponderada"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+2.5% vs Benchmark"
                />
                <KPICard
                    title="MOIC Medio"
                    value="1.4x"
                    subtext="Múltiplo sobre Inversión"
                    icon={<Target className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Fund List */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-200">Fondos Activos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Fondo</th>
                                    <th className="px-6 py-4">Vintage</th>
                                    <th className="px-6 py-4 text-right">Commitment</th>
                                    <th className="px-6 py-4 text-right">% Llamado</th>
                                    <th className="px-6 py-4 text-right">TVPI</th>
                                    <th className="px-6 py-4 text-right">TIR</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 text-sm">
                                {MOCK_PE_FUNDS.map((fund) => (
                                    <tr key={fund.name} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">{fund.name}</td>
                                        <td className="px-6 py-4 text-slate-400">{fund.vintage}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">{formatCurrency(fund.committed)}</td>
                                        <td className="px-6 py-4 text-right text-slate-400">
                                            <div className="flex items-center justify-end gap-2">
                                                <span>{Math.round((fund.called / fund.committed) * 100)}%</span>
                                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(fund.called / fund.committed) * 100}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-emerald-400">{fund.tvpi}x</td>
                                        <td className="px-6 py-4 text-right font-semibold text-emerald-400">{fund.irr}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Diversification Chart */}
                <ZenChartWrapper title="Estrategia">
                    <div className="flex flex-col h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={STRATEGY_DATA}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                >
                                    {STRATEGY_DATA.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#e2e8f0' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {STRATEGY_DATA.map(strategy => (
                                <div key={strategy.name} className="flex items-center gap-2 text-xs">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: strategy.color }} />
                                    <span className="text-slate-300">{strategy.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ZenChartWrapper>
            </div>
        </div>
    );
};
