import React from 'react';
import { MOCK_PORTFOLIO_HOLDINGS } from '../constants';
import { ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';

export const Portfolio: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-slate-100">Cartera de Valores</h2>
         <div className="flex gap-2">
            <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm">Renta Variable</span>
            <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm">ETF</span>
            <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-sm">Fondos</span>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PORTFOLIO_HOLDINGS.map((holding) => {
             const isPositive = holding.change.startsWith('+');
             return (
               <div key={holding.ticker} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-4 rounded-xl hover:border-blue-500/30 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-3">
                     <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-200 font-bold text-xs">
                        {holding.ticker}
                     </div>
                     <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {holding.change}
                     </span>
                  </div>
                  <h4 className="text-slate-200 font-semibold text-sm truncate">{holding.name}</h4>
                  <p className="text-slate-500 text-xs mb-3">{holding.type}</p>
                  <div className="flex justify-between items-end border-t border-slate-700/50 pt-3">
                     <span className="text-xs text-slate-400">Valor Actual</span>
                     <span className="text-lg font-bold text-white">{holding.value}</span>
                  </div>
               </div>
             )
          })}
          {/* Add Item Card */}
          <div className="bg-slate-800/20 border border-dashed border-slate-700 p-4 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800/40 hover:text-slate-300 hover:border-slate-500 transition-all cursor-pointer min-h-[160px]">
             <Briefcase className="w-8 h-8 mb-2 opacity-50" />
             <span className="text-sm font-medium">Gestionar Cartera</span>
          </div>
       </div>
    </div>
  );
}