import React, { useState } from 'react';
import {
  Building,
  MapPin,
  LayoutGrid,
  List as ListIcon,
  Filter,
  TrendingUp,
  DollarSign,
  Hammer,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRealEstateData } from '../hooks/useRealEstateData';
import { KPICard } from './ui/KPICard';
import { cn } from '../lib/utils';
import { RealEstateAsset } from '../types';
import { HoldVsSellCalculator } from './tools/HoldVsSellCalculator';

// CapEx Simulator Component (Internal for speed)
const RenovationSimulator: React.FC<{ asset: RealEstateAsset; onClose: () => void }> = ({ asset, onClose }) => {
  const [budget, setBudget] = useState(50000);
  const [rentIncrease, setRentIncrease] = useState(15); // %

  // Simple ROI Logic
  const currentVal = parseFloat(asset.value.replace(/[^0-9.]/g, '')) * 1000000;
  const currentYield = parseFloat(asset.yield);
  const currentAnnualRent = currentVal * (currentYield / 100);

  const newAnnualRent = currentAnnualRent * (1 + rentIncrease / 100);
  const totalCost = currentVal + budget;
  const newYieldOnCost = (newAnnualRent / totalCost) * 100;
  const valuationUplift = (newAnnualRent / (currentYield / 100)) - currentVal - budget;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Hammer className="w-5 h-5 text-amber-500" />
            Plan de Reforma: {asset.name}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Presupuesto Reforma (€)</label>
              <input
                type="range" min="10000" max="500000" step="5000"
                value={budget} onChange={e => setBudget(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>10k</span>
                <span className="text-amber-400 font-bold text-base">{budget.toLocaleString()} €</span>
                <span>500k</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Subida Alquiler Estimada (%)</label>
              <input
                type="range" min="0" max="50" step="1"
                value={rentIncrease} onChange={e => setRentIncrease(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                <span>0%</span>
                <span className="text-emerald-400 font-bold text-base">+{rentIncrease}%</span>
                <span>50%</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Yield Original vs Nuevo</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 line-through">{currentYield.toFixed(1)}%</span>
                <ArrowRight className="w-3 h-3 text-slate-500" />
                <span className="text-emerald-400 font-bold text-lg">{newYieldOnCost.toFixed(2)}%</span>
              </div>
            </div>
            <div className="h-px bg-slate-700/50"></div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Plusvalía Latente (Post-Obras)</span>
              <span className="text-amber-400 font-bold font-mono">+{Math.round(valuationUplift).toLocaleString()} €</span>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-2 text-center">
              *Calculado asumiendo misma tasa de capitalización (Cap Rate) de mercado.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors">Cancelar</button>
          <button onClick={() => alert("Proyecto guardado en Pipeline de Inversiones")} className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
            Aprobar Proyecto Capex
          </button>
        </div>
      </div>
    </div>
  );
};

export const RealEstate: React.FC = () => {
  const { t } = useTranslation();
  const { assets, metrics } = useRealEstateData();
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [filter, setFilter] = useState<'all' | 'occupied' | 'construction'>('all');
  const [selectedAsset, setSelectedAsset] = useState<RealEstateAsset | null>(null);

  // Controls for Modals
  const [showHoldSell, setShowHoldSell] = useState(false);
  const [showRenovation, setShowRenovation] = useState(false);

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

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setSelectedAsset(asset); setShowHoldSell(true); }}
                    className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <TrendingUp className="w-3 h-3" />
                    Hold/Sell
                  </button>
                  <button
                    onClick={() => { setSelectedAsset(asset); setShowRenovation(true); }}
                    className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <Hammer className="w-3 h-3" />
                    CapEx
                  </button>
                </div>
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

      {/* MODALS */}
      {selectedAsset && showHoldSell && (
        <HoldVsSellCalculator
          isOpen={true}
          onClose={() => { setShowHoldSell(false); setSelectedAsset(null); }}
          asset={selectedAsset}
        />
      )}

      {selectedAsset && showRenovation && (
        <RenovationSimulator
          asset={selectedAsset}
          onClose={() => { setShowRenovation(false); setSelectedAsset(null); }}
        />
      )}
    </div>
  );
};
