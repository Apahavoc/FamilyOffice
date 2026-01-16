import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'transfer' | 'buy' | 'sell';
    title: string;
    defaultAmount?: number;
    currency?: string;
    onConfirm: (data: any) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    defaultAmount = 1000,
    currency = 'EUR',
    onConfirm
}) => {
    const { t } = useTranslation();
    const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
    const [amount, setAmount] = useState<string>(defaultAmount.toString());
    const [recipient, setRecipient] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');

        // Simulate API call
        setTimeout(() => {
            setStep('success');
            onConfirm({ amount: parseFloat(amount), recipient });

            // Auto close after success
            setTimeout(() => {
                onClose();
                // Reset state after closing animation
                setTimeout(() => {
                    setStep('form');
                    setAmount(defaultAmount.toString());
                    setRecipient("");
                }, 300);
            }, 1500);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={cn(
                "relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform",
                step === 'success' ? "border-emerald-500/50" : "border-slate-700"
            )}>
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-slate-100">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'form' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Importe ({currency})</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            {type === 'transfer' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Beneficiario / Concepto</label>
                                    <input
                                        type="text"
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                                        placeholder="Ej: Inversión Fondo X"
                                        required
                                    />
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Confirmar Operación
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-3">
                                    La transacción será procesada instantáneamente.
                                </p>
                            </div>
                        </form>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
                                <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
                            </div>
                            <p className="text-slate-300 font-medium animate-pulse">Procesando transacción...</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-fade-in">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-white mb-1">¡Operación Exitosa!</h4>
                                <p className="text-slate-400">Se ha completado la orden correctamente.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
