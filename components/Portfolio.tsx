import React from 'react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { PortfolioTable } from './PortfolioTable';
import { Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Portfolio: React.FC = () => {
   const { holdings } = usePortfolioData();
   const { t } = useTranslation();
   const [activeFilter, setActiveFilter] = React.useState<string | null>(null);

   const filters = [
      { label: 'Renta Variable', type: 'Equity' },
      { label: 'ETF', type: 'ETF' },
      { label: 'Fondos', type: 'Fund' }
   ];

   const filteredHoldings = activeFilter
      ? holdings.filter(h => h.type === activeFilter)
      : holdings;

   return (
      <div className="space-y-6 animate-fade-in">
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
            </div>
         </div>

         <PortfolioTable data={filteredHoldings} />

         {/* Add Item Action (Optional, can be kept below or in a header action) */}
         <div className="mt-4 flex justify-end">
            <button
               className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
               onClick={() => alert("Gestión de Cartera: Módulo de órdenes de compra/venta no disponible")}
            >
               <Briefcase className="w-4 h-4" />
               Gestionar Cartera
            </button>
         </div>
      </div>
   );
}
