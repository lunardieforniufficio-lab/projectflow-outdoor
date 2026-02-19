// Hook dashboard — statistiche e alert
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet } from "@/lib/api";
import type { DashboardStats, Alert } from "@/types";

/** Chiavi query per dashboard */
export const CHIAVI_DASHBOARD = {
    base: ["dashboard"] as const,
    stats: () => [...CHIAVI_DASHBOARD.base, "stats"] as const,
    alert: () => [...CHIAVI_DASHBOARD.base, "alert"] as const,
};

/** Statistiche dashboard principale */
export function useDashboardStats() {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_DASHBOARD.stats(),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<DashboardStats>(
                "/dashboard/stats",
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 60 * 1000,
        refetchInterval: 5 * 60 * 1000, // Auto-refresh ogni 5 minuti
    });

    return {
        stats: query.data ?? null,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** Alert attivi */
export function useAlert() {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_DASHBOARD.alert(),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<Alert[]>(
                "/dashboard/alert",
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });

    return {
        alert: query.data ?? [],
        conteggio: query.data?.length ?? 0,
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}
