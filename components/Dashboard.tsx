import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, DollarSign, Activity, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { MOCK_PERFORMANCE_DATA, MOCK_ALLOCATION_DATA, ALLOCATION_COLORS } from '../constants';

const KPICard = ({ title, value, subtext, icon, trend }: { title: string, value: string, subtext: string, icon: React.ReactNode, trend?: string }) => (
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
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

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Row - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Patrimonio Total (AUM)" 
          value="24.5M €" 
          subtext="+4.2% YTD" 
          trend="+4.2%"
          icon={<DollarSign className="w-6 h-6" />} 
        />
        <KPICard 
          title="Rentabilidad Anual" 
          value="8.15%" 
          subtext="vs 6.5% Benchmark" 
          trend="+1.65%"
          icon={<TrendingUp className="w-6 h-6" />} 
        />
        <KPICard 
          title="Ratio de Liquidez" 
          value="13%" 
          subtext="Objetivo: 10-15%" 
          icon={<Activity className="w-6 h-6" />} 
        />
      </div>

      {/* Middle Row - Charts (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        {/* Line Chart - Spans 2 cols */}
        <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Evolución Patrimonial
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/20">6 Meses</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-700 hover:bg-slate-700 cursor-pointer transition-colors">YTD</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} domain={[22, 26]} unit="M" dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="NEXUS" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1e293b' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  name="Benchmark" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Spans 1 col */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Asset Allocation
          </h3>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_ALLOCATION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_ALLOCATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ALLOCATION_COLORS[index % ALLOCATION_COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-2xl font-bold text-slate-200">24.5M</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total</p>
            </div>
          </div>
          {/* Custom Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
             {MOCK_ALLOCATION_DATA.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ALLOCATION_COLORS[index] }} />
                  <span className="text-slate-400 flex-1">{entry.name}</span>
                  <span className="text-slate-200 font-medium">{entry.value}%</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Activity / Quick Stats */}
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-slate-200">Alertas y Notificaciones Recientes</h3>
             <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
               Ver todas <ArrowUpRight className="w-4 h-4" />
             </button>
          </div>
          <div className="space-y-3">
             <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3"></div>
                <p className="text-sm text-slate-300 flex-1">Dividendo recibido de <span className="text-white font-medium">Microsoft Corp</span></p>
                <span className="text-xs text-slate-500">Hace 2 horas</span>
             </div>
             <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <p className="text-sm text-slate-300 flex-1">Actualización de valoración: <span className="text-white font-medium">Nave Logística Vila-real</span></p>
                <span className="text-xs text-slate-500">Ayer</span>
             </div>
             <div className="flex items-center p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-3"></div>
                <p className="text-sm text-slate-300 flex-1">Revisión trimestral de Private Equity pendiente</p>
                <span className="text-xs text-slate-500">Hace 3 días</span>
             </div>
          </div>
      </div>
    </div>
  );
};
