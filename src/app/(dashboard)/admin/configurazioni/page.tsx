// Pagina admin configurazioni — editor stati, tipi prodotto, ruoli
"use client";

import { useState } from "react";
import { ArrowLeft, Sliders } from "lucide-react";
import Link from "next/link";
import { PillTabs } from "@/components/ui/pill-tabs";
import { BadgeStato } from "@/components/ui/badge-stato";
import {
    statiCantiereDemo,
    tipiProdottoDemo,
    ruoliDemo,
} from "@/lib/dati-mock";

type TabId = "stati" | "tipi" | "ruoli";

const tabs = [
    { id: "stati" as const, label: "Stati Cantiere", conteggio: statiCantiereDemo.length },
    { id: "tipi" as const, label: "Tipi Prodotto", conteggio: tipiProdottoDemo.length },
    { id: "ruoli" as const, label: "Ruoli", conteggio: ruoliDemo.length },
];

export default function PaginaConfigurazioni() {
    const [tabAttivo, setTabAttivo] = useState<TabId>("stati");

    return (
        <div className="space-y-6">
            {/* Header */}
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
                    style={{ backgroundColor: "rgba(27, 140, 58, 0.12)" }}
                >
                    <Sliders size={20} style={{ color: "#1B8C3A" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        Configurazioni
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Gestisci stati, tipi e ruoli del sistema
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <PillTabs
                tabs={tabs}
                tabAttivo={tabAttivo}
                onTabChange={(id) => setTabAttivo(id as TabId)}
            />

            {/* Contenuto tab */}
            <div
                className="rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
            >
                {tabAttivo === "stati" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="border-b"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                {["Ordine", "Codice", "Label", "Colore", "Icona"].map((col) => (
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
                            {statiCantiereDemo.map((stato) => (
                                <tr
                                    key={stato.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs"
                                            style={{ color: "var(--pf-text-muted)" }}
                                        >
                                            {stato.ordine}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "var(--pf-bg-hover)",
                                                color: "var(--pf-text-secondary)",
                                            }}
                                        >
                                            {stato.codice}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato
                                            label={stato.label}
                                            colore={stato.colore}
                                            dimensione="sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ backgroundColor: stato.colore }}
                                            />
                                            <span
                                                className="font-mono text-xs"
                                                style={{ color: "var(--pf-text-muted)" }}
                                            >
                                                {stato.colore}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {stato.icona}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {tabAttivo === "tipi" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="border-b"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                {["Codice", "Label", "Categoria"].map((col) => (
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
                            {tipiProdottoDemo.map((tipo) => (
                                <tr
                                    key={tipo.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "var(--pf-bg-hover)",
                                                color: "var(--pf-text-secondary)",
                                            }}
                                        >
                                            {tipo.codice}
                                        </span>
                                    </td>
                                    <td
                                        className="px-4 py-3 font-medium"
                                        style={{ color: "var(--pf-text-primary)" }}
                                    >
                                        {tipo.label}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs capitalize"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {tipo.categoria}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {tabAttivo === "ruoli" && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className="border-b"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                {["Ordine", "Codice", "Label", "Colore", "Descrizione"].map(
                                    (col) => (
                                        <th
                                            key={col}
                                            className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider"
                                            style={{ color: "var(--pf-text-muted)" }}
                                        >
                                            {col}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {ruoliDemo.map((ruolo) => (
                                <tr
                                    key={ruolo.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs"
                                            style={{ color: "var(--pf-text-muted)" }}
                                        >
                                            {ruolo.ordine}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "var(--pf-bg-hover)",
                                                color: "var(--pf-text-secondary)",
                                            }}
                                        >
                                            {ruolo.codice}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato
                                            label={ruolo.label}
                                            colore={ruolo.colore ?? "#666"}
                                            dimensione="sm"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{
                                                    backgroundColor: ruolo.colore ?? "#666",
                                                }}
                                            />
                                            <span
                                                className="font-mono text-xs"
                                                style={{ color: "var(--pf-text-muted)" }}
                                            >
                                                {ruolo.colore}
                                            </span>
                                        </div>
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {ruolo.descrizione}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
