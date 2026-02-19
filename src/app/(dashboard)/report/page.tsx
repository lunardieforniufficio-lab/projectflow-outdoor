// Pagina report — placeholder sviluppo
"use client";

import { BarChart3, Construction } from "lucide-react";

export default function PaginaReport() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: "rgba(167, 139, 250, 0.12)" }}
                >
                    <BarChart3 size={20} style={{ color: "#a78bfa" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        Report
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Report e analisi cantieri
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
                <Construction
                    size={48}
                    className="mb-4"
                    style={{ color: "var(--pf-text-muted)" }}
                />
                <h2
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--pf-text-primary)" }}
                >
                    In costruzione
                </h2>
                <p
                    className="text-sm max-w-md"
                    style={{ color: "var(--pf-text-muted)" }}
                >
                    I report saranno disponibili dopo il collegamento al
                    database. Includeranno analisi cantieri, margini, tempi e
                    performance squadre.
                </p>
            </div>
        </div>
    );
}
