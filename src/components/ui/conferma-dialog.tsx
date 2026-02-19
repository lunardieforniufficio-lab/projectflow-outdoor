// Conferma Dialog — dialog modale di conferma azione
"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfermaDialogProps {
    /** Se il dialog è aperto */
    aperto: boolean;
    /** Callback chiusura */
    onChiudi: () => void;
    /** Callback conferma */
    onConferma: () => void;
    /** Titolo del dialog */
    titolo: string;
    /** Descrizione/messaggio */
    descrizione: string;
    /** Testo bottone conferma */
    testoConferma?: string;
    /** Testo bottone annulla */
    testoAnnulla?: string;
    /** Stile distruttivo (rosso) */
    isDistrutivo?: boolean;
    /** Se l'azione è in corso */
    isCaricamento?: boolean;
}

/** Dialog di conferma per azioni critiche */
export function ConfermaDialog({
    aperto,
    onChiudi,
    onConferma,
    titolo,
    descrizione,
    testoConferma = "Conferma",
    testoAnnulla = "Annulla",
    isDistrutivo = false,
    isCaricamento = false,
}: ConfermaDialogProps) {
    return (
        <AlertDialog open={aperto} onOpenChange={(open) => !open && onChiudi()}>
            <AlertDialogContent className="bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-[var(--pf-text-primary)]">
                        {titolo}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-[var(--pf-text-muted)]">
                        {descrizione}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={onChiudi}
                        className="border-[var(--pf-border)] text-[var(--pf-text-secondary)] hover:bg-[var(--pf-surface-tertiary)]"
                    >
                        {testoAnnulla}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConferma}
                        disabled={isCaricamento}
                        className={
                            isDistrutivo
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-[var(--pf-accent-primary)] hover:bg-[var(--pf-accent-primary-hover)] text-white"
                        }
                    >
                        {isCaricamento ? "Attendere..." : testoConferma}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
