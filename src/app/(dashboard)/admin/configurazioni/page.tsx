// Pagina admin configurazioni — CRUD stati cantiere, tipi prodotto, ruoli (read-only)
"use client";

import { useState, useCallback } from "react";
import { ArrowLeft, Sliders, Plus, Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { PillTabs } from "@/components/ui/pill-tabs";
import { BadgeStato } from "@/components/ui/badge-stato";
import { DialogConferma } from "@/components/ui/dialog-conferma";
import {
    PannelloCrud,
    SezioneForm,
    SeparatoreSezione,
    Campo,
    InputPf,
    TextareaPf,
} from "@/components/ui/pannello-crud";
import {
    statiCantiereDemo,
    tipiProdottoDemo,
    ruoliDemo,
} from "@/lib/dati-mock";
import { useConfigurazione } from "@/hooks/use-configurazione";
import {
    useCreaStatoCantiere,
    useAggiornaStatoCantiere,
    useEliminaStatoCantiere,
    useCreaTipoProdotto,
    useAggiornaTipoProdotto,
    useEliminaTipoProdotto,
} from "@/hooks/use-config-crud";
import type { StatoCantiere, TipoProdotto } from "@/types";

type TabId = "stati" | "tipi" | "ruoli";

// =====================
// === TIPI FORM ===
// =====================

interface FormStato {
    codice: string;
    label: string;
    colore: string;
    icona: string;
    ordine: string;
    descrizione: string;
    isIniziale: boolean;
    isFinale: boolean;
    attivo: boolean;
}

const formStatoVuoto: FormStato = {
    codice: "",
    label: "",
    colore: "#3b82f6",
    icona: "",
    ordine: "",
    descrizione: "",
    isIniziale: false,
    isFinale: false,
    attivo: true,
};

function statoToForm(s: StatoCantiere): FormStato {
    return {
        codice: s.codice,
        label: s.label,
        colore: s.colore,
        icona: s.icona ?? "",
        ordine: String(s.ordine),
        descrizione: s.descrizione ?? "",
        isIniziale: s.isIniziale,
        isFinale: s.isFinale,
        attivo: s.attivo,
    };
}

interface FormTipo {
    codice: string;
    label: string;
    categoria: string;
    descrizione: string;
    ordine: string;
    attivo: boolean;
}

const formTipoVuoto: FormTipo = {
    codice: "",
    label: "",
    categoria: "",
    descrizione: "",
    ordine: "",
    attivo: true,
};

function tipoToForm(t: TipoProdotto): FormTipo {
    return {
        codice: t.codice,
        label: t.label,
        categoria: t.categoria ?? "",
        descrizione: t.descrizione ?? "",
        ordine: String(t.ordine),
        attivo: t.attivo,
    };
}

// Colori predefiniti per il picker stati
const coloriPreset = [
    "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#ec4899",
    "#f97316", "#1B8C3A", "#14b8a6", "#22c55e", "#ef4444",
];

// =====================
// === PAGINA ===
// =====================

export default function PaginaConfigurazioni() {
    const [tabAttivo, setTabAttivo] = useState<TabId>("stati");

    // --- Hook dati reali n8n ---
    const { dati: statiApi } = useConfigurazione("stati_cantiere");
    const { dati: tipiApi } = useConfigurazione("tipi_prodotto");
    const { dati: ruoliApi } = useConfigurazione("ruoli");

    // Dati: usa API se disponibili, altrimenti mock
    const statiCantiere: StatoCantiere[] = (statiApi.length > 0 ? statiApi : statiCantiereDemo) as StatoCantiere[];
    const tipiProdotto: TipoProdotto[] = (tipiApi.length > 0 ? tipiApi : tipiProdottoDemo) as TipoProdotto[];
    const ruoli = ruoliApi.length > 0 ? ruoliApi : ruoliDemo;

    // Hook mutations
    const creaStato = useCreaStatoCantiere();
    const aggiornaStato = useAggiornaStatoCantiere();
    const eliminaStato = useEliminaStatoCantiere();
    const creaTipo = useCreaTipoProdotto();
    const aggiornaTipo = useAggiornaTipoProdotto();
    const eliminaTipo = useEliminaTipoProdotto();

    // --- UI stati cantiere ---
    const [pannelloStatoAperto, setPannelloStatoAperto] = useState(false);
    const [statoInModifica, setStatoInModifica] = useState<StatoCantiere | null>(null);
    const [formStato, setFormStato] = useState<FormStato>(formStatoVuoto);
    const [erroriStato, setErroriStato] = useState<Partial<Record<keyof FormStato, string>>>({});
    const [statoPerElimina, setStatoPerElimina] = useState<StatoCantiere | null>(null);

    const isSalvataggioStato = creaStato.isPending || aggiornaStato.isPending;
    const isEliminazioneStato = eliminaStato.isPending;

    // --- UI tipi prodotto ---
    const [pannelloTipoAperto, setPannelloTipoAperto] = useState(false);
    const [tipoInModifica, setTipoInModifica] = useState<TipoProdotto | null>(null);
    const [formTipo, setFormTipo] = useState<FormTipo>(formTipoVuoto);
    const [erroriTipo, setErroriTipo] = useState<Partial<Record<keyof FormTipo, string>>>({});
    const [tipoPerElimina, setTipoPerElimina] = useState<TipoProdotto | null>(null);

    const isSalvataggioTipo = creaTipo.isPending || aggiornaTipo.isPending;
    const isEliminazioneTipo = eliminaTipo.isPending;

    const tabs = [
        { id: "stati" as const, label: "Stati Cantiere", conteggio: statiCantiere.length },
        { id: "tipi" as const, label: "Tipi Prodotto", conteggio: tipiProdotto.length },
        { id: "ruoli" as const, label: "Ruoli", conteggio: ruoli.length },
    ];

    // =====================
    // === CRUD STATI ===
    // =====================

    const apriNuovoStato = useCallback(() => {
        setStatoInModifica(null);
        setFormStato(formStatoVuoto);
        setErroriStato({});
        setPannelloStatoAperto(true);
    }, []);

    const apriModificaStato = useCallback((stato: StatoCantiere) => {
        setStatoInModifica(stato);
        setFormStato(statoToForm(stato));
        setErroriStato({});
        setPannelloStatoAperto(true);
    }, []);

    const validaStato = (): boolean => {
        const err: Partial<Record<keyof FormStato, string>> = {};
        if (!formStato.codice.trim()) err.codice = "Codice obbligatorio";
        else if (!/^[A-Z0-9_]+$/.test(formStato.codice)) err.codice = "Solo maiuscole, numeri e underscore";
        if (!formStato.label.trim()) err.label = "Label obbligatoria";
        if (!formStato.colore.trim()) err.colore = "Colore obbligatorio";
        if (formStato.ordine && isNaN(Number(formStato.ordine))) err.ordine = "Ordine deve essere un numero";
        setErroriStato(err);
        return Object.keys(err).length === 0;
    };

    const salvaStato = useCallback(async () => {
        if (!validaStato()) return;
        const payload = {
            codice: formStato.codice.trim().toUpperCase(),
            label: formStato.label.trim(),
            colore: formStato.colore,
            icona: formStato.icona || null,
            ordine: formStato.ordine ? Number(formStato.ordine) : undefined,
            descrizione: formStato.descrizione || null,
            isIniziale: formStato.isIniziale,
            isFinale: formStato.isFinale,
            attivo: formStato.attivo,
        };
        try {
            if (statoInModifica) {
                await aggiornaStato.mutateAsync({ id: statoInModifica.id, dati: payload });
            } else {
                await creaStato.mutateAsync(payload);
            }
            setPannelloStatoAperto(false);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [formStato, statoInModifica, creaStato, aggiornaStato]);

    const confermaEliminaStato = useCallback(async () => {
        if (!statoPerElimina) return;
        try {
            await eliminaStato.mutateAsync(statoPerElimina.id);
            setStatoPerElimina(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [statoPerElimina, eliminaStato]);

    // =====================
    // === CRUD TIPI ===
    // =====================

    const apriNuovoTipo = useCallback(() => {
        setTipoInModifica(null);
        setFormTipo(formTipoVuoto);
        setErroriTipo({});
        setPannelloTipoAperto(true);
    }, []);

    const apriModificaTipo = useCallback((tipo: TipoProdotto) => {
        setTipoInModifica(tipo);
        setFormTipo(tipoToForm(tipo));
        setErroriTipo({});
        setPannelloTipoAperto(true);
    }, []);

    const validaTipo = (): boolean => {
        const err: Partial<Record<keyof FormTipo, string>> = {};
        if (!formTipo.codice.trim()) err.codice = "Codice obbligatorio";
        else if (!/^[a-z0-9_]+$/.test(formTipo.codice)) err.codice = "Solo minuscole, numeri e underscore";
        if (!formTipo.label.trim()) err.label = "Label obbligatoria";
        if (formTipo.ordine && isNaN(Number(formTipo.ordine))) err.ordine = "Ordine deve essere un numero";
        setErroriTipo(err);
        return Object.keys(err).length === 0;
    };

    const salvaTipo = useCallback(async () => {
        if (!validaTipo()) return;
        const payload = {
            codice: formTipo.codice.trim(),
            label: formTipo.label.trim(),
            categoria: formTipo.categoria || null,
            descrizione: formTipo.descrizione || null,
            ordine: formTipo.ordine ? Number(formTipo.ordine) : undefined,
            attivo: formTipo.attivo,
        };
        try {
            if (tipoInModifica) {
                await aggiornaTipo.mutateAsync({ id: tipoInModifica.id, dati: payload });
            } else {
                await creaTipo.mutateAsync(payload);
            }
            setPannelloTipoAperto(false);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [formTipo, tipoInModifica, creaTipo, aggiornaTipo]);

    const confermaEliminaTipo = useCallback(async () => {
        if (!tipoPerElimina) return;
        try {
            await eliminaTipo.mutateAsync(tipoPerElimina.id);
            setTipoPerElimina(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [tipoPerElimina, eliminaTipo]);

    // =====================
    // === RENDER ===
    // =====================

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
                    <h1 className="text-xl font-bold" style={{ color: "var(--pf-text-primary)" }}>
                        Configurazioni
                    </h1>
                    <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
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

            {/* ===================== TAB: STATI CANTIERE ===================== */}
            {tabAttivo === "stati" && (
                <>
                    {/* Header azione */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                            {statiCantiere.filter((s) => s.attivo).length} attivi su {statiCantiere.length} totali
                        </p>
                        <button
                            onClick={apriNuovoStato}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ backgroundColor: "#1B8C3A" }}
                        >
                            <Plus size={15} />
                            Nuovo Stato
                        </button>
                    </div>

                    <div
                        className="rounded-xl border overflow-hidden"
                        style={{ backgroundColor: "var(--pf-bg-surface)", borderColor: "var(--pf-border)" }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                    {["#", "Codice", "Label", "Colore", "Flags", ""].map((col) => (
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
                                {statiCantiere.map((stato) => (
                                    <tr
                                        key={stato.id}
                                        className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors group"
                                        style={{ borderColor: "var(--pf-border)" }}
                                    >
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                                {stato.ordine}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="font-mono text-xs px-2 py-1 rounded"
                                                style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                                            >
                                                {stato.codice}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <BadgeStato label={stato.label} colore={stato.colore} dimensione="sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: stato.colore }} />
                                                <span className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                                    {stato.colore}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {stato.isIniziale && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
                                                        Iniziale
                                                    </span>
                                                )}
                                                {stato.isFinale && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#22c55e" }}>
                                                        Finale
                                                    </span>
                                                )}
                                                {!stato.attivo && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                                                        Inattivo
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => apriModificaStato(stato)}
                                                    className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                                                    style={{ color: "var(--pf-text-muted)" }}
                                                    title="Modifica"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setStatoPerElimina(stato)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    style={{ color: "var(--pf-text-muted)" }}
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ===================== TAB: TIPI PRODOTTO ===================== */}
            {tabAttivo === "tipi" && (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                            {tipiProdotto.filter((t) => t.attivo).length} attivi su {tipiProdotto.length} totali
                        </p>
                        <button
                            onClick={apriNuovoTipo}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ backgroundColor: "#1B8C3A" }}
                        >
                            <Plus size={15} />
                            Nuovo Tipo
                        </button>
                    </div>

                    <div
                        className="rounded-xl border overflow-hidden"
                        style={{ backgroundColor: "var(--pf-bg-surface)", borderColor: "var(--pf-border)" }}
                    >
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                    {["Codice", "Label", "Categoria", "Attivo", ""].map((col) => (
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
                                {tipiProdotto.map((tipo) => (
                                    <tr
                                        key={tipo.id}
                                        className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors group"
                                        style={{ borderColor: "var(--pf-border)" }}
                                    >
                                        <td className="px-4 py-3">
                                            <span
                                                className="font-mono text-xs px-2 py-1 rounded"
                                                style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                                            >
                                                {tipo.codice}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium" style={{ color: "var(--pf-text-primary)" }}>
                                            {tipo.label}
                                        </td>
                                        <td className="px-4 py-3 text-xs capitalize" style={{ color: "var(--pf-text-muted)" }}>
                                            {tipo.categoria ?? "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {tipo.attivo ? (
                                                <CheckCircle2 size={16} style={{ color: "#22c55e" }} />
                                            ) : (
                                                <XCircle size={16} style={{ color: "var(--pf-text-muted)" }} />
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => apriModificaTipo(tipo)}
                                                    className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                                                    style={{ color: "var(--pf-text-muted)" }}
                                                    title="Modifica"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setTipoPerElimina(tipo)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                                    style={{ color: "var(--pf-text-muted)" }}
                                                    title="Elimina"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ===================== TAB: RUOLI (read-only) ===================== */}
            {tabAttivo === "ruoli" && (
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{ backgroundColor: "var(--pf-bg-surface)", borderColor: "var(--pf-border)" }}
                >
                    <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "var(--pf-border)" }}>
                        <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
                            Solo lettura
                        </span>
                        <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>
                            I ruoli sono gestiti dal sistema di simulazione
                        </span>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b" style={{ borderColor: "var(--pf-border)" }}>
                                {["Ordine", "Codice", "Label", "Colore", "Descrizione"].map((col) => (
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
                            {ruoli.map((ruolo) => (
                                <tr
                                    key={ruolo.id}
                                    className="border-b last:border-b-0 hover:bg-[var(--pf-bg-hover)] transition-colors"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                            {ruolo.ordine}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="font-mono text-xs px-2 py-1 rounded"
                                            style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                                        >
                                            {ruolo.codice}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <BadgeStato label={ruolo.label} colore={ruolo.colore ?? "#666"} dimensione="sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ruolo.colore ?? "#666" }} />
                                            <span className="font-mono text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                                {ruolo.colore}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                        {ruolo.descrizione}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===================== DIALOGS CONFERMA ===================== */}
            <DialogConferma
                aperto={!!statoPerElimina}
                onChiudi={() => setStatoPerElimina(null)}
                onConferma={confermaEliminaStato}
                titolo="Elimina stato cantiere"
                messaggio={
                    statoPerElimina
                        ? `Vuoi eliminare lo stato "${statoPerElimina.label}"? Tutti i cantieri con questo stato potrebbero essere coinvolti.`
                        : ""
                }
                labelConferma="Elimina"
                tipo="pericolo"
                isCaricamento={isEliminazioneStato}
            />

            <DialogConferma
                aperto={!!tipoPerElimina}
                onChiudi={() => setTipoPerElimina(null)}
                onConferma={confermaEliminaTipo}
                titolo="Elimina tipo prodotto"
                messaggio={
                    tipoPerElimina
                        ? `Vuoi eliminare il tipo prodotto "${tipoPerElimina.label}"? Tutti i cantieri con questo tipo potrebbero essere coinvolti.`
                        : ""
                }
                labelConferma="Elimina"
                tipo="pericolo"
                isCaricamento={isEliminazioneTipo}
            />

            {/* ===================== PANNELLO STATO CANTIERE ===================== */}
            <PannelloCrud
                aperto={pannelloStatoAperto}
                onChiudi={() => setPannelloStatoAperto(false)}
                titolo={statoInModifica ? "Modifica Stato" : "Nuovo Stato"}
                sottotitolo={statoInModifica ? statoInModifica.label : "Aggiungi uno stato al flusso cantieri"}
                icona={<Sliders size={18} />}
                coloreAccent="#1B8C3A"
                onSalva={salvaStato}
                isSalvataggio={isSalvataggioStato}
                labelSalva={statoInModifica ? "Aggiorna" : "Crea Stato"}
            >
                <SezioneForm titolo="Identificazione" descrizione="Codice univoco e nome visualizzato">
                    <Campo label="Codice" obbligatorio errore={erroriStato.codice}>
                        <InputPf
                            value={formStato.codice}
                            onChange={(e) => setFormStato((f) => ({ ...f, codice: e.target.value.toUpperCase() }))}
                            placeholder="POSA"
                            className="font-mono uppercase"
                            hasError={!!erroriStato.codice}
                        />
                    </Campo>
                    <Campo label="Label" obbligatorio errore={erroriStato.label}>
                        <InputPf
                            value={formStato.label}
                            onChange={(e) => setFormStato((f) => ({ ...f, label: e.target.value }))}
                            placeholder="Posa in opera"
                            hasError={!!erroriStato.label}
                        />
                    </Campo>
                    <Campo label="Icona (nome lucide)" errore={erroriStato.icona}>
                        <InputPf
                            value={formStato.icona}
                            onChange={(e) => setFormStato((f) => ({ ...f, icona: e.target.value }))}
                            placeholder="hammer"
                        />
                    </Campo>
                    <Campo label="Ordine" errore={erroriStato.ordine}>
                        <InputPf
                            type="number"
                            value={formStato.ordine}
                            onChange={(e) => setFormStato((f) => ({ ...f, ordine: e.target.value }))}
                            placeholder="10"
                            min="1"
                            hasError={!!erroriStato.ordine}
                            className="font-mono"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                <SezioneForm titolo="Colore" descrizione="Colore del badge nella UI">
                    <Campo label="Colore HEX" obbligatorio errore={erroriStato.colore} fullWidth>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-wrap gap-2">
                                {coloriPreset.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setFormStato((f) => ({ ...f, colore: c }))}
                                        className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: c,
                                            borderColor: formStato.colore === c ? "var(--pf-text-primary)" : "transparent",
                                        }}
                                        title={c}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-8 h-8 rounded-lg border flex-shrink-0" style={{ backgroundColor: formStato.colore, borderColor: "var(--pf-border)" }} />
                            <InputPf
                                value={formStato.colore}
                                onChange={(e) => setFormStato((f) => ({ ...f, colore: e.target.value }))}
                                placeholder="#3b82f6"
                                className="font-mono"
                                hasError={!!erroriStato.colore}
                            />
                        </div>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                <SezioneForm titolo="Flags" descrizione="Comportamento speciale dello stato">
                    <Campo label="Stato iniziale (entry point)" fullWidth>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setFormStato((f) => ({ ...f, isIniziale: !f.isIniziale }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${formStato.isIniziale ? "bg-[var(--pf-accent-primary)]" : "bg-[var(--pf-border)]"}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formStato.isIniziale ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm" style={{ color: formStato.isIniziale ? "var(--pf-accent-primary)" : "var(--pf-text-muted)" }}>
                                {formStato.isIniziale ? "Sì — stato iniziale" : "No"}
                            </span>
                        </label>
                    </Campo>
                    <Campo label="Stato finale (chiusura)" fullWidth>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setFormStato((f) => ({ ...f, isFinale: !f.isFinale }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${formStato.isFinale ? "bg-[#22c55e]" : "bg-[var(--pf-border)]"}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formStato.isFinale ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm" style={{ color: formStato.isFinale ? "#22c55e" : "var(--pf-text-muted)" }}>
                                {formStato.isFinale ? "Sì — stato finale" : "No"}
                            </span>
                        </label>
                    </Campo>
                    <Campo label="Attivo" fullWidth>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setFormStato((f) => ({ ...f, attivo: !f.attivo }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${formStato.attivo ? "bg-[#1B8C3A]" : "bg-[var(--pf-border)]"}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formStato.attivo ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm" style={{ color: formStato.attivo ? "#1B8C3A" : "var(--pf-text-muted)" }}>
                                {formStato.attivo ? "Attivo" : "Inattivo"}
                            </span>
                        </label>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                <SezioneForm titolo="Descrizione">
                    <Campo label="Note interne" fullWidth>
                        <TextareaPf
                            value={formStato.descrizione}
                            onChange={(e) => setFormStato((f) => ({ ...f, descrizione: e.target.value }))}
                            placeholder="Descrizione interna dello stato..."
                            rows={3}
                        />
                    </Campo>
                </SezioneForm>
            </PannelloCrud>

            {/* ===================== PANNELLO TIPO PRODOTTO ===================== */}
            <PannelloCrud
                aperto={pannelloTipoAperto}
                onChiudi={() => setPannelloTipoAperto(false)}
                titolo={tipoInModifica ? "Modifica Tipo Prodotto" : "Nuovo Tipo Prodotto"}
                sottotitolo={tipoInModifica ? tipoInModifica.label : "Aggiungi un tipo di prodotto al catalogo"}
                icona={<Sliders size={18} />}
                coloreAccent="#1B8C3A"
                onSalva={salvaTipo}
                isSalvataggio={isSalvataggioTipo}
                labelSalva={tipoInModifica ? "Aggiorna" : "Crea Tipo"}
            >
                <SezioneForm titolo="Identificazione" descrizione="Codice e nome del prodotto">
                    <Campo label="Codice" obbligatorio errore={erroriTipo.codice}>
                        <InputPf
                            value={formTipo.codice}
                            onChange={(e) => setFormTipo((f) => ({ ...f, codice: e.target.value.toLowerCase().replace(/\s/g, "_") }))}
                            placeholder="evolution_elite"
                            className="font-mono"
                            hasError={!!erroriTipo.codice}
                        />
                    </Campo>
                    <Campo label="Label" obbligatorio errore={erroriTipo.label}>
                        <InputPf
                            value={formTipo.label}
                            onChange={(e) => setFormTipo((f) => ({ ...f, label: e.target.value }))}
                            placeholder="Evolution Elite"
                            hasError={!!erroriTipo.label}
                        />
                    </Campo>
                    <Campo label="Categoria">
                        <InputPf
                            value={formTipo.categoria}
                            onChange={(e) => setFormTipo((f) => ({ ...f, categoria: e.target.value }))}
                            placeholder="pergola"
                        />
                    </Campo>
                    <Campo label="Ordine" errore={erroriTipo.ordine}>
                        <InputPf
                            type="number"
                            value={formTipo.ordine}
                            onChange={(e) => setFormTipo((f) => ({ ...f, ordine: e.target.value }))}
                            placeholder="1"
                            min="1"
                            hasError={!!erroriTipo.ordine}
                            className="font-mono"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                <SezioneForm titolo="Stato e descrizione">
                    <Campo label="Attivo" fullWidth>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setFormTipo((f) => ({ ...f, attivo: !f.attivo }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${formTipo.attivo ? "bg-[#1B8C3A]" : "bg-[var(--pf-border)]"}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formTipo.attivo ? "translate-x-5" : ""}`} />
                            </div>
                            <span className="text-sm" style={{ color: formTipo.attivo ? "#1B8C3A" : "var(--pf-text-muted)" }}>
                                {formTipo.attivo ? "Attivo" : "Inattivo"}
                            </span>
                        </label>
                    </Campo>
                    <Campo label="Descrizione" fullWidth>
                        <TextareaPf
                            value={formTipo.descrizione}
                            onChange={(e) => setFormTipo((f) => ({ ...f, descrizione: e.target.value }))}
                            placeholder="Descrizione del tipo prodotto..."
                            rows={3}
                        />
                    </Campo>
                </SezioneForm>
            </PannelloCrud>
        </div>
    );
}
