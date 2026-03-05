# ROADMAP — ProjectFlow

> Documento vivo. Aggiorna lo stato dopo ogni task completato. L'agente lo legge per sapere dove siamo.

---

## Stato Attuale

```
BLOCCO CORRENTE: 5 — Layout, Pagine, Admin (avanzato)
ULTIMA MILESTONE: v0.2.0
ULTIMO COMMIT: 49abff3
```

---

## Blocco 0: Setup Infrastruttura
**Tag: `v0.0.1`** · Stima: 1-2 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 0.1 | Init Next.js + TypeScript + Tailwind | ✅ | `20c7299` |
| 0.2 | Installa TUTTE le dipendenze da stack | ✅ | `20c7299` |
| 0.3 | Configura Clerk (auth) | ✅ | `8649a8b` |
| 0.4 | Setup shadcn/ui + tema dark Lunardi & Forni | ✅ | `8649a8b` |
| 0.5 | Crea `globals.css` con variabili `--pf-*` | ✅ | `20c7299` |
| 0.6 | Crea struttura cartelle completa (vuota) | ✅ | `20c7299` |
| 0.7 | File `.env.local` con placeholder | ✅ | `20c7299` |
| 0.8 | Setup PostgreSQL: crea tabelle config (ruoli, stati, transizioni, vincoli, tipi, aree) | ✅ | `fce03b0` |
| 0.9 | Esegui SEED_DATA.md (dati iniziali) | ✅ | `fce03b0` |
| 0.10 | Init git + primo commit + tag v0.0.1 | ✅ | `20c7299` |

**Criterio completamento**: progetto parte con `npm run dev`, Clerk login funziona, DB ha tabelle config populate.

---

## Blocco 1: Fondamenta Codice
**Tag: `v0.1.0`** · Stima: 3-5 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 1.1 | `types/` — tutti i tipi TypeScript (cantiere, cliente, config, ai...) | ✅ | `0749487` |
| 1.2 | `lib/validations.ts` — schemi Zod (CF, telefono, IBAN, email, valuta) | ✅ | `0749487` |
| 1.3 | `lib/api.ts` — client API generico (fetch wrapper per n8n) | ✅ | `0749487` |
| 1.4 | `lib/export-utils.ts` — generazione CSV, Excel, JSON | ✅ | `0749487` |
| 1.5 | `hooks/use-configurazione.ts` — hook config da DB (CRITICO) | ✅ | `0749487` |
| 1.6 | `hooks/use-role.ts` — hook ruolo utente da Clerk + DB | ✅ | `0749487` |
| 1.7 | `stores/ui-store.ts` + `stores/config-store.ts` | ✅ | `0749487` |
| 1.8 | n8n: workflow `GET /config/:tipo` (endpoint configurazioni) | ⬜ | |
| 1.9 | Test: hook useConfigurazione carica stati/ruoli da DB | ⬜ | |
| 1.10 | Git tag v0.1.0 | ⬜ | |

**Criterio completamento**: `useConfigurazione("stati_cantiere")` restituisce dati dal DB. Export CSV/Excel funziona.

---

## Blocco 2: Componenti Atomici + Form
**Tag: `v0.2.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 2.1 | Installa e personalizza shadcn/ui base (button, input, dialog, tabs, badge...) | ✅ | `351617c` |
| 2.2 | `ui/badge-stato.tsx` (colori da DB) | ✅ | `351617c` |
| 2.3 | `ui/progress-arc.tsx` | ✅ | `351617c` |
| 2.4 | `ui/pill-tabs.tsx` | ✅ | `351617c` |
| 2.5 | `ui/floating-pill-nav.tsx` | ✅ | `351617c` |
| 2.6 | `ui/campo-ricerca.tsx` | ✅ | `351617c` |
| 2.7 | `ui/export-toolbar.tsx` (CSV, Excel, JSON) | ✅ | `351617c` |
| 2.8 | `ui/empty-state.tsx` + `ui/skeleton-loader.tsx` + `ui/conferma-dialog.tsx` | ✅ | `351617c` |
| 2.9 | `forms/campo-codice-fiscale.tsx` (con codice-fiscale-js) | ✅ | `431e3fc` |
| 2.10 | `forms/campo-telefono.tsx` (con libphonenumber-js) | ✅ | `431e3fc` |
| 2.11 | `forms/campo-iban.tsx` (con ibantools) | ✅ | `431e3fc` |
| 2.12 | `forms/campo-email.tsx` + `forms/campo-valuta.tsx` + `forms/campo-data.tsx` | ✅ | `431e3fc` |
| 2.13 | `forms/campo-select-config.tsx` (select generico da tabella DB) | ✅ | `431e3fc` |
| 2.14 | `forms/campo-upload-file.tsx` (react-dropzone) | ✅ | `431e3fc` |
| 2.15 | Pagina test visuale di tutti i componenti (demo page) | ✅ | `431e3fc` |
| 2.16 | Git tag v0.2.0 | ✅ | `431e3fc` |

**Criterio completamento**: tutti i componenti renderizzano correttamente in una demo page, form con validazione funzionano.

---

## Blocco 3: API Backend (n8n)
**Tag: `v0.3.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 3.1 | n8n: CRUD cantieri (GET lista, GET dettaglio, POST, PATCH) | ⬜ | |
| 3.2 | n8n: transizione FSM `POST /cantieri/:id/stato` con vincoli da DB | ⬜ | |
| 3.3 | n8n: `GET /cantieri/:id/vincoli` | ⬜ | |
| 3.4 | n8n: CRUD clienti con validazione CF | ⬜ | |
| 3.5 | n8n: CRUD timeline + media | ⬜ | |
| 3.6 | n8n: CRUD fornitori + ordini | ⬜ | |
| 3.7 | n8n: CRUD fatture + preventivi | ⬜ | |
| 3.8 | n8n: CRUD squadre + membri | ⬜ | |
| 3.9 | n8n: dashboard stats `GET /dashboard/stats` | ⬜ | |
| 3.10 | n8n: CRUD utenti gestionale | ⬜ | |
| 3.11 | n8n: export `?format=csv|excel|json` su tutti gli endpoint lista | ⬜ | |
| 3.12 | Tutti i hook frontend collegati agli endpoint | ⬜ | |
| 3.13 | Git tag v0.3.0 | ⬜ | |

**Criterio completamento**: tutti gli endpoint rispondono, frontend carica dati reali dal DB.

---

## Blocco 4: Moduli Core
**Tag: `v0.4.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 4.1 | `modules/timeline/` completo (lista, entry, add note) | ✅ | |
| 4.2 | `modules/kanban/` completo (board, column, card) — dnd-kit | ✅ | |
| 4.3 | `modules/media-gallery/` (upload Google Drive, thumbnails) | ⏳ | |
| 4.4 | `modules/cantiere-detail/` (header, progress, info, tabs) | ✅ | |
| 4.5 | `modules/nav/` aggiornato con voce Kanban | ✅ | |
| 4.6 | `modules/calendario/` (Google Calendar integration) | ⏳ | |
| 4.7 | Pagina dettaglio cantiere `/cantieri/[id]` | ✅ | |
| 4.8 | Pagina kanban `/kanban` | ✅ | |
| 4.9 | Dati mock espansi (timeline, fornitori, dettaglio) | ✅ | |
| 4.10 | Tabella cantieri con navigazione a dettaglio | ✅ | |
| 4.11 | Git tag v0.4.0 | ⬜ | |

**Criterio completamento**: moduli funzionano standalone con dati mock. Kanban drag-and-drop funziona.

> **Nota**: 4.3 e 4.6 rimandati — richiedono configurazione Google API (Drive + Calendar).

---

## Blocco 5: Layout, Pagine, Admin
**Tag: `v0.5.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 5.1 | `layouts/admin-layout.tsx` + `titolare-layout.tsx` | ✅ | |
| 5.2 | `layouts/venditore-layout.tsx` + `centralino-layout.tsx` | ✅ | |
| 5.3 | `layouts/posatore-layout.tsx` (mobile-first, caposquadra + installatore) | ✅ | |
| 5.4 | `layouts/tecnico-layout.tsx` + `logistica-layout.tsx` + `magazziniere-layout.tsx` | ✅ | |
| 5.5 | `layouts/contabilita-layout.tsx` + `amministrazione-layout.tsx` | ✅ | |
| 5.6 | Pagine app/ con routing completo (clienti, fornitori, squadre, report, admin) | ✅ | `62547c8` |
| 5.7 | Role guard middleware (Clerk) | ✅ | |
| 5.8 | **Admin panel**: `admin/configurazioni/` — editor stati, ruoli, tipi | ✅ | `62547c8` |
| 5.9 | **Admin panel**: `admin/utenti/` — gestione utenti organigramma | ✅ | `62547c8` |
| 5.10 | **Admin panel**: `admin/tabelle-sistema/` — editor tabelle config DB | ✅ | |
| 5.11 | Migrazione calendario da GroupCal a Google Calendar | ⬜ | |
| 5.12 | Seed utenti reali in Clerk (21 persone organigramma) | ⬜ | |
| 5.13 | Git tag v0.5.0 | ⬜ | |

**Criterio completamento**: ogni ruolo vede solo quello che deve. Admin può modificare configurazioni da interfaccia. Login funziona per tutti i 21 utenti.

---

## Blocco 6: Layer AI
**Tag: `v0.6.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 6.1 | `lib/api-ai.ts` — client OpenRouter | ⬜ | |
| 6.2 | `lib/ai-prompts.ts` — system prompt con schema DB per text-to-SQL | ⬜ | |
| 6.3 | n8n: workflow proxy AI con sandbox SQL read-only | ⬜ | |
| 6.4 | `modules/ai-chat/` completo | ⬜ | |
| 6.5 | AI: interrogazione DB da linguaggio naturale | ⬜ | |
| 6.6 | AI: risultati query con ExportToolbar inline | ⬜ | |
| 6.7 | Logging in `ai_query_log` | ⬜ | |
| 6.8 | Git tag v0.6.0 | ⬜ | |

**Criterio completamento**: "quanti cantieri in stato POSA?" restituisce dato corretto dal DB.

---

## Blocco 7: Dashboard e Tabelle Dinamiche
**Tag: `v0.7.0`** · Stima: 5-8 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 7.1 | AI: generazione config dashboard da prompt | ⬜ | |
| 7.2 | `modules/dashboard-dinamica/` — renderer widget (grafici, tabelle, contatori) | ⬜ | |
| 7.3 | CRUD dashboard salvate | ⬜ | |
| 7.4 | AI: generazione schema tabella da prompt | ⬜ | |
| 7.5 | `modules/tabella-dinamica/` — CRUD + form dinamico da config JSON | ⬜ | |
| 7.6 | n8n: endpoint CRUD auto-generati per tabelle dinamiche | ⬜ | |
| 7.7 | Export CSV/Excel/JSON su tutte le tabelle dinamiche | ⬜ | |
| 7.8 | Git tag v0.7.0 | ⬜ | |

**Criterio completamento**: "crea tabella omaggi con nome, valore, categoria" genera tabella funzionante con CRUD ed export.

---

## Blocco 8: Integrazione, Test, Deploy
**Tag: `v1.0.0`** · Stima: 3-5 sessioni

| # | Task | Stato | Commit |
|---|------|-------|--------|
| 8.1 | Test flusso completo: lead → vendita → ... → saldo (ogni stato) | ⬜ | |
| 8.2 | Test ogni ruolo: login, viste, azioni permesse | ⬜ | |
| 8.3 | Test mobile: posatore/caposquadra su smartphone | ⬜ | |
| 8.4 | Test AI: query, dashboard, tabelle | ⬜ | |
| 8.5 | Fix bug, performance, UX | ⬜ | |
| 8.6 | Deploy su VPS (quarrataweb.it) | ⬜ | |
| 8.7 | Git tag v1.0.0 🚀 | ⬜ | |

**Criterio completamento**: sistema in produzione, tutti gli utenti possono accedere e lavorare.

---

## Come Aggiornare Questo File

Dopo ogni task completato:
```markdown
| 0.1 | Init Next.js + TypeScript + Tailwind | ✅ | `abc1234` |
```

Dopo ogni blocco completato:
```markdown
## Stato Attuale
BLOCCO CORRENTE: 1 — Fondamenta Codice
ULTIMA MILESTONE: v0.0.1 — Setup Infrastruttura
ULTIMO COMMIT: abc1234
```

**L'agente DEVE aggiornare ROADMAP.md dopo ogni commit.**
