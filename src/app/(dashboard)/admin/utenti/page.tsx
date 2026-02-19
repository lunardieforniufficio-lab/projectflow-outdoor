// Pagina admin utenti — tabella organigramma con badge ruolo
"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, Users, Search } from "lucide-react";
import Link from "next/link";
import { BadgeStato } from "@/components/ui/badge-stato";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { utentiDemo } from "@/lib/dati-mock";

export default function PaginaUtenti() {
    const [ricerca, setRicerca] = useState("");

    const utentiFiltrati = useMemo(() => {
        if (!ricerca) return utentiDemo;
        const termine = ricerca.toLowerCase();
        return utentiDemo.filter(
            (u) =>
                u.nome.toLowerCase().includes(termine) ||
                u.cognome.toLowerCase().includes(termine) ||
                u.emailAziendale?.toLowerCase().includes(termine) ||
                u.ruolo.label.toLowerCase().includes(termine) ||
                u.area?.label.toLowerCase().includes(termine)
        );
    }, [ricerca]);

    const colonneExport = [
        { chiave: "nome", label: "Nome" },
        { chiave: "cognome", label: "Cognome" },
        { chiave: "emailAziendale", label: "Email" },
        { chiave: "ruolo.label", label: "Ruolo" },
        { chiave: "area.label", label: "Area" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin"
                        className="p-2 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
                    >
                        <Users size={20} style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold"
                            style={{ color: "var(--pf-text-primary)" }}
                        >
                            Utenti
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: "var(--pf-text-muted)" }}
                        >
                            {utentiFiltrati.length} utenti nel sistema
                        </p>
                    </div>
                </div>
                <ExportToolbar
                    dati={utentiFiltrati as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="utenti"
                />
            </div>

            {/* Ricerca */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--pf-text-muted)" }}
                />
                <input
                    type="text"
                    placeholder="Cerca per nome, email, ruolo, area..."
                    value={ricerca}
                    onChange={(e) => setRicerca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none transition-colors"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                        color: "var(--pf-text-primary)",
                    }}
                />
            </div>

            {/* Tabella */}
            <div
                className="rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="border-b"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                {["Nome", "Email", "Ruolo", "Area", "Stato"].map((col) => (
                                    <th
                                        key={col}
                                        className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {utentiFiltrati.map((utente) => (
                                <tr
                                    key={utente.id}
                                    className="border-b last:border-b-0 transition-colors hover:bg-[var(--pf-bg-hover)]"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                style={{
                                                    backgroundColor:
                                                        utente.ruolo.colore ?? "#666",
                                                }}
                                            >
                                                {utente.nome[0]}{utente.cognome[0]}
                                            </div>
                                            <span
                                                className="font-medium"
                                                style={{ color: "var(--pf-text-primary)" }}
                                            >
                                                {utente.nome} {utente.cognome}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {utente.emailAziendale ?? (
                                            <span style={{ color: "var(--pf-text-muted)" }}>
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato
                                            label={utente.ruolo.label}
                                            colore={utente.ruolo.colore ?? "#666"}
                                            dimensione="sm"
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {utente.area?.label ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: utente.attivo
                                                    ? "rgba(27, 140, 58, 0.12)"
                                                    : "rgba(239, 68, 68, 0.12)",
                                                color: utente.attivo
                                                    ? "#1B8C3A"
                                                    : "#ef4444",
                                            }}
                                        >
                                            {utente.attivo ? "Attivo" : "Inattivo"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
