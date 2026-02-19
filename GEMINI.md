# ProjectFlow Outdoor — Gestionale Cantieri Lunardi & Forni

> Questo file è il contesto principale del progetto. L'agente lo legge SEMPRE.

## Regole Fondamentali

1. **ITALIANO SEMPRE** — codice, commenti, variabili, messaggi UI, documentazione
2. **ZERO HARDCODING** — ogni lista, enum, configurazione viene da database via API
3. **CERCA PRIMA DI CREARE** — verifica npm/librerie prima di scrivere codice custom
4. **CHIEDI SE MANCA** — API key, URL, credenziali: chiedi, non inventare
5. **CODICE PULITO** — modulare, tipizzato, niente `any`, niente fallback finti
6. **EXPORT SU OGNI LISTA** — CSV, Excel, JSON su qualsiasi tabella/lista
7. **GIT COMMIT A OGNI MILESTONE** — vedi ROADMAP.md per stato avanzamento

## Stack Tecnologico

Next.js 14+ (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui (custom dark theme) · Radix UI · Clerk (auth/ruoli) · React Hook Form + Zod · TanStack Table + TanStack Query · dnd-kit · Zustand · react-dropzone · date-fns (it) · react-day-picker · OpenRouter (AI multi-modello) · n8n webhook (backend) · PostgreSQL 15+ · Google Drive API (storage) · Google Calendar API

**MAI usare**: axios, moment.js, Redux, styled-components, Material UI, Ant Design, Chakra UI

## Tema Visivo

Dark theme unico. Verde brand `#1B8C3A`. Font: Outfit + monospace. Vedere `docs/PROJECT_RULES.md` per palette completa `--pf-*`.

## Documentazione Dettagliata (in `docs/`)

| File | Contenuto |
|------|-----------|
| `docs/PROJECT_RULES.md` | Stack completo, convenzioni, palette, struttura cartelle, .env template |
| `docs/COMPONENT_CATALOG.md` | Ogni componente con interfaccia Props e dipendenze |
| `docs/DATABASE_SCHEMA.md` | Tutte le tabelle PostgreSQL, meta-schema tabelle dinamiche |
| `docs/API_ENDPOINTS.md` | Tutti gli endpoint n8n con request/response |
| `docs/SEED_DATA.md` | SQL per dati iniziali (organigramma, stati, ruoli, transizioni) |
| `ROADMAP.md` | Stato avanzamento, blocchi, milestone, git tag |

**LEGGI il documento specifico prima di lavorare su quel layer.**

## Stato Progetto Attuale

Controlla `ROADMAP.md` per sapere a che blocco siamo, cosa è completato, e cosa fare dopo.

## Git Strategy

```bash
# Formato commit
tipo(scope): descrizione in italiano

# Tipi: feat, fix, refactor, docs, style, chore, test
# Scope: ui, forms, hooks, api, db, auth, ai, config, layout

# Esempi:
feat(ui): aggiunto componente badge-stato con colori da DB
feat(forms): campo codice fiscale con validazione codice-fiscale-js
fix(api): corretta gestione errore 422 su transizione FSM
docs(roadmap): completato blocco 2 — componenti atomici

# Tag per milestone
git tag -a v0.1.0 -m "Blocco 1: fondamenta completate"
git tag -a v0.2.0 -m "Blocco 2: componenti atomici completati"
```

**REGOLA: dopo ogni task completato, fai commit. Dopo ogni blocco completato, fai tag.**
