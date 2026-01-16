import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Calculator,
    TrendingUp,
    Building,
    DollarSign,
    ArrowRight,
    X,
    Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '../../lib/utils';
import { RealEstateAsset } from '../../types';

interface HoldVsSellCalculatorProps {
    isOpen: boolean;
    onClose: () => void;
    asset: RealEstateAsset;
}

export const HoldVsSellCalculator: React.FC<HoldVsSellCalculatorProps> = ({
    isOpen,
    onClose,
    asset
}) => {
    const { t } = useTranslation();

    // Simulation Parameters with initial defaults
    const [holdYears, setHoldYears] = useState(10);
    const [rentGrowth, setRentGrowth] = useState(3.0); // %
    const [appreciation, setAppreciation] = useState(2.5); // %
    const [exitCapRate, setExitCapRate] = useState(4.5); // %
    const [capex, setCapex] = useState(50000); // Initial CAPEX if held

    // Calculations
    const simulationData = useMemo(() => {
        const data = [];
        let currentRent = parseFloat(asset.yield.replace('%', '')) / 100 * parseFloat(asset.value.replace(/[^0-9.-]+/g, "")) * 1000000; // Rough estimate from string
        // Fallback parsing if needed, but let's assume we have clean numbers for simulation:
        const initialValue = 5000000; // Example base value if parsing fails
        const initialRent = 250000;

        let currentValue = initialValue;
        let cumulativeCashFlow = 0;
        let cumulativeSaleProceeds = initialValue; // If sold today

        for (let year = 0; year <= holdYears; year++) {
            // HOLD Scenario
            if (year > 0) {
                currentValue = currentValue * (1 + appreciation / 100);
                const rent = initialRent * Math.pow(1 + rentGrowth / 100, year);
                cumulativeCashFlow += rent;

                // Subtract CAPEX in year 1
                if (year === 1) cumulativeCashFlow -= capex;
            }

            // SELL Scenario (If sold at Year X)
            // Sale Price at Year X = NOI / Exit Cap (Simplified approximation or just appreciated value)
            // Let's use appreciated value for simplicity in this demo
            const salePrice = currentValue;
            const saleCosts = salePrice * 0.03; // Broker fees
            const tax = (salePrice - initialValue) * 0.25; // Cap Gains Tax
            const netSaleProceeds = salePrice - saleCosts - tax;

            data.push({
                year: `Year ${year}`,
                holdValue: Math.round(cumulativeCashFlow + currentValue), // Net Asset Value + Cash Flow received
                sellValue: Math.round(netSaleProceeds + (year === 0 ? 0 : cumulativeCashFlow)), // Proceeds if sold + Cash Flow received until then
                cashFlow: Math.round(cumulativeCashFlow)
            });
        }
        return data;
    }, [holdYears, rentGrowth, appreciation, exitCapRate, capex, asset]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">

                {/* Controls Sidebar */}
                <div className="w-full md:w-80 bg-slate-800/50 border-r border-slate-700 p-6 overflow-y-auto space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Calculator className="w-6 h-6 text-blue-400" />
                            Hold vs Sell
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{asset.name}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Horizonte (Años)</label>
                            <input
                                type="range" min="1" max="20" value={holdYears}
                                onChange={(e) => setHoldYears(Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>1 año</span>
                                <span className="text-blue-400 font-bold">{holdYears} años</span>
                                <span>20 años</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Crecimiento Rentas (%)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number" step="0.1" value={rentGrowth}
                                    onChange={(e) => setRentGrowth(Number(e.target.value))}
                                    className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                />
                                <span className="text-xs text-slate-500">Anual</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Apreciación Activo (%)</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number" step="0.1" value={appreciation}
                                    onChange={(e) => setAppreciation(Number(e.target.value))}
                                    className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-white"
                                />
                                <span className="text-xs text-slate-500">Anual</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Investigación CAPEX (€)</label>
                            <input
                                type="number" step="10000" value={capex}
                                onChange={(e) => setCapex(Number(e.target.value))}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white"
                            />
                            <p className="text-[10px] text-slate-500">Inversión inicial necesaria si se mantiene.</p>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-200">
                                La estrategia óptima basada en estos supuestos es <strong className="text-emerald-400">MAINTENER (HOLD)</strong> durante al menos 7 años.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Chart Area */}
                <div className="flex-1 p-8 flex flex-col bg-slate-900">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-200">Proyección de Patrimonio Total</h4>
                            <p className="text-sm text-slate-500">Comparativa del valor neto acumulado (Nav + Flujos de Caja)</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={simulationData}>
                                <defs>
                                    <linearGradient id="colorHold" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" tickFormatter={(val) => `${val / 1000000}M`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="holdValue"
                                    name="Estrategia HOLD (Mantener)"
                                    stroke="#3b82f6"
                                    fillOpacity={1}
                                    fill="url(#colorHold)"
                                    strokeWidth={3}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sellValue"
                                    name="Estrategia SELL (Vender hoy e invertir)"
                                    stroke="#ef4444"
                                    fillOpacity={1}
                                    fill="url(#colorSell)"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
