import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import {
    Briefcase,
    TrendingUp,
    DollarSign,
    Target,
    Layers,
    Kanban,
    MoreHorizontal,
    Building,
    ArrowRight,
    GitMerge,
    Calculator
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { generatePrivateEquityReport } from '../services/reportGenerator';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { MOCK_PE_FUNDS } from '../constants';
import { cn } from '../lib/utils';

// ... (Existing Constants: STRATEGY_DATA, J_CURVE_DATA, CAPITAL_CALL_FORECAST, MOCK_DEALS, KANBAN_COLUMNS)

const STRATEGY_DATA = [
    { name: 'Buyout', value: 45, color: '#6366f1' },
    { name: 'Growth', value: 30, color: '#10b981' },
    { name: 'Venture', value: 15, color: '#f59e0b' },
    { name: 'Secondaries', value: 10, color: '#ec4899' },
];

const J_CURVE_DATA = [
    { year: '2019', cashFlow: -50, nav: 45 },
    { year: '2020', cashFlow: -120, nav: 110 },
    { year: '2021', cashFlow: -180, nav: 190 },
    { year: '2022', cashFlow: -210, nav: 280 },
    { year: '2023', cashFlow: -150, nav: 350 },
    { year: '2024', cashFlow: -50, nav: 420 },
    { year: '2025 (P)', cashFlow: 80, nav: 480 },
];

const CAPITAL_CALL_FORECAST = [
    { year: 'Q1 2025', amount: 1.2 },
    { year: 'Q2 2025', amount: 0.8 },
    { year: 'Q3 2025', amount: 1.5 },
    { year: 'Q4 2025', amount: 0.5 },
];

// MOCK DEAL FLOW DATA
type DealStage = 'screening' | 'diligence' | 'negotiation' | 'closed';

const MOCK_DEALS = [
    { id: 1, name: 'Project Alpha', sector: 'AI / SaaS', value: 12.5, stage: 'negotiation', prob: 75, nextStep: 'Finalizar SPA' },
    { id: 2, name: 'EcoLogistics', sector: 'Industrial', value: 45.0, stage: 'diligence', prob: 40, nextStep: 'Revisión Legal' },
    { id: 3, name: 'MediCare Groups', sector: 'Healthcare', value: 8.2, stage: 'screening', prob: 20, nextStep: 'Reunión con CEO' },
    { id: 4, name: 'CyberShield', sector: 'Cybersec', value: 15.0, stage: 'screening', prob: 15, nextStep: 'NDA Firmado' },
    { id: 5, name: 'SolarSpain 2', sector: 'Energy', value: 22.0, stage: 'closed', prob: 100, nextStep: 'Integración' },
];

const KANBAN_COLUMNS: { id: DealStage; label: string; color: string }[] = [
    { id: 'screening', label: 'Screening (Analizando)', color: 'bg-slate-500' },
    { id: 'diligence', label: 'Due Diligence', color: 'bg-amber-500' },
    { id: 'negotiation', label: 'Negociación (SPA)', color: 'bg-blue-500' },
    { id: 'closed', label: 'Cerrado / Portfolio', color: 'bg-emerald-500' },
];

export const PrivateEquity: React.FC = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState<'funds' | 'kanban' | 'waterfall'>('funds');

    // Waterfall State
    const [exitValuation, setExitValuation] = useState(50); // M€
    const [hurdleRate, setHurdleRate] = useState(8); // %
    const [catchUpRate, setCatchUpRate] = useState(100); // % usually GP gets 100% until 80/20 catch up

    // Waterfall Calculation
    const investment = 20; // Commitment Mock
    const preferredReturn = investment * (hurdleRate / 100) * 5; // 5 years simple interest for demo
    const remainingAfterCapital = Math.max(0, exitValuation - investment);
    const lpPrefAmount = Math.min(remainingAfterCapital, preferredReturn);
    const remainingAfterPref = Math.max(0, remainingAfterCapital - lpPrefAmount);
    const gpCatchUp = Math.min(remainingAfterPref, (preferredReturn / 4)); // Simplified 80/20 Math
    const remainingForCarry = Math.max(0, remainingAfterPref - gpCatchUp);
    const gpCarry = remainingForCarry * 0.2;
    const lpCarry = remainingForCarry * 0.8;

    const lpTotal = investment + lpPrefAmount + lpCarry;
    const gpTotal = gpCatchUp + gpCarry;

    const WATERFALL_DATA = [
        { name: 'Return of Capital', value: investment, fill: '#3b82f6', role: 'LP' },
        { name: 'Preferred Return', value: lpPrefAmount, fill: '#10b981', role: 'LP' },
        { name: 'GP Catch-up', value: gpCatchUp, fill: '#f59e0b', role: 'GP' },
        { name: 'Carried Interest', value: gpCarry + lpCarry, fill: '#6366f1', role: 'Split' }, // Simplified for chart
    ];


    const totalCommitted = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.committed, 0);
    const totalCalled = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.called, 0);
    const uncalled = totalCommitted - totalCalled;
    const avgIRR = MOCK_PE_FUNDS.reduce((acc, fund) => acc + fund.irr, 0) / MOCK_PE_FUNDS.length;

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in mb-8 h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-100">{t('menu.private_equity')}</h2>

                    {/* VIEW TOGGLE */}
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                        <button
                            onClick={() => setViewMode('funds')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                viewMode === 'funds' ? "bg-slate-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            <Layers className="w-4 h-4" />
                            Cartera
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                viewMode === 'kanban' ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            <Kanban className="w-4 h-4" />
                            Deal Flow
                        </button>
                        <button
                            onClick={() => setViewMode('waterfall')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                                viewMode === 'waterfall' ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            <Calculator className="w-4 h-4" />
                            Simulador
                        </button>
                    </div>
                </div>

                <div className="flex gap-3">
                    {viewMode === 'kanban' && (
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
                            + Nueva Operación
                        </button>
                    )}
                    <button
                        className="bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        onClick={generatePrivateEquityReport}
                    >
                        Descargar Informe Q4
                    </button>
                </div>
            </div>

            {viewMode === 'funds' ? (
                // --- EXISTING FUnds DASHBOARD ---
                <div className="space-y-6 animate-fade-in">
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
                            title="Polvora Seca (Uncalled)"
                            value={formatCurrency(uncalled)}
                            subtext="Pendiente de Inversión"
                            icon={<Target className="w-6 h-6" />}
                            trend={`${(uncalled / totalCommitted * 100).toFixed(0)}% Cap`}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ZenChartWrapper title="Análisis J-Curve (Ciclo de Vida)">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={J_CURVE_DATA}>
                                        <defs>
                                            <linearGradient id="colorNav" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="nav" name="Valor (NAV)" stroke="#10b981" fillOpacity={1} fill="url(#colorNav)" />
                                        <Area type="monotone" dataKey="cashFlow" name="Flujo Acumulado" stroke="#ef4444" fillOpacity={1} fill="url(#colorFlow)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenChartWrapper>

                        <ZenChartWrapper title="Previsión Capital Calls (2025)">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={CAPITAL_CALL_FORECAST}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="year" stroke="#94a3b8" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `${val}M`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                                            formatter={(val) => [`${val}M €`, 'Llamada Estimada']}
                                        />
                                        <Bar dataKey="amount" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Capital Call (€ Millones)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ZenChartWrapper>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            ) : viewMode === 'kanban' ? (
                // --- KANBAN DEAL FLOW VIEW ---
                <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 animate-fade-in">
                    <div className="flex h-full gap-6 min-w-[1000px]">
                        {KANBAN_COLUMNS.map(col => (
                            <div key={col.id} className="flex-1 flex flex-col bg-slate-800/30 rounded-xl border border-slate-700/50 min-w-[300px]">
                                {/* Column Header */}
                                <div className={cn("p-4 border-b border-slate-700/50 flex items-center justify-between", col.color.replace('bg-', 'border-l-4 border-'))}>
                                    <h3 className="font-bold text-slate-200 text-sm tracking-wide">{col.label}</h3>
                                    <span className="bg-slate-800 px-2 py-0.5 rounded textxs text-slate-400 font-mono">
                                        {MOCK_DEALS.filter(d => d.stage === col.id).length}
                                    </span>
                                </div>

                                {/* Drag Area (Simulated) */}
                                <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                    {MOCK_DEALS.filter(d => d.stage === col.id).length === 0 && (
                                        <div className="h-24 border-2 border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-600 text-xs italic">
                                            Arrastrar operación aquí
                                        </div>
                                    )}
                                    {MOCK_DEALS.filter(d => d.stage === col.id).map(deal => (
                                        <div key={deal.id} className="bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg p-4 shadow-lg cursor-grab active:cursor-grabbing hover:translate-y-[-2px] transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                                                        {deal.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-200 text-sm leading-tight">{deal.name}</h4>
                                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{deal.sector}</span>
                                                    </div>
                                                </div>
                                                <button className="text-slate-500 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="bg-slate-900/50 p-2 rounded">
                                                    <div className="text-[10px] text-slate-500">Valuation (EV)</div>
                                                    <div className="text-sm font-mono font-bold text-slate-200">{deal.value}M €</div>
                                                </div>
                                                <div className="bg-slate-900/50 p-2 rounded">
                                                    <div className="text-[10px] text-slate-500">Probabilidad</div>
                                                    <div className={cn(
                                                        "text-sm font-bold flex items-center gap-1",
                                                        deal.prob > 70 ? "text-emerald-400" : deal.prob > 30 ? "text-amber-400" : "text-slate-400"
                                                    )}>
                                                        {deal.prob}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                                                <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate w-2/3">
                                                    <ArrowRight className="w-3 h-3 text-blue-500" />
                                                    {deal.nextStep}
                                                </span>
                                                <div className="flex -space-x-2">
                                                    <div className="w-5 h-5 rounded-full bg-blue-500 border border-slate-800"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // --- WATERFALL SIMULATOR VIEW ---
                <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CONTROLS */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-fit">
                        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-emerald-500" />
                            Configuración Salida
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Valoración de Salida (Exit)</label>
                                <input
                                    type="range" min="20" max="100" step="5"
                                    value={exitValuation} onChange={e => setExitValuation(Number(e.target.value))}
                                    className="w-full accent-emerald-500"
                                />
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-slate-500">20M €</span>
                                    <span className="text-lg font-bold text-emerald-400">{exitValuation}M €</span>
                                    <span className="text-xs text-slate-500">100M €</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Hurdle Rate (LP Min Return)</label>
                                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                                    <input
                                        type="number"
                                        value={hurdleRate} onChange={e => setHurdleRate(Number(e.target.value))}
                                        className="bg-transparent text-white font-mono w-full outline-none"
                                    />
                                    <span className="text-slate-500 font-bold">%</span>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Total Distribuible</span>
                                    <span className="text-white font-bold">{exitValuation}M €</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Inversión (Basis)</span>
                                    <span className="text-slate-300">{investment}M €</span>
                                </div>
                                <div className="h-px bg-slate-700/50 my-2"></div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Net Profit</span>
                                    <span className="text-emerald-400 font-bold">+{exitValuation - investment}M €</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WATERFALL CHART */}
                    <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
                            <GitMerge className="w-5 h-5 text-blue-500 rotate-90" />
                            European Waterfall Distribution
                        </h3>

                        <div className="flex-1 w-full min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={WATERFALL_DATA} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                    <XAxis type="number" stroke="#94a3b8" axisLine={false} tickLine={false} tickFormatter={(val) => `${val}M`} />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                                        formatter={(val: number) => [`${val.toFixed(2)}M €`, 'Monto']}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {WATERFALL_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
                                <p className="text-sm text-blue-300 font-bold uppercase mb-1">LP Total Return</p>
                                <p className="text-2xl font-mono font-bold text-white">{lpTotal.toFixed(2)}M €</p>
                            </div>
                            <div className="bg-fuchsia-500/10 p-4 rounded-xl border border-fuchsia-500/20 text-center">
                                <p className="text-sm text-fuchsia-300 font-bold uppercase mb-1">GP Total Carry</p>
                                <p className="text-2xl font-mono font-bold text-white">{gpTotal.toFixed(2)}M €</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
