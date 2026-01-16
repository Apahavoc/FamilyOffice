import React from 'react';
import { CustomTooltipProps } from '../../types';

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
                <p className="text-slate-300 font-medium mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-400">{entry.name}:</span>
                        <span className="text-slate-200 font-bold">{entry.value}M €</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};
