import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTreasuryData } from '../hooks/useTreasuryData';
import { Wallet, TrendingUp, AlertOctagon, ArrowRight, Coins, Landmark, Search, Percent } from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { cn } from '../lib/utils';

export const Treasury: React.FC = () => {
    const { t } = useTranslation();
    const { cashFlowData, liquidityData } = useTreasuryData();

    const formatCurrency = (value: number, currency: string = 'EUR') => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(value);
    }

    // Mock Liquidity for Demo
    const totalLiquidityValue = 1680000;
    const totalLiquidityStr = "1.68M €";

    // Smart Sweeper Logic
    const sweeperThreshold = 500000;
    const idleCash = totalLiquidityValue; // Assuming all is "idle" for demo
    const potentialYield = 0.035; // 3.5% T-Bills
    const yearlyLostYield = (idleCash - sweeperThreshold) * potentialYield;
    const isSweeperActive = idleCash > sweeperThreshold;

    // Tax Harvester Logic (Mock)
    const taxHarvestOpportunities = [
        { asset: 'Amazon (AMZN)', loss: -12500, type: 'Equity' },
        { asset: 'Bitcoin (BTC)', loss: -4200, type: 'Crypto' },
        { asset: 'Vintage Fund II', loss: -8000, type: 'PE' },
    ];
    const totalHarvestableLoss = -24700;
    const potentialTaxCredit = Math.abs(totalHarvestableLoss * 0.21); // ~21% Tax Rate

    return (
        <div className="space-y-6 animate-fade-in mb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100">{t('menu.treasury')}</h2>
            </div>

            {/* Liquidity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Liquidez Total (EUR)"
                    value={totalLiquidityStr}
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

            {/* Financial Engineering Section (Ariete Features) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Smart Cash Sweeper */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Coins className="w-12 h-12 text-slate-700 group-hover:text-emerald-500/20 transition-colors" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Landmark className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Smart Cash Sweeper</h3>
                        </div>

                        {isSweeperActive ? (
                            <div className="space-y-4">
                                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                                    <AlertOctagon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-slate-300">
                                            Se han detectado <span className="font-bold text-white">{formatCurrency(idleCash - sweeperThreshold)}</span> de liquidez excedente improductiva.
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">Umbral definido: {formatCurrency(sweeperThreshold)}</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Costo de Oportunidad (Pérdida)</p>
                                        <p className="text-xl font-mono font-bold text-rose-400">-{formatCurrency(yearlyLostYield)} / año</p>
                                    </div>
                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg hover:shadow-emerald-900/20 transition-all flex items-center gap-2">
                                        Mover a T-Bills (3.5%) <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-4 rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                                <span className="font-medium">Tesorería Optimizada</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Tax Harvest Scanner */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Percent className="w-12 h-12 text-slate-700 group-hover:text-indigo-500/20 transition-colors" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Search className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-100">Global Tax Harvester</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-end bg-slate-950/30 p-3 rounded-lg border border-slate-800">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Crédito Fiscal Potencial</p>
                                    <p className="text-xl font-bold text-indigo-400">+{formatCurrency(potentialTaxCredit)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-1">Minusvalías Latentes</p>
                                    <p className="text-sm font-mono text-rose-400">{formatCurrency(totalHarvestableLoss)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Candidatos para Venta (Harvest)</h4>
                                <div className="space-y-2">
                                    {taxHarvestOpportunities.map((opp, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-2 rounded text-sm hover:bg-slate-700 transition-colors cursor-pointer group/row">
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                <span className="text-slate-300 font-medium group-hover/row:text-white">{opp.asset}</span>
                                                <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded">{opp.type}</span>
                                            </div>
                                            <span className="font-mono text-rose-400">{formatCurrency(opp.loss)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cash Flow Chart */}
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-200">Cash Flow Mensual</h3>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ingresos
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Gastos
                        </span>
                    </div>
                </div>
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
                            <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="net" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};
