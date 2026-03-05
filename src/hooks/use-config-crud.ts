// Hook CRUD configurazioni — stati cantiere, tipi prodotto (admin only)
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiPost, apiPatch, apiDelete } from "@/lib/api";
import { CHIAVI_CONFIG } from "@/hooks/use-configurazione";
import type { StatoCantiere, TipoProdotto } from "@/types";

// ============================================================
// === STATI CANTIERE ===
// ============================================================

interface StatoCantiereCreazione {
    codice: string;
    label: string;
    colore: string;
    icona?: string | null;
    ordine?: number;
    descrizione?: string | null;
    isIniziale?: boolean;
    isFinale?: boolean;
    attivo?: boolean;
}

/** Creazione stato cantiere (admin) */
export function useCreaStatoCantiere() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: StatoCantiereCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<StatoCantiere>(
                "/config/stati_cantiere",
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("stati_cantiere") });
        },
    });
}

/** Aggiornamento stato cantiere (admin) */
export function useAggiornaStatoCantiere() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: Partial<StatoCantiereCreazione> }) => {
            const token = await getToken();
            const risposta = await apiPatch<StatoCantiere>(
                `/config/stati_cantiere/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("stati_cantiere") });
        },
    });
}

/** Eliminazione stato cantiere (admin) */
export function useEliminaStatoCantiere() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            const risposta = await apiDelete<void>(
                `/config/stati_cantiere/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("stati_cantiere") });
        },
    });
}

// ============================================================
// === TIPI PRODOTTO ===
// ============================================================

interface TipoProdottoCreazione {
    codice: string;
    label: string;
    categoria?: string | null;
    descrizione?: string | null;
    ordine?: number;
    attivo?: boolean;
}

/** Creazione tipo prodotto (admin) */
export function useCreaTipoProdotto() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dati: TipoProdottoCreazione) => {
            const token = await getToken();
            const risposta = await apiPost<TipoProdotto>(
                "/config/tipi_prodotto",
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("tipi_prodotto") });
        },
    });
}

/** Aggiornamento tipo prodotto (admin) */
export function useAggiornaTipoProdotto() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, dati }: { id: string; dati: Partial<TipoProdottoCreazione> }) => {
            const token = await getToken();
            const risposta = await apiPatch<TipoProdotto>(
                `/config/tipi_prodotto/${id}`,
                dati,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("tipi_prodotto") });
        },
    });
}

/** Eliminazione tipo prodotto (admin) */
export function useEliminaTipoProdotto() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const token = await getToken();
            const risposta = await apiDelete<void>(
                `/config/tipi_prodotto/${id}`,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CHIAVI_CONFIG.tipo("tipi_prodotto") });
        },
    });
}
