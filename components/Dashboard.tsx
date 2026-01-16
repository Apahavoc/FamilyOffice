import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine
} from 'recharts';
import { TrendingUp, DollarSign, Activity, ArrowUpRight, ShieldCheck, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KPICard } from './ui/KPICard';
import { CustomTooltip } from './charts/CustomTooltip';
import { KPISkeleton, ChartSkeleton } from './ui/Skeleton';
import { ZenChartWrapper } from './charts/ZenChartWrapper';
import { useGlobalWealth } from '../hooks/useGlobalWealth';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { generateReportAnalysis } from '../services/geminiService';
import { generateIntegratedReport, AIReportAnalysis } from '../services/reportGenerator';

import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { performanceData, getKPIs } = usePortfolioData();
  const wealthData = useGlobalWealth(); // Get full object to pass
  const { totalWealth, allocation, weightedReturn, liquidityRatio } = wealthData;
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    let aiAnalysis: AIReportAnalysis | undefined = undefined;

    // 1. Try to get AI Analysis (Graceful Fallback)
    try {
      console.log("Generating AI Analysis with context:", wealthData);
      // Pass the CURRENT dashboard state to the AI so it knows the real numbers (e.g. Total Wealth)
      aiAnalysis = await generateReportAnalysis(wealthData);
    } catch (error) {
      console.warn("AI Analysis Failed - Proceeding with static report", error);
      // We continue without aiAnalysis, reportGenerator handles undefined.
    }

    try {
      // 2. Generate PDF (with or without AI)
      console.log("Generating PDF...", aiAnalysis);
      await generateIntegratedReport(
        ['summary', 'portfolio', 'real_estate', 'private_equity', 'treasury', 'risks', 'philanthropy'],
        "Memoria Mensual - Ariete Style",
        wealthData,
        aiAnalysis
      );
      // alert("Informe generado y descargado con éxito."); // Optional: remove alert for smoother UX or use toast
    } catch (error) {
      console.error("Report Generation Failed", error);
      alert("Error crítico generando el PDF. Por favor revisa la consola.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatCurrencyShort = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const kpis = getKPIs();

  // Override Total Wealth KPI with real calculated value to prevent discrepancies
  // Override Total Wealth KPI with real calculated value to prevent discrepancies
  if (kpis.length > 0) {
    kpis[0].value = `${formatCurrencyShort(totalWealth)} €`;

    // 2. Weighted Return
    kpis[1].value = `${weightedReturn.toFixed(2)}%`;
    kpis[1].subtext = "Rentabilidad Ponderada Global";

    // 3. Liquidity Ratio
    kpis[2].value = `${liquidityRatio.toFixed(1)}%`;
    kpis[2].subtext = "Cash + Activos Líquidos / Total";
  }

  const iconMap: Record<string, React.ReactNode> = {
    dollar: <DollarSign className="w-6 h-6" />,
    trending: <TrendingUp className="w-6 h-6" />,
    activity: <Activity className="w-6 h-6" />
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPISkeleton />
          <KPISkeleton />
          <KPISkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
          <div className="lg:col-span-2"><ChartSkeleton /></div>
          <div><ChartSkeleton /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER ROW with REPORT BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Visión Global</h1>
          <p className="text-slate-400 text-sm">Resumen ejecutivo del patrimonio familiar actualizado.</p>
        </div>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-emerald-500/20 ${isGeneratingReport
            ? 'bg-slate-800 text-slate-400 cursor-wait border border-slate-700'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50'
            }`}
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redactando Memoria...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generar Memoria Mensual (PDF)</span>
            </>
          )}
        </button>
      </div>

      {/* Top Row - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            {...kpi}
            icon={typeof kpi.icon === 'string' ? iconMap[kpi.icon] : kpi.icon}
          />
        ))}
      </div>

      {/* Middle Row - Charts (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Line Chart - Spans 2 cols */}
        <ZenChartWrapper
          className="lg:col-span-2"
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              {t('dashboard.evolution')}
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} domain={[120, 140]} unit="M" dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
              <ReferenceLine y={135} label={{ value: "Target 2024", fill: "#94a3b8", fontSize: 12 }} stroke="#94a3b8" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="portfolio"
                name="NEXUS"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1e293b' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="Benchmark"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ZenChartWrapper>

        {/* Pie Chart - Spans 1 col */}
        <ZenChartWrapper
          title={
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              {t('dashboard.allocation')}
            </div>
          }
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    onClick={(data) => {
                      if (data && data.route) navigate(data.route);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {allocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="rgba(0,0,0,0)"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value: number) => formatCurrencyShort(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-2xl font-bold text-slate-200">{formatCurrencyShort(totalWealth)}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('dashboard.total')}</p>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs shrink-0 overflow-y-auto max-h-[100px] scrollbar-thin scrollbar-thumb-slate-700">
              {allocation.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 p-1 rounded transition-colors group"
                  onClick={() => entry.route && navigate(entry.route)}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-400 flex-1 truncate group-hover:text-white transition-colors" title={entry.name}>{entry.name}</span>
                  <span className="text-slate-200 font-medium">{entry.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </ZenChartWrapper>
      </div>

      {/* Bottom Row - Recent Activity / Quick Stats */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-200">{t('dashboard.recent_alerts')}</h3>
          <button
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
            onClick={() => alert("Navegando al Centro de Alertas completo...")}
          >
            {t('dashboard.view_all')} <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
            <p className="text-sm text-slate-300 flex-1">Dividendo recibido de <span className="text-white font-medium">Microsoft Corp</span></p>
            <span className="text-xs text-slate-500">Hace 2 horas</span>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
            <p className="text-sm text-slate-300 flex-1">Actualización de valoración: <span className="text-white font-medium">Nave Logística Vila-real</span></p>
            <span className="text-xs text-slate-500">Ayer</span>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
            <p className="text-sm text-slate-300 flex-1">Revisión trimestral de Private Equity pendiente</p>
            <span className="text-xs text-slate-500">Hace 3 días</span>
          </div>
        </div>
      </div>
    </div>
  );
};
