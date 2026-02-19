---
trigger: working with AI features, chat, text-to-SQL, dashboard generation, or dynamic tables
description: Regole per il layer AI di ProjectFlow (chat, query, dashboard, tabelle dinamiche)
---

# Regole Layer AI

## Architettura AI
- Gateway: OpenRouter API (multi-modello: GPT-4o, Gemini, Claude)
- Le query SQL generate dall'AI vanno eseguite con utente PostgreSQL READ-ONLY
- Ogni query generata viene loggata in `ai_query_log`
- Limite righe: configurabile da `AI_SQL_MAX_ROWS` (.env)

## Chat AI
- L'AI riceve lo schema DB completo nel system prompt
- Risposte in italiano
- Tipi risultato: 'testo', 'query', 'dashboard', 'tabella'
- Risultati query mostrati in tabella con ExportToolbar

## Dashboard Dinamiche
- Config salvata come JSON in `dashboard_salvate.config_widgets`
- Widget: grafico_torta, grafico_barre, grafico_linee, tabella, contatore, lista
- Ogni widget ha la sua query SQL
- Dashboard visibili in base a ruoli (`visibile_a`)

## Tabelle Dinamiche
- Schema in `tabelle_dinamiche.schema_colonne` (JSON)
- Form generato da `config_form` (JSON)
- Vista generata da `config_vista` (JSON)
- CRUD endpoint generati automaticamente: `/dati/:nomeTabella`
- SEMPRE export CSV/Excel/JSON

## Leggere prima di lavorare
- `docs/DATABASE_SCHEMA.md` sezione "Meta-Schema: Tabelle Dinamiche"
- `docs/API_ENDPOINTS.md` sezioni 13-15 (AI)
