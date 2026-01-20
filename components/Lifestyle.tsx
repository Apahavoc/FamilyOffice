import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Gem,
    Watch,
    Anchor,
    Palette,
    TrendingUp,
    MapPin,
    Calendar,
    Search
} from 'lucide-react';
import { KPICard } from './ui/KPICard';
import { cn } from '../lib/utils';
import { ZenChartWrapper } from './charts/ZenChartWrapper';

// Mock Data
const LIFESTYLE_ASSETS = [
    { id: 1, name: "Patek Philippe Nautilus 5711", category: "Watches", value: 125000, purchaseDate: "2019", purchasePrice: 55000, image: "https://images.unsplash.com/photo-1639016834077-4b5cb3878b27?auto=format&fit=crop&q=80&w=600", location: "Caja Fuerte (Ginebra)" },
    { id: 2, name: "Ferrari F40 (1991)", category: "Cars", value: 2100000, purchaseDate: "2015", purchasePrice: 1200000, image: "https://images.unsplash.com/photo-1583121274602-3e2820c698d9?auto=format&fit=crop&q=80&w=600", location: "Garaje Madrid" },
    { id: 3, name: "Picasso - 'Le Rêve' (Print)", category: "Art", value: 45000, purchaseDate: "2020", purchasePrice: 42000, image: "https://images.unsplash.com/photo-1578321272195-2ea6538a0b0d?auto=format&fit=crop&q=80&w=600", location: "Oficina" },
    { id: 4, name: "Riva Aquarama Special", category: "Marine", value: 650000, purchaseDate: "2018", purchasePrice: 580000, image: "https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&q=80&w=600", location: "Puerto Banús" },
    { id: 5, name: "Rolex Daytona Panda", category: "Watches", value: 32000, purchaseDate: "2022", purchasePrice: 14000, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=600", location: "Caja Fuerte (Madrid)" },
];

export const Lifestyle: React.FC = () => {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Aggregates
    const totalValuation = LIFESTYLE_ASSETS.reduce((acc, item) => acc + item.value, 0);
    const totalCost = LIFESTYLE_ASSETS.reduce((acc, item) => acc + item.purchasePrice, 0);
    const unrealizedGain = totalValuation - totalCost;
    const gainPercentage = (unrealizedGain / totalCost) * 100;

    const filteredAssets = activeCategory === 'All'
        ? LIFESTYLE_ASSETS
        : LIFESTYLE_ASSETS.filter(a => a.category === activeCategory);

    const categories = ['All', 'Watches', 'Cars', 'Art', 'Marine'];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-6 animate-fade-in mb-8 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <Gem className="w-8 h-8 text-fuchsia-500" />
                    Passion Assets & Lifestyle
                </h2>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                activeCategory === cat ? "bg-fuchsia-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
                            )}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <KPICard
                    title="Valoración Total"
                    value={formatCurrency(totalValuation)}
                    subtext="Mark-to-Market"
                    icon={<Gem className="w-6 h-6" />}
                />
                <KPICard
                    title="Plusvalía Latente"
                    value={formatCurrency(unrealizedGain)}
                    subtext={`+${gainPercentage.toFixed(1)}% vs Coste`}
                    trend="Excelente"
                    icon={<TrendingUp className="w-6 h-6" />}
                />
                <KPICard
                    title="Activos Registrados"
                    value={LIFESTYLE_ASSETS.length.toString()}
                    subtext="En gestión"
                    icon={<Palette className="w-6 h-6" />}
                />
                <div className="bg-gradient-to-br from-fuchsia-900/40 to-slate-900 border border-fuchsia-500/30 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-fuchsia-300 font-bold mb-1">Próxima Tasación</p>
                        <p className="text-white font-mono">15 Feb 2026</p>
                    </div>
                    <Calendar className="w-8 h-8 text-fuchsia-500/50" />
                </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map(asset => (
                    <div key={asset.id} className="group bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-fuchsia-500/50 transition-all hover:shadow-xl hover:shadow-fuchsia-900/20">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={asset.image}
                                alt={asset.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider border border-slate-700">
                                {asset.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-slate-100 truncate mb-1">{asset.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                                <MapPin className="w-3 h-3" />
                                {asset.location}
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase">Valor Mercado</p>
                                    <p className="text-lg font-mono font-bold text-emerald-400">{formatCurrency(asset.value)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase">Año Compra</p>
                                    <p className="text-sm font-medium text-slate-300">{asset.purchaseDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Card Dummy */}
                <div className="border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-800/20 cursor-pointer hover:bg-slate-800/50 hover:border-slate-600 transition-colors h-full min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-slate-500" />
                    </div>
                    <p className="font-bold text-slate-400">Añadir Activo</p>
                </div>
            </div>
        </div>
    );
};
