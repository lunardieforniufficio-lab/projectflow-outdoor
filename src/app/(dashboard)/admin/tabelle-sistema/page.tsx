// Pagina admin tabelle sistema — editor tabelle di configurazione database
"use client";

import { useState } from "react";
import { ArrowLeft, Database } from "lucide-react";
import Link from "next/link";
import { PillTabs } from "@/components/ui/pill-tabs";
import { BadgeStato } from "@/components/ui/badge-stato";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import {
    statiCantiereDemo,
    ruoliDemo,
    areeDemo,
    tipiProdottoDemo,
} from "@/lib/dati-mock";

type TabId = "stati" | "ruoli" | "aree" | "tipi_prodotto";

const tabs: { id: TabId; label: string }[] = [
    { id: "stati", label: "Stati Cantiere" },
    { id: "ruoli", label: "Ruoli" },
    { id: "aree", label: "Aree Aziendali" },
    { id: "tipi_prodotto", label: "Tipi Prodotto" },
];

export default function PaginaTabelleSistema() {
    const [tabAttivo, setTabAttivo] = useState<TabId>("stati");

    const tabsConConteggio = tabs.map((t) => ({
        ...t,
        conteggio:
            t.id === "stati"
                ? statiCantiereDemo.length
                : t.id === "ruoli"
                ? ruoliDemo.length
                : t.id === "aree"
                ? areeDemo.length
                : tipiProdottoDemo.length,
    }));

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
                        style={{ backgroundColor: "rgba(139, 92, 246, 0.12)" }}
                    >
                        <Database size={20} style={{ color: "#8b5cf6" }} />
                    </div>
                    <div>
                        <h1
                            className="text-xl font-bold"
                            style={{ color: "var(--pf-text-primary)" }}
                        >
                            Tabelle Sistema
                        </h1>
                        <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                            Editor tabelle di configurazione database
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <PillTabs
                tabs={tabsConConteggio}
                tabAttivo={tabAttivo}
                onTabChange={(id) => setTabAttivo(id as TabId)}
            />

            {/* Contenuto */}
            {tabAttivo === "stati" && <TabellaStati />}
            {tabAttivo === "ruoli" && <TabellaRuoli />}
            {tabAttivo === "aree" && <TabellaAree />}
            {tabAttivo === "tipi_prodotto" && <TabellaTipiProdotto />}
        </div>
    );
}

// === STATI CANTIERE ===
function TabellaStati() {
    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "label", label: "Label" },
        { chiave: "colore", label: "Colore" },
        { chiave: "ordine", label: "Ordine" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {statiCantiereDemo.length} stati configurati (FSM)
                </p>
                <ExportToolbar
                    dati={statiCantiereDemo as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="stati-cantiere"
                />
            </div>
            <TabellaGenerica
                colonne={["Ord.", "Codice", "Label", "Colore", "Anteprima"]}
                righe={statiCantiereDemo.map((s) => ({
                    id: s.id,
                    celle: [
                        <span key="ord" className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>{s.ordine}</span>,
                        <CodiceCell key="cod" valore={s.codice} />,
                        <span key="label" className="font-medium" style={{ color: "var(--pf-text-primary)" }}>{s.label}</span>,
                        <span key="col" className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>{s.colore}</span>,
                        <BadgeStato key="badge" label={s.label} colore={s.colore} dimensione="sm" />,
                    ],
                }))}
            />
        </div>
    );
}

// === RUOLI ===
function TabellaRuoli() {
    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "label", label: "Label" },
        { chiave: "descrizione", label: "Descrizione" },
        { chiave: "colore", label: "Colore" },
        { chiave: "ordine", label: "Ordine" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {ruoliDemo.length} ruoli configurati
                </p>
                <ExportToolbar
                    dati={ruoliDemo as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="ruoli"
                />
            </div>
            <TabellaGenerica
                colonne={["Ord.", "Codice", "Label", "Descrizione", "Badge"]}
                righe={ruoliDemo.map((r) => ({
                    id: r.id,
                    celle: [
                        <span key="ord" className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>{r.ordine}</span>,
                        <CodiceCell key="cod" valore={r.codice} />,
                        <span key="label" className="font-medium" style={{ color: "var(--pf-text-primary)" }}>{r.label}</span>,
                        <span key="desc" className="text-xs" style={{ color: "var(--pf-text-muted)" }}>{r.descrizione}</span>,
                        <BadgeStato key="badge" label={r.label} colore={r.colore ?? "#666"} dimensione="sm" />,
                    ],
                }))}
            />
        </div>
    );
}

// === AREE AZIENDALI ===
function TabellaAree() {
    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "label", label: "Label" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {areeDemo.length} aree configurate
                </p>
                <ExportToolbar
                    dati={areeDemo as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="aree-aziendali"
                />
            </div>
            <TabellaGenerica
                colonne={["#", "Codice", "Label"]}
                righe={areeDemo.map((a, i) => ({
                    id: a.id,
                    celle: [
                        <span key="num" className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>{i + 1}</span>,
                        <CodiceCell key="cod" valore={a.codice} />,
                        <span key="label" className="font-medium" style={{ color: "var(--pf-text-primary)" }}>{a.label}</span>,
                    ],
                }))}
            />
        </div>
    );
}

// === TIPI PRODOTTO ===
function TabellaTipiProdotto() {
    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "label", label: "Label" },
        { chiave: "categoria", label: "Categoria" },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {tipiProdottoDemo.length} tipi prodotto
                </p>
                <ExportToolbar
                    dati={tipiProdottoDemo as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="tipi-prodotto"
                />
            </div>
            <TabellaGenerica
                colonne={["Codice", "Label", "Categoria"]}
                righe={tipiProdottoDemo.map((t) => ({
                    id: t.id,
                    celle: [
                        <CodiceCell key="cod" valore={t.codice} />,
                        <span key="label" className="font-medium" style={{ color: "var(--pf-text-primary)" }}>{t.label}</span>,
                        <BadgeStato key="cat" label={t.categoria} colore="#3b82f6" dimensione="sm" />,
                    ],
                }))}
            />
        </div>
    );
}

// === COMPONENTI HELPER ===

/** Cella con codice monospace */
function CodiceCell({ valore }: { valore: string }) {
    return (
        <span
            className="font-mono text-xs px-2 py-1 rounded"
            style={{
                backgroundColor: "var(--pf-bg-hover)",
                color: "var(--pf-text-secondary)",
            }}
        >
            {valore}
        </span>
    );
}

/** Tabella generica riutilizzabile */
interface RigaTabella {
    id: string;
    celle: React.ReactNode[];
}

interface TabellaGenericaProps {
    colonne: string[];
    righe: RigaTabella[];
}

function TabellaGenerica({ colonne, righe }: TabellaGenericaProps) {
    if (righe.length === 0) {
        return (
            <EmptyState
                icona={<Database size={32} />}
                titolo="Nessun dato"
                descrizione="I dati verranno caricati dal database."
            />
        );
    }

    return (
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
                        <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                            {colonne.map((col) => (
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
                        {righe.map((riga) => (
                            <tr
                                key={riga.id}
                                className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                {riga.celle.map((cella, i) => (
                                    <td key={i} className="px-4 py-3">
                                        {cella}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
