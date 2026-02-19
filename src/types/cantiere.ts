// Tipi per cantieri e entità correlate

/** Cantiere — entità principale */
export interface Cantiere {
    id: string;
    codice: string;
    clienteId: string;
    tipoProdottoId: string;
    statoId: string;
    importoTotale: number | null;
    importoAcconto: number | null;
    accontoPagato: boolean;
    indirizzoCantiere: string;
    cittaCantiere: string | null;
    squadraId: string | null;
    venditoreId: string | null;
    progettistaId: string | null;
    dataInizio: string | null;
    dataFinePrevista: string | null;
    dataFineReale: string | null;
    noteInterne: string | null;
    googleCalendarEventId: string | null;
    googleDriveFolderId: string | null;
    creatoIl: string;
    aggiornatoIl: string;
    creatoDa: string | null;
}

/** Cantiere con relazioni espanse (da GET /cantieri/:id) */
export interface CantiereDettaglio extends Cantiere {
    cliente: {
        id: string;
        nome: string;
        cognome: string;
        telefono: string;
        email: string | null;
    };
    stato: {
        codice: string;
        label: string;
        colore: string;
    };
    tipoProdotto: {
        codice: string;
        label: string;
        categoria: string | null;
    };
    squadra: {
        id: string;
        nome: string;
        colore: string | null;
    } | null;
    venditore: {
        id: string;
        nome: string;
        cognome: string;
    } | null;
}

/** Entry nella timeline del cantiere */
export interface TimelineEntry {
    id: string;
    cantiereId: string;
    tipo: string;
    autoreId: string;
    autoreNome: string;
    contenuto: string;
    metadata: Record<string, unknown> | null;
    creatoIl: string;
}

/** File media collegato a un cantiere */
export interface MediaFile {
    id: string;
    cantiereId: string;
    timelineEntryId: string | null;
    tipo: "foto" | "video" | "documento" | "progetto";
    nomeFile: string;
    googleDriveFileId: string;
    googleDriveUrl: string | null;
    dimensioneBytes: number | null;
    mimeType: string | null;
    thumbnailDriveId: string | null;
    caricatoDa: string;
    caricatoIl: string;
}

/** Rilievo tecnico di un cantiere */
export interface Rilievo {
    id: string;
    cantiereId: string;
    larghezzaCm: number | null;
    profonditaCm: number | null;
    altezzaMaxCm: number | null;
    noteTecniche: string | null;
    ostacoli: Record<string, unknown> | null;
    eseguitoDa: string;
    eseguitoIl: string;
}

/** Progetto esecutivo */
export interface Progetto {
    id: string;
    cantiereId: string;
    fornitore: string | null;
    descrizione: string | null;
    larghezzaCm: number | null;
    profonditaCm: number | null;
    altezzaMaxCm: number | null;
    googleDriveFileId: string;
    approvato: boolean;
    nonModificabile: boolean;
    creatoIl: string;
    creatoDa: string | null;
}

/** Preventivo */
export interface Preventivo {
    id: string;
    cantiereId: string;
    numero: string;
    descrizione: string | null;
    importo: number;
    stato: string;
    googleDriveFileId: string | null;
    creatoIl: string;
    creatoDa: string | null;
}

/** Fattura */
export interface Fattura {
    id: string;
    cantiereId: string;
    numero: string;
    tipo: string;
    importo: number;
    dataEmissione: string;
    dataPagamento: string | null;
    stato: string;
    googleDriveFileId: string | null;
    note: string | null;
    creatoIl: string;
    creatoDa: string | null;
}

/** Ordine fornitore */
export interface OrdineFornitore {
    id: string;
    cantiereId: string;
    fornitoreId: string;
    numeroOrdine: string | null;
    descrizione: string;
    importo: number | null;
    stato: string;
    dataOrdine: string;
    dataConsegnaPrevista: string | null;
    dataConsegnaReale: string | null;
    note: string | null;
    creatoIl: string;
    creatoDa: string | null;
}

/** Squadra operativa */
export interface Squadra {
    id: string;
    nome: string;
    responsabileId: string | null;
    telefono: string | null;
    colore: string | null;
    attiva: boolean;
    creatoIl: string;
}

/** Membro di una squadra */
export interface MembroSquadra {
    id: string;
    squadraId: string;
    utenteId: string;
    ruoloSquadra: string | null;
    attivo: boolean;
    aggiuntoIl: string;
}

/** Filtri per la lista cantieri */
export interface FiltriCantiere {
    statoId?: string;
    squadraId?: string;
    ricerca?: string;
    pagina?: number;
    limite?: number;
    ordine?: string;
}
