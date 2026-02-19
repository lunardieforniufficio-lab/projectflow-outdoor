// Hook CRUD utenti gestionale — lista, dettaglio, creazione, aggiornamento
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import type { UtenteGestionale, UtenteDettaglio, UtenteCreazione } from "@/types";

/** Chiavi query per utenti */
export const CHIAVI_UTENTI = {
    base: ["utenti"] as const,
    lista: () => [...CHIAVI_UTENTI.base, "lista"] as const,
    dettaglio: (id: string) => [...CHIAVI_UTENTI.base, "dettaglio", id] as const,
};

/** Lista utenti gestionale */
export function useUtenti() {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_UTENTI.lista(),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<UtenteDettaglio[]>("/utenti", {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    return {
        utenti: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Dettaglio utente */
export function useUtenteDettaglio(id: string | undefined) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_UTENTI.dettaglio(id ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<UtenteDettaglio>(
                `/utenti/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        enabled: !!id,
    });

    return {
        utente: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
    };
}

/** Creazione utente gestionale */
export function useCreaUtente() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: UtenteCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<UtenteGestionale>("/utenti", dati, {
                token: token ?? undefined,
            });
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_UTENTI.base });
        },
    });
}

/** Aggiornamento utente */
export function useAggiornaUtente() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            dati,
        }: {
            id: string;
            dati: Partial<Omit<UtenteCreazione, "clerkUserId">>;
        }) => {
            const token = await getToken();
            const risposta = await apiPatch<UtenteGestionale>(
                `/utenti/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_UTENTI.base });
            queryClient.invalidateQueries({
                queryKey: CHIAVI_UTENTI.dettaglio(variabili.id),
            });
        },
    });
}
