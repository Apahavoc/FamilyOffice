import React, { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import { PortfolioHolding } from '../types';
import { cn } from '../lib/utils';

const columnHelper = createColumnHelper<PortfolioHolding>();

const columns = [
    columnHelper.accessor('ticker', {
        header: 'Ticker',
        cell: info => <span className="font-mono font-bold text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('name', {
        header: 'Nombre del Activo',
        cell: info => <span className="text-slate-200 font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', {
        header: 'Tipo',
        cell: info => (
            <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400">
                {info.getValue()}
            </span>
        ),
    }),
    columnHelper.accessor('value', {
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center hover:text-white transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Valor Actual
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: info => <span className="font-mono font-bold text-white tracking-wide">{info.getValue()}</span>,
    }),
    columnHelper.accessor('change', {
        header: 'Rentabilidad',
        cell: info => {
            const val = info.getValue();
            const isPositive = val.startsWith('+');
            return (
                <span className={cn(
                    "flex items-center gap-1 font-medium",
                    isPositive ? "text-emerald-400" : "text-red-400"
                )}>
                    {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {val}
                </span>
            );
        },
    }),
];

interface PortfolioTableProps {
    data: PortfolioHolding[];
}

export const PortfolioTable: React.FC<PortfolioTableProps> = ({ data }) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder="Filtrar activos..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                </div>
                {/* Additional Filters could go here */}
            </div>

            <div className="rounded-xl border border-slate-700 overflow-hidden bg-slate-800/20 backdrop-blur-sm shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="bg-slate-900/50 border-b border-slate-700">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-slate-700/30 transition-colors group">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="p-4 text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {table.getRowModel().rows.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No se encontraron activos que coincidan con la búsqueda.
                    </div>
                )}
            </div>
        </div>
    );
};
