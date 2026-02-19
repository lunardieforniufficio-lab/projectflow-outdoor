// Tipi per le tabelle di configurazione (zero hardcoding — tutto da DB)

/** Ruolo utente (da tabella `ruoli`) */
export interface Ruolo {
    id: string;
    codice: string;
    label: string;
    descrizione: string | null;
    colore: string | null;
    icona: string | null;
    ordine: number;
    attivo: boolean;
    creatoIl: string;
}

/** Permesso associato a un ruolo */
export interface PermessoRuolo {
    id: string;
    ruoloId: string;
    sezione: string;
    azione: string;
    filtroCantieri: "tutti" | "assegnati" | "per_stato";
    statiVisibili: string[] | null;
    attivo: boolean;
}

/** Stato del cantiere nella FSM (da tabella `stati_cantiere`) */
export interface StatoCantiere {
    id: string;
    codice: string;
    label: string;
    descrizione: string | null;
    colore: string;
    icona: string | null;
    ordine: number;
    isIniziale: boolean;
    isFinale: boolean;
    attivo: boolean;
    creatoIl: string;
}

/** Transizione ammessa tra stati */
export interface TransizioneStato {
    id: string;
    statoDa: { codice: string; label: string };
    statoA: { codice: string; label: string };
    vincoli: VincoloTransizione[];
}

/** Vincolo per una transizione FSM */
export interface VincoloTransizione {
    id: string;
    transizioneId: string;
    descrizione: string;
    tipoVerifica: "campo_cantiere" | "conteggio_media" | "flag_booleano" | "campo_rilievo" | "campo_progetto" | "conteggio_timeline" | "custom";
    campo: string | null;
    valoreAtteso: string | null;
    ordine: number;
    attivo: boolean;
}

/** Tipo di prodotto (da tabella `tipi_prodotto`) */
export interface TipoProdotto {
    id: string;
    codice: string;
    label: string;
    categoria: string | null;
    descrizione: string | null;
    attivo: boolean;
    ordine: number;
    creatoIl: string;
}

/** Area aziendale (da tabella `aree_aziendali`) */
export interface AreaAziendale {
    id: string;
    codice: string;
    label: string;
    descrizione: string | null;
    responsabileId: string | null;
    attivo: boolean;
    ordine: number;
}

/** Configurazione chiave-valore generica */
export interface Configurazione {
    id: string;
    chiave: string;
    valore: string;
    tipo: "testo" | "numero" | "booleano" | "json";
    descrizione: string | null;
    modificabile: boolean;
    aggiornatoIl: string;
    aggiornatoDa: string | null;
}

/** Tipi di configurazione caricabili via API */
export type TipoConfigurazione =
    | "ruoli"
    | "stati_cantiere"
    | "tipi_prodotto"
    | "aree_aziendali"
    | "configurazioni"
    | "transizioni";

/** Mappa tipo → interfaccia per type safety */
export type MappaConfigurazione = {
    ruoli: Ruolo;
    stati_cantiere: StatoCantiere;
    tipi_prodotto: TipoProdotto;
    aree_aziendali: AreaAziendale;
    configurazioni: Configurazione;
    transizioni: TransizioneStato;
};
