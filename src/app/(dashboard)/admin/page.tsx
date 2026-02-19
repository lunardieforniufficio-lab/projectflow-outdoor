// Pagina admin — homepage con card navigazione
"use client";

import Link from "next/link";
import { Settings, Users, Sliders, Database } from "lucide-react";

const sezioniAdmin = [
    {
        id: "configurazioni",
        titolo: "Configurazioni",
        descrizione: "Stati cantiere, tipi prodotto, ruoli e transizioni FSM",
        icona: Sliders,
        href: "/admin/configurazioni",
        colore: "#1B8C3A",
    },
    {
        id: "utenti",
        titolo: "Utenti",
        descrizione: "Gestione utenti, assegnazione ruoli e permessi",
        icona: Users,
        href: "/admin/utenti",
        colore: "#3b82f6",
    },
    {
        id: "tabelle",
        titolo: "Tabelle Sistema",
        descrizione: "Editor tabelle di configurazione database",
        icona: Database,
        href: "/admin/tabelle-sistema",
        colore: "#8b5cf6",
    },
];

export default function PaginaAdmin() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: "rgba(239, 68, 68, 0.12)" }}
                >
                    <Settings size={20} style={{ color: "#ef4444" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        Amministrazione
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Gestione configurazioni e utenti del sistema
                    </p>
                </div>
            </div>

            {/* Card navigazione */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sezioniAdmin.map((sezione) => {
                    const Icona = sezione.icona;
                    return (
                        <Link
                            key={sezione.id}
                            href={sezione.href}
                            className="group rounded-xl border p-6 transition-all duration-200 hover:border-[var(--pf-text-muted)] hover:shadow-lg"
                            style={{
                                backgroundColor: "var(--pf-bg-surface)",
                                borderColor: "var(--pf-border)",
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                style={{
                                    backgroundColor: `${sezione.colore}18`,
                                }}
                            >
                                <Icona size={24} style={{ color: sezione.colore }} />
                            </div>
                            <h3
                                className="font-semibold text-base mb-1"
                                style={{ color: "var(--pf-text-primary)" }}
                            >
                                {sezione.titolo}
                            </h3>
                            <p
                                className="text-sm"
                                style={{ color: "var(--pf-text-muted)" }}
                            >
                                {sezione.descrizione}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
