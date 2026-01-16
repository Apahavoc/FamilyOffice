import React from 'react';
import { TrendingUp } from 'lucide-react';
import { KPICardProps } from '../../types';

export const KPICard: React.FC<KPICardProps> = ({ title, value, subtext, icon, trend }) => (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-blue-900/10">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            {trend && (
                <span className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1" /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-50">{value}</span>
            <span className="text-sm text-slate-500">{subtext}</span>
        </div>
    </div>
);
