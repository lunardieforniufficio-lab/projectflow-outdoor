// Pagina squadre — DataTable con TanStack Table v8 + PannelloCrud laterale
"use client";

import { useState, useCallback } from "react";
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    Phone,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
    PannelloCrud,
    SezioneForm,
    SeparatoreSezione,
    Campo,
    InputPf,
} from "@/components/ui/pannello-crud";
import { squadreDemo } from "@/lib/dati-mock";
import type { Squadra } from "@/types/cantiere";

// === Colori predefiniti per le squadre ===
const coloriSquadra = [
    { value: "#1B8C3A", label: "Verde" },
    { value: "#3b82f6", label: "Blu" },
    { value: "#f59e0b", label: "Arancione" },
    { value: "#ec4899", label: "Rosa" },
    { value: "#8b5cf6", label: "Viola" },
    { value: "#ef4444", label: "Rosso" },
    { value: "#06b6d4", label: "Ciano" },
    { value: "#14b8a6", label: "Teal" },
];

// === Tipo form ===
interface FormSquadra {
    nome: string;
    telefono: string;
    colore: string;
    attiva: boolean;
}

interface ErroriForm {
    nome?: string;
}

const formVuoto: FormSquadra = {
    nome: "",
    telefono: "",
    colore: "#1B8C3A",
    attiva: true,
};

export default function PaginaSquadre() {
    // --- Dati locali (mock) ---
    const [squadre, setSquadre] = useState<Squadra[]>(squadreDemo);

    // --- Pannello CRUD ---
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [modalitaModifica, setModalitaModifica] = useState(false);
    const [squadraCorrente, setSquadraCorrente] = useState<Squadra | null>(null);
    const [form, setForm] = useState<FormSquadra>(formVuoto);
    const [errori, setErrori] = useState<ErroriForm>({});
    const [isSalvataggio, setIsSalvataggio] = useState(false);

    // === Apri pannello nuova squadra ===
    const apriNuova = useCallback(() => {
        setSquadraCorrente(null);
        setModalitaModifica(false);
        setForm(formVuoto);
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // === Apri pannello modifica ===
    const apriModifica = useCallback((squadra: Squadra, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setSquadraCorrente(squadra);
        setModalitaModifica(true);
        setForm({
            nome: squadra.nome,
            telefono: squadra.telefono ?? "",
            colore: squadra.colore ?? "#1B8C3A",
            attiva: squadra.attiva,
        });
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // === Elimina squadra ===
    const eliminaSquadra = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Vuoi eliminare questa squadra?")) return;
        setSquadre((prev) => prev.filter((s) => s.id !== id));
    }, []);

    // === Validazione form ===
    const valida = (): boolean => {
        const nuovi: ErroriForm = {};
        if (!form.nome.trim()) nuovi.nome = "Nome squadra obbligatorio";
        setErrori(nuovi);
        return Object.keys(nuovi).length === 0;
    };

    // === Salva squadra ===
    const salva = async () => {
        if (!valida()) return;
        setIsSalvataggio(true);

        // TODO: sostituire con chiamata API n8n
        await new Promise((r) => setTimeout(r, 600));

        const ora = new Date().toISOString();

        if (modalitaModifica && squadraCorrente) {
            setSquadre((prev) =>
                prev.map((s) =>
                    s.id === squadraCorrente.id
                        ? {
                            ...s,
                            nome: form.nome.trim(),
                            telefono: form.telefono.trim() || null,
                            colore: form.colore,
                            attiva: form.attiva,
                        }
                        : s
                )
            );
        } else {
            const nuova: Squadra = {
                id: `sq${Date.now()}`,
                nome: form.nome.trim(),
                responsabileId: null,
                telefono: form.telefono.trim() || null,
                colore: form.colore,
                attiva: form.attiva,
                creatoIl: ora,
            };
            setSquadre((prev) => [nuova, ...prev]);
        }

        setIsSalvataggio(false);
        setPannelloAperto(false);
    };

    // === Colonne DataTable ===
    const colonne: ColumnDef<Squadra, unknown>[] = [
        {
            id: "nome",
            accessorKey: "nome",
            header: "Squadra",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: row.original.colore ?? "#666" }}
                    >
                        {row.original.nome.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-[var(--pf-text-primary)]">
                            {row.original.nome}
                        </p>
                        {row.original.telefono && (
                            <p className="text-xs text-[var(--pf-text-muted)] flex items-center gap-1 mt-0.5">
                                <Phone size={10} />
                                {row.original.telefono}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "stato",
            header: "Stato",
            accessorFn: (row) => (row.attiva ? "Attiva" : "Inattiva"),
            cell: ({ row }) => (
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                        backgroundColor: row.original.attiva
                            ? "rgba(27, 140, 58, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                        color: row.original.attiva ? "#1B8C3A" : "#ef4444",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: row.original.attiva ? "#1B8C3A" : "#ef4444" }}
                    />
                    {row.original.attiva ? "Attiva" : "Inattiva"}
                </span>
            ),
        },
        {
            id: "colore",
            header: "Colore",
            enableSorting: false,
            cell: ({ row }) => {
                const coloreDef = coloriSquadra.find((c) => c.value === row.original.colore);
                return (
                    <div className="flex items-center gap-2">
                        <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: row.original.colore ?? "#666" }}
                        />
                        <span className="text-xs text-[var(--pf-text-muted)]">
                            {coloreDef?.label ?? row.original.colore ?? "—"}
                        </span>
                    </div>
                );
            },
        },
        {
            id: "azioni",
            header: "",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => apriModifica(row.original, e)}
                        title="Modifica"
                        className="p-1.5 rounded-md hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={(e) => eliminaSquadra(row.original.id, e)}
                        title="Elimina"
                        className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                        style={{ color: "#ef4444" }}
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ),
        },
    ];

    // === Riga espandibile mobile ===
    const rigaEspandibile = (s: Squadra) => (
        <div className="px-4 py-3 text-xs space-y-2">
            {s.telefono && (
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[var(--pf-text-muted)]" />
                    <span className="text-[var(--pf-text-secondary)]">{s.telefono}</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.colore ?? "#666" }}
                />
                <span className="text-[var(--pf-text-muted)]">
                    {coloriSquadra.find((c) => c.value === s.colore)?.label ?? s.colore ?? "—"}
                </span>
            </div>
            <div className="flex gap-2 pt-1">
                <button
                    onClick={() => apriModifica(s)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                >
                    <Pencil size={12} /> Modifica
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* === HEADER === */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] flex items-center gap-3">
                        <Users size={28} className="text-[#3b82f6]" />
                        Squadre
                    </h1>
                    <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                        {squadre.filter((s) => s.attiva).length} attive · {squadre.length} totali
                    </p>
                </div>
                <button
                    onClick={apriNuova}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: "#3b82f6" }}
                >
                    <Plus size={16} />
                    Nuova Squadra
                </button>
            </div>

            {/* === TABELLA === */}
            <DataTable
                colonne={colonne}
                dati={squadre}
                placeholderRicerca="Cerca squadra..."
                onClickRiga={(s) => apriModifica(s)}
                getRowId={(s) => s.id}
                rigaEspandibile={rigaEspandibile}
                emptyState={
                    <div className="text-center py-12">
                        <Users size={40} className="mx-auto text-[var(--pf-text-muted)] mb-3" />
                        <p className="text-sm text-[var(--pf-text-secondary)]">Nessuna squadra trovata</p>
                        <p className="text-xs text-[var(--pf-text-muted)] mt-1">
                            Aggiungi la prima squadra operativa
                        </p>
                    </div>
                }
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={modalitaModifica ? `Modifica ${squadraCorrente?.nome}` : "Nuova Squadra"}
                sottotitolo={
                    modalitaModifica
                        ? "Modifica i dati della squadra"
                        : "Crea una nuova squadra operativa"
                }
                icona={<Users size={18} />}
                coloreAccent="#3b82f6"
                onSalva={salva}
                isSalvataggio={isSalvataggio}
                larghezza="md"
                labelSalva={modalitaModifica ? "Salva modifiche" : "Crea squadra"}
            >
                {/* === Sezione 1: Dati principali === */}
                <SezioneForm
                    titolo="Dati squadra"
                    descrizione="Nome e recapito della squadra"
                >
                    <Campo label="Nome squadra" obbligatorio errore={errori.nome} fullWidth>
                        <InputPf
                            value={form.nome}
                            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                            hasError={!!errori.nome}
                            placeholder="es. Nexteam, Alfateam..."
                            autoFocus
                        />
                    </Campo>
                    <Campo label="Telefono" fullWidth>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <InputPf
                                type="tel"
                                value={form.telefono}
                                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                                placeholder="+39 333 1234567"
                                className="pl-8"
                            />
                        </div>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 2: Aspetto === */}
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                            Colore identificativo
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                            Usato nei calendari, timeline e badge
                        </p>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {coloriSquadra.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, colore: c.value }))}
                                className="flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all"
                                style={{
                                    borderColor: form.colore === c.value ? c.value : "var(--pf-border)",
                                    backgroundColor: form.colore === c.value
                                        ? `color-mix(in srgb, ${c.value} 10%, transparent)`
                                        : "transparent",
                                }}
                            >
                                <span
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: c.value }}
                                />
                                <span className="text-[10px]" style={{ color: "var(--pf-text-muted)" }}>
                                    {c.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Preview avatar */}
                    {form.nome && (
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg border"
                            style={{
                                borderColor: "var(--pf-border)",
                                backgroundColor: "var(--pf-bg-surface)",
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                style={{ backgroundColor: form.colore }}
                            >
                                {form.nome.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                                    {form.nome}
                                </p>
                                <p className="text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                    Anteprima badge squadra
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <SeparatoreSezione />

                {/* === Sezione 3: Stato === */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                        Stato operativo
                    </h3>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--pf-text-primary)" }}>
                                Squadra attiva
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                                Le squadre inattive non compaiono nelle assegnazioni cantieri
                            </p>
                        </div>
                        <div
                            onClick={() => setForm((f) => ({ ...f, attiva: !f.attiva }))}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ml-4 flex-shrink-0 ${form.attiva ? "bg-[#3b82f6]" : "bg-[var(--pf-border)]"}`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.attiva ? "translate-x-5" : ""}`}
                            />
                        </div>
                    </label>
                </div>
            </PannelloCrud>
        </div>
    );
}
