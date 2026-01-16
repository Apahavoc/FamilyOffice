import React, { useState } from 'react';
import {
  Building,
  MapPin,
  LayoutGrid,
  List as ListIcon,
  Filter,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRealEstateData } from '../hooks/useRealEstateData';
import { KPICard } from './ui/KPICard';
import { cn } from '../lib/utils';
import { RealEstateAsset } from '../types';
import { HoldVsSellCalculator } from './tools/HoldVsSellCalculator';

export const RealEstate: React.FC = () => {
  const { t } = useTranslation();
  const { assets, metrics } = useRealEstateData();
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [filter, setFilter] = useState<'all' | 'occupied' | 'construction'>('all');
  const [selectedAsset, setSelectedAsset] = useState<RealEstateAsset | null>(null);

  const filteredAssets = assets.filter(asset => {
    if (filter === 'all') return true;
    if (filter === 'occupied') return asset.status === 'Occupado';
    if (filter === 'construction') return asset.status === 'En Construcción';
    return true;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      'Occupado': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'En Construcción': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'Disponible': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return (
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", styles[status as keyof typeof styles])}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in mb-8">
      {/* Header & KPIs */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-100">{t('menu.real_estate')}</h2>
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('gallery')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'gallery' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title={t('real_estate_section.total_value')}
            value={metrics.totalValue}
            subtext="Valoración RICS"
            icon={<Building className="w-6 h-6" />}
          />
          <KPICard
            title={t('real_estate_section.avg_yield')}
            value={metrics.averageYield}
            subtext="Rentabilidad Bruta"
            icon={<TrendingUp className="w-6 h-6" />}
            trend="+0.2%"
          />
          <KPICard
            title={t('real_estate_section.occupancy')}
            value={metrics.occupancyRate}
            subtext="Superficie alquilada"
            icon={<DollarSign className="w-6 h-6" />}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
        <Filter className="w-4 h-4 text-slate-500" />
        <button
          onClick={() => setFilter('all')}
          className={cn("text-sm font-medium transition-colors", filter === 'all' ? "text-blue-400" : "text-slate-400 hover:text-slate-200")}
        >
          {t('real_estate_section.filter_all')}
        </button>
        <button
          onClick={() => setFilter('occupied')}
          className={cn("text-sm font-medium transition-colors", filter === 'occupied' ? "text-blue-400" : "text-slate-400 hover:text-slate-200")}
        >
          {t('real_estate_section.filter_occupied')}
        </button>
        <button
          onClick={() => setFilter('construction')}
          className={cn("text-sm font-medium transition-colors", filter === 'construction' ? "text-blue-400" : "text-slate-400 hover:text-slate-200")}
        >
          {t('real_estate_section.filter_construction')}
        </button>
      </div>

      {/* Content */}
      {viewMode === 'gallery' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-900/10">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={asset.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"}
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute top-4 right-4">
                  <StatusBadge status={asset.status} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent">
                  <h3 className="text-lg font-bold text-white truncate">{asset.name}</h3>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {asset.location}
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Valor</p>
                  <p className="text-lg font-mono font-semibold text-slate-200">{asset.value}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Yield</p>
                  <p className="text-lg font-mono font-semibold text-emerald-400">{asset.yield}</p>
                </div>
              </div>
              {/* Mini Profitability Bar (Simulated) */}
              <div className="px-4 pb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">{t('real_estate_section.income')} vs {t('real_estate_section.expenses')}</span>
                  <span className="text-slate-400">75% Margin</span>
                </div>
                <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: '75%' }}></div>
                  <div className="h-full bg-red-500/50" style={{ width: '25%' }}></div>
                </div>

                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="w-full mt-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-3 h-3" />
                  Analizar Hold vs Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Activo</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-right">Yield</th>
                <th className="px-6 py-4 text-right">Ocupación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-sm">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      <img src={asset.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    {asset.name}
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                  <td className="px-6 py-4 text-slate-400">{asset.location}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-200">{asset.value}</td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-400">{asset.yield}</td>
                  <td className="px-6 py-4 text-right text-slate-400">{asset.occupancy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedAsset && (
        <HoldVsSellCalculator
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          asset={selectedAsset}
        />
      )}
    </div>
  );
};
