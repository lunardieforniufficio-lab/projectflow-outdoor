// Hook CRUD media — lista, upload, URL condivisibile
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiGet, apiPost } from "@/lib/api";
import type { MediaFile } from "@/types";

/** Chiavi query per media */
export const CHIAVI_MEDIA = {
    base: ["media"] as const,
    cantiere: (cantiereId: string, tipo?: string) =>
        [...CHIAVI_MEDIA.base, cantiereId, tipo] as const,
    url: (mediaId: string) => [...CHIAVI_MEDIA.base, "url", mediaId] as const,
};

/** Lista media per cantiere */
export function useMedia(
    cantiereId: string | undefined,
    opzioni?: { tipo?: "foto" | "video" | "documento" | "progetto" }
) {
    const { getToken } = useAuth();

    const query = useQuery({
        queryKey: CHIAVI_MEDIA.cantiere(cantiereId ?? "", opzioni?.tipo),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<MediaFile[]>(
                `/cantieri/${cantiereId}/media`,
                {
                    token: token ?? undefined,
                    parametri: { tipo: opzioni?.tipo },
                }
            );
            return risposta.data;
        },
        enabled: !!cantiereId,
        staleTime: 60 * 1000,
    });

    return {
        media: query.data ?? [],
        isCaricamento: query.isLoading,
        errore: query.error,
        ricarica: query.refetch,
    };
}

/** URL condivisibile Google Drive */
export function useMediaUrl(mediaId: string | undefined) {
    const { getToken } = useAuth();

    return useQuery({
        queryKey: CHIAVI_MEDIA.url(mediaId ?? ""),
        queryFn: async () => {
            const token = await getToken();
            const risposta = await apiGet<{ url: string }>(
                `/media/${mediaId}/url`,
                { token: token ?? undefined }
            );
            return risposta.data.url;
        },
        enabled: !!mediaId,
        staleTime: 10 * 60 * 1000,
    });
}

/** Upload media su Google Drive */
export function useUploadMedia() {
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            cantiereId,
            file,
            tipo,
        }: {
            cantiereId: string;
            file: File;
            tipo: "foto" | "video" | "documento" | "progetto";
        }) => {
            const token = await getToken();
            const formData = new FormData();
            formData.append("file", file);
            formData.append("tipo", tipo);

            const risposta = await apiPost<MediaFile>(
                `/cantieri/${cantiereId}/media`,
                formData,
                { token: token ?? undefined }
            );
            return risposta.data;
        },
        onSuccess: (_data, variabili) => {
            queryClient.invalidateQueries({
                queryKey: CHIAVI_MEDIA.cantiere(variabili.cantiereId),
            });
        },
    });
}
