// Tipi per utenti, clienti e fornitori

/** Utente del gestionale (estensione dati Clerk) */
export interface UtenteGestionale {
    id: string;
    clerkUserId: string;
    nome: string;
    cognome: string;
    emailAziendale: string | null;
    whatsapp: string | null;
    ruoloId: string;
    areaId: string | null;
    attivo: boolean;
    creatoIl: string;
    aggiornatoIl: string;
}

/** Utente con relazioni espanse */
export interface UtenteDettaglio extends UtenteGestionale {
    ruolo: {
        codice: string;
        label: string;
        colore: string | null;
    };
    area: {
        codice: string;
        label: string;
    } | null;
}

/** Cliente */
export interface Cliente {
    id: string;
    nome: string;
    cognome: string;
    codiceFiscale: string;
    email: string | null;
    telefono: string;
    indirizzo: string | null;
    citta: string | null;
    cap: string | null;
    provincia: string | null;
    iban: string | null;
    note: string | null;
    creatoIl: string;
    aggiornatoIl: string;
    creatoDa: string;
}

/** Fornitore */
export interface Fornitore {
    id: string;
    nome: string;
    partitaIva: string | null;
    email: string | null;
    telefono: string | null;
    indirizzo: string | null;
    referente: string | null;
    note: string | null;
    attivo: boolean;
    creatoIl: string;
}

/** Payload creazione cliente (POST /clienti) */
export interface ClienteCreazione {
    nome: string;
    cognome: string;
    codiceFiscale: string;
    telefono: string;
    email?: string;
    indirizzo?: string;
    citta?: string;
    cap?: string;
    provincia?: string;
    iban?: string;
    note?: string;
}

/** Payload creazione fornitore (POST /fornitori) */
export interface FornitoreCreazione {
    nome: string;
    partitaIva?: string;
    email?: string;
    telefono?: string;
    indirizzo?: string;
    referente?: string;
    note?: string;
}

/** Payload creazione squadra (POST /squadre) */
export interface SquadraCreazione {
    nome: string;
    responsabileId?: string;
    telefono?: string;
    colore?: string;
}

/** Payload creazione utente gestionale (POST /utenti) */
export interface UtenteCreazione {
    clerkUserId: string;
    nome: string;
    cognome: string;
    emailAziendale?: string;
    whatsapp?: string;
    ruoloId: string;
    areaId?: string;
    attivo?: boolean;
}

/** Filtri per la lista clienti */
export interface FiltriClienti {
    ricerca?: string;
    pagina?: number;
    limite?: number;
}

/** Filtri per la lista fornitori */
export interface FiltriFornitori {
    ricerca?: string;
    attivo?: boolean;
    pagina?: number;
    limite?: number;
}

