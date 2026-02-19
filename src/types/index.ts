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
    CantiereCreazione,
    CantiereAggiornamento,
    TransizioneStatoPayload,
    VincoloStatoRisposta,
    TimelineEntry,
    TimelineCreazione,
    MediaFile,
    MediaUploadPayload,
    Rilievo,
    RilievoCreazione,
    Progetto,
    ProgettoCreazione,
    Preventivo,
    PreventivoCreazione,
    Fattura,
    FatturaCreazione,
    OrdineFornitore,
    OrdineCreazione,
    Squadra,
    MembroSquadra,
    FiltriCantiere,
} from "./cantiere";

export type {
    UtenteGestionale,
    UtenteDettaglio,
    UtenteCreazione,
    Cliente,
    ClienteCreazione,
    FiltriClienti,
    Fornitore,
    FornitoreCreazione,
    FiltriFornitori,
    SquadraCreazione,
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

export type {
    DashboardStats,
    CantieriPerStato,
    Alert,
} from "./dashboard";
