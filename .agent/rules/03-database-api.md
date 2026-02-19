---
trigger: working with database, SQL, API endpoints, n8n workflows, or files in lib/api
description: Regole per database, API, e logica backend ProjectFlow
---

# Regole Database e API

## Database
- UUID come primary key ovunque (gen_random_uuid())
- TIMESTAMPTZ per timestamp (UTC, frontend converte)
- FK verso `utenti_gestionale`, non stringhe clerk_user_id sparse
- JSONB per dati semi-strutturati
- Flag `attivo` per soft-delete (non si cancella mai una config)
- Indici su tutte le FK e campi di ricerca

## API (n8n webhook)
- Risposta successo: `{ "data": T, "meta?": { "totale": N, "pagina": N } }`
- Risposta errore: `{ "error": { "codice": "...", "messaggio": "...", "dettagli?": {} } }`
- HTTP: 200, 201, 400, 403, 404, 422
- Auth: header `Authorization: Bearer <clerk_token>`
- Ruoli e permessi verificati lato n8n da tabella `permessi_ruolo`

## FSM (transizioni stato cantiere)
- Transizioni ammesse in tabella `transizioni_stato` (NON nel codice)
- Vincoli in tabella `vincoli_transizione` (NON nel codice)
- Validazione SEMPRE lato n8n, MAI nel frontend
- Frontend mostra vincoli e disabilita UI, ma la decisione è di n8n
- Errore 422 con `vincoli_mancanti` se transizione non valida

## Leggere prima di lavorare
- `docs/DATABASE_SCHEMA.md` per schema completo
- `docs/API_ENDPOINTS.md` per endpoint e formati
