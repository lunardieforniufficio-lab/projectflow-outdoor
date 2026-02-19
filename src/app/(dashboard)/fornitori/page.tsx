// Pagina fornitori — DataTable con sorting, filtri, CRUD via pannello laterale
"use client";

import { useState, useCallback } from "react";
import { Truck, Plus, Pencil, Trash2, Phone, Mail, User } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { BadgeStato } from "@/components/ui/badge-stato";
import {
    PannelloCrud,
    SezioneForm,
    SeparatoreSezione,
    Campo,
    InputPf,
    TextareaPf,
} from "@/components/ui/pannello-crud";
import { fornitoriDemo } from "@/lib/dati-mock";
import type { Fornitore } from "@/types";

// === COLONNE TABELLA ===

const colonne: ColumnDef<Fornitore, unknown>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                        backgroundColor: "rgba(249, 115, 22, 0.12)",
                        color: "#f97316",
                    }}
                >
                    {row.original.nome.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <p className="font-medium truncate" style={{ color: "var(--pf-text-primary)" }}>
                        {row.original.nome}
                    </p>
                    {row.original.note && (
                        <p className="text-xs truncate max-w-[200px]" style={{ color: "var(--pf-text-muted)" }}>
                            {row.original.note}
                        </p>
                    )}
                </div>
            </div>
        ),
    },
    {
        accessorKey: "partitaIva",
        header: "P.IVA",
        cell: ({ getValue }) => {
            const v = getValue() as string | null;
            return v ? (
                <span
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-muted)" }}
                >
                    {v}
                </span>
            ) : (
                <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>
            );
        },
        meta: { nascostaMobile: true },
    },
    {
        accessorKey: "referente",
        header: "Referente",
        cell: ({ getValue }) => {
            const v = getValue() as string | null;
            return v ? (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                    <User size={12} className="flex-shrink-0" style={{ color: "var(--pf-text-muted)" }} />
                    {v}
                </span>
            ) : (
                <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>
            );
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => {
            const v = getValue() as string | null;
            return v ? (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                    <Mail size={12} className="flex-shrink-0" style={{ color: "var(--pf-text-muted)" }} />
                    <span className="truncate">{v}</span>
                </span>
            ) : (
                <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>
            );
        },
        meta: { nascostaMobile: true },
    },
    {
        accessorKey: "telefono",
        header: "Telefono",
        cell: ({ getValue }) => {
            const v = getValue() as string | null;
            return v ? (
                <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                    <Phone size={12} className="flex-shrink-0" style={{ color: "var(--pf-text-muted)" }} />
                    {v}
                </span>
            ) : (
                <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>
            );
        },
        meta: { nascostaMobile: true },
    },
    {
        accessorKey: "attivo",
        header: "Stato",
        cell: ({ getValue }) => {
            const attivo = getValue() as boolean;
            return (
                <BadgeStato
                    label={attivo ? "Attivo" : "Inattivo"}
                    colore={attivo ? "#1B8C3A" : "#6b7280"}
                    dimensione="sm"
                />
            );
        },
    },
    {
        id: "azioni",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex items-center gap-1 justify-end">
                <button
                    className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                    style={{ color: "var(--pf-text-muted)" }}
                    title="Modifica"
                >
                    <Pencil size={14} />
                </button>
                <button
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                    style={{ color: "var(--pf-text-muted)" }}
                    title="Elimina"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        ),
    },
];

const colonneExport = [
    { chiave: "nome", label: "Nome" },
    { chiave: "partitaIva", label: "Partita IVA" },
    { chiave: "referente", label: "Referente" },
    { chiave: "email", label: "Email" },
    { chiave: "telefono", label: "Telefono" },
    { chiave: "indirizzo", label: "Indirizzo" },
    { chiave: "note", label: "Note" },
];

// === STATO FORM ===

interface StatoForm {
    nome: string;
    partitaIva: string;
    referente: string;
    email: string;
    telefono: string;
    indirizzo: string;
    note: string;
}

const formVuoto: StatoForm = {
    nome: "",
    partitaIva: "",
    referente: "",
    email: "",
    telefono: "",
    indirizzo: "",
    note: "",
};

function fornitoreToForm(f: Fornitore): StatoForm {
    return {
        nome: f.nome,
        partitaIva: f.partitaIva ?? "",
        referente: f.referente ?? "",
        email: f.email ?? "",
        telefono: f.telefono ?? "",
        indirizzo: f.indirizzo ?? "",
        note: f.note ?? "",
    };
}

// === PAGINA ===

export default function PaginaFornitori() {
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [fornitoreInModifica, setFornitoreInModifica] = useState<Fornitore | null>(null);
    const [form, setForm] = useState<StatoForm>(formVuoto);
    const [errori, setErrori] = useState<Partial<Record<keyof StatoForm, string>>>({});
    const [isSalvataggio, setIsSalvataggio] = useState(false);

    const dati = fornitoriDemo;

    const setCampo = useCallback(<K extends keyof StatoForm>(campo: K, valore: StatoForm[K]) => {
        setForm((prev) => ({ ...prev, [campo]: valore }));
        setErrori((prev) => ({ ...prev, [campo]: undefined }));
    }, []);

    const apriNuovo = useCallback(() => {
        setFornitoreInModifica(null);
        setForm(formVuoto);
        setErrori({});
        setPannelloAperto(true);
    }, []);

    const apriModifica = useCallback((fornitore: Fornitore) => {
        setFornitoreInModifica(fornitore);
        setForm(fornitoreToForm(fornitore));
        setErrori({});
        setPannelloAperto(true);
    }, []);

    const valida = (): boolean => {
        const nuoviErrori: Partial<Record<keyof StatoForm, string>> = {};
        if (!form.nome.trim()) nuoviErrori.nome = "Nome obbligatorio";
        if (form.partitaIva && !/^\d{11}$/.test(form.partitaIva))
            nuoviErrori.partitaIva = "P.IVA: 11 cifre";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            nuoviErrori.email = "Email non valida";
        setErrori(nuoviErrori);
        return Object.keys(nuoviErrori).length === 0;
    };

    const gestisciSalva = useCallback(async () => {
        if (!valida()) return;
        setIsSalvataggio(true);
        try {
            // TODO: useCreaFornitore / useAggiornaFornitore
            await new Promise((r) => setTimeout(r, 800));
            console.log(fornitoreInModifica ? "Aggiorna:" : "Crea:", form);
            setPannelloAperto(false);
        } finally {
            setIsSalvataggio(false);
        }
    }, [form, fornitoreInModifica]);

    const rigaEspandibile = (f: Fornitore) => (
        <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>P.IVA</span>
                <p className="font-mono" style={{ color: "var(--pf-text-primary)" }}>{f.partitaIva ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Email</span>
                <p style={{ color: "var(--pf-text-primary)" }}>{f.email ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Telefono</span>
                <p className="font-mono" style={{ color: "var(--pf-text-primary)" }}>{f.telefono ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Indirizzo</span>
                <p style={{ color: "var(--pf-text-primary)" }}>{f.indirizzo ?? "—"}</p>
            </div>
        </div>
    );

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
                        <h1 className="text-xl font-bold" style={{ color: "var(--pf-text-primary)" }}>
                            Fornitori
                        </h1>
                        <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                            Anagrafica fornitori e partner
                        </p>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                colonne={colonne}
                dati={dati}
                getRowId={(f) => f.id}
                placeholderRicerca="Cerca per nome, P.IVA, referente, email..."
                mostraToggleColonne
                rigaEspandibile={rigaEspandibile}
                onClickRiga={apriModifica}
                azioniHeader={
                    <button
                        onClick={apriNuovo}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "#f97316" }}
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Nuovo Fornitore</span>
                        <span className="sm:hidden">Nuovo</span>
                    </button>
                }
                toolbarExport={
                    <ExportToolbar
                        dati={dati as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="fornitori"
                    />
                }
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={fornitoreInModifica ? "Modifica Fornitore" : "Nuovo Fornitore"}
                sottotitolo={
                    fornitoreInModifica
                        ? fornitoreInModifica.nome
                        : "Inserisci i dati del nuovo fornitore"
                }
                icona={<Truck size={18} />}
                coloreAccent="#f97316"
                onSalva={gestisciSalva}
                isSalvataggio={isSalvataggio}
                labelSalva={fornitoreInModifica ? "Aggiorna" : "Crea Fornitore"}
            >
                {/* Sezione: Dati azienda */}
                <SezioneForm titolo="Dati azienda" descrizione="Ragione sociale e partita IVA">
                    <Campo label="Nome / Ragione sociale" obbligatorio errore={errori.nome} fullWidth>
                        <InputPf
                            value={form.nome}
                            onChange={(e) => setCampo("nome", e.target.value)}
                            placeholder="KE Outdoor Design"
                            hasError={!!errori.nome}
                        />
                    </Campo>
                    <Campo label="Partita IVA" errore={errori.partitaIva}>
                        <InputPf
                            value={form.partitaIva}
                            onChange={(e) => setCampo("partitaIva", e.target.value.replace(/\D/g, ""))}
                            placeholder="04056850265"
                            maxLength={11}
                            hasError={!!errori.partitaIva}
                            className="font-mono"
                        />
                    </Campo>
                    <Campo label="Referente">
                        <InputPf
                            value={form.referente}
                            onChange={(e) => setCampo("referente", e.target.value)}
                            placeholder="Marco Zago"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Sezione: Contatti */}
                <SezioneForm titolo="Contatti">
                    <Campo label="Email" errore={errori.email}>
                        <InputPf
                            value={form.email}
                            onChange={(e) => setCampo("email", e.target.value)}
                            placeholder="ordini@keoutdoor.com"
                            type="email"
                            hasError={!!errori.email}
                        />
                    </Campo>
                    <Campo label="Telefono">
                        <InputPf
                            value={form.telefono}
                            onChange={(e) => setCampo("telefono", e.target.value)}
                            placeholder="+39 042 373 8600"
                            type="tel"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Sezione: Indirizzo e note */}
                <SezioneForm titolo="Indirizzo e note">
                    <Campo label="Indirizzo" fullWidth>
                        <InputPf
                            value={form.indirizzo}
                            onChange={(e) => setCampo("indirizzo", e.target.value)}
                            placeholder="Via Serenissima 1, Godega di Sant'Urbano (TV)"
                        />
                    </Campo>
                    <Campo label="Note" fullWidth>
                        <TextareaPf
                            value={form.note}
                            onChange={(e) => setCampo("note", e.target.value)}
                            placeholder="Note sul fornitore (es. tipologia prodotti, condizioni)..."
                            rows={3}
                        />
                    </Campo>
                </SezioneForm>
            </PannelloCrud>
        </div>
    );
}
