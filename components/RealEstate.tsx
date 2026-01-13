import React from 'react';
import { REAL_ESTATE_ASSETS } from '../constants';
import { Building, MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const RealEstate: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Occupado':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"><CheckCircle2 className="w-3 h-3 mr-1" /> 100% Ocupado</span>;
      case 'En Construcción':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400 border border-amber-400/20"><Clock className="w-3 h-3 mr-1" /> En Desarrollo</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300"><AlertCircle className="w-3 h-3 mr-1" /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Cartera Inmobiliaria</h2>
            <p className="text-slate-400 text-sm mt-1">Gestión activa de activos reales (45% del Portfolio)</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">
            Añadir Activo
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700">
             <div className="text-slate-400 text-xs uppercase font-semibold mb-1">Valor Total Activos</div>
             <div className="text-2xl font-bold text-slate-100">10.4M €</div>
          </div>
          <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700">
             <div className="text-slate-400 text-xs uppercase font-semibold mb-1">Yield Medio Ponderado</div>
             <div className="text-2xl font-bold text-emerald-400">5.85%</div>
          </div>
          <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700">
             <div className="text-slate-400 text-xs uppercase font-semibold mb-1">Tasa de Ocupación</div>
             <div className="text-2xl font-bold text-blue-400">95%</div>
          </div>
       </div>

       <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Activo</th>
                  <th className="p-4 font-semibold">Ubicación</th>
                  <th className="p-4 font-semibold">Valoración</th>
                  <th className="p-4 font-semibold">Yield (Bruto)</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {REAL_ESTATE_ASSETS.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-700/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                           <Building className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-slate-200">{asset.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-slate-400 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {asset.location}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {asset.value}
                    </td>
                    <td className="p-4">
                      <span className={`font-mono font-medium ${asset.yield !== '--' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {asset.yield}
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(asset.status)}
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Detalles</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       </div>
    </div>
  );
};
