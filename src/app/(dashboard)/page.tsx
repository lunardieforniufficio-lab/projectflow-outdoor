// Dashboard principale — panoramica generale cantieri
"use client";

import {
    HardHat,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import {
    dashboardStatsDemo,
    alertDemo,
    cantieriDemo,
    statiCantiereDemo,
    clientiDemo,
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

export default function PaginaDashboard() {
    const stats = dashboardStatsDemo;
    const alert = alertDemo;

    // Cantieri recenti (ultimi 5 per data creazione)
    const cantieriRecenti = [...cantieriDemo]
        .sort((a, b) => new Date(b.creatoIl).getTime() - new Date(a.creatoIl).getTime())
        .slice(0, 5);

    // Barra più larga per il conteggio massimo
    const maxConteggio = Math.max(
        ...stats.cantieriPerStato.map((s) => s.conteggio),
        1
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--pf-text-primary)]">
                    Dashboard
                </h1>
                <p className="text-sm text-[var(--pf-text-secondary)] mt-1">
                    Panoramica generale cantieri — Lunardi &amp; Forni
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    titolo="Cantieri Attivi"
                    valore={stats.cantieriAttivi}
                    descrizione="In lavorazione"
                    icona={HardHat}
                    coloreIcona="var(--pf-accent-primary)"
                    trend={{ valore: 12, positivo: true }}
                />
                <StatCard
                    titolo="Valore Totale"
                    valore={formatValuta(stats.valoreTotale)}
                    descrizione="Portfolio attivo"
                    icona={DollarSign}
                    coloreIcona="var(--pf-accent-blue)"
                />
                <StatCard
                    titolo="Alert Attivi"
                    valore={stats.alertAttivi}
                    descrizione={`${stats.cantieriInRitardo} in ritardo`}
                    icona={AlertTriangle}
                    coloreIcona="var(--pf-accent-yellow)"
                />
                <StatCard
                    titolo="Completati Mese"
                    valore={stats.completatiMese}
                    descrizione="Questo mese"
                    icona={CheckCircle}
                    coloreIcona="#22c55e"
                    trend={{ valore: 33, positivo: true }}
                />
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cantieri per stato — grafico barre */}
                <div className="lg:col-span-2 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-5">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
                            Cantieri per Stato
                        </h2>
                        <span className="text-xs text-[var(--pf-text-muted)]">
                            Distribuzione pipeline
                        </span>
                    </div>

                    <div className="space-y-3">
                        {stats.cantieriPerStato.map((item) => (
                            <div key={item.statoLabel} className="flex items-center gap-3">
                                <span className="text-xs font-medium text-[var(--pf-text-secondary)] w-20 text-right truncate">
                                    {item.statoLabel}
                                </span>
                                <div className="flex-1 h-7 rounded-md bg-[var(--pf-bg-elevated)] overflow-hidden">
                                    <div
                                        className="h-full rounded-md flex items-center px-2.5 transition-all duration-500 ease-out"
                                        style={{
                                            width: `${Math.max((item.conteggio / maxConteggio) * 100, 8)}%`,
                                            backgroundColor: `color-mix(in srgb, ${item.colore} 25%, transparent)`,
                                            borderLeft: `3px solid ${item.colore}`,
                                        }}
                                    >
                                        <span
                                            className="text-xs font-bold tabular-nums"
                                            style={{ color: item.colore }}
                                        >
                                            {item.conteggio}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alert attivi */}
                <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
                            Alert Attivi
                        </h2>
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--pf-accent-red)]/20 text-[10px] font-bold text-[var(--pf-accent-red)]">
                            {alert.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {alert.map((a) => (
                            <div
                                key={a.id}
                                className="p-3 rounded-lg border border-[var(--pf-border-light)] bg-[var(--pf-bg-elevated)] hover:border-[var(--pf-accent-yellow)]/30 transition-colors"
                            >
                                <div className="flex items-start gap-2">
                                    <div
                                        className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                a.gravita === "alta" || a.gravita === "critica"
                                                    ? "var(--pf-accent-red)"
                                                    : "var(--pf-accent-yellow)",
                                        }}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs text-[var(--pf-text-primary)] leading-relaxed">
                                            {a.messaggio}
                                        </p>
                                        {a.cantiereCodice && (
                                            <p className="text-[10px] font-mono text-[var(--pf-text-muted)] mt-1">
                                                {a.cantiereCodice}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {alert.length === 0 && (
                            <div className="text-center py-6">
                                <CheckCircle size={24} className="mx-auto text-emerald-500/50 mb-2" />
                                <p className="text-xs text-[var(--pf-text-muted)]">
                                    Nessun alert attivo
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cantieri recenti */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-[var(--pf-text-primary)]">
                        Cantieri Recenti
                    </h2>
                    <Link
                        href="/cantieri"
                        className="flex items-center gap-1 text-xs font-medium text-[var(--pf-accent-primary)] hover:underline"
                    >
                        Vedi tutti
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Tabella mini */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--pf-border)]">
                                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Codice
                                </th>
                                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th className="text-left py-2.5 px-3 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Stato
                                </th>
                                <th className="text-right py-2.5 px-3 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider">
                                    Importo
                                </th>
                                <th className="text-right py-2.5 px-3 text-xs font-medium text-[var(--pf-text-muted)] uppercase tracking-wider hidden sm:table-cell">
                                    Città
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cantieriRecenti.map((cantiere) => {
                                const stato = statiCantiereDemo.find((s) => s.id === cantiere.statoId);
                                const cliente = clientiDemo.find((c) => c.id === cantiere.clienteId);

                                return (
                                    <tr
                                        key={cantiere.id}
                                        className="border-b border-[var(--pf-border-light)] last:border-0 hover:bg-[var(--pf-bg-hover)] transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-3">
                                            <span className="font-mono text-xs font-semibold text-[var(--pf-text-primary)]">
                                                {cantiere.codice}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 text-[var(--pf-text-secondary)]">
                                            {cliente ? `${cliente.cognome} ${cliente.nome}` : "—"}
                                        </td>
                                        <td className="py-3 px-3">
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
                                                        style={{ backgroundColor: stato.colore }}
                                                    />
                                                    {stato.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-right tabular-nums text-[var(--pf-text-secondary)]">
                                            {cantiere.importoTotale
                                                ? formatValuta(cantiere.importoTotale)
                                                : "—"}
                                        </td>
                                        <td className="py-3 px-3 text-right text-[var(--pf-text-muted)] hidden sm:table-cell">
                                            {cantiere.cittaCantiere ?? "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
