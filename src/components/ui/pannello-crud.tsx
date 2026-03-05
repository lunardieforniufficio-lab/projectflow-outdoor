// PannelloCrud — pannello laterale (Sheet) per form CRUD
// Scorre da destra, 60% desktop / full mobile, header sticky
"use client";

import { type ReactNode } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PannelloCrudProps {
    /** Pannello aperto o chiuso */
    aperto: boolean;
    /** Callback chiusura */
    onChiudi: () => void;
    /** Titolo del pannello (es. "Nuovo Cliente", "Modifica Cantiere") */
    titolo: string;
    /** Sottotitolo opzionale */
    sottotitolo?: string;
    /** Icona nell'header */
    icona?: ReactNode;
    /** Colore accent per l'icona */
    coloreAccent?: string;
    /** Contenuto del form */
    children: ReactNode;
    /** Testo bottone salva */
    labelSalva?: string;
    /** Callback salvataggio */
    onSalva?: () => void;
    /** Loading durante salvataggio */
    isSalvataggio?: boolean;
    /** Disabilita bottone salva */
    disabilitaSalva?: boolean;
    /** Azioni footer extra */
    azioniFooter?: ReactNode;
    /** Larghezza custom */
    larghezza?: "sm" | "md" | "lg" | "xl";
}

const larghezzeMap = {
    sm: "sm:max-w-md",
    md: "sm:max-w-xl",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-3xl",
};

export function PannelloCrud({
    aperto,
    onChiudi,
    titolo,
    sottotitolo,
    icona,
    coloreAccent = "var(--pf-accent-primary)",
    children,
    labelSalva = "Salva",
    onSalva,
    isSalvataggio = false,
    disabilitaSalva = false,
    azioniFooter,
    larghezza = "lg",
}: PannelloCrudProps) {
    return (
        <Sheet open={aperto} onOpenChange={(open) => !open && onChiudi()}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className={cn(
                    "w-full p-0 flex flex-col",
                    larghezzeMap[larghezza],
                )}
                style={{
                    backgroundColor: "var(--pf-bg-primary)",
                    borderColor: "var(--pf-border)",
                }}
            >
                {/* === HEADER STICKY === */}
                <div
                    className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {icona && (
                            <div
                                className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                                style={{
                                    backgroundColor: `color-mix(in srgb, ${coloreAccent} 12%, transparent)`,
                                    color: coloreAccent,
                                }}
                            >
                                {icona}
                            </div>
                        )}
                        <div className="min-w-0">
                            <SheetTitle
                                className="text-base font-bold truncate"
                                style={{ color: "var(--pf-text-primary)" }}
                            >
                                {titolo}
                            </SheetTitle>
                            {sottotitolo && (
                                <SheetDescription
                                    className="text-xs truncate mt-0.5"
                                    style={{ color: "var(--pf-text-muted)" }}
                                >
                                    {sottotitolo}
                                </SheetDescription>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onChiudi}
                        className="p-2 rounded-lg hover:bg-[var(--pf-bg-hover)] transition-colors flex-shrink-0"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* === CONTENUTO SCROLLABILE === */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {children}
                </div>

                {/* === FOOTER STICKY === */}
                <div
                    className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 border-t gap-3"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        {azioniFooter}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onChiudi}
                            disabled={isSalvataggio}
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--pf-bg-hover)]"
                            style={{ color: "var(--pf-text-secondary)" }}
                        >
                            Annulla
                        </button>
                        {onSalva && (
                            <button
                                onClick={onSalva}
                                disabled={disabilitaSalva || isSalvataggio}
                                className={cn(
                                    "px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all",
                                    (disabilitaSalva || isSalvataggio)
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:opacity-90 active:scale-[0.98]"
                                )}
                                style={{ backgroundColor: coloreAccent }}
                            >
                                {isSalvataggio ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" />
                                        Salvataggio...
                                    </span>
                                ) : (
                                    labelSalva
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// === HELPER: Sezione form con titolo ===

interface SezioneFormProps {
    titolo: string;
    descrizione?: string;
    children: ReactNode;
    className?: string;
}

export function SezioneForm({ titolo, descrizione, children, className }: SezioneFormProps) {
    return (
        <div className={cn("space-y-4", className)}>
            <div>
                <h3
                    className="text-sm font-semibold"
                    style={{ color: "var(--pf-text-primary)" }}
                >
                    {titolo}
                </h3>
                {descrizione && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--pf-text-muted)" }}>
                        {descrizione}
                    </p>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    );
}

// === HELPER: Separatore sezioni ===

export function SeparatoreSezione() {
    return (
        <div
            className="my-6 border-t"
            style={{ borderColor: "var(--pf-border)" }}
        />
    );
}

// === HELPER: Campo form generico ===

interface CampoProps {
    label: string;
    obbligatorio?: boolean;
    errore?: string;
    children: ReactNode;
    fullWidth?: boolean;
    className?: string;
}

export function Campo({ label, obbligatorio, errore, children, fullWidth, className }: CampoProps) {
    return (
        <div className={cn(fullWidth && "sm:col-span-2", className)}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--pf-text-secondary)" }}>
                {label}
                {obbligatorio && <span style={{ color: "var(--pf-accent-red, #ef4444)" }}> *</span>}
            </label>
            {children}
            {errore && (
                <p className="text-xs mt-1" style={{ color: "var(--pf-accent-red, #ef4444)" }}>
                    {errore}
                </p>
            )}
        </div>
    );
}

// === HELPER: Input stilizzato ===

interface InputPfProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasError?: boolean;
}

export function InputPf({ hasError, className, ...props }: InputPfProps) {
    return (
        <input
            {...props}
            className={cn(
                "w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors",
                "focus:border-[var(--pf-accent-primary)]",
                hasError && "border-[var(--pf-accent-red,#ef4444)]",
                className
            )}
            style={{
                backgroundColor: "var(--pf-bg-surface)",
                borderColor: hasError ? "var(--pf-accent-red, #ef4444)" : "var(--pf-border)",
                color: "var(--pf-text-primary)",
            }}
        />
    );
}

// === HELPER: Textarea stilizzata ===

interface TextareaPfProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    hasError?: boolean;
}

export function TextareaPf({ hasError, className, ...props }: TextareaPfProps) {
    return (
        <textarea
            {...props}
            className={cn(
                "w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors resize-none",
                "focus:border-[var(--pf-accent-primary)]",
                hasError && "border-[var(--pf-accent-red,#ef4444)]",
                className
            )}
            style={{
                backgroundColor: "var(--pf-bg-surface)",
                borderColor: hasError ? "var(--pf-accent-red, #ef4444)" : "var(--pf-border)",
                color: "var(--pf-text-primary)",
            }}
        />
    );
}

// === HELPER: Select stilizzata ===

interface SelectPfProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    opzioni: { value: string; label: string; colore?: string }[];
    placeholder?: string;
    hasError?: boolean;
}

export function SelectPf({ opzioni, placeholder, hasError, className, ...props }: SelectPfProps) {
    return (
        <select
            {...props}
            className={cn(
                "w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors",
                "focus:border-[var(--pf-accent-primary)]",
                hasError && "border-[var(--pf-accent-red,#ef4444)]",
                className
            )}
            style={{
                backgroundColor: "var(--pf-bg-surface)",
                borderColor: hasError ? "var(--pf-accent-red, #ef4444)" : "var(--pf-border)",
                color: "var(--pf-text-primary)",
            }}
        >
            {placeholder && (
                <option value="" style={{ color: "var(--pf-text-muted)" }}>
                    {placeholder}
                </option>
            )}
            {opzioni.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}
