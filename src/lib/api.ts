// Client API generico per comunicare con n8n via webhook
// Aggiunge automaticamente il token Clerk e gestisce errori

import type { ApiRisposta, ApiErrore, OpzioniRichiesta } from "@/types";

const URL_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ?? "";

/** Errore API personalizzato */
export class ErroreApi extends Error {
    codice: string;
    status: number;
    dettagli: Record<string, unknown> | undefined;

    constructor(messaggio: string, codice: string, status: number, dettagli?: Record<string, unknown>) {
        super(messaggio);
        this.name = "ErroreApi";
        this.codice = codice;
        this.status = status;
        this.dettagli = dettagli;
    }
}


/** Costruisci URL completo con query string */
function costruisciUrl(percorso: string, parametri?: Record<string, string | number | undefined>): string {
    const url = new URL(`${URL_BASE}${percorso}`);
    if (parametri) {
        Object.entries(parametri).forEach(([chiave, valore]) => {
            if (valore !== undefined && valore !== null && valore !== "") {
                url.searchParams.set(chiave, String(valore));
            }
        });
    }
    return url.toString();
}

/** Gestisci la risposta HTTP */
async function gestisciRisposta<T>(risposta: Response): Promise<T> {
    if (!risposta.ok) {
        let erroreBody: ApiErrore | null = null;
        try {
            erroreBody = (await risposta.json()) as ApiErrore;
        } catch {
            // Risposta non JSON
        }

        throw new ErroreApi(
            erroreBody?.error?.messaggio ?? `Errore HTTP ${risposta.status}`,
            erroreBody?.error?.codice ?? "ERRORE_SCONOSCIUTO",
            risposta.status,
            erroreBody?.error?.dettagli
        );
    }

    // Per i download (CSV, Excel), restituisci il blob
    const contentType = risposta.headers.get("content-type") ?? "";
    if (contentType.includes("application/octet-stream") || contentType.includes("text/csv")) {
        const blob = await risposta.blob();
        return blob as unknown as T;
    }

    return risposta.json() as Promise<T>;
}

/** Fetch generico con autenticazione */
async function fetchAutenticato<T>(
    percorso: string,
    opzioni: RequestInit & { token?: string; parametri?: Record<string, string | number | undefined> } = {}
): Promise<T> {
    const { token, parametri, ...fetchOpzioni } = opzioni;
    const url = costruisciUrl(percorso, parametri);

    const headers: Record<string, string> = {
        ...(fetchOpzioni.headers as Record<string, string> ?? {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    if (!(fetchOpzioni.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const risposta = await fetch(url, {
        ...fetchOpzioni,
        headers,
    });

    return gestisciRisposta<T>(risposta);
}

// === Metodi API pubblici ===

/** GET — leggi dati */
export async function apiGet<T>(
    percorso: string,
    opzioni?: {
        token?: string;
        parametri?: Record<string, string | number | undefined>;
        segnale?: AbortSignal;
    }
): Promise<ApiRisposta<T>> {
    return fetchAutenticato<ApiRisposta<T>>(percorso, {
        method: "GET",
        token: opzioni?.token,
        parametri: opzioni?.parametri,
        signal: opzioni?.segnale,
    });
}

/** POST — crea risorsa */
export async function apiPost<T>(
    percorso: string,
    corpo: unknown,
    opzioni?: { token?: string; segnale?: AbortSignal }
): Promise<ApiRisposta<T>> {
    return fetchAutenticato<ApiRisposta<T>>(percorso, {
        method: "POST",
        body: corpo instanceof FormData ? corpo : JSON.stringify(corpo),
        token: opzioni?.token,
        signal: opzioni?.segnale,
    });
}

/** PATCH — aggiorna risorsa */
export async function apiPatch<T>(
    percorso: string,
    corpo: unknown,
    opzioni?: { token?: string; segnale?: AbortSignal }
): Promise<ApiRisposta<T>> {
    return fetchAutenticato<ApiRisposta<T>>(percorso, {
        method: "PATCH",
        body: JSON.stringify(corpo),
        token: opzioni?.token,
        signal: opzioni?.segnale,
    });
}

/** DELETE — elimina risorsa */
export async function apiDelete<T>(
    percorso: string,
    opzioni?: { token?: string; segnale?: AbortSignal }
): Promise<ApiRisposta<T>> {
    return fetchAutenticato<ApiRisposta<T>>(percorso, {
        method: "DELETE",
        token: opzioni?.token,
        signal: opzioni?.segnale,
    });
}
