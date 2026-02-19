// Barrel export — tutti i tipi del progetto

export type {
    Ruolo,
    PermessoRuolo,
    StatoCantiere,
    TransizioneStato,
    VincoloTransizione,
    TipoProdotto,
    AreaAziendale,
    Configurazione,
    TipoConfigurazione,
    MappaConfigurazione,
} from "./config";

export type {
    Cantiere,
    CantiereDettaglio,
    TimelineEntry,
    MediaFile,
    Rilievo,
    Progetto,
    Preventivo,
    Fattura,
    OrdineFornitore,
    Squadra,
    MembroSquadra,
    FiltriCantiere,
} from "./cantiere";

export type {
    UtenteGestionale,
    UtenteDettaglio,
    Cliente,
    Fornitore,
} from "./utente";

export type {
    AiConversazione,
    AiMessaggio,
    RisultatoQuery,
    TipoRisultatoAi,
    RispostaChatAi,
    DashboardSalvata,
    ConfigWidgets,
    WidgetConfig,
    TabellaDinamica,
    SchemaColonne,
    ColonnaSchema,
    ConfigForm,
    CampoForm,
    ConfigVista,
} from "./ai";

export type {
    ApiRisposta,
    PaginazioneMeta,
    ApiErrore,
    OpzioniRichiesta,
} from "./api";
