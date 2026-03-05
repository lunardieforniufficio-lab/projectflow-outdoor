// Pagina fornitori — DataTable con sorting, filtri, CRUD via pannello laterale
"use client";

import { useState, useCallback } from "react";
import { Truck, Plus, Pencil, Trash2, Phone, Mail, User } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { ExportToolbar } from "@/components/ui/export-toolbar";
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
import { fornitoriDemo } from "@/lib/dati-mock";
import {
    useFornitori,
    useCreaFornitore,
    useAggiornaFornitore,
    useEliminaFornitore,
} from "@/hooks/use-fornitori";
import type { Fornitore } from "@/types";

// === COLONNE EXPORT ===
const colonneExport = [
    { chiave: "nome", label: "Nome" },
    { chiave: "partitaIva", label: "Partita IVA" },
    { chiave: "referente", label: "Referente" },
    { chiave: "email", label: "Email" },
    { chiave: "telefono", label: "Telefono" },
    { chiave: "indirizzo", label: "Indirizzo" },
    { chiave: "attivo", label: "Attivo" },
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
    attivo: boolean;
    note: string;
}

const formVuoto: StatoForm = {
    nome: "",
    partitaIva: "",
    referente: "",
    email: "",
    telefono: "",
    indirizzo: "",
    attivo: true,
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
        attivo: f.attivo,
        note: f.note ?? "",
    };
}

// === PAGINA ===
export default function PaginaFornitori() {
    // --- Hook dati reali n8n (fallback a mock se API non disponibile) ---
    const { fornitori: fornitoriApi, isCaricamento: isLoadingApi } = useFornitori();
    const creaFornitore = useCreaFornitore();
    const aggiornaFornitore = useAggiornaFornitore();
    const eliminaFornitore = useEliminaFornitore();

    // Dati: usa API se disponibili, altrimenti mock
    const fornitori = fornitoriApi.length > 0 ? fornitoriApi : fornitoriDemo;

    // Pannello CRUD
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [fornitoreInModifica, setFornitoreInModifica] = useState<Fornitore | null>(null);
    const [form, setForm] = useState<StatoForm>(formVuoto);
    const [errori, setErrori] = useState<Partial<Record<keyof StatoForm, string>>>({});

    // Dialog eliminazione
    const [fornitorePerElimina, setFornitorePerElimina] = useState<Fornitore | null>(null);

    const isSalvataggio = creaFornitore.isPending || aggiornaFornitore.isPending;
    const isEliminazione = eliminaFornitore.isPending;

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
        const payload = {
            nome: form.nome.trim(),
            partitaIva: form.partitaIva || undefined,
            referente: form.referente || undefined,
            email: form.email || undefined,
            telefono: form.telefono || undefined,
            indirizzo: form.indirizzo || undefined,
            attivo: form.attivo,
            note: form.note || undefined,
        };
        try {
            if (fornitoreInModifica) {
                await aggiornaFornitore.mutateAsync({ id: fornitoreInModifica.id, dati: payload });
            } else {
                await creaFornitore.mutateAsync(payload);
            }
            setPannelloAperto(false);
        } catch {
            // errore gestito da TanStack Query (toast futuro)
        }
    }, [form, fornitoreInModifica, creaFornitore, aggiornaFornitore]);

    const confermaElimina = useCallback(async () => {
        if (!fornitorePerElimina) return;
        try {
            await eliminaFornitore.mutateAsync(fornitorePerElimina.id);
            setFornitorePerElimina(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [fornitorePerElimina, eliminaFornitore]);

    // Colonne (dentro la funzione per accesso a apriModifica e setFornitorePerElimina)
    const colonne: ColumnDef<Fornitore, unknown>[] = [
        {
            accessorKey: "nome",
            header: "Nome",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "rgba(249,115,22,0.12)", color: "#f97316" }}
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
                    <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-muted)" }}>
                        {v}
                    </span>
                ) : <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>;
            },
        },
        {
            accessorKey: "referente",
            header: "Referente",
            cell: ({ getValue }) => {
                const v = getValue() as string | null;
                return v ? (
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                        <User size={12} style={{ color: "var(--pf-text-muted)" }} />{v}
                    </span>
                ) : <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>;
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ getValue }) => {
                const v = getValue() as string | null;
                return v ? (
                    <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                        <Mail size={12} style={{ color: "var(--pf-text-muted)" }} />
                        <span className="truncate">{v}</span>
                    </span>
                ) : <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>;
            },
        },
        {
            accessorKey: "telefono",
            header: "Telefono",
            cell: ({ getValue }) => {
                const v = getValue() as string | null;
                return v ? (
                    <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                        <Phone size={12} style={{ color: "var(--pf-text-muted)" }} />{v}
                    </span>
                ) : <span className="text-xs" style={{ color: "var(--pf-text-muted)" }}>—</span>;
            },
        },
        {
            accessorKey: "attivo",
            header: "Stato",
            accessorFn: (row) => (row.attivo ? "Attivo" : "Inattivo"),
            cell: ({ row }) => (
                <BadgeStato
                    label={row.original.attivo ? "Attivo" : "Inattivo"}
                    colore={row.original.attivo ? "#1B8C3A" : "#6b7280"}
                    dimensione="sm"
                />
            ),
        },
        {
            id: "azioni",
            header: "",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); apriModifica(row.original); }}
                        className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                        title="Modifica"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setFornitorePerElimina(row.original); }}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        style={{ color: "#ef4444" }}
                        title="Elimina"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ),
        },
    ];

    const rigaEspandibile = (f: Fornitore) => (
        <div className="grid grid-cols-2 gap-3 text-xs px-4 py-3">
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>P.IVA</span>
                <p className="font-mono mt-0.5" style={{ color: "var(--pf-text-primary)" }}>{f.partitaIva ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Email</span>
                <p className="mt-0.5" style={{ color: "var(--pf-text-primary)" }}>{f.email ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Telefono</span>
                <p className="font-mono mt-0.5" style={{ color: "var(--pf-text-primary)" }}>{f.telefono ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Indirizzo</span>
                <p className="mt-0.5" style={{ color: "var(--pf-text-primary)" }}>{f.indirizzo ?? "—"}</p>
            </div>
            <div className="col-span-2 flex gap-2 pt-1">
                <button
                    onClick={() => apriModifica(f)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                >
                    <Pencil size={12} /> Modifica
                </button>
                <button
                    onClick={() => setFornitorePerElimina(f)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                >
                    <Trash2 size={12} /> Elimina
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] flex items-center gap-3">
                        <Truck size={28} style={{ color: "#f97316" }} />
                        Fornitori
                    </h1>
                    <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                        {fornitori.filter(f => f.attivo).length} attivi · {fornitori.length} totali
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportToolbar
                        dati={fornitori as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="fornitori"
                    />
                    <button
                        onClick={apriNuovo}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "#f97316" }}
                    >
                        <Plus size={16} />
                        Nuovo Fornitore
                    </button>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                colonne={colonne}
                dati={fornitori}
                getRowId={(f) => f.id}
                placeholderRicerca="Cerca per nome, P.IVA, referente, email..."
                mostraToggleColonne
                rigaEspandibile={rigaEspandibile}
                onClickRiga={apriModifica}
                emptyState={
                    <div className="text-center py-12">
                        <Truck size={40} className="mx-auto text-[var(--pf-text-muted)] mb-3" />
                        <p className="text-sm text-[var(--pf-text-secondary)]">Nessun fornitore trovato</p>
                    </div>
                }
            />

            {/* Dialog eliminazione */}
            <DialogConferma
                aperto={!!fornitorePerElimina}
                onChiudi={() => setFornitorePerElimina(null)}
                onConferma={confermaElimina}
                titolo="Elimina fornitore"
                messaggio={`Sei sicuro di voler eliminare "${fornitorePerElimina?.nome}"? L'operazione non può essere annullata.`}
                labelConferma="Elimina"
                tipo="pericolo"
                isCaricamento={isEliminazione}
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={fornitoreInModifica ? "Modifica Fornitore" : "Nuovo Fornitore"}
                sottotitolo={fornitoreInModifica ? fornitoreInModifica.nome : "Inserisci i dati del nuovo fornitore"}
                icona={<Truck size={18} />}
                coloreAccent="#f97316"
                onSalva={gestisciSalva}
                isSalvataggio={isSalvataggio}
                labelSalva={fornitoreInModifica ? "Aggiorna" : "Crea Fornitore"}
            >
                <SezioneForm titolo="Dati azienda" descrizione="Ragione sociale, P.IVA e referente">
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
                            placeholder="Note sul fornitore (tipologia prodotti, condizioni)..."
                            rows={3}
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Toggle attivo */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                        Stato fornitore
                    </h3>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--pf-text-primary)" }}>
                                Fornitore attivo
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                                I fornitori inattivi non compaiono nelle selezioni ordini
                            </p>
                        </div>
                        <div
                            onClick={() => setCampo("attivo", !form.attivo)}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ml-4 flex-shrink-0 ${form.attivo ? "bg-[#f97316]" : "bg-[var(--pf-border)]"}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.attivo ? "translate-x-5" : ""}`} />
                        </div>
                    </label>
                </div>
            </PannelloCrud>
        </div>
    );
}
