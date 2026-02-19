// Tipi per le risposte API (n8n webhook)

/** Risposta API standard con dati */
export interface ApiRisposta<T> {
    data: T;
    meta?: PaginazioneMeta;
}

/** Metadati di paginazione */
export interface PaginazioneMeta {
    totale: number;
    pagina: number;
    limite: number;
    totalePagine: number;
}

/** Errore API standard */
export interface ApiErrore {
    error: {
        codice: string;
        messaggio: string;
        dettagli?: Record<string, unknown>;
    };
}

/** Opzioni per le richieste API */
export interface OpzioniRichiesta {
    segnale?: AbortSignal;
    formato?: "csv" | "excel" | "json";
}
