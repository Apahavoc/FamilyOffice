import React, { useState } from 'react';
import { MOCK_RISK_DATA, MOCK_RISK_GEO_EXPOSURE, MOCK_RISK_SCENARIOS } from '../constants';

import { useTranslation } from 'react-i18next';
import {
    ShieldAlert,
    AlertTriangle,
    Activity,
    Globe2,
    Droplets,
    TrendingDown
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { cn } from '../lib/utils';
import { generateLiquidityReport } from '../services/reportGenerator';

// Data moved to constants.ts
const RISK_DATA = MOCK_RISK_DATA;
const GEO_EXPOSURE = MOCK_RISK_GEO_EXPOSURE;
const STRESS_SCENARIOS = MOCK_RISK_SCENARIOS;


export const RiskManagement: React.FC = () => {
    const { t } = useTranslation();
    const [selectedScenario, setSelectedScenario] = useState<'base' | 'crash' | 'rates' | 're_slump'>('base');

    const getCurrentImpact = () => STRESS_SCENARIOS[selectedScenario];

    return (
        <div className="space-y-6 animate-fade-in">
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
                    <ZenChartWrapper title={t('risk_section.radar_title')} className="h-[400px]">
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
                                    fillOpacity={0.6}
                                />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ZenChartWrapper>
                </div>

                {/* Stress Test Simulator */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-400" />
                                {t('risk_section.stress_test')}
                            </h3>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Impacto Patrimonial</p>
                                <p className={cn("text-2xl font-bold font-mono", selectedScenario === 'base' ? 'text-slate-200' : 'text-rose-500')}>
                                    {getCurrentImpact().value}
                                </p>
                                <p className={cn("text-sm font-medium", selectedScenario === 'base' ? 'text-slate-500' : 'text-rose-400')}>
                                    {getCurrentImpact().change}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setSelectedScenario('crash')}
                                className={cn(
                                    "p-4 rounded-xl border transition-all text-left",
                                    selectedScenario === 'crash'
                                        ? "bg-rose-500/20 border-rose-500 text-rose-200"
                                        : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                                )}
                            >
                                <div className="font-semibold mb-1">{t('risk_section.scenario_crash')}</div>
                                <div className="text-xs opacity-70">S&P 500 -20% | Real Estate -5%</div>
                            </button>
                            <button
                                onClick={() => setSelectedScenario('rates')}
                                className={cn(
                                    "p-4 rounded-xl border transition-all text-left",
                                    selectedScenario === 'rates'
                                        ? "bg-amber-500/20 border-amber-500 text-amber-200"
                                        : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                                )}
                            >
                                <div className="font-semibold mb-1">{t('risk_section.scenario_rates')}</div>
                                <div className="text-xs opacity-70">Euribor +200bps | Bond Yields +1.5%</div>
                            </button>
                            <button
                                onClick={() => setSelectedScenario('base')}
                                className={cn(
                                    "p-4 rounded-xl border transition-all text-left",
                                    selectedScenario === 'base'
                                        ? "bg-blue-500/20 border-blue-500 text-blue-200"
                                        : "bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600"
                                )}
                            >
                                <div className="font-semibold mb-1">Escenario Base</div>
                                <div className="text-xs opacity-70">Condiciones actuales de mercado</div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <KPICard
                            title={t('risk_section.liquidity_gap')}
                            value="18 Meses"
                            subtext="Runway de caja actual"
                            icon={<Droplets className="w-6 h-6" />}
                            trend="High Risk"
                        />
                        <KPICard
                            title={t('risk_section.geo_concentration')}
                            value="65% Eurozona"
                            subtext="Alta exposición local"
                            icon={<Globe2 className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
