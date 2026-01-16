import React from 'react';
import { cn } from '../../lib/utils';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={cn("animate-pulse rounded-md bg-slate-800/50", className)} />
);

export const KPISkeleton = () => (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-[140px]">
        <div className="flex justify-between items-start mb-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="w-16 h-6 rounded-full" />
        </div>
        <Skeleton className="w-24 h-4 mb-2" />
        <div className="flex items-baseline gap-2">
            <Skeleton className="w-32 h-8" />
            <Skeleton className="w-16 h-4" />
        </div>
    </div>
);

export const ChartSkeleton = () => (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl h-full flex flex-col">
        <Skeleton className="w-48 h-6 mb-6" />
        <Skeleton className="flex-1 w-full rounded-xl" />
    </div>
);
