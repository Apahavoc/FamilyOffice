import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ZenChartWrapperProps {
    children: React.ReactNode;
    title: React.ReactNode;
    className?: string; // Additional classes for the container
}

export const ZenChartWrapper: React.FC<ZenChartWrapperProps> = ({ children, title, className }) => {
    const [isZenMode, setIsZenMode] = useState(false);

    return (
        <div
            className={cn(
                "bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl transition-all duration-500 ease-in-out flex flex-col hover:border-blue-500/30",
                isZenMode ? "fixed inset-4 z-50 bg-slate-900/95 border-blue-500/50 shadow-2xl" : "relative",
                className
            )}
        >
            <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold text-slate-200">{title}</div>
                <button
                    onClick={() => setIsZenMode(!isZenMode)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                    title={isZenMode ? "Salir de Zen Mode" : "Pantalla Completa"}
                >
                    {isZenMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </button>
            </div>
            <div className="flex-1 w-full min-h-0 relative">
                {children}
            </div>
        </div>
    );
};
