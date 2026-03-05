// Pagina clienti — DataTable con sorting, filtri, CRUD via pannello laterale
"use client";

import { useState, useCallback } from "react";
import { Users, Plus, Pencil, Trash2, Phone, Mail } from "lucide-react";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import {
    PannelloCrud,
    SezioneForm,
    SeparatoreSezione,
    Campo,
    InputPf,
    TextareaPf,
} from "@/components/ui/pannello-crud";
import { DialogConferma } from "@/components/ui/dialog-conferma";
import { clientiDemo } from "@/lib/dati-mock";
import {
    useClienti,
    useCreaCliente,
    useAggiornaCliente,
    useEliminaCliente,
} from "@/hooks/use-clienti";
import type { Cliente } from "@/types";

// (le colonne vengono definite dentro il componente per accedere ai callbacks via closure)

// === COLONNE EXPORT ===

const colonneExport = [
    { chiave: "cognome", label: "Cognome" },
    { chiave: "nome", label: "Nome" },
    { chiave: "codiceFiscale", label: "Codice Fiscale" },
    { chiave: "email", label: "Email" },
    { chiave: "telefono", label: "Telefono" },
    { chiave: "indirizzo", label: "Indirizzo" },
    { chiave: "citta", label: "Città" },
    { chiave: "provincia", label: "Provincia" },
    { chiave: "cap", label: "CAP" },
];

// === STATO FORM ===

interface StatoForm {
    nome: string;
    cognome: string;
    codiceFiscale: string;
    telefono: string;
    email: string;
    indirizzo: string;
    citta: string;
    cap: string;
    provincia: string;
    iban: string;
    note: string;
}

const formVuoto: StatoForm = {
    nome: "",
    cognome: "",
    codiceFiscale: "",
    telefono: "",
    email: "",
    indirizzo: "",
    citta: "",
    cap: "",
    provincia: "",
    iban: "",
    note: "",
};

function clienteToForm(c: Cliente): StatoForm {
    return {
        nome: c.nome,
        cognome: c.cognome,
        codiceFiscale: c.codiceFiscale,
        telefono: c.telefono,
        email: c.email ?? "",
        indirizzo: c.indirizzo ?? "",
        citta: c.citta ?? "",
        cap: c.cap ?? "",
        provincia: c.provincia ?? "",
        iban: c.iban ?? "",
        note: c.note ?? "",
    };
}

// === PAGINA ===

export default function PaginaClienti() {
    // --- Hook dati reali n8n (fallback a mock se API non disponibile) ---
    const { clienti: clientiApi } = useClienti();
    const creaCliente = useCreaCliente();
    const aggiornaCliente = useAggiornaCliente();
    const eliminaCliente = useEliminaCliente();

    // Dati: usa API se disponibili, altrimenti mock
    const clienti = clientiApi.length > 0 ? clientiApi : clientiDemo;

    // Stato pannello CRUD
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [clienteInModifica, setClienteInModifica] = useState<Cliente | null>(null);
    const [form, setForm] = useState<StatoForm>(formVuoto);
    const [errori, setErrori] = useState<Partial<Record<keyof StatoForm, string>>>({});

    // Stato dialog eliminazione
    const [clientePerElimina, setClientePerElimina] = useState<Cliente | null>(null);

    const isSalvataggio = creaCliente.isPending || aggiornaCliente.isPending;
    const isEliminazione = eliminaCliente.isPending;

    // Colonne (definite dentro il componente per accesso ai callbacks via closure)
    const colonne: ColumnDef<Cliente, unknown>[] = [
        {
            id: "nome",
            accessorFn: (row) => `${row.cognome} ${row.nome}`,
            header: "Nome",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                            backgroundColor: "var(--pf-accent-primary-subtle)",
                            color: "var(--pf-accent-primary)",
                        }}
                    >
                        {row.original.nome[0]}{row.original.cognome[0]}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium truncate" style={{ color: "var(--pf-text-primary)" }}>
                            {row.original.cognome} {row.original.nome}
                        </p>
                        {row.original.citta && (
                            <p className="text-xs truncate" style={{ color: "var(--pf-text-muted)" }}>
                                {row.original.citta}{row.original.provincia ? ` (${row.original.provincia})` : ""}
                            </p>
                        )}
                    </div>
                </div>
            ),
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
                const v = getValue() as string;
                return (
                    <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                        <Phone size={12} className="flex-shrink-0" style={{ color: "var(--pf-text-muted)" }} />
                        {v}
                    </span>
                );
            },
        },
        {
            accessorKey: "codiceFiscale",
            header: "CF",
            cell: ({ getValue }) => {
                const v = getValue() as string;
                return (
                    <span
                        className="font-mono text-[11px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-muted)" }}
                    >
                        {v}
                    </span>
                );
            },
            meta: { nascostaMobile: true },
        },
        {
            accessorKey: "citta",
            header: "Città",
            cell: ({ getValue }) => (
                <span className="text-xs" style={{ color: "var(--pf-text-secondary)" }}>
                    {(getValue() as string | null) ?? "—"}
                </span>
            ),
            meta: { nascostaMobile: true },
        },
        {
            id: "azioni",
            header: "",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-1 justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            apriModifica(row.original);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                        title="Modifica"
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            avviaElimina(row.original);
                        }}
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

    // Aggiorna campo form
    const setCampo = useCallback(<K extends keyof StatoForm>(campo: K, valore: StatoForm[K]) => {
        setForm((prev) => ({ ...prev, [campo]: valore }));
        setErrori((prev) => ({ ...prev, [campo]: undefined }));
    }, []);

    // Apri pannello per nuovo cliente
    const apriNuovo = useCallback(() => {
        setClienteInModifica(null);
        setForm(formVuoto);
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // Apri pannello per modifica
    const apriModifica = useCallback((cliente: Cliente) => {
        setClienteInModifica(cliente);
        setForm(clienteToForm(cliente));
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // Avvia flusso eliminazione
    const avviaElimina = useCallback((cliente: Cliente) => {
        setClientePerElimina(cliente);
    }, []);

    // Conferma eliminazione
    const confermaElimina = useCallback(async () => {
        if (!clientePerElimina) return;
        try {
            await eliminaCliente.mutateAsync(clientePerElimina.id);
            setClientePerElimina(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [clientePerElimina, eliminaCliente]);

    // Valida form
    const valida = (): boolean => {
        const nuoviErrori: Partial<Record<keyof StatoForm, string>> = {};
        if (!form.nome.trim()) nuoviErrori.nome = "Nome obbligatorio";
        if (!form.cognome.trim()) nuoviErrori.cognome = "Cognome obbligatorio";
        if (!form.codiceFiscale.trim()) nuoviErrori.codiceFiscale = "CF obbligatorio";
        else if (form.codiceFiscale.length !== 16) nuoviErrori.codiceFiscale = "CF deve avere 16 caratteri";
        if (!form.telefono.trim()) nuoviErrori.telefono = "Telefono obbligatorio";
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            nuoviErrori.email = "Email non valida";
        if (form.cap && !/^\d{5}$/.test(form.cap)) nuoviErrori.cap = "CAP: 5 cifre";
        if (form.provincia && !/^[A-Za-z]{2}$/.test(form.provincia))
            nuoviErrori.provincia = "Provincia: 2 lettere";
        setErrori(nuoviErrori);
        return Object.keys(nuoviErrori).length === 0;
    };

    // Salva
    const gestisciSalva = useCallback(async () => {
        if (!valida()) return;
        const payload = {
            nome: form.nome,
            cognome: form.cognome,
            codiceFiscale: form.codiceFiscale,
            telefono: form.telefono,
            email: form.email || undefined,
            indirizzo: form.indirizzo || undefined,
            citta: form.citta || undefined,
            cap: form.cap || undefined,
            provincia: form.provincia || undefined,
            iban: form.iban || undefined,
            note: form.note || undefined,
        };
        try {
            if (clienteInModifica) {
                await aggiornaCliente.mutateAsync({ id: clienteInModifica.id, dati: payload });
            } else {
                await creaCliente.mutateAsync(payload);
            }
            setPannelloAperto(false);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [form, clienteInModifica, creaCliente, aggiornaCliente]);

    // Dettaglio mobile espandibile
    const rigaEspandibile = (cliente: Cliente) => (
        <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Email</span>
                <p style={{ color: "var(--pf-text-primary)" }}>{cliente.email ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>CF</span>
                <p className="font-mono" style={{ color: "var(--pf-text-primary)" }}>{cliente.codiceFiscale}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Indirizzo</span>
                <p style={{ color: "var(--pf-text-primary)" }}>{cliente.indirizzo ?? "—"}</p>
            </div>
            <div>
                <span style={{ color: "var(--pf-text-muted)" }}>Città</span>
                <p style={{ color: "var(--pf-text-primary)" }}>
                    {cliente.citta ?? "—"}{cliente.provincia ? ` (${cliente.provincia})` : ""}
                </p>
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
                        style={{ backgroundColor: "var(--pf-accent-primary-subtle)" }}
                    >
                        <Users size={20} style={{ color: "var(--pf-accent-primary)" }} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: "var(--pf-text-primary)" }}>
                            Clienti
                        </h1>
                        <p className="text-sm" style={{ color: "var(--pf-text-muted)" }}>
                            {clienti.length} client{clienti.length === 1 ? "e" : "i"} · anagrafica
                        </p>
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                colonne={colonne}
                dati={clienti}
                getRowId={(c) => c.id}
                placeholderRicerca="Cerca per nome, cognome, email, CF, città..."
                mostraToggleColonne
                rigaEspandibile={rigaEspandibile}
                azioniHeader={
                    <button
                        onClick={apriNuovo}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "var(--pf-accent-primary)" }}
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Nuovo Cliente</span>
                        <span className="sm:hidden">Nuovo</span>
                    </button>
                }
                toolbarExport={
                    <ExportToolbar
                        dati={clienti as unknown as Record<string, unknown>[]}
                        colonne={colonneExport}
                        nomeFile="clienti"
                    />
                }
            />

            {/* === DIALOG CONFERMA ELIMINAZIONE === */}
            <DialogConferma
                aperto={!!clientePerElimina}
                onChiudi={() => setClientePerElimina(null)}
                onConferma={confermaElimina}
                titolo="Elimina cliente"
                messaggio={
                    clientePerElimina
                        ? `Vuoi eliminare ${clientePerElimina.cognome} ${clientePerElimina.nome}? Questa azione non può essere annullata.`
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
                titolo={clienteInModifica ? "Modifica Cliente" : "Nuovo Cliente"}
                sottotitolo={
                    clienteInModifica
                        ? `${clienteInModifica.cognome} ${clienteInModifica.nome}`
                        : "Inserisci i dati del nuovo cliente"
                }
                icona={<Users size={18} />}
                onSalva={gestisciSalva}
                isSalvataggio={isSalvataggio}
                labelSalva={clienteInModifica ? "Aggiorna" : "Crea Cliente"}
            >
                {/* Sezione: Dati personali */}
                <SezioneForm titolo="Dati personali" descrizione="Nome, cognome e codice fiscale">
                    <Campo label="Nome" obbligatorio errore={errori.nome}>
                        <InputPf
                            value={form.nome}
                            onChange={(e) => setCampo("nome", e.target.value)}
                            placeholder="Mario"
                            hasError={!!errori.nome}
                        />
                    </Campo>
                    <Campo label="Cognome" obbligatorio errore={errori.cognome}>
                        <InputPf
                            value={form.cognome}
                            onChange={(e) => setCampo("cognome", e.target.value)}
                            placeholder="Rossi"
                            hasError={!!errori.cognome}
                        />
                    </Campo>
                    <Campo label="Codice Fiscale" obbligatorio errore={errori.codiceFiscale} fullWidth>
                        <InputPf
                            value={form.codiceFiscale}
                            onChange={(e) => setCampo("codiceFiscale", e.target.value.toUpperCase())}
                            placeholder="RSSMRA80A01H501A"
                            maxLength={16}
                            hasError={!!errori.codiceFiscale}
                            className="font-mono uppercase"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Sezione: Contatti */}
                <SezioneForm titolo="Contatti" descrizione="Telefono, email">
                    <Campo label="Telefono" obbligatorio errore={errori.telefono}>
                        <InputPf
                            value={form.telefono}
                            onChange={(e) => setCampo("telefono", e.target.value)}
                            placeholder="+39 055 123 4567"
                            type="tel"
                            hasError={!!errori.telefono}
                        />
                    </Campo>
                    <Campo label="Email" errore={errori.email}>
                        <InputPf
                            value={form.email}
                            onChange={(e) => setCampo("email", e.target.value)}
                            placeholder="mario.rossi@email.com"
                            type="email"
                            hasError={!!errori.email}
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Sezione: Indirizzo */}
                <SezioneForm titolo="Indirizzo" descrizione="Residenza o domicilio">
                    <Campo label="Indirizzo" fullWidth>
                        <InputPf
                            value={form.indirizzo}
                            onChange={(e) => setCampo("indirizzo", e.target.value)}
                            placeholder="Via Roma 1"
                        />
                    </Campo>
                    <Campo label="Città">
                        <InputPf
                            value={form.citta}
                            onChange={(e) => setCampo("citta", e.target.value)}
                            placeholder="Firenze"
                        />
                    </Campo>
                    <div className="grid grid-cols-2 gap-3">
                        <Campo label="CAP" errore={errori.cap}>
                            <InputPf
                                value={form.cap}
                                onChange={(e) => setCampo("cap", e.target.value)}
                                placeholder="50100"
                                maxLength={5}
                                hasError={!!errori.cap}
                                className="font-mono"
                            />
                        </Campo>
                        <Campo label="Provincia" errore={errori.provincia}>
                            <InputPf
                                value={form.provincia}
                                onChange={(e) => setCampo("provincia", e.target.value.toUpperCase())}
                                placeholder="FI"
                                maxLength={2}
                                hasError={!!errori.provincia}
                                className="font-mono uppercase"
                            />
                        </Campo>
                    </div>
                </SezioneForm>

                <SeparatoreSezione />

                {/* Sezione: Pagamento e note */}
                <SezioneForm titolo="Pagamento e note">
                    <Campo label="IBAN" fullWidth>
                        <InputPf
                            value={form.iban}
                            onChange={(e) => setCampo("iban", e.target.value.toUpperCase())}
                            placeholder="IT60X0542811101000000123456"
                            className="font-mono uppercase"
                        />
                    </Campo>
                    <Campo label="Note" fullWidth>
                        <TextareaPf
                            value={form.note}
                            onChange={(e) => setCampo("note", e.target.value)}
                            placeholder="Note aggiuntive sul cliente..."
                            rows={3}
                        />
                    </Campo>
                </SezioneForm>
            </PannelloCrud>
        </div>
    );
}
