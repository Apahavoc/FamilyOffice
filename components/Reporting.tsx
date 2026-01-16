import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Loader2,
    FileBarChart
} from 'lucide-react';
import { generateIntegratedReport, triggerDownload } from '../services/reportGenerator';
import { useGlobalWealth } from '../hooks/useGlobalWealth';

const MOCK_REPORTS = [
    { id: 1, title: "Informe Mensual - Diciembre 2024", date: "31/12/2024", type: "Mensual", size: "2.4 MB" },
    { id: 2, title: "Revisión Trimestral Q4 2024", date: "15/01/2025", type: "Trimestral", size: "5.1 MB" },
    { id: 3, title: "Informe de Impacto & ESG 2024", date: "20/12/2024", type: "Temático", size: "1.8 MB" },
];

const MODULES = [
    { id: 'summary', label: 'Resumen Ejecutivo' },
    { id: 'portfolio', label: 'Cartera Financiera' },
    { id: 'real_estate', label: 'Real Estate' },
    { id: 'private_equity', label: 'Private Equity' },
    { id: 'treasury', label: 'Tesorería' },
    { id: 'business', label: 'Negocio Familiar' },
    { id: 'risks', label: 'Matriz de Riesgos' },
    { id: 'impact', label: 'Filantropía & ESG' },
    { id: 'environmental', label: 'Derechos CO₂' },
    { id: 'passion_assets', label: 'Activos de Pasión' },
    { id: 'crypto', label: 'Criptoactivos' },

];

export const Reporting: React.FC = () => {
    const { t } = useTranslation();
    const [isGenerating, setIsGenerating] = useState(false);
    // Select ALL modules by default for the "Premium" experience
    const [selectedModules, setSelectedModules] = useState<string[]>(MODULES.map(m => m.id));
    const wealthData = useGlobalWealth(); // Fetch live data

    const [reportTitle, setReportTitle] = useState(`Informe Integrado - ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`);

    const handleGenerate = async () => {
        setIsGenerating(true);
        console.log("Starting report generation...", { selectedModules, reportTitle });

        try {
            console.log("Calling generateIntegratedReport...");

            // Generate and Save immediately (Single Step)
            await generateIntegratedReport(selectedModules, reportTitle, wealthData);

            console.log("Report generated and save triggered.");
        } catch (error) {
            console.error("Report Generation Error:", error);
            alert("Error: Falla al generar el informe. Ver consola para detalles.");
        } finally {
            setIsGenerating(false);
        }
    };



    const toggleModule = (id: string) => {
        if (selectedModules.includes(id)) {
            setSelectedModules(selectedModules.filter(m => m !== id));
        } else {
            setSelectedModules([...selectedModules, id]);
        }
    };

    const toggleAll = () => {
        if (selectedModules.length === MODULES.length) {
            setSelectedModules(['summary']); // Keep at least Summary
        } else {
            setSelectedModules(MODULES.map(m => m.id));
        }
    };

    return (
        <div className="space-y-6 animate-fade-in mb-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-400" />
                    {t('menu.reporting')}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Configuration Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <FileBarChart className="w-5 h-5 text-blue-400" />
                            {t('reporting_section.configure')}
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Título del Informe</label>
                                <input
                                    type="text"
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <label className="block text-sm font-medium text-slate-400">{t('reporting_section.select_modules')}</label>
                                    <button
                                        onClick={toggleAll}
                                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                                    >
                                        {selectedModules.length === MODULES.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {MODULES.map(module => (
                                        <div
                                            key={module.id}
                                            onClick={() => toggleModule(module.id)}
                                            className={`
                                                cursor-pointer flex items-center justify-between p-3 rounded-lg border transition-all
                                                ${selectedModules.includes(module.id)
                                                    ? 'bg-blue-500/10 border-blue-500/50'
                                                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'}
                                            `}
                                        >
                                            <span className={`text-sm ${selectedModules.includes(module.id) ? 'text-blue-200' : 'text-slate-400'}`}>
                                                {module.label}
                                            </span>
                                            {selectedModules.includes(module.id) && (
                                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-700/50 flex justify-end">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className={`
                                            flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-white transition-all
                                            ${isGenerating
                                                ? 'bg-slate-700 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20'}
                                        `}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {t('reporting_section.generating')}
                                            </>
                                        ) : (
                                            <>
                                                <FileText className="w-5 h-5" />
                                                {t('reporting_section.generate_new')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-6 h-full">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-400" />
                            {t('reporting_section.history')}
                        </h3>

                        <div className="space-y-4">
                            {MOCK_REPORTS.map(report => (
                                <div key={report.id} className="group p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-slate-600 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-400">{report.type}</div>
                                        <span className="text-xs text-slate-500">{report.date}</span>
                                    </div>
                                    <h4 className="text-slate-200 font-medium text-sm mb-3 group-hover:text-blue-400 transition-colors">{report.title}</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">{report.size}</span>
                                        <button
                                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                            title={t('reporting_section.download')}
                                            onClick={() => alert(`Descargando: ${report.title}`)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
