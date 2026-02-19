// Pagina AI Chat — placeholder sviluppo
"use client";

import { MessageSquare, Construction, Sparkles } from "lucide-react";

export default function PaginaAI() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: "rgba(27, 140, 58, 0.12)" }}
                >
                    <MessageSquare size={20} style={{ color: "#1B8C3A" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        AI Chat
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Assistente intelligente per dati e analisi
                    </p>
                </div>
            </div>

            {/* Coming soon */}
            <div
                className="rounded-xl border p-12 flex flex-col items-center justify-center text-center"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
            >
                <div className="relative mb-4">
                    <Construction
                        size={48}
                        style={{ color: "var(--pf-text-muted)" }}
                    />
                    <Sparkles
                        size={20}
                        className="absolute -top-1 -right-2"
                        style={{ color: "#1B8C3A" }}
                    />
                </div>
                <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--pf-text-primary)" }}
                >
                    In costruzione
                </h2>
                <p
                    className="text-sm max-w-md mb-4"
                    style={{ color: "var(--pf-text-muted)" }}
                >
                    L&apos;assistente AI permetterà di interrogare il database in
                    linguaggio naturale, generare report, creare dashboard e
                    tabelle personalizzate.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        "Quanti cantieri in posa?",
                        "Report margini mensile",
                        "Crea tabella omaggi",
                        "Dashboard vendite",
                    ].map((esempio) => (
                        <span
                            key={esempio}
                            className="text-xs px-3 py-1.5 rounded-full border"
                            style={{
                                borderColor: "var(--pf-border)",
                                color: "var(--pf-text-muted)",
                            }}
                        >
                            &quot;{esempio}&quot;
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
