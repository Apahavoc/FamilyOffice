import React, { useState } from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { PortfolioTable } from './PortfolioTable';
import { Briefcase, Bot, ArrowRightLeft, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KPICard } from './ui/KPICard';
import { cn } from '../lib/utils';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export const Portfolio: React.FC = () => {
   const { holdings } = usePortfolioData();
   const { t } = useTranslation();
   const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
   const [showRebalancer, setShowRebalancer] = useState(false);

   const filters = [
      { label: 'Renta Variable', type: 'Equity' },
      { label: 'ETF', type: 'ETF' },
      { label: 'Fondos', type: 'Fund' }
   ];

   const filteredHoldings = activeFilter
      ? holdings.filter(h => h.type === activeFilter)
      : holdings;

   // Mock Allocation Data for Rebalancer
   const allocationData = [
      { name: 'Equity', value: 65, target: 60, color: '#3b82f6' },
      { name: 'Fixed Income', value: 25, target: 30, color: '#10b981' },
      { name: 'Alts', value: 10, target: 10, color: '#f59e0b' },
   ];

   const recommendedTrades = [
      { action: 'SELL', asset: 'SPDR S&P 500 ETF', amount: 150000, reason: 'Take Profit (Overweight)' },
      { action: 'BUY', asset: 'iShares Core Aggreg Bond', amount: 150000, reason: 'Rebalance Yield' },
   ];

   return (
      <div className="space-y-6 animate-fade-in mb-8">
         <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-100">{t('menu.portfolio')}</h2>
            <div className="flex gap-2">
               {filters.map(filter => (
                  <button
                     key={filter.type}
                     onClick={() => setActiveFilter(activeFilter === filter.type ? null : filter.type)}
                     className={`
                           px-3 py-1.5 rounded-lg text-sm border transition-colors
                           ${activeFilter === filter.type
                           ? 'bg-blue-600 border-blue-500 text-white'
                           : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}
                       `}
                  >
                     {filter.label}
                  </button>
               ))}
               <button
                  onClick={() => setShowRebalancer(!showRebalancer)}
                  className={cn(
                     "px-3 py-1.5 rounded-lg text-sm border border-indigo-500/50 transition-all flex items-center gap-2",
                     showRebalancer ? "bg-indigo-600 text-white shadow-lg" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
                  )}
               >
                  <Bot className="w-4 h-4" />
                  AI Rebalancer
               </button>
            </div>
         </div>

         {/* AI Rebalancing Widget */}
         {showRebalancer && (
            <div className="bg-slate-800/50 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-500">
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-indigo-400" />
                        Comité de Inversión (AI)
                     </h3>
                     <p className="text-sm text-slate-500 mt-1">
                        Análisis de desviación de cartera y recomendaciones automáticas.
                     </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
                     <AlertTriangle className="w-4 h-4 text-amber-500" />
                     <span className="text-xs font-medium text-amber-400">Drift Detectado: +5% Equity</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Allocation Chart */}
                  <div className="h-[200px] flex items-center justify-center relative">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={allocationData}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                           >
                              {allocationData.map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                              ))}
                           </Pie>
                           <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }} />
                           <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                           <span className="text-xl font-bold text-white">65%</span>
                           <p className="text-[10px] text-slate-400">Equity Exposure</p>
                        </div>
                     </div>
                  </div>

                  {/* Action Plan */}
                  <div className="lg:col-span-2 space-y-4">
                     <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Plan de Rebalanceo Propuesto</h4>
                     {recommendedTrades.map((trade, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                 "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                                 trade.action === 'SELL' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"
                              )}>
                                 {trade.action}
                              </div>
                              <div>
                                 <p className="text-sm font-medium text-white">{trade.asset}</p>
                                 <p className="text-xs text-slate-500">{trade.reason}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-mono font-bold text-slate-200">
                                 {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(trade.amount)}
                              </p>
                           </div>
                        </div>
                     ))}

                     <div className="flex justify-end gap-3 pt-2">
                        <button className="text-xs text-slate-500 hover:text-white px-3 py-2 transition-colors">
                           Ignorar Alerta
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-900/20 hover:scale-105 transition-transform">
                           <CheckCircle2 className="w-3 h-3" />
                           Ejecutar Rebalanceo (1 Click)
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <PortfolioTable data={filteredHoldings} />
      </div>
   );
}
