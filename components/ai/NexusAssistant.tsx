import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Bot,
    X,
    Send,
    Sparkles,
    MessageSquare,
    ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGlobalWealth } from '../../hooks/useGlobalWealth';
import { getGeminiResponse } from '../../services/geminiService';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: React.ReactNode;
    timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
    "¿Cuál es mi patrimonio total?",
    "Resumen de Private Equity",
    "Exposición a Riesgo Climático",
    "Últimos movimientos de Tesorería"
];

export const NexusAssistant: React.FC = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimizing, setIsMinimizing] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hola. Soy Nexus, tu asistente patrimonial inteligente. ¿En qué puedo ayudarte hoy?",
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleClose = () => {
        setIsMinimizing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsMinimizing(false);
        }, 300);
    };

    const wealthData = useGlobalWealth();

    // Helper to format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 1
        }).format(value); // .replace('€', 'M €') - let's keep it simple or format matches dashboard "138.4M €"
    };

    const formatMillions = (value: number) => {
        return (value / 1000000).toFixed(1) + 'M €';
    };

    // --- GEMINI INTEGRATION ---
    const [apiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY);

    const generateResponse = async (query: string) => {
        setIsTyping(true);

        try {
            // Convert current chat history to Gemini format
            const history = messages
                .filter(m => m.id !== 'welcome') // Skip welcome if needed, or keep it
                .map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: typeof m.content === 'string' ? m.content : '' // Only text content for now
                })) as any[];

            // Context Injection: Pass the full wealthData object for RAG-like behavior
            const responseText = await getGeminiResponse(history, query, wealthData);

            const newMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: responseText, // Markdown support ideally
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newMessage]);

        } catch (error) {
            console.error("Error generating response:", error);
            const errorMsg: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Lo siento, hubo un error de conexión con mi cerebro digital. Por favor intenta de nuevo.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        generateResponse(inputValue);
        setInputValue("");
    };

    const handleSuggestionClick = (suggestion: string) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: suggestion,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        generateResponse(suggestion);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 group animate-bounce-slow"
                title="Abrir Nexus Assistant"
            >
                <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:animate-ping"></div>
                <Bot className="w-8 h-8 text-white relative z-10" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900"></span>
            </button>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 w-full max-w-[380px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 origin-bottom-right",
                isMinimizing ? "opacity-0 scale-90 translate-y-4" : "opacity-100 scale-100 translate-y-0",
                "h-[600px] max-h-[80vh]"
            )}
        >
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-100 text-sm">Nexus AI</h3>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] text-emerald-400 font-medium">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/95">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                            msg.role === 'assistant'
                                ? "bg-slate-800 text-blue-400 border border-slate-700"
                                : "bg-blue-600 text-white"
                        )}>
                            {msg.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : "YO"}
                        </div>
                        <div className={cn(
                            "p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                            msg.role === 'assistant'
                                ? "bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none"
                                : "bg-blue-600 text-white rounded-tr-none"
                        )}>
                            {msg.content}
                            <div className={cn(
                                "text-[10px] mt-2 opacity-50 text-right",
                                msg.role === 'user' ? "text-blue-100" : "text-slate-500"
                            )}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-1">
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (Chips) */}
            {messages.length < 3 && !isTyping && (
                <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                    {SUGGESTED_QUESTIONS.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(q)}
                            className="whitespace-nowrap px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded-full text-xs text-slate-300 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 bg-slate-900 border border-slate-700 p-1.5 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
                >
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Pregunta sobre tu patrimonio..."
                        className="flex-1 bg-transparent border-none text-slate-200 text-sm px-3 py-2 focus:outline-none placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className={cn(
                            "p-2 rounded-lg transition-all duration-200",
                            inputValue.trim() && !isTyping
                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
                                : "bg-slate-800 text-slate-600 cursor-not-allowed"
                        )}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        AI generated content grounded in portfolio data
                    </p>
                </div>
            </div>
        </div>
    );
};
