// Cantiere Info — griglia informazioni cantiere
"use client";

import { cn } from "@/lib/utils";
import {
    MapPin,
    Calendar,
    Phone,
    Mail,
    CreditCard,
    User,
    Users,
    FileText,
} from "lucide-react";
import type { CantiereDettaglio } from "@/types";

interface CantiereInfoProps {
    /** Cantiere con relazioni */
    cantiere: CantiereDettaglio;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Formatta importo in € italiano */
function formatValuta(valore: number): string {
    return new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(valore);
}

/** Formatta data ISO in formato italiano */
function formatData(iso: string | null): string {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date(iso));
}

/** Singola riga info */
function RigaInfo({
    icona,
    label,
    valore,
    coloreValore,
}: {
    icona: React.ReactNode;
    label: string;
    valore: string;
    coloreValore?: string;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5">
            <span className="text-[var(--pf-text-muted)] flex-shrink-0 mt-0.5">
                {icona}
            </span>
            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--pf-text-muted)]">
                    {label}
                </p>
                <p
                    className="text-sm text-[var(--pf-text-primary)] mt-0.5"
                    style={coloreValore ? { color: coloreValore } : undefined}
                >
                    {valore}
                </p>
            </div>
        </div>
    );
}

/** Griglia informazioni del cantiere organizzata in card */
export function CantiereInfo({ cantiere, className }: CantiereInfoProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
            {/* Card Cliente */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-3">
                    Cliente
                </h3>
                <RigaInfo
                    icona={<User size={14} />}
                    label="Nome"
                    valore={`${cantiere.cliente.nome} ${cantiere.cliente.cognome}`}
                />
                <RigaInfo
                    icona={<Phone size={14} />}
                    label="Telefono"
                    valore={cantiere.cliente.telefono}
                />
                {cantiere.cliente.email && (
                    <RigaInfo
                        icona={<Mail size={14} />}
                        label="Email"
                        valore={cantiere.cliente.email}
                    />
                )}
            </div>

            {/* Card Economica */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-3">
                    Dati Economici
                </h3>
                <RigaInfo
                    icona={<CreditCard size={14} />}
                    label="Importo totale"
                    valore={
                        cantiere.importoTotale
                            ? formatValuta(cantiere.importoTotale)
                            : "Da definire"
                    }
                />
                <RigaInfo
                    icona={<CreditCard size={14} />}
                    label="Acconto"
                    valore={
                        cantiere.importoAcconto
                            ? `${formatValuta(cantiere.importoAcconto)} ${cantiere.accontoPagato ? "✓ Pagato" : "⏳ In attesa"}`
                            : "—"
                    }
                    coloreValore={
                        cantiere.accontoPagato
                            ? "var(--pf-accent-primary)"
                            : "var(--pf-accent-yellow)"
                    }
                />
                <RigaInfo
                    icona={<FileText size={14} />}
                    label="Tipo Prodotto"
                    valore={cantiere.tipoProdotto.label}
                />
            </div>

            {/* Card Logistica */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-3">
                    Logistica
                </h3>
                <RigaInfo
                    icona={<MapPin size={14} />}
                    label="Indirizzo cantiere"
                    valore={cantiere.indirizzoCantiere}
                />
                {cantiere.squadra && (
                    <RigaInfo
                        icona={<Users size={14} />}
                        label="Squadra"
                        valore={cantiere.squadra.nome}
                    />
                )}
                {cantiere.venditore && (
                    <RigaInfo
                        icona={<User size={14} />}
                        label="Venditore"
                        valore={`${cantiere.venditore.nome} ${cantiere.venditore.cognome}`}
                    />
                )}
            </div>

            {/* Card Date */}
            <div className="rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-3">
                    Tempistiche
                </h3>
                <RigaInfo
                    icona={<Calendar size={14} />}
                    label="Data inizio"
                    valore={formatData(cantiere.dataInizio)}
                />
                <RigaInfo
                    icona={<Calendar size={14} />}
                    label="Fine prevista"
                    valore={formatData(cantiere.dataFinePrevista)}
                />
                <RigaInfo
                    icona={<Calendar size={14} />}
                    label="Fine reale"
                    valore={formatData(cantiere.dataFineReale)}
                />
            </div>

            {/* Note interne (span completo) */}
            {cantiere.noteInterne && (
                <div className="md:col-span-2 rounded-xl border border-[var(--pf-border)] bg-[var(--pf-bg-surface)] p-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--pf-text-muted)] mb-2">
                        Note Interne
                    </h3>
                    <p className="text-sm text-[var(--pf-text-primary)] leading-relaxed">
                        {cantiere.noteInterne}
                    </p>
                </div>
            )}
        </div>
    );
}
