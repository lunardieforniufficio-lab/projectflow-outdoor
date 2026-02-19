// Pagina lista cantieri — tabella con filtri, ricerca ed export
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    HardHat,
    Plus,
    Filter,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import {
    cantieriDemo,
    statiCantiereDemo,
    clientiDemo,
    tipiProdottoDemo,
    squadreDemo,
} from "@/lib/dati-mock";

/** Formatta importo in € italiano */
function formatValuta(valore: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valore);
}

/** Formatta data in formato italiano corto */
function formatData(iso: string | null): string {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(iso));
}

export default function PaginaCantieri() {
    const [ricerca, setRicerca] = useState("");
    const [filtroStato, setFiltroStato] = useState<string | null>(null);
    const [mostraFiltri, setMostraFiltri] = useState(false);

    // Filtro cantieri
    const cantieriFiltrati = useMemo(() => {
        let risultati = [...cantieriDemo];

        // Filtro per stato
        if (filtroStato) {
            risultati = risultati.filter((c) => c.statoId === filtroStato);
        }

        // Filtro per ricerca (codice, cliente, città)
        if (ricerca.trim()) {
            const query = ricerca.toLowerCase();
            risultati = risultati.filter((c) => {
                const cliente = clientiDemo.find((cl) => cl.id === c.clienteId);
                const nomeCliente = cliente
                    ? `${cliente.nome} ${cliente.cognome}`.toLowerCase()
                    : "";
                return (
                    c.codice.toLowerCase().includes(query) ||
                    nomeCliente.includes(query) ||
                    (c.cittaCantiere?.toLowerCase().includes(query) ?? false)
                );
            });
        }

        return risultati;
    }, [ricerca, filtroStato]);

    // Dati per export
    const datiExport = cantieriFiltrati.map((c) => {
        const cliente = clientiDemo.find((cl) => cl.id === c.clienteId);
        const stato = statiCantiereDemo.find((s) => s.id === c.statoId);
        const tipo = tipiProdottoDemo.find((t) => t.id === c.tipoProdottoId);
        const squadra = squadreDemo.find((s) => s.id === c.squadraId);

        return {
            codice: c.codice,
            cliente: cliente ? `${cliente.cognome} ${cliente.nome}` : "",
            stato: stato?.label ?? "",
            tipoProdotto: tipo?.label ?? "",
            importo: c.importoTotale ?? 0,
            acconto: c.importoAcconto ?? 0,
            indirizzo: c.indirizzoCantiere,
            citta: c.cittaCantiere ?? "",
            squadra: squadra?.nome ?? "",
            dataInizio: c.dataInizio ?? "",
            dataFinePrevista: c.dataFinePrevista ?? "",
        };
    });

    const colonneExport = [
        { chiave: "codice", label: "Codice" },
        { chiave: "cliente", label: "Cliente" },
        { chiave: "stato", label: "Stato" },
        { chiave: "tipoProdotto", label: "Tipo Prodotto" },
        { chiave: "importo", label: "Importo (€)" },
        { chiave: "acconto", label: "Acconto (€)" },
        { chiave: "indirizzo", label: "Indirizzo" },
        { chiave: "citta", label: "Città" },
        { chiave: "squadra", label: "Squadra" },
        { chiave: "dataInizio", label: "Data Inizio" },
        { chiave: "dataFinePrevista", label: "Data Fine Prevista" },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--pf-text-primary)] flex items-center gap-3">
                        <HardHat
                            size={28}
                            className="text-[var(--pf-accent-primary)]"
                        />
                        Cantieri
                    </h1>
                    <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                        {cantieriFiltrati.length} cantier{cantieriFiltrati.length === 1 ? "e" : "i"}
                        {filtroStato && " (filtrati)"}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <ExportToolbar
                        dati={datiExport}
                        nomeFile="cantieri-export"
                        colonne={colonneExport}
                    />
                    <Button
                        className="gap-2"
                        style={{
                            backgroundColor: "var(--pf-accent-primary)",
                            color: "white",
                        }}
                    >
                        <Plus size={18} />
                        Nuovo Cantiere
                    </Button>
                </div>
            </div>

            {/* Barra ricerca + filtri */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pf-text-muted)]"
                    />
                    <input
                        type="text"
                        value={ricerca}
                        onChange={(e) => setRicerca(e.target.value)}
                        placeholder="Cerca per codice, cliente, città..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[var(--pf-bg-surface)] border border-[var(--pf-border)] text-sm text-[var(--pf-text-primary)] placeholder:text-[var(--pf-text-muted)] focus:outline-none focus:border-[var(--pf-accent-primary)] transition-colors"
                    />
                </div>

                {/* Toggle filtri */}
                <button
                    onClick={() => setMostraFiltri(!mostraFiltri)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${mostraFiltri || filtroStato
                        ? "border-[var(--pf-accent-primary)] text-[var(--pf-accent-primary)] bg-[var(--pf-accent-primary-subtle)]"
                        : "border-[var(--pf-border)] text-[var(--pf-text-secondary)] hover:border-[var(--pf-text-muted)]"
                        }`}
                >
                    <Filter size={16} />
                    Filtri
                    {filtroStato && (
                        <span className="ml-1 w-5 h-5 rounded-full bg-[var(--pf-accent-primary)] text-white text-xs flex items-center justify-center font-bold">
                            1
                        </span>
                    )}
                </button>
            </div>

            {/* Pannello filtri */}
            {mostraFiltri && (
                <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-[var(--pf-text-muted)] uppercase tracking-wider">
                            Filtra per stato
                        </span>
                        {filtroStato && (
                            <button
                                onClick={() => setFiltroStato(null)}
                                className="text-xs text-[var(--pf-accent-primary)] hover:underline"
                            >
                                Rimuovi filtro
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {statiCantiereDemo.map((stato) => (
                            <button
                                key={stato.id}
                                onClick={() =>
                                    setFiltroStato(
                                        filtroStato === stato.id ? null : stato.id
                                    )
                                }
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${filtroStato === stato.id
                                    ? "ring-2 ring-offset-1 ring-offset-[var(--pf-bg-surface)]"
                                    : "opacity-70 hover:opacity-100"
                                    }`}
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${stato.colore} 15%, transparent)`,
                                    color: stato.colore,
                                    ...(filtroStato === stato.id
                                        ? { ringColor: stato.colore }
                                        : {}),
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ backgroundColor: stato.colore }}
                                />
                                {stato.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabella cantieri */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--pf-border)] bg-[var(--pf-bg-elevated)]">
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Codice
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider hidden md:table-cell">
                                    Prodotto
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Stato
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider hidden sm:table-cell">
                                    Importo
                                </th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider hidden lg:table-cell">
                                    Squadra
                                </th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider hidden xl:table-cell">
                                    Data Inizio
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cantieriFiltrati.map((cantiere) => {
                                const stato = statiCantiereDemo.find(
                                    (s) => s.id === cantiere.statoId
                                );
                                const cliente = clientiDemo.find(
                                    (c) => c.id === cantiere.clienteId
                                );
                                const tipo = tipiProdottoDemo.find(
                                    (t) => t.id === cantiere.tipoProdottoId
                                );
                                const squadra = squadreDemo.find(
                                    (s) => s.id === cantiere.squadraId
                                );

                                return (
                                    <tr
                                        key={cantiere.id}
                                        className="border-b border-[var(--pf-border-light)] last:border-0 hover:bg-[var(--pf-bg-hover)] transition-colors cursor-pointer group"
                                    >
                                        <td className="py-3.5 px-4">
                                            <span className="font-mono text-xs font-bold text-[var(--pf-accent-primary)] group-hover:underline">
                                                {cantiere.codice}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div>
                                                <p className="font-medium text-[var(--pf-text-primary)]">
                                                    {cliente
                                                        ? `${cliente.cognome} ${cliente.nome}`
                                                        : "—"}
                                                </p>
                                                <p className="text-xs text-[var(--pf-text-muted)] mt-0.5">
                                                    {cantiere.cittaCantiere ?? ""}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-[var(--pf-text-secondary)] hidden md:table-cell">
                                            {tipo?.label ?? "—"}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {stato && (
                                                <span
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                                                    style={{
                                                        backgroundColor: `color-mix(in srgb, ${stato.colore} 15%, transparent)`,
                                                        color: stato.colore,
                                                    }}
                                                >
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full"
                                                        style={{
                                                            backgroundColor: stato.colore,
                                                        }}
                                                    />
                                                    {stato.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right tabular-nums text-[var(--pf-text-secondary)] hidden sm:table-cell">
                                            {cantiere.importoTotale
                                                ? formatValuta(cantiere.importoTotale)
                                                : "—"}
                                        </td>
                                        <td className="py-3.5 px-4 hidden lg:table-cell">
                                            {squadra ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--pf-text-secondary)]">
                                                    <span
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            backgroundColor: squadra.colore ?? "#666",
                                                        }}
                                                    />
                                                    {squadra.nome}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-[var(--pf-text-muted)]">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-right text-xs text-[var(--pf-text-muted)] hidden xl:table-cell">
                                            {formatData(cantiere.dataInizio)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {cantieriFiltrati.length === 0 && (
                    <div className="text-center py-12">
                        <HardHat
                            size={40}
                            className="mx-auto text-[var(--pf-text-muted)] mb-3"
                        />
                        <p className="text-sm text-[var(--pf-text-secondary)]">
                            Nessun cantiere trovato
                        </p>
                        <p className="text-xs text-[var(--pf-text-muted)] mt-1">
                            Prova a modificare i filtri di ricerca
                        </p>
                    </div>
                )}
            </div>

            {/* Footer conteggio */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--pf-text-muted)]">
                    Mostrando {cantieriFiltrati.length} di {cantieriDemo.length} cantieri
                </p>
            </div>
        </div>
    );
}
