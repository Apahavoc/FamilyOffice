import React from 'react';
import { MOCK_ENV_TRANSACTIONS, MOCK_ENV_PRICE_DATA } from '../constants';

import { useTranslation } from 'react-i18next';
import {
    Leaf,
    Factory,
    Car,
    ArrowRightLeft,
    TrendingUp,
    Scale
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { cn } from '../lib/utils';

// Data moved to constants.ts
const MOCK_TRANSACTIONS = MOCK_ENV_TRANSACTIONS;
const MOCK_PRICE_DATA = MOCK_ENV_PRICE_DATA;


export const Environmental: React.FC = () => {
    const { t } = useTranslation();

    const totalVolume = 14500; // Tons
    const avgBuyPrice = 73.95; // 2025 Avg
    const avgSellPrice = 86.42; // 2026 Avg
    const netProfit = (avgSellPrice - avgBuyPrice) * 6000; // Realized YTD
    const dailyQuote = 90.74; // EUA Spot (Jan 13 Close)

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Leaf className="w-8 h-8 text-emerald-500" />
                    {t('menu.environmental')}
                </h2>
                <div className="flex gap-2">
                    <button
                        className="bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => window.open('https://es.investing.com/commodities/carbon-emissions-historical-data', '_blank')}
                    >
                        Ver Mercado Spot
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <KPICard
                    title="Cotización del Día"
                    value={`${dailyQuote.toFixed(2)} €`}
                    subtext="Mercado Spot (Live)"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="+1.2%"
                />
                <KPICard
                    title="Volumen Gestionado"
                    value={`${totalVolume.toLocaleString()} tCO₂`}
                    subtext="Derechos en cartera"
                    icon={<Scale className="w-6 h-6" />}
                />
                <KPICard
                    title="Precio Compra Medio"
                    value={formatCurrency(avgBuyPrice)}
                    subtext="Origen: Movilidad"
                    icon={<Car className="w-6 h-6" />}
                    trend="-14% vs Market"
                />
                <KPICard
                    title="Precio Venta Medio"
                    value={formatCurrency(avgSellPrice)}
                    subtext="Destino: Industria"
                    icon={<Factory className="w-6 h-6" />}
                    trend="+16% Margin"
                />
                <KPICard
                    title="Margen Neto Realizado"
                    value={formatCurrency(netProfit)}
                    subtext="YTD 2026"
                    icon={<TrendingUp className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaction Log */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-200">Libro de Órdenes</h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">LIVE</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Contraparte</th>
                                    <th className="px-6 py-4 text-right">Volumen (t)</th>
                                    <th className="px-6 py-4 text-right">Precio/t</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 text-sm">
                                {MOCK_TRANSACTIONS.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-xs font-bold",
                                                tx.type === 'BUY' ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                                            )}>
                                                {tx.type === 'BUY' ? 'COMPRA' : 'VENTA'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-200">{tx.counterparty}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    {tx.sector === 'Movilidad' ? <Car className="w-3 h-3" /> : <Factory className="w-3 h-3" />}
                                                    {tx.sector}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">{tx.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">{tx.price.toFixed(2)} €</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-200">{formatCurrency(tx.amount * tx.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Market Chart */}
                <ZenChartWrapper title="Spread de Precios" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_PRICE_DATA}>
                            <defs>
                                <linearGradient id="colorSpot" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} domain={['auto', 'auto']} unit="€" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="spot" stroke="#8884d8" fillOpacity={1} fill="url(#colorSpot)" name="Precio Mercado" />
                            <Area type="monotone" dataKey="portfolio" stroke="#10b981" fillOpacity={1} fill="url(#colorPortfolio)" name="Precio Venta Medio" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 text-xs text-slate-500 text-center">
                        Evolución del spread entre precio mercado (Spot) y nuestras ventas industriales.
                    </div>
                </ZenChartWrapper>
            </div>
        </div>
    );
};
