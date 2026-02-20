// Pagina Organigramma — gestione utenti con DataTable + PannelloCrud
"use client";

import { useState, useCallback } from "react";
import {
    UsersRound,
    Plus,
    Pencil,
    Trash2,
    Mail,
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
    SelectPf,
} from "@/components/ui/pannello-crud";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { BadgeStato } from "@/components/ui/badge-stato";
import { DialogConferma } from "@/components/ui/dialog-conferma";
import { utentiDemo, ruoliDemo, areeDemo } from "@/lib/dati-mock";
import { useUtenti, useCreaUtente, useAggiornaUtente, useEliminaUtente } from "@/hooks/use-utenti";
import type { UtenteDettaglio } from "@/types";

// === Tipo form ===
interface FormUtente {
    nome: string;
    cognome: string;
    emailAziendale: string;
    whatsapp: string;
    ruoloId: string;
    areaId: string;
    attivo: boolean;
}

interface ErroriForm {
    nome?: string;
    cognome?: string;
    emailAziendale?: string;
    ruoloId?: string;
}

const formVuoto: FormUtente = {
    nome: "",
    cognome: "",
    emailAziendale: "",
    whatsapp: "",
    ruoloId: "",
    areaId: "",
    attivo: true,
};

export default function PaginaOrganigramma() {
    // --- Hook dati reali n8n (fallback a mock se API non disponibile) ---
    const { utenti: utentiApi } = useUtenti();
    const creaUtente = useCreaUtente();
    const aggiornaUtente = useAggiornaUtente();
    const eliminaUtente = useEliminaUtente();

    // Dati: usa API se disponibili, altrimenti mock
    const utenti = utentiApi.length > 0 ? utentiApi : utentiDemo;

    // --- Pannello CRUD ---
    const [pannelloAperto, setPannelloAperto] = useState(false);
    const [modalitaModifica, setModalitaModifica] = useState(false);
    const [utenteCorrente, setUtenteCorrente] = useState<UtenteDettaglio | null>(null);
    const [form, setForm] = useState<FormUtente>(formVuoto);
    const [errori, setErrori] = useState<ErroriForm>({});
    const isSalvataggio = creaUtente.isPending || aggiornaUtente.isPending;

    // --- Helpers ---
    const getRuolo = (id: string) => ruoliDemo.find((r) => r.id === id);
    const getArea = (id: string) => areeDemo.find((a) => a.id === id);

    // === Apri pannello nuovo utente ===
    const apriNuovo = useCallback(() => {
        setUtenteCorrente(null);
        setModalitaModifica(false);
        setForm(formVuoto);
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // === Apri pannello modifica ===
    const apriModifica = useCallback((utente: UtenteDettaglio, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setUtenteCorrente(utente);
        setModalitaModifica(true);
        setForm({
            nome: utente.nome,
            cognome: utente.cognome,
            emailAziendale: utente.emailAziendale ?? "",
            whatsapp: utente.whatsapp ?? "",
            ruoloId: utente.ruoloId,
            areaId: utente.areaId ?? "",
            attivo: utente.attivo,
        });
        setErrori({});
        setPannelloAperto(true);
    }, []);

    // Dialog conferma disattivazione
    const [utentePerDisattiva, setUtentePerDisattiva] = useState<UtenteDettaglio | null>(null);

    // === Disattiva (non elimina fisicamente) ===
    const avviaDisattiva = useCallback((utente: UtenteDettaglio, e: React.MouseEvent) => {
        e.stopPropagation();
        setUtentePerDisattiva(utente);
    }, []);

    const confermaDisattiva = useCallback(async () => {
        if (!utentePerDisattiva) return;
        try {
            await aggiornaUtente.mutateAsync({
                id: utentePerDisattiva.id,
                dati: { attivo: false },
            });
            setUtentePerDisattiva(null);
        } catch {
            // errore gestito da TanStack Query
        }
    }, [utentePerDisattiva, aggiornaUtente]);

    // === Validazione form ===
    const valida = (): boolean => {
        const nuovi: ErroriForm = {};
        if (!form.nome.trim()) nuovi.nome = "Nome obbligatorio";
        if (!form.cognome.trim()) nuovi.cognome = "Cognome obbligatorio";
        if (!form.ruoloId) nuovi.ruoloId = "Seleziona un ruolo";
        if (form.emailAziendale && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAziendale))
            nuovi.emailAziendale = "Email non valida";
        setErrori(nuovi);
        return Object.keys(nuovi).length === 0;
    };

    // === Salva utente ===
    const salva = async () => {
        if (!valida()) return;
        const payload = {
            nome: form.nome.trim(),
            cognome: form.cognome.trim(),
            emailAziendale: form.emailAziendale.trim() || undefined,
            whatsapp: form.whatsapp.trim() || undefined,
            ruoloId: form.ruoloId,
            areaId: form.areaId || undefined,
            attivo: form.attivo,
        };
        try {
            if (modalitaModifica && utenteCorrente) {
                await aggiornaUtente.mutateAsync({ id: utenteCorrente.id, dati: payload });
            } else {
                await creaUtente.mutateAsync({ ...payload, clerkUserId: `clerk_pending_${Date.now()}` });
            }
            setPannelloAperto(false);
        } catch {
            // errore gestito da TanStack Query
        }
    };

    // === Colonne DataTable ===
    const colonne: ColumnDef<UtenteDettaglio, unknown>[] = [
        {
            id: "nome",
            header: "Utente",
            accessorFn: (row) => `${row.cognome} ${row.nome}`,
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: row.original.ruolo.colore ?? "#666" }}
                    >
                        {row.original.nome[0]}{row.original.cognome[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-[var(--pf-text-primary)]">
                            {row.original.nome} {row.original.cognome}
                        </p>
                        {row.original.emailAziendale && (
                            <p className="text-xs text-[var(--pf-text-muted)] flex items-center gap-1 mt-0.5">
                                <Mail size={10} />
                                {row.original.emailAziendale}
                            </p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "ruolo",
            header: "Ruolo",
            accessorFn: (row) => row.ruolo.label,
            cell: ({ row }) => (
                <BadgeStato
                    label={row.original.ruolo.label}
                    colore={row.original.ruolo.colore ?? "#666"}
                    dimensione="sm"
                />
            ),
        },
        {
            id: "area",
            header: "Area",
            accessorFn: (row) => row.area?.label ?? "",
            cell: ({ row }) => (
                <span className="text-xs text-[var(--pf-text-muted)]">
                    {row.original.area?.label ?? "—"}
                </span>
            ),
        },
        {
            id: "whatsapp",
            header: "WhatsApp",
            accessorFn: (row) => row.whatsapp ?? "",
            cell: ({ row }) =>
                row.original.whatsapp ? (
                    <span className="text-xs text-[var(--pf-text-secondary)] flex items-center gap-1">
                        <Phone size={11} />
                        {row.original.whatsapp}
                    </span>
                ) : (
                    <span className="text-xs text-[var(--pf-text-muted)]">—</span>
                ),
        },
        {
            id: "stato",
            header: "Stato",
            accessorFn: (row) => (row.attivo ? "Attivo" : "Inattivo"),
            cell: ({ row }) => (
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{
                        backgroundColor: row.original.attivo
                            ? "rgba(27, 140, 58, 0.12)"
                            : "rgba(239, 68, 68, 0.12)",
                        color: row.original.attivo ? "#1B8C3A" : "#ef4444",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: row.original.attivo ? "#1B8C3A" : "#ef4444" }}
                    />
                    {row.original.attivo ? "Attivo" : "Inattivo"}
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
                        onClick={(e) => apriModifica(row.original, e)}
                        title="Modifica"
                        className="p-1.5 rounded-md hover:bg-[var(--pf-bg-hover)] transition-colors"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <Pencil size={15} />
                    </button>
                    {row.original.attivo && (
                        <button
                            onClick={(e) => avviaDisattiva(row.original, e)}
                            title="Disattiva"
                            className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                            style={{ color: "#ef4444" }}
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    // === Export ===
    const datiExport = utenti.map((u) => ({
        nome: u.nome,
        cognome: u.cognome,
        email: u.emailAziendale ?? "",
        whatsapp: u.whatsapp ?? "",
        ruolo: u.ruolo.label,
        area: u.area?.label ?? "",
        stato: u.attivo ? "Attivo" : "Inattivo",
    }));

    const colonneExport = [
        { chiave: "cognome", label: "Cognome" },
        { chiave: "nome", label: "Nome" },
        { chiave: "email", label: "Email" },
        { chiave: "whatsapp", label: "WhatsApp" },
        { chiave: "ruolo", label: "Ruolo" },
        { chiave: "area", label: "Area" },
        { chiave: "stato", label: "Stato" },
    ];

    // === Riga espandibile mobile ===
    const rigaEspandibile = (u: UtenteDettaglio) => (
        <div className="px-4 py-3 text-xs space-y-2">
            {u.emailAziendale && (
                <div className="flex items-center gap-2">
                    <Mail size={12} className="text-[var(--pf-text-muted)]" />
                    <span className="text-[var(--pf-text-secondary)]">{u.emailAziendale}</span>
                </div>
            )}
            {u.whatsapp && (
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[var(--pf-text-muted)]" />
                    <span className="text-[var(--pf-text-secondary)]">{u.whatsapp}</span>
                </div>
            )}
            <div className="flex gap-2 pt-1">
                <button
                    onClick={() => apriModifica(u)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: "var(--pf-bg-hover)", color: "var(--pf-text-secondary)" }}
                >
                    <Pencil size={12} /> Modifica
                </button>
            </div>
        </div>
    );

    // === Raggruppamento per area (per visualizzazione org) ===
    const utentiAttivi = utenti.filter((u) => u.attivo).length;

    return (
        <div className="space-y-6">
            {/* === HEADER === */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] flex items-center gap-3">
                        <UsersRound size={28} className="text-[#3b82f6]" />
                        Organigramma
                    </h1>
                    <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                        {utentiAttivi} attivi · {utenti.length} totali
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportToolbar
                        dati={datiExport}
                        nomeFile="organigramma-export"
                        colonne={colonneExport}
                    />
                    <button
                        onClick={apriNuovo}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{ backgroundColor: "#3b82f6" }}
                    >
                        <Plus size={16} />
                        Nuovo Utente
                    </button>
                </div>
            </div>

            {/* === TABELLA === */}
            <DataTable
                colonne={colonne}
                dati={utenti}
                placeholderRicerca="Cerca per nome, email, ruolo, area..."
                onClickRiga={(u) => apriModifica(u)}
                getRowId={(u) => u.id}
                rigaEspandibile={rigaEspandibile}
                emptyState={
                    <div className="text-center py-12">
                        <UsersRound size={40} className="mx-auto text-[var(--pf-text-muted)] mb-3" />
                        <p className="text-sm text-[var(--pf-text-secondary)]">Nessun utente trovato</p>
                    </div>
                }
            />

            {/* === DIALOG CONFERMA DISATTIVAZIONE === */}
            <DialogConferma
                aperto={!!utentePerDisattiva}
                onChiudi={() => setUtentePerDisattiva(null)}
                onConferma={confermaDisattiva}
                titolo="Disattiva utente"
                messaggio={
                    utentePerDisattiva
                        ? `Vuoi disattivare ${utentePerDisattiva.nome} ${utentePerDisattiva.cognome}? L'utente non potrà più accedere al sistema.`
                        : ""
                }
                labelConferma="Disattiva"
                tipo="avviso"
                isCaricamento={aggiornaUtente.isPending}
            />

            {/* === PANNELLO CRUD === */}
            <PannelloCrud
                aperto={pannelloAperto}
                onChiudi={() => setPannelloAperto(false)}
                titolo={
                    modalitaModifica
                        ? `Modifica ${utenteCorrente?.nome} ${utenteCorrente?.cognome}`
                        : "Nuovo Utente"
                }
                sottotitolo={
                    modalitaModifica
                        ? "Modifica ruolo, area e contatti"
                        : "Aggiungi un nuovo membro all'organigramma"
                }
                icona={<UsersRound size={18} />}
                coloreAccent="#3b82f6"
                onSalva={salva}
                isSalvataggio={isSalvataggio}
                larghezza="md"
                labelSalva={modalitaModifica ? "Salva modifiche" : "Crea utente"}
            >
                {/* === Sezione 1: Dati anagrafici === */}
                <SezioneForm
                    titolo="Dati anagrafici"
                    descrizione="Nome e cognome del collaboratore"
                >
                    <Campo label="Nome" obbligatorio errore={errori.nome}>
                        <InputPf
                            value={form.nome}
                            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                            hasError={!!errori.nome}
                            placeholder="Mario"
                            autoFocus
                        />
                    </Campo>
                    <Campo label="Cognome" obbligatorio errore={errori.cognome}>
                        <InputPf
                            value={form.cognome}
                            onChange={(e) => setForm((f) => ({ ...f, cognome: e.target.value }))}
                            hasError={!!errori.cognome}
                            placeholder="Rossi"
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 2: Ruolo e Area === */}
                <SezioneForm
                    titolo="Ruolo e area"
                    descrizione="Assegna il ruolo aziendale e l'area di competenza"
                >
                    <Campo label="Ruolo" obbligatorio errore={errori.ruoloId} fullWidth>
                        <SelectPf
                            value={form.ruoloId}
                            onChange={(e) => setForm((f) => ({ ...f, ruoloId: e.target.value }))}
                            hasError={!!errori.ruoloId}
                            placeholder="— Seleziona ruolo —"
                            opzioni={ruoliDemo
                                .filter((r) => r.attivo)
                                .sort((a, b) => a.ordine - b.ordine)
                                .map((r) => ({
                                    value: r.id,
                                    label: r.label,
                                    colore: r.colore ?? undefined,
                                }))}
                        />
                    </Campo>
                    {/* Preview badge ruolo */}
                    {form.ruoloId && (() => {
                        const r = getRuolo(form.ruoloId);
                        return r ? (
                            <div className="sm:col-span-2 flex items-center gap-2">
                                <span
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{
                                        backgroundColor: `color-mix(in srgb, ${r.colore ?? "#666"} 15%, transparent)`,
                                        color: r.colore ?? "#666",
                                    }}
                                >
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.colore ?? "#666" }} />
                                    {r.label}
                                </span>
                                <span className="text-xs text-[var(--pf-text-muted)]">{r.descrizione}</span>
                            </div>
                        ) : null;
                    })()}
                    <Campo label="Area aziendale" fullWidth>
                        <SelectPf
                            value={form.areaId}
                            onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
                            placeholder="— Seleziona area —"
                            opzioni={areeDemo.map((a) => ({
                                value: a.id,
                                label: a.label,
                            }))}
                        />
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 3: Contatti === */}
                <SezioneForm
                    titolo="Contatti"
                    descrizione="Email aziendale e numero WhatsApp"
                >
                    <Campo label="Email aziendale" errore={errori.emailAziendale} fullWidth>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <InputPf
                                type="email"
                                value={form.emailAziendale}
                                onChange={(e) => setForm((f) => ({ ...f, emailAziendale: e.target.value }))}
                                hasError={!!errori.emailAziendale}
                                placeholder="nome@lunardieforni.it"
                                className="pl-8"
                            />
                        </div>
                    </Campo>
                    <Campo label="WhatsApp" fullWidth>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)] pointer-events-none" />
                            <InputPf
                                type="tel"
                                value={form.whatsapp}
                                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                                placeholder="+39 333 1234567"
                                className="pl-8"
                            />
                        </div>
                    </Campo>
                </SezioneForm>

                <SeparatoreSezione />

                {/* === Sezione 4: Stato === */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold" style={{ color: "var(--pf-text-primary)" }}>
                        Stato account
                    </h3>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <p className="text-sm font-medium" style={{ color: "var(--pf-text-primary)" }}>
                                Utente attivo
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                                Gli utenti inattivi non possono accedere al sistema
                            </p>
                        </div>
                        <div
                            onClick={() => setForm((f) => ({ ...f, attivo: !f.attivo }))}
                            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ml-4 flex-shrink-0 ${form.attivo ? "bg-[#3b82f6]" : "bg-[var(--pf-border)]"}`}
                        >
                            <div
                                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.attivo ? "translate-x-5" : ""}`}
                            />
                        </div>
                    </label>
                </div>
            </PannelloCrud>
        </div>
    );
}
