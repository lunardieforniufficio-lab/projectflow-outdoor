// Tipi per le funzionalità AI

/** Conversazione AI */
export interface AiConversazione {
    id: string;
    utenteId: string;
    titolo: string | null;
    creataIl: string;
    aggiornatoIl: string;
}

/** Messaggio nella chat AI */
export interface AiMessaggio {
    id: string;
    conversazioneId: string;
    ruolo: "user" | "assistant";
    contenuto: string;
    querySql: string | null;
    risultatoQuery: RisultatoQuery | null;
    modelloUsato: string | null;
    tokenInput: number | null;
    tokenOutput: number | null;
    creatoIl: string;
}

/** Risultato di una query SQL generata dall'AI */
export interface RisultatoQuery {
    colonne: string[];
    righe: Record<string, unknown>[];
}

/** Tipo di risultato dal chat AI */
export type TipoRisultatoAi = "testo" | "query" | "dashboard" | "tabella";

/** Risposta dal chat AI */
export interface RispostaChatAi {
    messaggioId: string;
    contenuto: string;
    tipoRisultato: TipoRisultatoAi;
    querySql: string | null;
    risultato: RisultatoQuery | null;
    modelloUsato: string;
}

/** Dashboard salvata */
export interface DashboardSalvata {
    id: string;
    nome: string;
    descrizione: string | null;
    configWidgets: ConfigWidgets;
    visibileA: string[];
    creataDa: string | null;
    creataIl: string;
    aggiornatoIl: string;
}

/** Configurazione widget della dashboard */
export interface ConfigWidgets {
    widgets: WidgetConfig[];
}

/** Singolo widget nella dashboard */
export interface WidgetConfig {
    id: string;
    tipo: "grafico_torta" | "grafico_barre" | "grafico_linee" | "tabella" | "contatore" | "lista";
    titolo: string;
    querySql: string;
    posizione: {
        riga: number;
        colonna: number;
        larghezza: number;
        altezza: number;
    };
    configGrafico?: {
        campoLabel: string;
        campoValore: string;
    };
}

/** Tabella dinamica creata dall'AI */
export interface TabellaDinamica {
    id: string;
    nomeTabella: string;
    label: string;
    descrizione: string | null;
    schemaColonne: SchemaColonne;
    configForm: ConfigForm;
    configVista: ConfigVista;
    creataDa: string | null;
    creataIl: string;
    aggiornatoIl: string;
}

/** Schema colonne per tabella dinamica */
export interface SchemaColonne {
    colonne: ColonnaSchema[];
}

/** Singola colonna nello schema */
export interface ColonnaSchema {
    nome: string;
    tipo: "uuid" | "varchar" | "text" | "integer" | "decimal" | "boolean" | "timestamptz" | "date" | "jsonb";
    lunghezza?: number;
    precisione?: [number, number];
    obbligatorio?: boolean;
    primaria?: boolean;
    auto?: boolean;
    default?: unknown;
    label?: string;
    ref?: string;
}

/** Configurazione form per tabella dinamica */
export interface ConfigForm {
    campi: CampoForm[];
}

/** Singolo campo nel form dinamico */
export interface CampoForm {
    nome: string;
    tipoInput: "testo" | "numero" | "valuta" | "data" | "booleano" | "select_libero" | "textarea";
    placeholder?: string;
    obbligatorio?: boolean;
    label?: string;
}

/** Configurazione vista tabella dinamica */
export interface ConfigVista {
    colonneVisibili: string[];
    ordinamentoDefault: {
        campo: string;
        direzione: "asc" | "desc";
    };
    filtri: string[];
    ricercaCampi: string[];
    export: ("csv" | "excel" | "json")[];
}
