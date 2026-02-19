// Pagina lista clienti — tabella con ricerca ed export
"use client";

import { useState, useMemo } from "react";
import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { clientiDemo } from "@/lib/dati-mock";

export default function PaginaClienti() {
    const [ricerca, setRicerca] = useState("");

    const clientiFiltrati = useMemo(() => {
        if (!ricerca) return clientiDemo;
        const termine = ricerca.toLowerCase();
        return clientiDemo.filter(
            (c) =>
                c.nome.toLowerCase().includes(termine) ||
                c.cognome.toLowerCase().includes(termine) ||
                c.email?.toLowerCase().includes(termine) ||
                c.telefono?.includes(termine) ||
                c.codiceFiscale?.toLowerCase().includes(termine) ||
                c.citta?.toLowerCase().includes(termine)
        );
    }, [ricerca]);

    // Colonne per export
    const colonneExport = [
        { chiave: "nome", label: "Nome" },
        { chiave: "cognome", label: "Cognome" },
        { chiave: "codiceFiscale", label: "Codice Fiscale" },
        { chiave: "email", label: "Email" },
        { chiave: "telefono", label: "Telefono" },
        { chiave: "indirizzo", label: "Indirizzo" },
        { chiave: "citta", label: "Città" },
        { chiave: "provincia", label: "Provincia" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: "var(--pf-accent-primary-subtle)" }}
                    >
                        <Users size={20} style={{ color: "var(--pf-accent-primary)" }} />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold"
                            style={{ color: "var(--pf-text-primary)" }}
                        >
                            Clienti
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: "var(--pf-text-muted)" }}
                        >
                            {clientiFiltrati.length} clienti
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ExportToolbar
                        dati={clientiFiltrati as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="clienti"
                    />
                    <Button size="sm" className="gap-1.5">
                        <Plus size={16} />
                        Nuovo Cliente
                    </Button>
                </div>
            </div>

            {/* Barra ricerca */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--pf-text-muted)" }}
                />
                <input
                    type="text"
                    placeholder="Cerca per nome, cognome, CF, email, città..."
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
                                {["Nome", "Email", "Telefono", "CF", "Città"].map((col) => (
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
                            {clientiFiltrati.map((cliente) => (
                                <tr
                                    key={cliente.id}
                                    className="border-b last:border-b-0 transition-colors hover:bg-[var(--pf-bg-hover)] cursor-pointer"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{
                                                    backgroundColor: "var(--pf-accent-primary-subtle)",
                                                    color: "var(--pf-accent-primary)",
                                                }}
                                            >
                                                {cliente.nome[0]}{cliente.cognome[0]}
                                            </div>
                                            <span
                                                className="font-medium"
                                                style={{ color: "var(--pf-text-primary)" }}
                                            >
                                                {cliente.nome} {cliente.cognome}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {cliente.email ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3 font-mono text-xs"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {cliente.telefono ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3 font-mono text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {cliente.codiceFiscale ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {cliente.citta ?? "—"}
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
