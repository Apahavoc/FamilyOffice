import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Bitcoin,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { cn } from '../lib/utils';
import { MOCK_CRYPTO_HOLDINGS, MOCK_CRYPTO_PERFORMANCE } from '../constants';

export const Crypto: React.FC = () => {
    const { t } = useTranslation();

    const totalValue = MOCK_CRYPTO_HOLDINGS.reduce((acc, asset) => acc + (asset.amount * asset.price), 0);
    const totalChange = "+15.2% (YTD)";

    // Live Quote simulation (BTC)
    const btcPrice = 95400;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Bitcoin className="w-8 h-8 text-orange-500" />
                    {t('menu.crypto')}
                </h2>
                <div className="flex gap-2">
                    <button
                        className="bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => window.open('https://www.coingecko.com/es', '_blank')}
                    >
                        Ver Cotizaciones (CoinGecko)
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Valor Total Cripto"
                    value={formatCurrency(totalValue)}
                    subtext="En Custodia Fría (Ledger)"
                    icon={<Wallet className="w-6 h-6" />}
                />
                <KPICard
                    title="Bitcoin (BTC)"
                    value={formatCurrency(btcPrice)}
                    subtext="Precio Actual"
                    icon={<Bitcoin className="w-6 h-6" />}
                    trend="+2.5% (24h)"
                />
                <KPICard
                    title="Rentabilidad YTD"
                    value={totalChange}
                    subtext="Desde 01/01/2026"
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="Alta Volatilidad"
                />
                <KPICard
                    title="Dominancia BTC"
                    value="60%"
                    subtext="Peso en Cartera"
                    icon={<Activity className="w-6 h-6" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Holdings List */}
                <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-200">Portfolio</h3>
                        <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">LIVE</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-4">Activo</th>
                                    <th className="px-6 py-4">Símbolo</th>
                                    <th className="px-6 py-4 text-right">Cantidad</th>
                                    <th className="px-6 py-4 text-right">Precio</th>
                                    <th className="px-6 py-4 text-right">Valor Total</th>
                                    <th className="px-6 py-4 text-right">Cambio</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 text-sm">
                                {MOCK_CRYPTO_HOLDINGS.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-2">
                                            {asset.id === 'BTC' && <Bitcoin className="w-4 h-4 text-orange-500" />}
                                            {asset.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{asset.symbol}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">{asset.amount}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-300">{formatCurrency(asset.price)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-200">{formatCurrency(asset.amount * asset.price)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold">
                                                {asset.change}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Chart */}
                <ZenChartWrapper title="Evolución Portfolio" className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={MOCK_CRYPTO_PERFORMANCE}>
                            <defs>
                                <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} />
                            <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} domain={['auto', 'auto']} unit="€" hide />
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorCrypto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ZenChartWrapper>
            </div>
        </div>
    );
};
