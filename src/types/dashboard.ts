// Tipi per la dashboard e statistiche

/** Statistiche dashboard principale (GET /dashboard/stats) */
export interface DashboardStats {
    cantieriAttivi: number;
    valoreTotale: number;
    alertAttivi: number;
    completatiMese: number;
    cantieriPerStato: CantieriPerStato[];
    cantieriInRitardo: number;
}

/** Distribuzione cantieri per stato */
export interface CantieriPerStato {
    statoLabel: string;
    conteggio: number;
    colore: string;
}

/** Alert attivo (GET /dashboard/alert) */
export interface Alert {
    id: string;
    tipo: string;
    messaggio: string;
    cantiereId: string | null;
    cantiereCodice: string | null;
    gravita: "bassa" | "media" | "alta" | "critica";
    creatoIl: string;
    letto: boolean;
}
