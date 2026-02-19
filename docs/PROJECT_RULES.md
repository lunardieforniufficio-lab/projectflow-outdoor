# ProjectFlow Outdoor — Regole di Progetto v2

> Questo documento è la fonte di verità del progetto. Ogni AI che genera codice per ProjectFlow DEVE leggere questo file prima di scrivere qualsiasi cosa. Nessuna eccezione.

---

## Regole per AI che Scrive Codice

Queste regole si applicano a QUALSIASI modello AI che lavora su questo progetto (Claude, GPT, Gemini, Cursor, Windsurf, Copilot).

1. **RISPONDI SEMPRE IN ITALIANO** — commenti, variabili, messaggi utente, documentazione. Unica eccezione: keyword TypeScript/JavaScript e nomi di librerie npm.
2. **CODICE PULITO E PROFESSIONALE** — niente soluzioni "quick and dirty". Ogni funzione, ogni componente deve essere leggibile, tipizzato, testabile.
3. **ZERO HARDCODING** — tutto ciò che è lista, enum, configurazione, ruolo, stato, tipo prodotto, area aziendale viene letto da database via API. Niente array hardcoded nel codice frontend. Se serve un valore di default prima del caricamento dati, usa un skeleton loader, non un fallback hardcoded.
4. **NIENTE FALLBACK INUTILI** — se manca un dato, mostra un errore chiaro o uno stato vuoto. Non inventare dati placeholder che mascherano problemi.
5. **PRIMA DI CREARE UN COMPONENTE: CERCA** — prima di scrivere qualsiasi componente, chiediti se esiste una libreria, un pacchetto npm, o un componente open source che fa già quel lavoro. Fai una ricerca e proponi la soluzione più adatta. Non reinventare la ruota.
6. **SE MANCANO API KEY, PASSWORD, URL: CHIEDI** — non inventare, non lasciare stringhe vuote, non commentare "TODO". Chiedi esplicitamente all'utente.
7. **MODULARE SEMPRE** — se un file supera 150 righe, spezzalo. Se una funzione supera 30 righe, spezzala. Se un componente fa due cose, fai due componenti.

---

## Identità del Progetto

**ProjectFlow** è il gestionale cantieri di **Lunardi & Forni** (lunardieforni.com), azienda di outdoor (pergole, bioclimatiche, pergotende, coperture) con sede operativa in Toscana.

Gestisce il ciclo di vita completo di un cantiere tramite una FSM (Finite State Machine) configurabile. È usato da ~21 persone con ruoli diversi. Include un layer AI per generazione report, query database, creazione dashboard e tabelle dinamiche.

### Branding

| Elemento | Valore |
|----------|--------|
| Logo | "LUNARDI & FORNI" — testo grigio scuro su nero, ampersand verde |
| Font logo | Condensed bold serif (simile a Impact/Oswald condensed) |
| Verde brand | `#1B8C3A` (ampersand del logo) |
| Grigio testo logo | `#5A5A5A` |
| Sfondo | `#0C0C0C` (nero profondo) |

### Palette Applicazione

```css
/* Sfondo e superfici */
--pf-bg-primary: #0c0c0c;
--pf-bg-surface: #111111;
--pf-bg-elevated: #1a1a1a;
--pf-bg-hover: rgba(255, 255, 255, 0.02);
--pf-bg-active: rgba(255, 255, 255, 0.04);

/* Bordi */
--pf-border: #222222;
--pf-border-light: #1a1a1a;
--pf-border-focus: #1B8C3A;

/* Testo */
--pf-text-primary: #e8e8e8;
--pf-text-secondary: #888888;
--pf-text-muted: #555555;
--pf-text-disabled: #333333;

/* Accenti — il verde brand è l'accento primario */
--pf-accent-primary: #1B8C3A;       /* Verde Lunardi & Forni */
--pf-accent-primary-light: #24a847;  /* Hover/glow del verde */
--pf-accent-primary-subtle: rgba(27, 140, 58, 0.12);  /* Background badge/pill */
--pf-accent-yellow: #f59e0b;
--pf-accent-red: #ef4444;
--pf-accent-blue: #3b82f6;
--pf-accent-purple: #a78bfa;

/* Glow effects */
--pf-glow-green: 0 0 12px rgba(27, 140, 58, 0.4);
--pf-glow-red: 0 0 8px rgba(239, 68, 68, 0.4);
```

**Regole visive:**
- **Dark theme UNICO** — non esiste light mode
- **Font primario: `Outfit`** — body, UI, labels
- **Font monospace** — per codici cantiere, importi, timestamp
- **Border radius**: 8px (elementi), 14-16px (card/pannelli), 20-50px (pill/badge)
- **Animazioni**: `cubic-bezier(0.16, 1, 0.3, 1)`, durata 200-400ms
- **Verde brand come accento primario** — bottoni azione principale, progress bar, stati positivi, glow

---

## Stack Tecnologico (NON modificabile senza approvazione)

| Layer | Tecnologia | Note |
|-------|-----------|------|
| Framework | Next.js 14+ (App Router) | |
| Linguaggio | TypeScript strict | |
| Styling | Tailwind CSS 3.4+ | |
| Componenti UI | shadcn/ui (copiati nel progetto) | Personalizzati con tema PF |
| Primitivi headless | Radix UI | Via shadcn |
| Auth | Clerk (@clerk/nextjs) | Ruoli e gruppi |
| Form | React Hook Form 7+ | |
| Validazione | Zod 3+ | |
| Tabelle dati | TanStack Table v8 | Headless |
| Drag & Drop | dnd-kit | Kanban, ordinamento |
| Data fetching | TanStack Query v5 | Cache, refetch |
| Stato globale | Zustand 4+ | |
| Upload file | react-dropzone | |
| Date | date-fns (locale it) | |
| Calendario | react-day-picker | |
| AI Gateway | OpenRouter API | Multi-modello (OpenAI, Gemini, Claude) |
| Backend logica | n8n (self-hosted) | Webhook REST |
| Database | PostgreSQL 15+ | Tutto dinamico da DB |
| Storage file | Google Drive API | Cartella condivisa aziendale |
| Calendario | Google Calendar API | Migrazione da GroupCal |
| Infrastruttura | VPS (quarrataweb.it) | n8n + PostgreSQL |

**NON usare MAI**: axios, moment.js, Redux, styled-components, Material UI, Ant Design, Chakra UI, localStorage per dati persistenti.

---

## Architettura: Configurazione Dinamica (Zero Hardcoding)

### Principio fondamentale

TUTTO ciò che è un elenco, una configurazione, un'opzione selezionabile viene da database. Il frontend carica le configurazioni all'avvio e le tiene in cache con TanStack Query.

### Cosa viene da database (tabella `configurazioni`)

| Tipo configurazione | Esempio valori | Modificabile da |
|---------------------|----------------|-----------------|
| Stati cantiere (FSM) | LEAD, VENDITA, ACCONTO... | Solo admin |
| Transizioni FSM ammesse | LEAD→VENDITA, VENDITA→ACCONTO... | Solo admin |
| Vincoli per transizione | "Acconto 40% registrato" | Solo admin |
| Ruoli utente | admin, venditore, centralino... | Solo admin |
| Permessi per ruolo | sezioni visibili, azioni permesse | Solo admin |
| Tipi prodotto | Evolution Elite, Bioclimatica Plus... | Admin |
| Aree aziendali | Commerciale, Operativa, Uff. Tecnico... | Admin |
| Colori stati | POSA=#1B8C3A, ALERT=#ef4444... | Admin |
| Template notifiche | Testo alert ritardo fornitore | Admin |

### Pattern nel frontend

```typescript
// COME FUNZIONA: hook che carica config da API
function useConfigurazione(tipo: string) {
  return useQuery({
    queryKey: ["config", tipo],
    queryFn: () => configApi.lista(tipo),
    staleTime: 5 * 60 * 1000,  // cache 5 minuti
  });
}

// USO NEI COMPONENTI
function BadgeStato({ stato }: { stato: string }) {
  const { data: statiConfig } = useConfigurazione("stati_cantiere");
  const config = statiConfig?.find(s => s.codice === stato);
  // colore, label, icona vengono TUTTI da DB
  return <span style={{ color: config?.colore }}>{config?.label}</span>;
}
```

---

## Layer AI

### Architettura AI

Il gestionale include un sistema AI integrato che usa OpenRouter come gateway per accedere a più modelli (GPT-4, Gemini, Claude) in base al task.

| Funzione AI | Modello consigliato | Descrizione |
|-------------|-------------------|-------------|
| Chat conversazionale | GPT-4o / Claude Sonnet | Domande libere, assistenza |
| Text-to-SQL (query DB) | GPT-4o / Claude Sonnet | Genera SQL da domande in italiano |
| Generazione dashboard | Claude Sonnet / GPT-4o | Crea configurazione dashboard da prompt |
| Creazione tabelle | Claude Sonnet | Genera schema tabella + interfaccia CRUD |
| Report narrativi | Claude Sonnet / GPT-4o | Report in italiano da dati cantiere |

### AI Chat — Funzionalità

1. **Interrogazione database**: l'utente chiede in italiano ("quanti cantieri abbiamo in stato POSA?"), l'AI genera SQL, lo esegue in sandbox read-only, restituisce risposta in italiano con dati.
2. **Generazione report**: "fammi un report sui cantieri completati questo mese con margini" → l'AI interroga il DB, formatta un report scaricabile.
3. **Creazione dashboard dinamiche**: "crea una dashboard con grafico a torta degli stati cantiere e una tabella con i cantieri in ritardo" → l'AI genera una configurazione JSON che il frontend renderizza. La dashboard può essere salvata, modificata, eliminata, riselezionata.
4. **Creazione tabelle dinamiche**: "crea una tabella omaggi con colonne nome, valore, ordinamento, categoria" → l'AI genera:
   - Schema SQL (CREATE TABLE)
   - JSON configurazione per form insert/update
   - JSON configurazione per vista tabella con colonne ordinabili/filtrabili
   - Endpoint API (CRUD) registrati nel sistema
   - Aggiornamento automatico del manuale API
   - Ogni interfaccia di lista include bottoni export CSV, Excel, JSON

### Sicurezza AI-SQL

- Le query generate dall'AI vengono eseguite con un utente PostgreSQL READ-ONLY
- Le query di modifica (INSERT, UPDATE, DELETE) passano SEMPRE attraverso n8n con validazione
- L'AI non ha accesso diretto al database — passa da n8n
- Ogni query generata viene loggata con timestamp, utente, prompt originale

---

## Struttura Cartelle (OBBLIGATORIA)

```
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── cantieri/
│   │   ├── clienti/
│   │   ├── fornitori/
│   │   ├── squadre/
│   │   ├── calendario/              # Google Calendar integrato
│   │   ├── report/
│   │   ├── ai/                      # Chat AI + dashboard dinamiche
│   │   │   ├── page.tsx             # Chat principale
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx         # Lista dashboard salvate
│   │   │   │   └── [id]/page.tsx    # Dashboard specifica
│   │   │   └── tabelle/
│   │   │       ├── page.tsx         # Lista tabelle dinamiche
│   │   │       └── [nome]/page.tsx  # Vista/edit tabella
│   │   └── admin/
│   │       ├── configurazioni/      # Editor configurazioni da DB
│   │       ├── utenti/              # Gestione utenti/ruoli
│   │       └── tabelle-sistema/     # Editor tabelle config
│   └── api/
│       ├── cantieri/
│       ├── config/                   # API configurazioni dinamiche
│       ├── ai/                       # Proxy AI (OpenRouter)
│       ├── calendar/                 # Proxy Google Calendar
│       ├── drive/                    # Proxy Google Drive
│       └── tabelle-dinamiche/        # CRUD tabelle create da AI
│
├── components/
│   ├── ui/                           # Atomici (shadcn + custom)
│   ├── forms/                        # Campi form riutilizzabili
│   ├── modules/
│   │   ├── timeline/
│   │   ├── kanban/
│   │   ├── media-gallery/
│   │   ├── cantiere-detail/
│   │   ├── nav/
│   │   ├── ai-chat/                  # Chat AI con risultati inline
│   │   │   ├── ai-chat.tsx
│   │   │   ├── ai-message.tsx
│   │   │   ├── ai-risultato-query.tsx
│   │   │   ├── ai-dashboard-preview.tsx
│   │   │   └── ai-tabella-preview.tsx
│   │   ├── dashboard-dinamica/       # Renderer dashboard da JSON config
│   │   │   ├── dashboard-renderer.tsx
│   │   │   ├── widget-grafico.tsx
│   │   │   ├── widget-tabella.tsx
│   │   │   ├── widget-contatore.tsx
│   │   │   └── widget-lista.tsx
│   │   ├── tabella-dinamica/         # Renderer tabella CRUD da JSON config
│   │   │   ├── tabella-dinamica.tsx
│   │   │   ├── form-dinamico.tsx
│   │   │   └── export-toolbar.tsx    # CSV, Excel, JSON
│   │   └── calendario/              # Integrazione Google Calendar
│   │       ├── calendario-view.tsx
│   │       └── evento-form.tsx
│   └── layouts/
│       ├── admin-layout.tsx
│       ├── titolare-layout.tsx       # Gabriele Forni
│       ├── venditore-layout.tsx
│       ├── centralino-layout.tsx
│       ├── tecnico-layout.tsx
│       ├── logistica-layout.tsx      # Simone Cocci
│       ├── posatore-layout.tsx       # Capisquadra + installatori
│       ├── magazziniere-layout.tsx
│       ├── contabilita-layout.tsx
│       └── amministrazione-layout.tsx
│
├── hooks/
│   ├── use-role.ts
│   ├── use-cantiere.ts
│   ├── use-cantieri.ts
│   ├── use-timeline.ts
│   ├── use-fsm.ts
│   ├── use-media-upload.ts
│   ├── use-configurazione.ts         # Carica config dinamiche da DB
│   ├── use-ai-chat.ts               # Gestione conversazione AI
│   ├── use-dashboard-dinamica.ts     # CRUD dashboard salvate
│   ├── use-tabella-dinamica.ts       # CRUD tabelle dinamiche
│   ├── use-calendario.ts            # Google Calendar
│   └── use-google-drive.ts          # Upload/download da Drive
│
├── lib/
│   ├── api.ts
│   ├── api-ai.ts                     # Client OpenRouter
│   ├── api-calendar.ts               # Client Google Calendar
│   ├── api-drive.ts                  # Client Google Drive
│   ├── validations.ts
│   ├── roles.ts                      # Helper (legge ruoli da DB, non hardcoded)
│   ├── fsm.ts                        # Helper (legge stati da DB, non hardcoded)
│   ├── constants.ts                  # Solo costanti tecniche (timeout, limiti)
│   ├── utils.ts
│   ├── export-utils.ts               # Generazione CSV, Excel, JSON
│   └── ai-prompts.ts                 # System prompt per AI (text-to-SQL, dashboard gen)
│
├── stores/
│   ├── ui-store.ts
│   ├── cantiere-store.ts
│   ├── config-store.ts               # Cache configurazioni da DB
│   └── ai-store.ts                   # Stato chat AI, dashboard attiva
│
├── types/
│   ├── cantiere.ts
│   ├── cliente.ts
│   ├── fornitore.ts
│   ├── squadra.ts
│   ├── timeline.ts
│   ├── user.ts
│   ├── api.ts
│   ├── config.ts                     # Tipi per configurazioni dinamiche
│   ├── ai.ts                         # Tipi per AI chat, dashboard, tabelle
│   └── tabella-dinamica.ts           # Schema tabelle generate da AI
│
└── styles/
    └── globals.css
```

---

## Convenzioni di Codice

### Naming

| Cosa | Convenzione | Esempio |
|------|------------|---------|
| File componenti | kebab-case | `campo-codice-fiscale.tsx` |
| Componenti React | PascalCase | `CampoCodiceFiscale` |
| Hook | camelCase con prefisso `use` | `useCantiere` |
| Tipi/Interfacce | PascalCase | `Cantiere`, `TimelineEntry` |
| Costanti tecniche | UPPER_SNAKE | `QUERY_STALE_TIME` |
| Variabili CSS | `--pf-*` | `--pf-accent-primary` |
| Prop callback | prefisso `on` | `onStatoChange` |
| Flag booleano | prefisso `is/has/can` | `isLoading`, `hasAcconto` |
| Testi utente | italiano | `"Cantiere creato con successo"` |
| Commenti codice | italiano | `// Carica configurazione stati da DB` |

### Regole TypeScript

```typescript
// SEMPRE: tipi espliciti per props
interface CampoTelefonoProps {
  value: string;
  onChange: (value: string) => void;
  paese?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// SEMPRE: export named per componenti riutilizzabili
export function CampoTelefono({ value, onChange, paese = "IT", ...props }: CampoTelefonoProps) { }

// MAI: any, as any, @ts-ignore, @ts-expect-error
// MAI: componenti class (solo functional)
// MAI: useEffect per data fetching (usa TanStack Query)
// MAI: array/oggetti hardcoded per dati che vengono da DB
```

### Regole Form e Validazione

Pattern identico alla v1 (React Hook Form + Zod + librerie specifiche per CF, telefono, IBAN). Vedi COMPONENT_CATALOG.md per dettagli.

### Regole Export Dati

OGNI interfaccia che mostra una lista o tabella DEVE includere:
- Bottone export **CSV**
- Bottone export **Excel** (.xlsx)
- Bottone export **JSON**

Usa `export-utils.ts` con funzioni centralizzate. Librerie: `xlsx` per Excel, `json2csv` per CSV.

---

## Organigramma Reale — Lunardi & Forni

| Persona | Ruolo | Area | Email aziendale | Ruolo gestionale |
|---------|-------|------|----------------|-----------------|
| Gabriele Forni | Titolare/Socio | Direzione | gabriele@lunardieforni.it | `titolare` |
| Marco Vitaletti | Admin/Workflow | Tutto | v.marco@lunardieforni.it | `admin` |
| Martina Cialdi | Centralino | Primo contatto | assistenza@lunardieforni.it | `centralino` |
| Alberto Bini | Venditore | Commerciale | b.alberto@lunardieforni.it | `venditore` |
| Davide Guidotti | Venditore | Commerciale | commerciale@lunardieforni.it | `venditore` |
| Gabriele Albanese | Venditore | Commerciale | a.gabriele@lunardieforni.it | `venditore` |
| Simone Cocci | Logistica/Acquisti | Logistica | ordini@lunardieforni.it | `logistica` |
| Michele Ciolini | Tecnico | Ufficio Tecnico | tecnico@lunardieforni.it | `tecnico` |
| Leonardo Manzone | Magazziniere | Magazzino | — | `magazziniere` |
| Martina Forni | Amministrazione | Amministrazione | info@lunardieforni.it | `amministrazione` |
| Lara Cappellini | Contabilità | Amministrazione | amministrazionelef@gmail.com | `contabilita` |
| Francesco Sinagra | Caposquadra | Operativa | — | `caposquadra` |
| Roberto Giglioni | Caposquadra | Operativa | — | `caposquadra` |
| Leonardo Sinagra | Caposquadra | Operativa | — | `caposquadra` |
| Antonino Sanfilippo | Caposquadra (part-time) | Operativa | — | `caposquadra` |
| Pierpaolo Giachi | Installatore | Operativa | — | `installatore` |
| Francesco Ponziani | Installatore | Operativa | — | `installatore` |
| Daniele Falcetta | Installatore | Operativa | — | `installatore` |
| Alessio Consales | Installatore | Operativa | — | `installatore` |

**Nota**: I ruoli sono definiti in database (tabella `ruoli`), NON hardcoded. L'organigramma sopra è il seed iniziale.

---

## Integrazioni Esterne

### Google Calendar
- Migrazione da GroupCal (app.groupcal.app)
- Ogni cantiere con data posa crea evento calendario
- Calendari separati per squadre
- Visualizzazione nel gestionale con componente integrato

### Google Drive
- Storage file caricati (foto cantiere, progetti, fatture PDF)
- Cartella condivisa aziendale specifica
- Struttura cartelle: `ProjectFlow/{codice_cantiere}/{tipo_documento}/`
- Upload via API, download via link condivisibile

### n8n
- URL: https://n8n.quarrataweb.it
- Tutti gli endpoint API sono workflow n8n
- Logica FSM, validazioni, notifiche, alert automatici
- Integrazione AI (proxy verso OpenRouter)

---

## File .env (TEMPLATE — inserire credenziali reali SOLO sul server)

```env
# === APP ===
NEXT_PUBLIC_APP_NAME=ProjectFlow
NEXT_PUBLIC_APP_URL=https://projectflow.lunardieforni.it  # o localhost:3000 in dev

# === N8N ===
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.quarrataweb.it/webhook
N8N_API_KEY=                        # API key n8n (se usi autenticazione webhook)

# === DATABASE (usato da n8n, non dal frontend) ===
# DB_HOST=
# DB_PORT=5432
# DB_NAME=
# DB_USER=
# DB_PASSWORD=

# === CLERK (Auth) ===
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# === OPENROUTER (AI Gateway) ===
OPENROUTER_API_KEY=
OPENROUTER_DEFAULT_MODEL=openai/gpt-4o
OPENROUTER_FALLBACK_MODEL=google/gemini-pro

# === GOOGLE (Calendar + Drive) ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_DRIVE_FOLDER_ID=             # ID cartella condivisa per file
GOOGLE_CALENDAR_ID=                  # ID calendario principale

# === SICUREZZA ===
AI_SQL_MAX_ROWS=1000                 # Limite righe per query AI
AI_SQL_TIMEOUT_MS=10000              # Timeout query AI
```

---

## Istruzioni per AI che Genera Codice (aggiornate)

1. **Leggi SEMPRE questo file prima di scrivere codice**
2. **SCRIVI IN ITALIANO**: variabili, commenti, messaggi utente, documentazione
3. **ZERO HARDCODING**: se è una lista o configurazione, viene da DB. Punto.
4. **CERCA PRIMA DI CREARE**: esiste un pacchetto npm? Un componente shadcn? Una libreria specializzata? Cerca e proponi prima di scrivere codice custom.
5. **CHIEDI SE MANCA QUALCOSA**: API key, URL, credenziali, specifiche — chiedi, non inventare
6. **Rispetta la struttura cartelle**: non creare file in posizioni diverse da quelle specificate
7. **Rispetta le convenzioni di naming**: controlla la tabella
8. **Props tipizzate con default ragionevoli**
9. **Non installare pacchetti non nello stack** senza approvazione
10. **Responsive = composizione diversa**, non breakpoint CSS
11. **Il frontend NON valida transizioni FSM**: la decisione è di n8n
12. **TanStack Query per OGNI fetch**: niente useEffect + fetch
13. **Export CSV/Excel/JSON su OGNI lista/tabella**
14. **Configurazioni da DB con cache TanStack Query** (staleTime 5 min)
