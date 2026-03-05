// Dialogo di conferma azione — sostituisce il confirm() nativo
"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";

interface DialogConfermaProps {
    aperto: boolean;
    onChiudi: () => void;
    onConferma: () => void;
    titolo: string;
    messaggio: string;
    labelConferma?: string;
    labelAnnulla?: string;
    tipo?: "pericolo" | "avviso" | "info";
    isCaricamento?: boolean;
}

export function DialogConferma({
    aperto,
    onChiudi,
    onConferma,
    titolo,
    messaggio,
    labelConferma = "Conferma",
    labelAnnulla = "Annulla",
    tipo = "pericolo",
    isCaricamento = false,
}: DialogConfermaProps) {
    if (!aperto) return null;

    const colori = {
        pericolo: { bg: "rgba(239,68,68,0.1)", testo: "#ef4444", icona: <Trash2 size={20} /> },
        avviso:   { bg: "rgba(245,158,11,0.1)", testo: "#f59e0b", icona: <AlertTriangle size={20} /> },
        info:     { bg: "rgba(59,130,246,0.1)", testo: "#3b82f6", icona: <AlertTriangle size={20} /> },
    };
    const c = colori[tipo];

    return (
        // Overlay
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onChiudi}
        >
            {/* Box */}
            <div
                className="w-full max-w-sm rounded-2xl shadow-2xl border p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: c.bg, color: c.testo }}
                        >
                            {c.icona}
                        </div>
                        <h3 className="font-semibold text-base" style={{ color: "var(--pf-text-primary)" }}>
                            {titolo}
                        </h3>
                    </div>
                    <button
                        onClick={onChiudi}
                        className="p-1 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors flex-shrink-0"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Messaggio */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--pf-text-secondary)" }}>
                    {messaggio}
                </p>

                {/* Azioni */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onChiudi}
                        disabled={isCaricamento}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--pf-bg-hover)] disabled:opacity-50"
                        style={{ borderColor: "var(--pf-border)", color: "var(--pf-text-secondary)" }}
                    >
                        {labelAnnulla}
                    </button>
                    <button
                        onClick={onConferma}
                        disabled={isCaricamento}
                        className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ backgroundColor: c.testo }}
                    >
                        {isCaricamento ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : null}
                        {labelConferma}
                    </button>
                </div>
            </div>
        </div>
    );
}
