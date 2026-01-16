import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTreasuryData } from '../hooks/useTreasuryData';
import { Wallet, TrendingUp } from 'lucide-react';
import { KPICard } from './ui/KPICard';

export const Treasury: React.FC = () => {
    const { t } = useTranslation();
    const { cashFlowData, liquidityData } = useTreasuryData();

    const formatCurrency = (value: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value);
    }

    // Calculate total liquidity for the KPI card (simplified for now assuming EUR base or direct sum if mocked)
    // specific logic could be added here
    const totalLiquidity = "1.68M €";

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100">{t('menu.treasury')}</h2>
            </div>

            {/* Liquidity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Liquidez Total (EUR)"
                    value={totalLiquidity}
                    subtext="Disponible"
                    icon={<Wallet className="w-6 h-6" />}
                    trend="+12% vs last month"
                />
                <KPICard
                    title="Cash Flow Neto (YTD)"
                    value="302k €"
                    subtext="Ingresos - Gastos"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+5%"
                />
                {/* Currency breakdown */}
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl">
                    <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">Diversificación Divisas</h3>
                    <div className="space-y-3">
                        {liquidityData.map(item => (
                            <div key={item.currency} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-200">{item.currency}</span>
                                    <div className="h-1.5 w-24 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }} />
                                    </div>
                                </div>
                                <span className="text-slate-400">{formatCurrency(item.amount, item.currency)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold text-slate-200 mb-6">Cash Flow Mensual</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cashFlowData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                            <Tooltip
                                cursor={{ fill: '#334155', opacity: 0.2 }}
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#e2e8f0' }}
                            />
                            <Legend />
                            <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" name="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="net" name="Neto" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};
