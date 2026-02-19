# Guida Sessioni AI — ProjectFlow v2

> Come iniziare ogni sessione di coding AI per risultati coerenti e professionali.

---

## File da Fornire ad OGNI Sessione

| File | Quando | Obbligatorio |
|------|--------|-------------|
| `PROJECT_RULES.md` | SEMPRE | ✅ Sempre |
| `COMPONENT_CATALOG.md` | Task UI/componenti | Se tocchi frontend |
| `DATABASE_SCHEMA.md` | Task dati/API/AI | Se tocchi dati |
| `API_ENDPOINTS.md` | Task integrazione | Se colleghi frontend↔backend |

### Configurazione per Tool

**Claude Code / CLI** → `CLAUDE.md` nella root:
```markdown
Leggi SEMPRE questi file prima di scrivere codice:
- docs/PROJECT_RULES.md (OBBLIGATORIO)
- docs/COMPONENT_CATALOG.md
- docs/DATABASE_SCHEMA.md
- docs/API_ENDPOINTS.md

REGOLE CRITICHE:
- Scrivi TUTTO in italiano (commenti, variabili, messaggi)
- ZERO hardcoding: liste e config da database
- CERCA librerie npm prima di creare componenti custom
- CHIEDI se mancano API key, URL, credenziali
```

**Cursor** → `.cursor/rules/project-rules.mdc`

**Windsurf** → `.windsurfrules`

---

## Regole Critiche per Ogni Sessione

### 1. LINGUA ITALIANA
```typescript
// ✅ CORRETTO
const cantiereSelezionato = useCantiere(id);
const { data: listaStati } = useConfigurazione("stati_cantiere");
// Carica la configurazione dal database
if (!cantiereSelezionato) return <StatoVuoto titolo="Cantiere non trovato" />;

// ❌ SBAGLIATO
const selectedSite = useSite(id);
const { data: statusList } = useConfig("site_status");
// Load config from database
if (!selectedSite) return <EmptyState title="Site not found" />;
```

### 2. ZERO HARDCODING
```typescript
// ✅ CORRETTO — stati da database
function KanbanBoard() {
  const { data: stati } = useConfigurazione("stati_cantiere");
  if (!stati) return <SkeletonLoader tipo="kanban" />;
  return stati.map(s => <KanbanColumn key={s.id} stato={s} />);
}

// ❌ SBAGLIATO — stati hardcoded
const STATI = ["LEAD", "VENDITA", "ACCONTO"]; // MAI
function KanbanBoard() {
  return STATI.map(s => <KanbanColumn key={s} stato={s} />);
}
```

### 3. CERCA PRIMA DI CREARE
Prima di scrivere qualsiasi componente, il modello AI deve:
1. Verificare se shadcn/ui ha già il componente
2. Cercare su npm un pacchetto che fa quel lavoro
3. Proporre la libreria trovata con pro/contro
4. Solo se non esiste nulla di adatto: scrivere codice custom

Esempio: serve un calendario? Non scrivere un calendario da zero. Usa `@fullcalendar/react` o `react-big-calendar`.

### 4. EXPORT SU OGNI LISTA
```typescript
// ✅ OGNI componente che mostra una lista DEVE avere ExportToolbar
function ListaCantieri({ cantieri }) {
  return (
    <>
      <ExportToolbar
        dati={cantieri}
        nomeFile="cantieri"
        colonne={[
          { chiave: "codice", label: "Codice" },
          { chiave: "cliente", label: "Cliente" },
          // ...
        ]}
      />
      <TabellaRisultati dati={cantieri} />
    </>
  );
}
```

---

## Template per Task

### Nuovo componente atomico
```
CONTESTO: Progetto ProjectFlow Lunardi & Forni. Leggi PROJECT_RULES.md e COMPONENT_CATALOG.md.

TASK: Crea [nome] in components/ui/[nome].tsx

REGOLE:
- Tema dark con variabili --pf-* (verde brand #1B8C3A)
- Props tipizzate, export named
- CERCA se esiste libreria npm adatta prima di scrivere custom
- Commenti e variabili in italiano
```

### Nuovo campo form
```
CONTESTO: ProjectFlow. Leggi sezione "Regole Form e Validazione" in PROJECT_RULES.md.

TASK: Crea campo-[nome].tsx in components/forms/

REGOLE:
- React Hook Form + useFormContext()
- Validazione Zod (aggiungi a lib/validations.ts)
- Cerca libreria validazione specifica (es. codice-fiscale-js per CF)
- Error inline, supporto required/disabled
```

### Nuovo modulo con dati da DB
```
CONTESTO: ProjectFlow. Leggi COMPONENT_CATALOG.md e DATABASE_SCHEMA.md.

TASK: Crea modulo [nome] in components/modules/[nome]/

REGOLE:
- Dati da DB via hook TanStack Query
- NIENTE dati hardcoded, niente fallback inventati
- Se servono opzioni (stati, tipi, ruoli): usa useConfigurazione()
- ExportToolbar se c'è una lista
```

### Workflow n8n per endpoint
```
CONTESTO: ProjectFlow. Leggi DATABASE_SCHEMA.md e API_ENDPOINTS.md.

TASK: Workflow n8n per [endpoint]

REGOLE:
- Verifica auth Clerk, estrai user_id e ruolo
- Ruoli e permessi da tabella DB, non hardcoded
- Transizioni FSM da tabelle DB (transizioni_stato + vincoli_transizione)
- Logga in timeline dove indicato
- Risposta nel formato standard { data: T }
```

### Tabella dinamica AI
```
CONTESTO: ProjectFlow. Leggi sezione "Meta-Schema: Tabelle Dinamiche" in DATABASE_SCHEMA.md.

TASK: Implementa il flusso creazione tabella da prompt AI

REGOLE:
- AI genera: schema_colonne, config_form, config_vista (JSON)
- n8n esegue CREATE TABLE
- n8n registra in tabelle_dinamiche
- Frontend usa tabella-dinamica.tsx per renderizzare CRUD
- SEMPRE export CSV/Excel/JSON
```

---

## Ordine di Sviluppo (Fasi)

### Fase 0: Setup Infrastruttura (1-2 sessioni)
- Init Next.js + TypeScript + Tailwind
- Installa TUTTE le dipendenze da PROJECT_RULES.md
- Configura Clerk
- Setup shadcn/ui con tema dark Lunardi & Forni
- Crea globals.css con variabili --pf-*
- Crea struttura cartelle vuota completa
- File .env con placeholder
- Crea tabelle config in PostgreSQL (ruoli, stati, transizioni, vincoli, tipi_prodotto, aree)
- Seed dati iniziali (organigramma reale, stati FSM, transizioni)

### Fase 1: Fondamenta Codice (3-5 sessioni)
- `types/` — tutti i tipi TypeScript
- `lib/validations.ts` — schemi Zod
- `lib/api.ts` — client API generico
- `lib/roles.ts` — helper ruoli (legge da DB)
- `lib/fsm.ts` — helper FSM (legge da DB)
- `lib/export-utils.ts` — generazione CSV, Excel, JSON
- `hooks/use-configurazione.ts` — hook config da DB (critico, tutto dipende da questo)
- `hooks/use-role.ts` — hook ruolo utente
- `stores/` — Zustand stores

### Fase 2: Componenti Atomici (5-8 sessioni)
- Installa e personalizza shadcn/ui
- Crea componenti custom ui/
- Crea TUTTI i campi forms/ (CF, telefono, IBAN, email, valuta, data, select-config)
- `export-toolbar.tsx`
- Test visuale di ogni componente

### Fase 3: Hook e API (3-5 sessioni)
- Tutti gli hook in hooks/
- Workflow n8n per ogni endpoint base (cantieri, clienti, fornitori, squadre, timeline, media)
- Endpoint configurazioni (GET/POST/PATCH config)
- Test API

### Fase 4: Moduli Core (5-8 sessioni)
- Timeline (con foto da Google Drive)
- Kanban (colonne da DB)
- Media Gallery (upload Google Drive)
- Cantiere Detail
- Nav (pill desktop + bottom bar mobile)
- Calendario (Google Calendar)

### Fase 5: Layout e Pagine (3-5 sessioni)
- Layout per ogni ruolo
- Pagine app/ con routing
- Guard per ruolo
- Mobile: layout posatore/caposquadra

### Fase 6: Layer AI (5-8 sessioni)
- `lib/api-ai.ts` — client OpenRouter
- `lib/ai-prompts.ts` — system prompt con schema DB
- Modulo ai-chat/ completo
- Workflow n8n: proxy AI, text-to-SQL, sandbox query
- `ai_query_log` per sicurezza
- Risultati query con ExportToolbar

### Fase 7: Dashboard e Tabelle Dinamiche (5-8 sessioni)
- Generazione dashboard da prompt AI
- Salvataggio/modifica/eliminazione dashboard
- Renderer widget (grafici, tabelle, contatori)
- Creazione tabelle dinamiche da prompt AI
- Form dinamico da config JSON
- Tabella dinamica con CRUD + export
- CRUD endpoint automatici per tabelle dinamiche

### Fase 8: Integrazione, Polish, Test (3-5 sessioni)
- Collegamento completo frontend ↔ backend
- Migrazione calendario da GroupCal
- Seed utenti reali in Clerk
- Test flussi end-to-end per ogni ruolo
- Fix bug, performance, UX

**Totale stimato: 35-55 sessioni di coding AI**

---

## Checklist Pre-Commit

Prima di considerare pronto un componente:
- [ ] TypeScript strict — niente `any`, niente errori
- [ ] Variabili e commenti in italiano
- [ ] Nessun dato hardcoded (liste, stati, ruoli → da DB)
- [ ] Props tipizzate con interfaccia
- [ ] Export presente se c'è una lista (CSV, Excel, JSON)
- [ ] Responsive: funziona su desktop e mobile
- [ ] Loading state: skeleton o spinner, non schermo vuoto
- [ ] Error state: messaggio chiaro, non crash silenzioso
- [ ] `npm run build` senza errori
- [ ] `npm run lint` senza warning
