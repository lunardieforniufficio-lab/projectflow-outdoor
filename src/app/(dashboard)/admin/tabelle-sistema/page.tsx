// Pagina admin tabelle sistema — editor tabelle di configurazione database
"use client";

import { useState } from "react";
import { ArrowLeft, Database, Plus, Pencil, Eye } from "lucide-react";
import Link from "next/link";
import { PillTabs } from "@/components/ui/pill-tabs";
import { BadgeStato } from "@/components/ui/badge-stato";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { useConfigurazione } from "@/hooks/use-configurazione";

type TabId = "aree" | "configurazioni" | "transizioni";

const tabs: { id: TabId; label: string }[] = [
    { id: "aree", label: "Aree Aziendali" },
    { id: "configurazioni", label: "Configurazioni Generali" },
    { id: "transizioni", label: "Transizioni FSM" },
];

export default function PaginaTabelleSistema() {
    const [tabAttivo, setTabAttivo] = useState<TabId>("aree");

    const { data: aree, isLoading: isLoadingAree } = useConfigurazione("aree_aziendali");
    const { data: configurazioni, isLoading: isLoadingConfig } = useConfigurazione("configurazioni");
    const { data: transizioni, isLoading: isLoadingTransizioni } = useConfigurazione("transizioni");

    const tabsConConteggio = tabs.map((t) => ({
        ...t,
        conteggio:
            t.id === "aree"
                ? aree?.length ?? 0
                : t.id === "configurazioni"
                ? configurazioni?.length ?? 0
                : transizioni?.length ?? 0,
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
            {tabAttivo === "aree" && (
                <TabellAree dati={aree ?? []} isLoading={isLoadingAree} />
            )}
            {tabAttivo === "configurazioni" && (
                <TabellaConfigurazioni dati={configurazioni ?? []} isLoading={isLoadingConfig} />
            )}
            {tabAttivo === "transizioni" && (
                <TabellaTransizioni dati={transizioni ?? []} isLoading={isLoadingTransizioni} />
            )}
        </div>
    );
}

// === AREE AZIENDALI ===

interface AreaAziendale {
    id: string;
    codice: string;
    label: string;
    descrizione: string | null;
    attivo: boolean;
    ordine: number;
}

interface TabellAreeProps {
    dati: AreaAziendale[];
    isLoading: boolean;
}

function TabellAree({ dati, isLoading }: TabellAreeProps) {
    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "label", label: "Label" },
        { chiave: "descrizione", label: "Descrizione" },
        { chiave: "ordine", label: "Ordine" },
        { chiave: "attivo", label: "Attivo" },
    ];

    if (isLoading) {
        return <SkeletonLoader tipo="tabella" righe={5} />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {dati.length} aree configurate
                </p>
                <div className="flex items-center gap-2">
                    <ExportToolbar
                        dati={dati as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="aree-aziendali"
                    />
                    <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: "rgba(27, 140, 58, 0.12)",
                            color: "var(--pf-accent-primary)",
                        }}
                        title="Aggiungere aree richiede accesso diretto al database"
                        disabled
                    >
                        <Plus size={16} />
                        Aggiungi
                    </button>
                </div>
            </div>

            {dati.length === 0 ? (
                <EmptyState
                    icona={<Database size={32} />}
                    titolo="Nessuna area aziendale"
                    descrizione="Le aree aziendali vengono caricate dal database. Verifica la connessione n8n."
                />
            ) : (
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                    }}
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                {["Ord.", "Codice", "Label", "Descrizione", "Stato"].map((col) => (
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
                            {dati.map((area) => (
                                <tr
                                    key={area.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td
                                        className="px-4 py-3 font-mono text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {area.ordine}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "var(--pf-bg-hover)",
                                                color: "var(--pf-text-secondary)",
                                            }}
                                        >
                                            {area.codice}
                                        </span>
                                    </td>
                                    <td
                                        className="px-4 py-3 font-medium"
                                        style={{ color: "var(--pf-text-primary)" }}
                                    >
                                        {area.label}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {area.descrizione ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato
                                            label={area.attivo ? "Attivo" : "Inattivo"}
                                            colore={area.attivo ? "#1B8C3A" : "#6b7280"}
                                            dimensione="sm"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// === CONFIGURAZIONI GENERALI ===

interface ConfigurazioneGenerale {
    id: string;
    chiave: string;
    valore: string;
    tipo: "testo" | "numero" | "booleano" | "json";
    descrizione: string | null;
    modificabile: boolean;
    aggiornatoIl: string;
}

interface TabellaConfigurazioniProps {
    dati: ConfigurazioneGenerale[];
    isLoading: boolean;
}

function TabellaConfigurazioni({ dati, isLoading }: TabellaConfigurazioniProps) {
    const colonneExport = [
        { chiave: "chiave", label: "Chiave" },
        { chiave: "valore", label: "Valore" },
        { chiave: "tipo", label: "Tipo" },
        { chiave: "descrizione", label: "Descrizione" },
        { chiave: "modificabile", label: "Modificabile" },
    ];

    const coloreTipo: Record<string, string> = {
        testo: "#3b82f6",
        numero: "#f59e0b",
        booleano: "#8b5cf6",
        json: "#06b6d4",
    };

    if (isLoading) {
        return <SkeletonLoader tipo="tabella" righe={6} />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {dati.length} configurazioni
                </p>
                <ExportToolbar
                    dati={dati as unknown as Record<string, unknown>[]}
                    colonne={colonneExport}
                    nomeFile="configurazioni-sistema"
                />
            </div>

            {dati.length === 0 ? (
                <EmptyState
                    icona={<Database size={32} />}
                    titolo="Nessuna configurazione"
                    descrizione="Le configurazioni vengono caricate dal database. Verifica la connessione n8n."
                />
            ) : (
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                    }}
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                {["Chiave", "Valore", "Tipo", "Descrizione", "Azioni"].map((col) => (
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
                            {dati.map((config) => (
                                <tr
                                    key={config.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs"
                                            style={{ color: "var(--pf-text-secondary)" }}
                                        >
                                            {config.chiave}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "var(--pf-bg-hover)",
                                                color: "var(--pf-text-primary)",
                                            }}
                                        >
                                            {config.tipo === "booleano"
                                                ? config.valore === "true" ? "✓ vero" : "✗ falso"
                                                : config.valore}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato
                                            label={config.tipo}
                                            colore={coloreTipo[config.tipo] ?? "#666"}
                                            dimensione="sm"
                                        />
                                    </td>
                                    <td
                                        className="px-4 py-3 text-xs"
                                        style={{ color: "var(--pf-text-muted)" }}
                                    >
                                        {config.descrizione ?? "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                                                style={{ color: "var(--pf-text-muted)" }}
                                                title={
                                                    config.modificabile
                                                        ? "Modifica valore"
                                                        : "Valore di sistema — non modificabile"
                                                }
                                                disabled={!config.modificabile}
                                            >
                                                {config.modificabile ? (
                                                    <Pencil size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// === TRANSIZIONI FSM ===

interface Transizione {
    id: string;
    statoDa: { codice: string; label: string };
    statoA: { codice: string; label: string };
    vincoli: { id: string; descrizione: string }[];
}

interface TabellaTransizioniProps {
    dati: Transizione[];
    isLoading: boolean;
}

function TabellaTransizioni({ dati, isLoading }: TabellaTransizioniProps) {
    if (isLoading) {
        return <SkeletonLoader tipo="tabella" righe={8} />;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                    {dati.length} transizioni configurate
                </p>
                <div className="text-xs px-3 py-1.5 rounded-lg border" style={{
                    borderColor: "var(--pf-border)",
                    color: "var(--pf-text-muted)",
                    backgroundColor: "var(--pf-bg-surface)",
                }}>
                    Solo lettura — modificare dal DB
                </div>
            </div>

            {dati.length === 0 ? (
                <EmptyState
                    icona={<Database size={32} />}
                    titolo="Nessuna transizione configurata"
                    descrizione="Le transizioni FSM vengono caricate dal database. Verifica la connessione n8n."
                />
            ) : (
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                    }}
                >
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                {["Da Stato", "A Stato", "Vincoli"].map((col) => (
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
                            {dati.map((transizione) => (
                                <tr
                                    key={transizione.id}
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
                                            {transizione.statoDa.codice}
                                        </span>
                                        <span
                                            className="mx-2 text-xs"
                                            style={{ color: "var(--pf-text-muted)" }}
                                        >
                                            {transizione.statoDa.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{
                                                backgroundColor: "rgba(27, 140, 58, 0.08)",
                                                color: "var(--pf-accent-primary)",
                                            }}
                                        >
                                            {transizione.statoA.codice}
                                        </span>
                                        <span
                                            className="mx-2 text-xs"
                                            style={{ color: "var(--pf-text-muted)" }}
                                        >
                                            {transizione.statoA.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {transizione.vincoli.length === 0 ? (
                                            <span
                                                className="text-xs"
                                                style={{ color: "var(--pf-text-muted)" }}
                                            >
                                                Nessun vincolo
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {transizione.vincoli.map((v) => (
                                                    <span
                                                        key={v.id}
                                                        className="text-xs px-2 py-0.5 rounded-full"
                                                        style={{
                                                            backgroundColor: "rgba(245, 158, 11, 0.12)",
                                                            color: "#f59e0b",
                                                        }}
                                                    >
                                                        {v.descrizione}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
