# Catalogo Componenti — ProjectFlow v2

> Ogni componente con interfaccia, dipendenze e uso. REGOLA: prima di creare un componente, cerca se esiste una libreria o pacchetto npm adatto.

---

## Livello 1: Componenti Atomici (`components/ui/`)

Vengono da shadcn/ui, personalizzati con tema Lunardi & Forni (dark, verde `#1B8C3A`).

### Shadcn/ui base (da installare e personalizzare)
```bash
npx shadcn@latest add button input textarea select dialog sheet
npx shadcn@latest add dropdown-menu popover tooltip command
npx shadcn@latest add tabs badge separator skeleton avatar
npx shadcn@latest add alert alert-dialog toast switch checkbox
npx shadcn@latest add scroll-area card collapsible
```
Tutti questi vengono copiati in `components/ui/` e customizzati con variabili `--pf-*`.

### Custom (da creare)

**`badge-stato.tsx`** — Pill colorata con colore da DB (non hardcoded).
```typescript
interface BadgeStatoProps {
  statoId: string;            // ID stato — carica colore e label da config DB
  dimensione?: "sm" | "md";
  conGlow?: boolean;
}
// Usa useConfigurazione("stati_cantiere") per colore e label
```

**`progress-arc.tsx`** — Arco SVG circolare.
```typescript
interface ProgressArcProps {
  percentuale: number;
  dimensione?: number;        // default 72
  colore?: string;            // default --pf-accent-primary
  spessore?: number;
  mostraLabel?: boolean;
}
```

**`pill-tabs.tsx`** — Tabs a pillola.
```typescript
interface PillTabsProps {
  tabs: { id: string; label: string; conteggio?: number }[];
  tabAttivo: string;
  onTabChange: (id: string) => void;
  dimensione?: "sm" | "md";
}
```

**`floating-pill-nav.tsx`** — Nav che si nasconde/riappare.
```typescript
interface FloatingPillNavProps {
  voci: { id: string; label: string; icona?: React.ReactNode }[];
  voceAttiva: string;
  onNavigazione: (id: string) => void;
  autoHideMs?: number;       // default 3000
}
```

**`campo-ricerca.tsx`** — Input ricerca con debounce.
```typescript
interface CampoRicercaProps {
  valore: string;
  onCambia: (valore: string) => void;
  placeholder?: string;
  debounceMs?: number;       // default 300
}
```

**`conferma-dialog.tsx`** — Dialog modale di conferma.

**`empty-state.tsx`** — Placeholder liste vuote.

**`skeleton-loader.tsx`** — Loading placeholder.

**`export-toolbar.tsx`** — **OBBLIGATORIO SU OGNI LISTA**. Bottoni CSV, Excel, JSON.
```typescript
interface ExportToolbarProps {
  dati: any[];
  nomeFile: string;           // es. "cantieri-export"
  colonne: { chiave: string; label: string }[];
  formatiAbilitati?: ("csv" | "excel" | "json")[];  // default: tutti e tre
}
// Usa: xlsx per Excel, json2csv per CSV, JSON.stringify per JSON
// Genera download diretto nel browser
```

---

## Livello 2: Campi Form (`components/forms/`)

Tutti integrati con React Hook Form + Zod. Pattern identico v1.

| Componente | Libreria validazione | Pacchetto npm |
|-----------|---------------------|---------------|
| `campo-codice-fiscale.tsx` | codice-fiscale-js | `codice-fiscale-js` |
| `campo-telefono.tsx` | libphonenumber-js | `libphonenumber-js` |
| `campo-iban.tsx` | ibantools | `ibantools` |
| `campo-email.tsx` | Zod built-in | `zod` |
| `campo-valuta.tsx` | Zod custom | `zod` |
| `campo-data.tsx` | react-day-picker | `react-day-picker` |
| `campo-select-config.tsx` | — | Carica opzioni da DB |
| `campo-upload-file.tsx` | — | `react-dropzone` |

### `campo-select-config.tsx` (NUOVO — fondamentale)
Select generico che carica opzioni da una tabella di configurazione DB.
```typescript
interface CampoSelectConfigProps {
  name: string;
  label?: string;
  tabella: string;            // 'stati_cantiere', 'tipi_prodotto', 'ruoli', 'aree_aziendali'...
  campoValore?: string;       // default 'id'
  campoLabel?: string;        // default 'label'
  filtro?: Record<string, any>; // es. { attivo: true }
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
// Usa useConfigurazione(tabella) per caricare opzioni
// NIENTE opzioni hardcoded — tutto da DB
```

---

## Livello 3: Moduli Funzionali (`components/modules/`)

### `timeline/` — Identico v1

### `kanban/` — Identico v1 ma colonne da DB
```typescript
interface KanbanBoardProps {
  cantieri: Cantiere[];
  // statiVisibili NON è una lista hardcoded:
  // viene da useConfigurazione("stati_cantiere") filtrato per ruolo
  onCantiereClick: (id: string) => void;
  onDragEnd?: (cantiereId: string, nuovoStatoId: string) => void;
}
```

### `media-gallery/` — Identico v1 ma con Google Drive
Upload va su Google Drive via API, non su filesystem locale.

### `cantiere-detail/` — Identico v1

### `nav/` — Identico v1

### `calendario/` (NUOVO)

**`calendario-view.tsx`** — Vista calendario con eventi da Google Calendar.
```typescript
interface CalendarioViewProps {
  vista?: "mese" | "settimana" | "giorno";
  calendariVisibili?: string[];  // ID calendari Google
  onEventoClick?: (eventoId: string) => void;
  onSlotClick?: (data: Date) => void;
}
// Libreria consigliata: @fullcalendar/react con plugin Google Calendar
// Alternativa: react-big-calendar
```

**`evento-form.tsx`** — Form per creare/modificare evento Google Calendar.
```typescript
interface EventoFormProps {
  cantiereId?: string;        // collega evento a cantiere
  dataIniziale?: Date;
  onSalva: (evento: EventoCalendario) => void;
  onAnnulla: () => void;
}
```

### `ai-chat/` (NUOVO)

**`ai-chat.tsx`** — Container chat AI completo.
```typescript
interface AiChatProps {
  conversazioneId?: string;   // null = nuova conversazione
  contestoCantiere?: string;  // se aperto da un cantiere, passa contesto
  modalita?: "chat" | "query" | "dashboard" | "tabella";
}
// Include: lista messaggi, input, risultati inline
// I risultati query mostrano tabella con export
// I risultati dashboard mostrano preview salvabile
```

**`ai-message.tsx`** — Singolo messaggio nella chat.
```typescript
interface AiMessageProps {
  messaggio: AiMessaggio;
  onSalvaDashboard?: (config: DashboardConfig) => void;
  onSalvaTabella?: (config: TabellaDinamicaConfig) => void;
}
// Se il messaggio contiene risultato query: mostra tabella inline con export
// Se contiene dashboard: mostra preview con bottone "Salva dashboard"
// Se contiene tabella: mostra preview schema con bottone "Crea tabella"
```

**`ai-risultato-query.tsx`** — Visualizzazione risultato query SQL in tabella.
```typescript
interface AiRisultatoQueryProps {
  colonne: string[];
  righe: Record<string, any>[];
  querySql: string;           // mostrabile in toggle "Vedi SQL"
  nomeExport?: string;
}
// Include SEMPRE: ExportToolbar per CSV, Excel, JSON
```

**`ai-dashboard-preview.tsx`** — Preview dashboard generata.
```typescript
interface AiDashboardPreviewProps {
  config: DashboardConfig;
  onSalva: () => void;
  onModifica: () => void;
}
```

**`ai-tabella-preview.tsx`** — Preview schema tabella generata.
```typescript
interface AiTabellaPreviewProps {
  config: TabellaDinamicaConfig;
  onCrea: () => void;
  onModifica: () => void;
}
// Mostra: lista colonne con tipi, preview form, preview tabella
```

### `dashboard-dinamica/` (NUOVO)

**`dashboard-renderer.tsx`** — Renderizza dashboard da config JSON salvata in DB.
```typescript
interface DashboardRendererProps {
  dashboardId: string;        // carica config da DB
  editabile?: boolean;        // default false — admin può riordinare widget
}
// Layout griglia con widget posizionabili
// Ogni widget esegue la sua query e renderizza il risultato
```

**`widget-grafico.tsx`** — Grafico (torta, barre, linee).
```typescript
interface WidgetGraficoProps {
  config: WidgetConfig;
  dati: any[];
}
// Libreria: recharts (già nello stack React artifacts)
```

**`widget-tabella.tsx`** — Tabella dati con TanStack Table.
**`widget-contatore.tsx`** — Numero grande con label (es. "5 cantieri attivi").
**`widget-lista.tsx`** — Lista semplice (es. "ultimi alert").

### `tabella-dinamica/` (NUOVO)

**`tabella-dinamica.tsx`** — Renderizza tabella CRUD da config JSON.
```typescript
interface TabellaDinamicaProps {
  nomeTabella: string;        // carica schema e config da DB
  mostraForm?: boolean;       // form inline per insert/update
  mostraExport?: boolean;     // default true — SEMPRE export
}
// TanStack Table con colonne generate da schema_colonne
// Sorting, filtering, paginazione tutti dinamici
// Export CSV/Excel/JSON SEMPRE presente
```

**`form-dinamico.tsx`** — Form generato da config JSON.
```typescript
interface FormDinamicoProps {
  configForm: ConfigForm;     // dal campo config_form della tabella
  valoriIniziali?: Record<string, any>;
  onSubmit: (dati: Record<string, any>) => void;
  onAnnulla?: () => void;
}
// Genera campi React Hook Form da configurazione
// Tipi input mappati: 'testo'→Input, 'numero'→InputNumero, 'valuta'→CampoValuta,
// 'select_libero'→Combobox, 'data'→CampoData, ecc.
// Validazione Zod generata da schema_colonne (obbligatorio, tipo, lunghezza)
```

**`export-toolbar.tsx`** → vedi Livello 1 (atomici)

---

## Livello 4: Layout per Ruolo (`components/layouts/`)

I ruoli vengono da DB. I layout sono composizioni di moduli.

| Layout | Ruoli DB | Sezioni | Cantieri visibili |
|--------|---------|---------|------------------|
| `admin-layout.tsx` | admin | Tutto + admin panel | Tutti |
| `titolare-layout.tsx` | titolare | Tutto (senza admin tecnico) | Tutti |
| `centralino-layout.tsx` | centralino | Dashboard, lead creation | Solo LEAD propri |
| `venditore-layout.tsx` | venditore | Dashboard, cantieri, clienti | Assegnati |
| `tecnico-layout.tsx` | tecnico | Cantieri (RILIEVO, PROGETTAZIONE) | Per stato |
| `logistica-layout.tsx` | logistica | Cantieri, fornitori, ordini | Per stato (ORDINE, MAGAZZINO) |
| `magazziniere-layout.tsx` | magazziniere | Cantieri (MAGAZZINO) | Per stato |
| `posatore-layout.tsx` | caposquadra, installatore | Cantiere attivo, note, foto | Assegnati (mobile-first) |
| `contabilita-layout.tsx` | contabilita | Fatture, preventivi, report | Vista contabile |
| `amministrazione-layout.tsx` | amministrazione | Clienti, fatture, report | Tutti (sola lettura) |

**REGOLA**: i permessi specifici per sezione e azione vengono dalla tabella `permessi_ruolo`, NON sono hardcoded nei layout. Il layout legge i permessi e compone di conseguenza.

---

## Dipendenze tra Componenti

```
layouts/ ──usa──> modules/ ──usa──> forms/ + ui/
                     │
                     ├──usa──> hooks/ ──chiama──> lib/api.ts ──fetch──> n8n webhook
                     │                    │
                     │                    ├──legge──> stores/ (Zustand)
                     │                    └──legge──> config da DB (TanStack Query)
                     │
                     └──usa──> dashboard-dinamica/ ──renderizza──> widget da config JSON
                     └──usa──> tabella-dinamica/ ──renderizza──> CRUD da config JSON
                     └──usa──> ai-chat/ ──chiama──> lib/api-ai.ts ──fetch──> n8n ──> OpenRouter
```

**Regola d'oro invariata**: dipendenze solo verso il basso. `ui/` non importa da `modules/`. `modules/` non importa da `layouts/`.
