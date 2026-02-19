// Pagina lista fornitori — tabella con ricerca ed export
"use client";

import { useState, useMemo } from "react";
import { Truck, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { fornitoriDemo } from "@/lib/dati-mock";

export default function PaginaFornitori() {
    const [ricerca, setRicerca] = useState("");

    const fornitoriFiltrati = useMemo(() => {
        if (!ricerca) return fornitoriDemo;
        const termine = ricerca.toLowerCase();
        return fornitoriDemo.filter(
            (f) =>
                f.nome.toLowerCase().includes(termine) ||
                f.partitaIva?.includes(termine) ||
                f.referente?.toLowerCase().includes(termine) ||
                f.email?.toLowerCase().includes(termine)
        );
    }, [ricerca]);

    const colonneExport = [
        { chiave: "nome", label: "Nome" },
        { chiave: "partitaIva", label: "Partita IVA" },
        { chiave: "referente", label: "Referente" },
        { chiave: "email", label: "Email" },
        { chiave: "telefono", label: "Telefono" },
        { chiave: "indirizzo", label: "Indirizzo" },
        { chiave: "note", label: "Note" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl"
                        style={{ backgroundColor: "rgba(249, 115, 22, 0.12)" }}
                    >
                        <Truck size={20} style={{ color: "#f97316" }} />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold"
                            style={{ color: "var(--pf-text-primary)" }}
                        >
                            Fornitori
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: "var(--pf-text-muted)" }}
                        >
                            {fornitoriFiltrati.length} fornitori
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ExportToolbar
                        dati={fornitoriFiltrati as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="fornitori"
                    />
                    <Button size="sm" className="gap-1.5">
                        <Plus size={16} />
                        Nuovo Fornitore
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
                    placeholder="Cerca per nome, P.IVA, referente, email..."
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
                                {["Nome", "P.IVA", "Referente", "Email", "Telefono"].map((col) => (
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
                            {fornitoriFiltrati.map((fornitore) => (
                                <tr
                                    key={fornitore.id}
                                    className="border-b last:border-b-0 transition-colors hover:bg-[var(--pf-bg-hover)] cursor-pointer"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{
                                                    backgroundColor: "rgba(249, 115, 22, 0.12)",
                                                    color: "#f97316",
                                                }}
                                            >
                                                {fornitore.nome.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <span
                                                    className="font-medium"
                                                    style={{ color: "var(--pf-text-primary)" }}
                                                >
                                                    {fornitore.nome}
                                                </span>
                                                {fornitore.note && (
                                                    <p
                                                        className="text-xs truncate max-w-[200px]"
                                                        style={{ color: "var(--pf-text-muted)" }}
                                                    >
                                                        {fornitore.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-3 font-mono text-xs"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {fornitore.partitaIva ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {fornitore.referente ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {fornitore.email ?? "—"}
                                    </td>
                                    <td
                                        className="px-4 py-3 font-mono text-xs"
                                        style={{ color: "var(--pf-text-secondary)" }}
                                    >
                                        {fornitore.telefono ?? "—"}
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
