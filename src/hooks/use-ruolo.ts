// Hook per ruolo utente — combina Clerk auth con dati DB
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/nextjs";
import { apiGet } from "@/lib/api";
import type { UtenteDettaglio, PermessoRuolo } from "@/types";

/** Chiavi query per utente */
export const CHIAVI_UTENTE = {
    profilo: (clerkId: string) => ["utente", "profilo", clerkId] as const,
    permessi: (ruoloId: string) => ["utente", "permessi", ruoloId] as const,
};

/**
 * Hook per ottenere il profilo utente gestionale corrente
 * Combina i dati Clerk (auth) con i dati del DB (ruolo, area, permessi)
 */
export function useRuolo() {
    const { getToken, userId } = useAuth();
    const { user, isLoaded } = useUser();

    // Carica profilo utente dal DB
    const profiloQuery = useQuery({
        queryKey: CHIAVI_UTENTE.profilo(userId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<UtenteDettaglio>(
                `/utenti/me`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 10 * 60 * 1000, // 10 minuti — i ruoli cambiano raramente
        enabled: !!userId && isLoaded,
    });

    // Carica permessi per il ruolo dell'utente
    const permessiQuery = useQuery({
        queryKey: CHIAVI_UTENTE.permessi(profiloQuery.data?.ruoloId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<PermessoRuolo[]>(
                `/config/permessi/${profiloQuery.data?.ruoloId}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 10 * 60 * 1000,
        enabled: !!profiloQuery.data?.ruoloId,
    });

    /**
     * Verifica se l'utente ha un permesso specifico
     * @example
     * const { haPermesso } = useRuolo();
     * if (haPermesso("cantieri", "modifica")) { ... }
     */
    function haPermesso(sezione: string, azione: string): boolean {
        if (!permessiQuery.data) return false;
        return permessiQuery.data.some(
            (permesso) =>
                permesso.sezione === sezione &&
                permesso.azione === azione &&
                permesso.attivo
        );
    }

    /**
     * Verifica il filtro cantieri per una sezione
     * @returns "tutti" | "assegnati" | "per_stato"
     */
    function filtroCantieri(sezione: string): string {
        const permesso = permessiQuery.data?.find(
            (p) => p.sezione === sezione && p.azione === "visualizza" && p.attivo
        );
        return permesso?.filtroCantieri ?? "assegnati";
    }

    return {
        // Dati utente
        utente: profiloQuery.data ?? null,
        clerkUser: user,
        ruoloCodice: profiloQuery.data?.ruolo?.codice ?? null,
        ruoloLabel: profiloQuery.data?.ruolo?.label ?? null,
        areaCodice: profiloQuery.data?.area?.codice ?? null,

        // Permessi
        permessi: permessiQuery.data ?? [],
        haPermesso,
        filtroCantieri,

        // Stato caricamento
        isCaricamento: !isLoaded || profiloQuery.isLoading || permessiQuery.isLoading,
        errore: profiloQuery.error ?? permessiQuery.error,

        // Shortcut ruoli comuni
        isAdmin: profiloQuery.data?.ruolo?.codice === "admin",
        isTitolare: profiloQuery.data?.ruolo?.codice === "titolare",
        isVenditore: profiloQuery.data?.ruolo?.codice === "venditore",
        isCaposquadra: profiloQuery.data?.ruolo?.codice === "caposquadra",
    };
}
