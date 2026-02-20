// Pagina squadre — DataTable + PannelloCrud con gestione membri dall'organigramma
"use client";

import { useState, useCallback, useMemo } from "react";
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    Phone,
    Search,
    X,
    Check,
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
import { squadreDemo, utentiDemo } from "@/lib/dati-mock";
import { useSquadre, useCreaSquadra, useAggiornaSquadra, useEliminaSquadra, useAggiuntaMembro, useRimozioneMembro } from "@/hooks/use-squadre";
import { DialogConferma } from "@/components/ui/dialog-conferma";
import type { Squadra } from "@/types/cantiere";
import type { UtenteDettaglio } from "@/types";

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

// === Tipo assegnazione membro-squadra ===
interface MembroAssegnato {
    utenteId: string;
    squadraId: string;
    ruoloSquadra: "caposquadra" | "installatore" | "altro";
}

// === Tipo form ===
interface FormSquadra {
    nome: string;
    telefono: string;
    colore: string;
    attiva: boolean;
    // Membri selezionati (utenteId[])
    membroIds: string[];
}

interface ErroriForm {
    nome?: string;
}

// Utenti assegnabili alle squadre (area operativa o con ruolo caposquadra/installatore)
const utentiOperativi = utentiDemo.filter(
    (u) =>
        u.attivo &&
        (u.area?.codice === "operativa" ||
            u.ruolo.codice === "caposquadra" ||
            u.ruolo.codice === "installatore")
);

// === Mappa iniziale squadra → membri (mock) ===
const membriInitiali: MembroAssegnato[] = [
    // sq1 = Nexteam
    { utenteId: "u12", squadraId: "sq1", ruoloSquadra: "caposquadra" }, // Francesco Sinagra
    { utenteId: "u16", squadraId: "sq1", ruoloSquadra: "installatore" }, // Pierpaolo Giachi
    { utenteId: "u17", squadraId: "sq1", ruoloSquadra: "installatore" }, // Francesco Ponziani
    // sq2 = Alfateam
    { utenteId: "u13", squadraId: "sq2", ruoloSquadra: "caposquadra" }, // Roberto Giglioni
    { utenteId: "u18", squadraId: "sq2", ruoloSquadra: "installatore" }, // Daniele Falcetta
    // sq3 = Team Esterni
    { utenteId: "u14", squadraId: "sq3", ruoloSquadra: "caposquadra" }, // Leonardo Sinagra
    { utenteId: "u15", squadraId: "sq3", ruoloSquadra: "caposquadra" }, // Antonino Sanfilippo
    { utenteId: "u19", squadraId: "sq3", ruoloSquadra: "installatore" }, // Alessio Consales
];

const formVuoto: FormSquadra = {
    nome: "",
    telefono: "",
    colore: "#1B8C3A",
    attiva: true,
    membroIds: [],
};

export default function PaginaSquadre() {
    // --- Hook dati reali n8n (fallback a mock se API non disponibile) ---
    const { squadre: squadreApi } = useSquadre();
    const creaSquadra = useCreaSquadra();
    const aggiornaSquadra = useAggiornaSquadra();
    const eliminaSquadra = useEliminaSquadra();
    const aggiuntaMembro = useAggiuntaMembro();
    const rimozioneMembro = useRimozioneMembro();

    // Dati: usa API se disponibili, altrimenti mock
    const squadre = squadreApi.length > 0 ? squadreApi : squadreDemo;
    const [membri, setMembri] = useState<MembroAssegnato[]>(membriInitiali);

    // Dialog conferma eliminazione
    const [squadraPerElimina, setSquadraPerElimina] = useState<Squadra | null>(null);
    const isEliminazione = eliminaSquadra.isPending;

    // --- Pannello CRUD ---
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [modalitaModifica, setModalitaModifica] = useState(false);
    const [squadraCorrente, setSquadraCorrente] = useState<Squadra | null>(null);
    const [form, setForm] = useState<FormSquadra>(formVuoto);
    const [errori, setErrori] = useState<ErroriForm>({});
    const isSalvataggio = creaSquadra.isPending || aggiornaSquadra.isPending;

    // --- Ricerca membri nel pannello ---
    const [ricercaMembri, setRicercaMembri] = useState("");

    // === Helpers ===
    const getMembriSquadra = useCallback(
        (squadraId: string): UtenteDettaglio[] =>
            membri
                .filter((m) => m.squadraId === squadraId)
                .map((m) => utentiDemo.find((u) => u.id === m.utenteId)!)
                .filter(Boolean),
        [membri]
    );

    // === Apri pannello nuova squadra ===
    const apriNuova = useCallback(() => {
        setSquadraCorrente(null);
        setModalitaModifica(false);
        setForm(formVuoto);
        setErrori({});
        setRicercaMembri("");
        setPannelloAperto(true);
    }, []);

    // === Apri pannello modifica ===
    const apriModifica = useCallback(
        (squadra: Squadra, e?: React.MouseEvent) => {
            e?.stopPropagation();
            setSquadraCorrente(squadra);
            setModalitaModifica(true);
            const membroIds = membri
                .filter((m) => m.squadraId === squadra.id)
                .map((m) => m.utenteId);
            setForm({
                nome: squadra.nome,
                telefono: squadra.telefono ?? "",
                colore: squadra.colore ?? "#1B8C3A",
                attiva: squadra.attiva,
                membroIds,
            });
            setErrori({});
            setRicercaMembri("");
            setPannelloAperto(true);
        },
        [membri]
    );

    // === Avvia eliminazione squadra ===
    const avviaElimina = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const squadra = squadre.find((s) => s.id === id) ?? null;
        setSquadraPerElimina(squadra);
    }, [squadre]);

    // === Conferma eliminazione squadra ===
    const confermaEliminaSquadra = useCallback(async () => {
        if (!squadraPerElimina) return;
        try {
            await eliminaSquadra.mutateAsync(squadraPerElimina.id);
            setMembri((prev) => prev.filter((m) => m.squadraId !== squadraPerElimina.id));
            setSquadraPerElimina(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [squadraPerElimina, eliminaSquadra]);

    // === Toggle membro nel form ===
    const toggleMembro = useCallback((utenteId: string) => {
        setForm((f) => ({
            ...f,
            membroIds: f.membroIds.includes(utenteId)
                ? f.membroIds.filter((id) => id !== utenteId)
                : [...f.membroIds, utenteId],
        }));
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
        try {
            if (modalitaModifica && squadraCorrente) {
                await aggiornaSquadra.mutateAsync({
                    id: squadraCorrente.id,
                    dati: {
                        nome: form.nome.trim(),
                        telefono: form.telefono.trim() || undefined,
                        colore: form.colore,
                    },
                });
                // Sincronizza membri: rimuovi vecchi, aggiungi nuovi
                const vecchiIds = membri
                    .filter((m) => m.squadraId === squadraCorrente.id)
                    .map((m) => m.utenteId);
                const daRimuovere = vecchiIds.filter((id) => !form.membroIds.includes(id));
                const daAggiungere = form.membroIds.filter((id) => !vecchiIds.includes(id));
                await Promise.all([
                    ...daRimuovere.map((uid) =>
                        rimozioneMembro.mutateAsync({ squadraId: squadraCorrente.id, membroId: uid })
                    ),
                    ...daAggiungere.map((uid) => {
                        const utente = utentiDemo.find((u) => u.id === uid);
                        const ruolo = utente?.ruolo.codice === "caposquadra"
                            ? "caposquadra"
                            : utente?.ruolo.codice === "installatore"
                                ? "installatore"
                                : "altro";
                        return aggiuntaMembro.mutateAsync({
                            squadraId: squadraCorrente.id,
                            utenteId: uid,
                            ruolo,
                        });
                    }),
                ]);
                // Aggiorna stato locale membri
                setMembri((prev) => {
                    const senzaSquadra = prev.filter((m) => m.squadraId !== squadraCorrente.id);
                    const nuoviMembri: MembroAssegnato[] = form.membroIds.map((uid) => {
                        const utente = utentiDemo.find((u) => u.id === uid);
                        return {
                            utenteId: uid,
                            squadraId: squadraCorrente.id,
                            ruoloSquadra: (
                                utente?.ruolo.codice === "caposquadra"
                                    ? "caposquadra"
                                    : utente?.ruolo.codice === "installatore"
                                        ? "installatore"
                                        : "altro"
                            ) as "caposquadra" | "installatore" | "altro",
                        };
                    });
                    return [...senzaSquadra, ...nuoviMembri];
                });
            } else {
                const nuovaSquadra = await creaSquadra.mutateAsync({
                    nome: form.nome.trim(),
                    telefono: form.telefono.trim() || undefined,
                    colore: form.colore,
                });
                // Aggiungi membri alla nuova squadra
                if (nuovaSquadra && form.membroIds.length > 0) {
                    await Promise.all(
                        form.membroIds.map((uid) => {
                            const utente = utentiDemo.find((u) => u.id === uid);
                            const ruolo = utente?.ruolo.codice === "caposquadra"
                                ? "caposquadra"
                                : utente?.ruolo.codice === "installatore"
                                    ? "installatore"
                                    : "altro";
                            return aggiuntaMembro.mutateAsync({
                                squadraId: nuovaSquadra.id,
                                utenteId: uid,
                                ruolo,
                            });
                        })
                    );
                    // Aggiorna stato locale
                    const nuoviMembri: MembroAssegnato[] = form.membroIds.map((uid) => {
                        const utente = utentiDemo.find((u) => u.id === uid);
                        return {
                            utenteId: uid,
                            squadraId: nuovaSquadra.id,
                            ruoloSquadra:
                                utente?.ruolo.codice === "caposquadra"
                                    ? "caposquadra"
                                    : utente?.ruolo.codice === "installatore"
                                        ? "installatore"
                                        : "altro",
                        } as MembroAssegnato;
                    });
                    setMembri((prev) => [...prev, ...nuoviMembri]);
                }
            }
            setPannelloAperto(false);
        } catch {
            // errore gestito da TanStack Query
        }
    };

    // === Utenti filtrati per ricerca nel pannello ===
    const utentiFiltrati = useMemo(() => {
        if (!ricercaMembri.trim()) return utentiOperativi;
        const q = ricercaMembri.toLowerCase();
        return utentiOperativi.filter(
            (u) =>
                u.nome.toLowerCase().includes(q) ||
                u.cognome.toLowerCase().includes(q) ||
                u.ruolo.label.toLowerCase().includes(q)
        );
    }, [ricercaMembri]);

    // === Colonne DataTable ===
    const colonne: ColumnDef<Squadra, unknown>[] = [
        {
            id: "nome",
            accessorKey: "nome",
            header: "Squadra",
            cell: ({ row }) => {
                const membroSquadra = getMembriSquadra(row.original.id);
                return (
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
                );
            },
        },
        {
            id: "membri",
            header: "Membri",
            enableSorting: false,
            cell: ({ row }) => {
                const membroSquadra = getMembriSquadra(row.original.id);
                if (membroSquadra.length === 0) {
                    return <span className="text-xs text-[var(--pf-text-muted)]">Nessun membro</span>;
                }
                return (
                    <div className="flex items-center gap-1.5">
                        {/* Avatar pile */}
                        <div className="flex -space-x-2">
                            {membroSquadra.slice(0, 5).map((m) => (
                                <div
                                    key={m.id}
                                    title={`${m.nome} ${m.cognome} — ${m.ruolo.label}`}
                                    className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-white"
                                    style={{
                                        backgroundColor: m.ruolo.colore ?? "#666",
                                        borderColor: "var(--pf-bg-surface)",
                                    }}
                                >
                                    {m.nome[0]}{m.cognome[0]}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs text-[var(--pf-text-muted)]">
                            {membroSquadra.length} {membroSquadra.length === 1 ? "membro" : "membri"}
                        </span>
                    </div>
                );
            },
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
                        onClick={(e) => avviaElimina(row.original.id, e)}
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
    const rigaEspandibile = (s: Squadra) => {
        const membroSquadra = getMembriSquadra(s.id);
        return (
            <div className="px-4 py-3 text-xs space-y-3">
                {s.telefono && (
                    <div className="flex items-center gap-2">
                        <Phone size={12} className="text-[var(--pf-text-muted)]" />
                        <span className="text-[var(--pf-text-secondary)]">{s.telefono}</span>
                    </div>
                )}
                {membroSquadra.length > 0 && (
                    <div>
                        <p className="text-[var(--pf-text-muted)] mb-2">Membri ({membroSquadra.length})</p>
                        <div className="flex flex-wrap gap-1.5">
                            {membroSquadra.map((m) => (
                                <span
                                    key={m.id}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${m.ruolo.colore} 15%, transparent)`,
                                        color: m.ruolo.colore ?? "#666",
                                    }}
                                >
                                    {m.nome[0]}{m.cognome[0]} — {m.nome} {m.cognome}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
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
    };

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

            {/* === DIALOG CONFERMA ELIMINAZIONE === */}
            <DialogConferma
                aperto={!!squadraPerElimina}
                onChiudi={() => setSquadraPerElimina(null)}
                onConferma={confermaEliminaSquadra}
                titolo="Elimina squadra"
                messaggio={
                    squadraPerElimina
                        ? `Vuoi eliminare la squadra "${squadraPerElimina.nome}"? Questa azione non può essere annullata.`
                        : ""
                }
                labelConferma="Elimina"
                tipo="pericolo"
                isCaricamento={isEliminazione}
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={modalitaModifica ? `Modifica ${squadraCorrente?.nome}` : "Nuova Squadra"}
                sottotitolo={
                    modalitaModifica
                        ? "Modifica dati e composizione della squadra"
                        : "Crea una nuova squadra e aggiungi i membri"
                }
                icona={<Users size={18} />}
                coloreAccent="#3b82f6"
                onSalva={salva}
                isSalvataggio={isSalvataggio}
                larghezza="lg"
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

                {/* === Sezione 2: Colore === */}
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
                                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: c.value }} />
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
                            style={{ borderColor: "var(--pf-border)", backgroundColor: "var(--pf-bg-surface)" }}
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

                {/* === Sezione 3: Membri === */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                                Composizione squadra
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                                Seleziona i membri dall&apos;organigramma operativo
                            </p>
                        </div>
                        {form.membroIds.length > 0 && (
                            <span
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: `color-mix(in srgb, #3b82f6 15%, transparent)`,
                                    color: "#3b82f6",
                                }}
                            >
                                {form.membroIds.length} selezionati
                            </span>
                        )}
                    </div>

                    {/* Chips membri selezionati */}
                    {form.membroIds.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {form.membroIds.map((uid) => {
                                const u = utentiDemo.find((x) => x.id === uid);
                                if (!u) return null;
                                return (
                                    <span
                                        key={uid}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: `color-mix(in srgb, ${u.ruolo.colore} 12%, transparent)`,
                                            color: u.ruolo.colore ?? "#666",
                                        }}
                                    >
                                        <span className="font-bold">{u.nome[0]}{u.cognome[0]}</span>
                                        {u.nome} {u.cognome}
                                        <button
                                            onClick={() => toggleMembro(uid)}
                                            className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {/* Ricerca + lista utenti selezionabili */}
                    <div
                        className="rounded-lg border overflow-hidden"
                        style={{ borderColor: "var(--pf-border)" }}
                    >
                        {/* Barra ricerca */}
                        <div
                            className="relative border-b"
                            style={{ borderColor: "var(--pf-border)" }}
                        >
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <input
                                type="text"
                                value={ricercaMembri}
                                onChange={(e) => setRicercaMembri(e.target.value)}
                                placeholder="Cerca per nome o ruolo..."
                                className="w-full pl-8 pr-4 py-2.5 text-sm outline-none"
                                style={{
                                    backgroundColor: "var(--pf-bg-surface)",
                                    color: "var(--pf-text-primary)",
                                }}
                            />
                        </div>

                        {/* Lista utenti */}
                        <div
                            className="max-h-64 overflow-y-auto"
                            style={{ backgroundColor: "var(--pf-bg-primary)" }}
                        >
                            {utentiFiltrati.length === 0 ? (
                                <div className="py-6 text-center text-xs" style={{ color: "var(--pf-text-muted)" }}>
                                    Nessun utente trovato
                                </div>
                            ) : (
                                utentiFiltrati.map((u) => {
                                    const selezionato = form.membroIds.includes(u.id);
                                    return (
                                        <button
                                            key={u.id}
                                            type="button"
                                            onClick={() => toggleMembro(u.id)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b last:border-b-0"
                                            style={{
                                                borderColor: "var(--pf-border-light, var(--pf-border))",
                                                backgroundColor: selezionato
                                                    ? `color-mix(in srgb, #3b82f6 8%, var(--pf-bg-primary))`
                                                    : "transparent",
                                            }}
                                        >
                                            {/* Avatar */}
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                                                style={{ backgroundColor: u.ruolo.colore ?? "#666" }}
                                            >
                                                {u.nome[0]}{u.cognome[0]}
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate" style={{ color: "var(--pf-text-primary)" }}>
                                                    {u.nome} {u.cognome}
                                                </p>
                                                <p className="text-xs truncate" style={{ color: u.ruolo.colore ?? "var(--pf-text-muted)" }}>
                                                    {u.ruolo.label}
                                                    {u.area && ` · ${u.area.label}`}
                                                </p>
                                            </div>
                                            {/* Check */}
                                            <div
                                                className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all"
                                                style={{
                                                    borderColor: selezionato ? "#3b82f6" : "var(--pf-border)",
                                                    backgroundColor: selezionato ? "#3b82f6" : "transparent",
                                                }}
                                            >
                                                {selezionato && <Check size={12} className="text-white" />}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <SeparatoreSezione />

                {/* === Sezione 4: Stato === */}
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
