import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    FileText,
    Download,
    Calendar,
    CheckCircle2,
    Loader2,
    FileBarChart,
    ShieldAlert,
    BrainCircuit,
    UploadCloud,
    Search,
    Eye
} from 'lucide-react';
import { generateIntegratedReport } from '../services/reportGenerator';
import { useGlobalWealth } from '../hooks/useGlobalWealth';
import { cn } from '../lib/utils';

// Mock existing documents
const MOCK_DOCUMENTS = [
    { id: 1, title: "Pacto de Socios - SolarSpain", date: "15/01/2025", type: "Legal", size: "2.4 MB", status: "analyzed", riskLevel: "medium" },
    { id: 2, title: "Term Sheet - Project Alpha", date: "10/01/2025", type: "M&A", size: "1.1 MB", status: "pending", riskLevel: "unknown" },
    { id: 3, title: "Escritura Constitución Holding", date: "20/12/2024", type: "Legal", size: "5.8 MB", status: "analyzed", riskLevel: "low" },
];

const ANALYSIS_RESULT_MOCK = {
    summary: "El documento 'Term Sheet - Project Alpha' describe una inversión de 12.5M€ por el 25% del equity. La valoración pre-money es de 37.5M€.",
    risks: [
        "Cláusula de 'Liquidation Preference' de 2x (No estándar, riesgo alto).",
        "Periodo de exclusividad corto (30 días).",
        "Drag-along rights sin suelo mínimo de valoración."
    ],
    dates: [
        { label: "Cierre Previsto", value: "28 Feb 2025" },
        { label: "Fin Exclusividad", value: "15 Feb 2025" }
    ]
};

export const Reporting: React.FC = () => {
    const { t } = useTranslation();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'vault' | 'generator'>('vault');

    // Generator State
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportTitle, setReportTitle] = useState(`Informe Integrado - ${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`);
    const wealthData = useGlobalWealth();

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        // Simulate AI Delay
        setTimeout(() => {
            setIsAnalyzing(false);
            setAnalysisData(ANALYSIS_RESULT_MOCK);
        }, 2500);
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            await generateIntegratedReport(['summary', 'portfolio', 'private_equity'], reportTitle, wealthData);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in mb-8 h-full flex flex-col">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <BrainCircuit className="w-8 h-8 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">Bóveda Inteligente (AI Vault)</h2>
                        <p className="text-xs text-slate-400">Gestión Documental Aumentada</p>
                    </div>
                </div>

                {/* TABS Toggle */}
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setActiveTab('vault')}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            activeTab === 'vault' ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                        )}>
                        <ShieldAlert className="w-4 h-4" />
                        Análisis Legal (AI)
                    </button>
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={cn(
                            "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                            activeTab === 'generator' ? "bg-slate-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                        )}>
                        <FileText className="w-4 h-4" />
                        Generador Informes
                    </button>
                </div>
            </div>

            {activeTab === 'vault' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* LEFT: Document List */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Drag & Drop Zone */}
                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-800/20 hover:bg-slate-800/40 hover:border-indigo-500/50 transition-all cursor-pointer group">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl shadow-black/20">
                                <UploadCloud className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-200">Arrastra tus contratos aquí</h3>
                            <p className="text-slate-500 text-sm mt-1">Soporta PDF, DOCX (Máx 25MB)</p>
                        </div>

                        {/* Recent Docs Table */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden flex-1">
                            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-200">Documentos Recientes</h3>
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="text" placeholder="Buscar..." className="bg-slate-900 border border-slate-700 rounded-full pl-9 pr-4 py-1 text-sm focus:outline-none focus:border-indigo-500 w-48" />
                                </div>
                            </div>
                            <div className="divide-y divide-slate-700/50">
                                {MOCK_DOCUMENTS.map(doc => (
                                    <div
                                        key={doc.id}
                                        onClick={() => { setSelectedDoc(doc.id); setAnalysisData(null); }}
                                        className={cn(
                                            "p-4 flex items-center justify-between hover:bg-slate-700/30 cursor-pointer transition-colors border-l-4",
                                            selectedDoc === doc.id ? "bg-slate-700/50 border-indigo-500" : "border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-900 rounded-lg">
                                                <FileText className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-slate-200 font-medium text-sm">{doc.title}</h4>
                                                <p className="text-slate-500 text-xs">{doc.type} • {doc.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {doc.status === 'analyzed' ? (
                                                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1">
                                                    <BrainCircuit className="w-3 h-3" /> Analizado
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-400 text-xs">Pendiente</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: AI Analysis Panel */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
                        {!selectedDoc ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 opacity-60">
                                <BrainCircuit className="w-16 h-16 mb-4 text-slate-700" />
                                <p>Selecciona un documento para activar el análisis inteligente</p>
                            </div>
                        ) : (
                            <>
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Análisis Nexus AI</h3>
                                        <p className="text-xs text-indigo-400">Extracción automática de riesgos</p>
                                    </div>
                                    <button className="text-slate-400 hover:text-white"><Download className="w-5 h-5" /></button>
                                </div>

                                {isAnalyzing ? (
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <BrainCircuit className="w-6 h-6 text-indigo-400 animate-pulse" />
                                            </div>
                                        </div>
                                        <p className="text-slate-300 animate-pulse">Leyendo cláusulas legales...</p>
                                    </div>
                                ) : !analysisData ? (
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <p className="text-slate-400 text-sm mb-6 text-center">Este documento aún no ha sido procesado por el motor de inteligencia artificial.</p>
                                        <button
                                            onClick={handleAnalyze}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-900/50 hover:scale-105 transition-transform flex items-center gap-2"
                                        >
                                            <BrainCircuit className="w-5 h-5" />
                                            Analizar Documento
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in-up">
                                        {/* Result Content */}
                                        <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30">
                                            <h4 className="text-indigo-300 text-xs font-bold uppercase mb-2">Resumen Ejecutivo</h4>
                                            <p className="text-slate-300 text-sm leading-relaxed">{analysisData.summary}</p>
                                        </div>

                                        <div>
                                            <h4 className="text-amber-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                                                <ShieldAlert className="w-4 h-4" /> Riesgos Detectados (3)
                                            </h4>
                                            <ul className="space-y-2">
                                                {analysisData.risks.map((risk: string, i: number) => (
                                                    <li key={i} className="text-sm text-slate-300 p-2 bg-slate-800/50 rounded border-l-2 border-amber-500 pl-3">
                                                        {risk}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {analysisData.dates.map((d: any, i: number) => (
                                                <div key={i} className="bg-slate-800 p-3 rounded-lg text-center">
                                                    <p className="text-xs text-slate-500 uppercase">{d.label}</p>
                                                    <p className="text-white font-mono font-bold">{d.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                // --- GENERATOR VIEW (Original Reporting Logic) ---
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
                            <FileBarChart className="w-16 h-16 text-slate-600 mb-6" />
                            <h3 className="text-xl font-bold text-slate-200 mb-2">Generador de Informes PDF</h3>
                            <p className="text-slate-400 max-w-md mb-8">
                                Crea informes ejecutivos listos para el consejo, combinando datos en tiempo real con narrativa generada por AI.
                            </p>

                            <div className="w-full max-w-md space-y-4">
                                <input
                                    type="text"
                                    value={reportTitle}
                                    onChange={(e) => setReportTitle(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleGenerateReport}
                                        disabled={isGenerating}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGenerating ? <Loader2 className="animate-spin" /> : <Download className="w-5 h-5" />}
                                        {isGenerating ? 'Generando...' : 'Informe PDF'}
                                    </button>
                                    <button
                                        onClick={() => alert("Sunday Brief: \n\nResumen Semanal Generado.\n\nHighlights:\n- Cartera +2.4% vs S&P500\n- Riesgo Liquidez: Bajo\n- Acción: Aprobar CapEx en Real Estate.")}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        <BrainCircuit className="w-5 h-5" />
                                        Sunday Brief (AI)
                                    </button>
                                </div>

                                <button
                                    onClick={() => import('../services/reportGenerator').then(mod => mod.generateUserManual())}
                                    className="w-full mt-3 bg-transparent border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400 font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all text-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    Descargar Manual de Usuario & Glosario
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Simplified History Panel */}
                    <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                        <h3 className="font-bold text-slate-200 mb-4">Historial de Informes</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-300">Informe Q3 2024</p>
                                    <p className="text-xs text-slate-500">15 Oct 2024 • 4.2 MB</p>
                                </div>
                                <Download className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
                            </div>
                            <div className="p-3 bg-indigo-900/20 rounded border border-indigo-500/30 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-indigo-300">Sunday Brief #42</p>
                                        <span className="text-[10px] bg-indigo-500 text-white px-1.5 rounded">AI</span>
                                    </div>
                                    <p className="text-xs text-indigo-400">Hace 2 días • Texto</p>
                                </div>
                                <Eye className="w-4 h-4 text-indigo-500 hover:text-indigo-300 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
