// Pagina lista cantieri — DataTable con TanStack Table v8 + PannelloCrud laterale
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    HardHat,
    Plus,
    Pencil,
    Trash2,
    ExternalLink,
    Euro,
    MapPin,
    Calendar,
} from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import {
    PannelloCrud,
    SezioneForm,
    SeparatoreSezione,
    Campo,
    InputPf,
    TextareaPf,
    SelectPf,
} from "@/components/ui/pannello-crud";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import {
    cantieriDemo,
    statiCantiereDemo,
    clientiDemo,
    tipiProdottoDemo,
    squadreDemo,
} from "@/lib/dati-mock";
import type { Cantiere } from "@/types/cantiere";

// === Tipi form ===
interface FormCantiere {
    clienteId: string;
    tipoProdottoId: string;
    statoId: string;
    indirizzoCantiere: string;
    cittaCantiere: string;
    importoTotale: string;
    importoAcconto: string;
    accontoPagato: boolean;
    squadraId: string;
    venditoreId: string;
    dataInizio: string;
    dataFinePrevista: string;
    noteInterne: string;
}

interface ErroriForm {
    clienteId?: string;
    indirizzoCantiere?: string;
    tipoProdottoId?: string;
    importoTotale?: string;
}

// === Helpers ===
function formatValuta(valore: number | null): string {
    if (!valore) return "—";
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valore);
}

function formatData(iso: string | null): string {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(iso));
}

const formVuoto: FormCantiere = {
    clienteId: "",
    tipoProdottoId: "",
    statoId: "s1",
    indirizzoCantiere: "",
    cittaCantiere: "",
    importoTotale: "",
    importoAcconto: "",
    accontoPagato: false,
    squadraId: "",
    venditoreId: "",
    dataInizio: "",
    dataFinePrevista: "",
    noteInterne: "",
};

// Venditori mock (utenti con ruolo venditore)
const venditoriDemo = [
    { id: "u2", nome: "Francesco", cognome: "Sinagra" },
    { id: "u5", nome: "Marco", cognome: "Bianchi" },
];

export default function PaginaCantieri() {
    const router = useRouter();

    // --- Dati locali (mock) ---
    const [cantieri, setCantieri] = useState<Cantiere[]>(cantieriDemo);

    // --- Pannello CRUD ---
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [modalitaModifica, setModalitaModifica] = useState(false);
    const [cantiereCorrente, setCantiereCorrente] = useState<Cantiere | null>(null);
    const [form, setForm] = useState<FormCantiere>(formVuoto);
    const [errori, setErrori] = useState<ErroriForm>({});
    const [isSalvataggio, setIsSalvataggio] = useState(false);

    // --- Helpers stato/cliente/tipo ---
    const getNomeCliente = (id: string) => {
        const c = clientiDemo.find((x) => x.id === id);
        return c ? `${c.cognome} ${c.nome}` : "—";
    };
    const getStato = (id: string) => statiCantiereDemo.find((s) => s.id === id);
    const getTipoProdotto = (id: string) => tipiProdottoDemo.find((t) => t.id === id)?.label ?? "—";
    const getSquadra = (id: string | null) => id ? squadreDemo.find((s) => s.id === id) : null;

    // === Apri pannello nuovo cantiere ===
    const apriNuovo = useCallback(() => {
        setCantiereCorrente(null);
        setModalitaModifica(false);
        setForm(formVuoto);
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // === Apri pannello modifica ===
    const apriModifica = useCallback((cantiere: Cantiere, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCantiereCorrente(cantiere);
        setModalitaModifica(true);
        setForm({
            clienteId: cantiere.clienteId,
            tipoProdottoId: cantiere.tipoProdottoId,
            statoId: cantiere.statoId,
            indirizzoCantiere: cantiere.indirizzoCantiere,
            cittaCantiere: cantiere.cittaCantiere ?? "",
            importoTotale: cantiere.importoTotale?.toString() ?? "",
            importoAcconto: cantiere.importoAcconto?.toString() ?? "",
            accontoPagato: cantiere.accontoPagato,
            squadraId: cantiere.squadraId ?? "",
            venditoreId: cantiere.venditoreId ?? "",
            dataInizio: cantiere.dataInizio ?? "",
            dataFinePrevista: cantiere.dataFinePrevista ?? "",
            noteInterne: cantiere.noteInterne ?? "",
        });
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // === Elimina cantiere ===
    const eliminaCantiere = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Vuoi eliminare questo cantiere?")) return;
        setCantieri((prev) => prev.filter((c) => c.id !== id));
    }, []);

    // === Validazione form ===
    const valida = (): boolean => {
        const nuovi: ErroriForm = {};
        if (!form.clienteId) nuovi.clienteId = "Seleziona un cliente";
        if (!form.indirizzoCantiere.trim()) nuovi.indirizzoCantiere = "Indirizzo obbligatorio";
        if (!form.tipoProdottoId) nuovi.tipoProdottoId = "Seleziona il tipo prodotto";
        if (form.importoTotale && isNaN(Number(form.importoTotale)))
            nuovi.importoTotale = "Inserisci un importo valido";
        setErrori(nuovi);
        return Object.keys(nuovi).length === 0;
    };

    // === Salva cantiere ===
    const salva = async () => {
        if (!valida()) return;
        setIsSalvataggio(true);

        // TODO: sostituire con chiamata API n8n
        await new Promise((r) => setTimeout(r, 700));

        const ora = new Date().toISOString();

        if (modalitaModifica && cantiereCorrente) {
            // Aggiorna
            setCantieri((prev) =>
                prev.map((c) =>
                    c.id === cantiereCorrente.id
                        ? {
                            ...c,
                            clienteId: form.clienteId,
                            tipoProdottoId: form.tipoProdottoId,
                            statoId: form.statoId,
                            indirizzoCantiere: form.indirizzoCantiere,
                            cittaCantiere: form.cittaCantiere || null,
                            importoTotale: form.importoTotale ? Number(form.importoTotale) : null,
                            importoAcconto: form.importoAcconto ? Number(form.importoAcconto) : null,
                            accontoPagato: form.accontoPagato,
                            squadraId: form.squadraId || null,
                            venditoreId: form.venditoreId || null,
                            dataInizio: form.dataInizio || null,
                            dataFinePrevista: form.dataFinePrevista || null,
                            noteInterne: form.noteInterne || null,
                            aggiornatoIl: ora,
                        }
                        : c
                )
            );
        } else {
            // Crea nuovo
            const maxNum = cantieri.length > 0
                ? Math.max(...cantieri.map((c) => {
                    const match = c.codice.match(/C-\d{4}-(\d+)/);
                    return match ? parseInt(match[1]) : 0;
                }))
                : 0;
            const anno = new Date().getFullYear();
            const nuovoCodice = `C-${anno}-${String(maxNum + 1).padStart(3, "0")}`;

            const nuovo: Cantiere = {
                id: `k${Date.now()}`,
                codice: nuovoCodice,
                clienteId: form.clienteId,
                tipoProdottoId: form.tipoProdottoId,
                statoId: form.statoId,
                indirizzoCantiere: form.indirizzoCantiere,
                cittaCantiere: form.cittaCantiere || null,
                importoTotale: form.importoTotale ? Number(form.importoTotale) : null,
                importoAcconto: form.importoAcconto ? Number(form.importoAcconto) : null,
                accontoPagato: form.accontoPagato,
                squadraId: form.squadraId || null,
                venditoreId: form.venditoreId || null,
                progettistaId: null,
                dataInizio: form.dataInizio || null,
                dataFinePrevista: form.dataFinePrevista || null,
                dataFineReale: null,
                noteInterne: form.noteInterne || null,
                googleCalendarEventId: null,
                googleDriveFolderId: null,
                creatoIl: ora,
                aggiornatoIl: ora,
                creatoDa: null,
            };
            setCantieri((prev) => [nuovo, ...prev]);
        }

        setIsSalvataggio(false);
        setPannelloAperto(false);
    };

    // === Colonne DataTable ===
    const colonne: ColumnDef<Cantiere, unknown>[] = [
        {
            id: "codice",
            accessorKey: "codice",
            header: "Codice",
            cell: ({ row }) => (
                <span className="font-mono text-xs font-bold text-[var(--pf-accent-primary)]">
                    {row.original.codice}
                </span>
            ),
        },
        {
            id: "cliente",
            header: "Cliente",
            accessorFn: (row) => getNomeCliente(row.clienteId),
            cell: ({ row }) => {
                const stato = getStato(row.original.statoId);
                return (
                    <div>
                        <p className="font-medium text-[var(--pf-text-primary)] text-sm">
                            {getNomeCliente(row.original.clienteId)}
                        </p>
                        {row.original.cittaCantiere && (
                            <p className="text-xs text-[var(--pf-text-muted)] mt-0.5 flex items-center gap-1">
                                <MapPin size={10} />
                                {row.original.cittaCantiere}
                            </p>
                        )}
                    </div>
                );
            },
        },
        {
            id: "tipoProdotto",
            header: "Prodotto",
            accessorFn: (row) => getTipoProdotto(row.tipoProdottoId),
            cell: ({ getValue }) => (
                <span className="text-sm text-[var(--pf-text-secondary)]">
                    {getValue() as string}
                </span>
            ),
        },
        {
            id: "stato",
            header: "Stato",
            accessorFn: (row) => getStato(row.statoId)?.label ?? "",
            cell: ({ row }) => {
                const stato = getStato(row.original.statoId);
                if (!stato) return null;
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${stato.colore} 18%, transparent)`,
                            color: stato.colore,
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stato.colore }} />
                        {stato.label}
                    </span>
                );
            },
        },
        {
            id: "importoTotale",
            header: "Importo",
            accessorFn: (row) => row.importoTotale ?? 0,
            cell: ({ row }) => (
                <span className="tabular-nums text-sm text-[var(--pf-text-secondary)]">
                    {formatValuta(row.original.importoTotale)}
                </span>
            ),
        },
        {
            id: "squadra",
            header: "Squadra",
            accessorFn: (row) => getSquadra(row.squadraId)?.nome ?? "",
            cell: ({ row }) => {
                const squadra = getSquadra(row.original.squadraId);
                if (!squadra) return <span className="text-[var(--pf-text-muted)] text-sm">—</span>;
                return (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--pf-text-secondary)]">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: squadra.colore ?? "#666" }} />
                        {squadra.nome}
                    </span>
                );
            },
        },
        {
            id: "dataInizio",
            header: "Inizio",
            accessorFn: (row) => row.dataInizio ?? "",
            cell: ({ row }) => (
                <span className="text-xs text-[var(--pf-text-muted)]">
                    {formatData(row.original.dataInizio)}
                </span>
            ),
        },
        {
            id: "azioni",
            header: "",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => router.push(`/cantieri/${row.original.id}`)}
                        title="Vai al dettaglio"
                        className="p-1.5 rounded-md hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <ExternalLink size={15} />
                    </button>
                    <button
                        onClick={(e) => apriModifica(row.original, e)}
                        title="Modifica"
                        className="p-1.5 rounded-md hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        onClick={(e) => eliminaCantiere(row.original.id, e)}
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

    // === Export dati ===
    const datiExport = cantieri.map((c) => ({
        codice: c.codice,
        cliente: getNomeCliente(c.clienteId),
        stato: getStato(c.statoId)?.label ?? "",
        tipoProdotto: getTipoProdotto(c.tipoProdottoId),
        importo: c.importoTotale ?? "",
        acconto: c.importoAcconto ?? "",
        accontoPagato: c.accontoPagato ? "Sì" : "No",
        indirizzo: c.indirizzoCantiere,
        citta: c.cittaCantiere ?? "",
        squadra: getSquadra(c.squadraId)?.nome ?? "",
        dataInizio: c.dataInizio ?? "",
        dataFinePrevista: c.dataFinePrevista ?? "",
    }));

    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "cliente", label: "Cliente" },
        { chiave: "stato", label: "Stato" },
        { chiave: "tipoProdotto", label: "Tipo Prodotto" },
        { chiave: "importo", label: "Importo (€)" },
        { chiave: "acconto", label: "Acconto (€)" },
        { chiave: "accontoPagato", label: "Acconto Pagato" },
        { chiave: "indirizzo", label: "Indirizzo" },
        { chiave: "citta", label: "Città" },
        { chiave: "squadra", label: "Squadra" },
        { chiave: "dataInizio", label: "Data Inizio" },
        { chiave: "dataFinePrevista", label: "Data Fine Prevista" },
    ];

    // === Riga espandibile mobile ===
    const rigaEspandibile = (c: Cantiere) => (
        <div className="grid grid-cols-2 gap-3 px-4 py-3 text-xs">
            <div>
                <p className="text-[var(--pf-text-muted)] mb-1">Prodotto</p>
                <p className="text-[var(--pf-text-secondary)]">{getTipoProdotto(c.tipoProdottoId)}</p>
            </div>
            <div>
                <p className="text-[var(--pf-text-muted)] mb-1">Importo</p>
                <p className="font-semibold text-[var(--pf-text-primary)]">{formatValuta(c.importoTotale)}</p>
            </div>
            <div>
                <p className="text-[var(--pf-text-muted)] mb-1">Squadra</p>
                <p className="text-[var(--pf-text-secondary)]">{getSquadra(c.squadraId)?.nome ?? "—"}</p>
            </div>
            <div>
                <p className="text-[var(--pf-text-muted)] mb-1">Data inizio</p>
                <p className="text-[var(--pf-text-secondary)]">{formatData(c.dataInizio)}</p>
            </div>
            {c.noteInterne && (
                <div className="col-span-2">
                    <p className="text-[var(--pf-text-muted)] mb-1">Note</p>
                    <p className="text-[var(--pf-text-secondary)]">{c.noteInterne}</p>
                </div>
            )}
            <div className="col-span-2 flex gap-2 pt-1">
                <button
                    onClick={() => router.push(`/cantieri/${c.id}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                >
                    <ExternalLink size={13} /> Dettaglio
                </button>
                <button
                    onClick={() => apriModifica(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                >
                    <Pencil size={13} /> Modifica
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
                        <HardHat size={28} className="text-[var(--pf-accent-primary)]" />
                        Cantieri
                    </h1>
                    <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                        {cantieri.length} cantier{cantieri.length === 1 ? "e" : "i"} totali
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportToolbar
                        dati={datiExport}
                        nomeFile="cantieri-export"
                        colonne={colonneExport}
                    />
                    <button
                        onClick={apriNuovo}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "var(--pf-accent-primary)" }}
                    >
                        <Plus size={16} />
                        Nuovo Cantiere
                    </button>
                </div>
            </div>

            {/* === TABELLA === */}
            <DataTable
                colonne={colonne}
                dati={cantieri}
                placeholderRicerca="Cerca per codice, cliente, città..."
                onClickRiga={(c) => router.push(`/cantieri/${c.id}`)}
                azioniHeader={
                    <ExportToolbar
                        dati={datiExport}
                        nomeFile="cantieri-export"
                        colonne={colonneExport}
                    />
                }
                getRowId={(c) => c.id}
                rigaEspandibile={rigaEspandibile}
                emptyState={
                    <div className="text-center py-12">
                        <HardHat size={40} className="mx-auto text-[var(--pf-text-muted)] mb-3" />
                        <p className="text-sm text-[var(--pf-text-secondary)]">Nessun cantiere trovato</p>
                        <p className="text-xs text-[var(--pf-text-muted)] mt-1">
                            Prova a modificare la ricerca o aggiungine uno nuovo
                        </p>
                    </div>
                }
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={modalitaModifica ? `Modifica ${cantiereCorrente?.codice}` : "Nuovo Cantiere"}
                sottotitolo={
                    modalitaModifica
                        ? `Modifica i dati del cantiere`
                        : "Inserisci i dati del nuovo cantiere"
                }
                icona={<HardHat size={18} />}
                coloreAccent="var(--pf-accent-primary)"
                onSalva={salva}
                isSalvataggio={isSalvataggio}
                larghezza="xl"
                labelSalva={modalitaModifica ? "Salva modifiche" : "Crea cantiere"}
            >
                {/* === Sezione 1: Cliente e Prodotto === */}
                <SezioneForm
                    titolo="Cliente e Prodotto"
                    descrizione="Associa il cantiere a un cliente e scegli il tipo di prodotto"
                >
                    <Campo label="Cliente" obbligatorio errore={errori.clienteId} fullWidth>
                        <SelectPf
                            value={form.clienteId}
                            onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}
                            hasError={!!errori.clienteId}
                            placeholder="— Seleziona cliente —"
                            opzioni={clientiDemo.map((c) => ({
                                value: c.id,
                                label: `${c.cognome} ${c.nome}`,
                            }))}
                        />
                    </Campo>
                    <Campo label="Tipo Prodotto" obbligatorio errore={errori.tipoProdottoId}>
                        <SelectPf
                            value={form.tipoProdottoId}
                            onChange={(e) => setForm((f) => ({ ...f, tipoProdottoId: e.target.value }))}
                            hasError={!!errori.tipoProdottoId}
                            placeholder="— Seleziona prodotto —"
                            opzioni={tipiProdottoDemo.map((t) => ({
                                value: t.id,
                                label: t.label,
                            }))}
                        />
                    </Campo>
                    <Campo label="Stato">
                        <SelectPf
                            value={form.statoId}
                            onChange={(e) => setForm((f) => ({ ...f, statoId: e.target.value }))}
                            opzioni={statiCantiereDemo.map((s) => ({
                                value: s.id,
                                label: s.label,
                                colore: s.colore,
                            }))}
                        />
                    </Campo>
                    <Campo label="Venditore">
                        <SelectPf
                            value={form.venditoreId}
                            onChange={(e) => setForm((f) => ({ ...f, venditoreId: e.target.value }))}
                            placeholder="— Nessun venditore —"
                            opzioni={venditoriDemo.map((v) => ({
                                value: v.id,
                                label: `${v.cognome} ${v.nome}`,
                            }))}
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 2: Localizzazione === */}
                <SezioneForm
                    titolo="Localizzazione"
                    descrizione="Indirizzo e città del cantiere"
                >
                    <Campo label="Indirizzo cantiere" obbligatorio errore={errori.indirizzoCantiere} fullWidth>
                        <InputPf
                            value={form.indirizzoCantiere}
                            onChange={(e) => setForm((f) => ({ ...f, indirizzoCantiere: e.target.value }))}
                            hasError={!!errori.indirizzoCantiere}
                            placeholder="Via Roma 42, Firenze"
                        />
                    </Campo>
                    <Campo label="Città">
                        <InputPf
                            value={form.cittaCantiere}
                            onChange={(e) => setForm((f) => ({ ...f, cittaCantiere: e.target.value }))}
                            placeholder="Firenze"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 3: Importi === */}
                <SezioneForm
                    titolo="Importi"
                    descrizione="Importo totale e acconto del cantiere"
                >
                    <Campo label="Importo totale (€)" errore={errori.importoTotale}>
                        <div className="relative">
                            <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" />
                            <InputPf
                                type="number"
                                value={form.importoTotale}
                                onChange={(e) => setForm((f) => ({ ...f, importoTotale: e.target.value }))}
                                hasError={!!errori.importoTotale}
                                placeholder="0"
                                className="pl-8"
                                min="0"
                                step="100"
                            />
                        </div>
                    </Campo>
                    <Campo label="Acconto (€)">
                        <div className="relative">
                            <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]" />
                            <InputPf
                                type="number"
                                value={form.importoAcconto}
                                onChange={(e) => setForm((f) => ({ ...f, importoAcconto: e.target.value }))}
                                placeholder="0"
                                className="pl-8"
                                min="0"
                                step="100"
                            />
                        </div>
                    </Campo>
                    <Campo label="Acconto pagato" fullWidth>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div
                                onClick={() => setForm((f) => ({ ...f, accontoPagato: !f.accontoPagato }))}
                                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${form.accontoPagato ? "bg-[var(--pf-accent-primary)]" : "bg-[var(--pf-border)]"}`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.accontoPagato ? "translate-x-5" : ""}`}
                                />
                            </div>
                            <span className="text-sm" style={{ color: form.accontoPagato ? "var(--pf-accent-primary)" : "var(--pf-text-muted)" }}>
                                {form.accontoPagato ? "Pagato" : "Non pagato"}
                            </span>
                        </label>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 4: Pianificazione === */}
                <SezioneForm
                    titolo="Pianificazione"
                    descrizione="Squadra e date di lavoro"
                >
                    <Campo label="Squadra" fullWidth>
                        <SelectPf
                            value={form.squadraId}
                            onChange={(e) => setForm((f) => ({ ...f, squadraId: e.target.value }))}
                            placeholder="— Nessuna squadra —"
                            opzioni={squadreDemo
                                .filter((s) => s.attiva)
                                .map((s) => ({ value: s.id, label: s.nome, colore: s.colore ?? undefined }))}
                        />
                    </Campo>
                    <Campo label="Data inizio">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <InputPf
                                type="date"
                                value={form.dataInizio}
                                onChange={(e) => setForm((f) => ({ ...f, dataInizio: e.target.value }))}
                                className="pl-8"
                            />
                        </div>
                    </Campo>
                    <Campo label="Data fine prevista">
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <InputPf
                                type="date"
                                value={form.dataFinePrevista}
                                onChange={(e) => setForm((f) => ({ ...f, dataFinePrevista: e.target.value }))}
                                className="pl-8"
                            />
                        </div>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 5: Note === */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                        Note interne
                    </h3>
                    <TextareaPf
                        value={form.noteInterne}
                        onChange={(e) => setForm((f) => ({ ...f, noteInterne: e.target.value }))}
                        placeholder="Note visibili solo al team interno..."
                        rows={4}
                    />
                </div>
            </PannelloCrud>
        </div>
    );
}
