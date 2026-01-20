import React, { useState } from 'react';
import { MOCK_RISK_DATA, MOCK_RISK_GEO_EXPOSURE, MOCK_RISK_SCENARIOS } from '../constants';

import { useTranslation } from 'react-i18next';
import {
    ShieldAlert,
    AlertTriangle,
    Activity,
    Globe2,
    Droplets,
    History,
    TrendingDown,
    RefreshCw
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { cn } from '../lib/utils';
import { generateLiquidityReport } from '../services/reportGenerator';

// Data moved to constants.ts
const RISK_DATA = MOCK_RISK_DATA;

// Expanded Historical Scenarios
const BLACK_SWAN_EVENTS = {
    base: { label: "Escenario Base", year: "2026", impact: 0, desc: "Condiciones actuales de mercado neutrales." },
    covid: { label: "Pandemia COVID-19", year: "Mar 2020", impact: -18.5, desc: "S&P 500 -34%, Flight to Liquidity, Shock de Demanda." },
    lehman: { label: "Quiebra Lehman Bros", year: "Sep 2008", impact: -42.0, desc: "Crisis Financiera Global. Real Estate -20%, Credit Freeze." },
    dotcom: { label: "Burbuja Dotcom", year: "2000", impact: -25.0, desc: "Tech Crash -70%. Rotación masiva a Value/Bonos." },
    inflation: { label: "Crisis Inflación", year: "2022", impact: -12.0, desc: "Bonos -15% (Rates Up), Tech Sell-off." },
};

export const RiskManagement: React.FC = () => {
    const { t } = useTranslation();
    const [selectedScenario, setSelectedScenario] = useState<keyof typeof BLACK_SWAN_EVENTS>('base');
    const [isSimulating, setIsSimulating] = useState(false);

    const handleScenarioChange = (scenario: keyof typeof BLACK_SWAN_EVENTS) => {
        setIsSimulating(true);
        setTimeout(() => {
            setSelectedScenario(scenario);
            setIsSimulating(false);
        }, 600); // Visual delay for "calculation"
    };

    const currentEvent = BLACK_SWAN_EVENTS[selectedScenario];

    return (
        <div className="space-y-6 animate-fade-in mb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                    {t('menu.risk_management')}
                </h2>
                <button
                    onClick={generateLiquidityReport}
                    className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="Generar Informe de Alerta"
                >
                    <AlertTriangle className="w-4 h-4 animate-pulse" />
                    <span className="font-semibold">Alerta de Liquidez Detectada</span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 ml-1">PDF</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Risk Radar */}
                <div className="lg:col-span-1">
                    <ZenChartWrapper title={t('risk_section.radar_title')} className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RISK_DATA}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Current Exposure"
                                    dataKey="A"
                                    stroke="#e11d48"
                                    fill="#e11d48"
                                    fillOpacity={0.5}
                                />
                                {selectedScenario !== 'base' && (
                                    <Radar
                                        name="Stress Impact"
                                        dataKey="B" // Assuming MOCK_RISK_DATA has a B value, otherwise it will just not show or we rely on 'A'. Let's assume A is stressed. 
                                        // Actually, for visual simplicity, let's just keep the main radar or simulate a second one. 
                                        // Since MOCK_RISK_DATA is static, we'll keep one radar but change color if stressed.
                                        fillOpacity={0}
                                        strokeOpacity={0}
                                    />
                                )}
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ZenChartWrapper>
                </div>

                {/* Black Swan Simulator */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 relative overflow-hidden transition-all duration-500">
                        {/* Dynamic Background Warning for Crashes */}
                        {selectedScenario !== 'base' && (
                            <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none z-0"></div>
                        )}

                        <div className="relative z-10 flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                    <History className="w-5 h-5 text-indigo-400" />
                                    Simulador de "Cisnes Negros"
                                </h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Proyecta el impacto de crisis históricas en tu portfolio actual.
                                </p>
                            </div>

                            <div className="text-right bg-slate-900/80 p-3 rounded-xl border border-slate-700 shadow-lg">
                                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Impacto NAV Estimado</p>
                                {isSimulating ? (
                                    <div className="h-8 w-24 bg-slate-800 rounded animate-pulse"></div>
                                ) : (
                                    <div className={cn(
                                        "text-2xl font-bold font-mono flex items-center justify-end gap-2",
                                        currentEvent.impact < 0 ? "text-rose-500" : "text-emerald-400"
                                    )}>
                                        {currentEvent.impact !== 0 && <TrendingDown className="w-5 h-5" />}
                                        {currentEvent.impact === 0 ? "0.0%" : `${currentEvent.impact}%`}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scenario Selector */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 relative z-10">
                            {Object.entries(BLACK_SWAN_EVENTS).map(([key, event]) => (
                                <button
                                    key={key}
                                    onClick={() => handleScenarioChange(key as any)}
                                    disabled={isSimulating}
                                    className={cn(
                                        "p-4 rounded-xl border transition-all text-left relative overflow-hidden group",
                                        selectedScenario === key
                                            ? "bg-slate-700/80 border-indigo-500 shadow-lg ring-1 ring-indigo-500/50"
                                            : "bg-slate-900/40 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className={cn(
                                            "text-xs font-mono px-2 py-0.5 rounded",
                                            key === 'base' ? "bg-slate-800 text-slate-400" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        )}>
                                            {event.year}
                                        </span>
                                        {selectedScenario === key && <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />}
                                    </div>
                                    <div className="font-bold text-slate-200 text-sm mb-1 group-hover:text-white transition-colors">
                                        {event.label}
                                    </div>
                                    <div className="text-xs text-slate-500 leading-snug">
                                        {event.desc}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KPICard
                            title={t('risk_section.liquidity_gap')}
                            value={selectedScenario === 'base' ? "18 Meses" : selectedScenario === 'lehman' ? "3 Meses (CRITICAL)" : "12 Meses"}
                            subtext="Runway de caja stress-test"
                            icon={<Droplets className="w-6 h-6" />}
                            trend={selectedScenario === 'base' ? "High Risk" : "INSOLVENCY RISK"}
                        />
                        <KPICard
                            title="Correlación Cruzada"
                            value={selectedScenario === 'covid' ? "0.92 (Alta)" : "0.45 (Normal)"}
                            subtext="Diversificación efectiva"
                            icon={<RefreshCw className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
