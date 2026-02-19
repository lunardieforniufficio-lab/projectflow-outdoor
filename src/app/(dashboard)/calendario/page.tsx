// Pagina calendario — placeholder sviluppo
"use client";

import { Calendar, Construction } from "lucide-react";

export default function PaginaCalendario() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
                >
                    <Calendar size={20} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        Calendario
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Programmazione cantieri e squadre
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
                    Il calendario verrà integrato con Google Calendar dopo la
                    migrazione da GroupCal. Mostrerà le date posa pianificate e
                    gli impegni delle squadre.
                </p>
            </div>
        </div>
    );
}
