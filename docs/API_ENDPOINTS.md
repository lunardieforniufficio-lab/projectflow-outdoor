# API Endpoints — ProjectFlow v2

> Webhook n8n. Il frontend li chiama come REST API. Ogni richiesta include `Authorization: Bearer <clerk_token>`.

## Base URL
```
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.quarrataweb.it/webhook
```

## Convenzioni Risposta
```json
// Successo
{ "data": T, "meta?": { "totale": 0, "pagina": 0 } }
// Errore
{ "error": { "codice": "string", "messaggio": "string", "dettagli?": {} } }
// HTTP: 200 OK, 201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found, 422 Unprocessable
```

---

## 1. Configurazioni Dinamiche

### `GET /config/:tipo`
Carica configurazione da DB. Tipo: `ruoli`, `stati_cantiere`, `tipi_prodotto`, `aree_aziendali`, `configurazioni`.
```json
// GET /config/stati_cantiere
{ "data": [
  { "id": "uuid", "codice": "LEAD", "label": "Lead", "colore": "#3b82f6", "icona": "user-plus", "ordine": 1 },
  { "id": "uuid", "codice": "VENDITA", "label": "Vendita", "colore": "#f59e0b", "ordine": 2 }
] }
```

### `POST /config/:tipo`
Crea nuova voce configurazione (solo admin).

### `PATCH /config/:tipo/:id`
Modifica voce configurazione (solo admin).

### `DELETE /config/:tipo/:id`
Soft-delete (imposta attivo=false) voce configurazione (solo admin).

### `GET /config/transizioni`
Lista transizioni FSM con vincoli.
```json
{ "data": [
  {
    "id": "uuid",
    "stato_da": { "codice": "ACCONTO", "label": "Acconto" },
    "stato_a": { "codice": "RILIEVO", "label": "Rilievo" },
    "vincoli": [
      { "id": "uuid", "descrizione": "Acconto 40% registrato", "tipo_verifica": "campo_cantiere", "campo": "acconto_pagato" }
    ]
  }
] }
```

### `GET /config/permessi/:ruoloId`
Permessi per un ruolo specifico.

### `PATCH /config/permessi/:ruoloId`
Aggiorna permessi ruolo (solo admin).

---

## 2. Cantieri

### `GET /cantieri`
```
Query: stato_id?, squadra_id?, search?, pagina?, limite?, ordine?
```
Filtrato automaticamente per ruolo utente.

### `GET /cantieri/:id`
Dettaglio con relazioni (cliente, squadra, rilievo, progetto, sommario fatture).

### `POST /cantieri`
```json
{
  "cliente_id": "uuid",
  "tipo_prodotto_id": "uuid",
  "indirizzo_cantiere": "Via Roma 42, Bologna",
  "citta_cantiere": "Bologna",
  "importo_totale": 18425.00
}
```
n8n: genera codice, imposta stato iniziale da DB, crea entry timeline, crea cartella Google Drive, crea evento Google Calendar se data prevista.

### `PATCH /cantieri/:id`

### `POST /cantieri/:id/stato`
Transizione FSM.
```json
{ "nuovo_stato_id": "uuid" }
```
n8n:
1. Verifica transizione ammessa (tabella `transizioni_stato`)
2. Verifica vincoli (tabella `vincoli_transizione`)
3. Se ok: aggiorna, crea timeline, notifica
4. Se ko: 422 con vincoli mancanti

### `GET /cantieri/:id/vincoli`
Stato vincoli per prossima transizione.

---

## 3. Timeline

### `GET /cantieri/:id/timeline`
```
Query: tipo?, limite? (default 50), cursore?
```

### `POST /cantieri/:id/timeline`
```json
{ "tipo": "nota", "contenuto": "Testo nota", "media_ids": ["uuid1"] }
```

---

## 4. Media (Google Drive)

### `GET /cantieri/:id/media`
```
Query: tipo? (foto, video, documento, progetto)
```

### `POST /cantieri/:id/media`
Multipart upload → n8n salva su Google Drive nella cartella del cantiere.
```
Form: file, tipo
```
Risposta include `google_drive_file_id` e `google_drive_url`.

### `GET /media/:id/url`
Restituisce URL condivisibile Google Drive.

---

## 5. Clienti

### `GET /clienti` — `GET /clienti/:id` — `POST /clienti` — `PATCH /clienti/:id`
Struttura standard. POST valida CF con codice-fiscale-js.

---

## 6. Fornitori

### `GET /fornitori` — `GET /fornitori/:id` — `POST /fornitori` — `PATCH /fornitori/:id`

---

## 7. Ordini Fornitore

### `GET /cantieri/:id/ordini` — `POST /cantieri/:id/ordini` — `PATCH /ordini/:id`
Se ritardo > soglia da `configurazioni.giorni_alert_ritardo`: alert automatico.

---

## 8. Fatture e Preventivi

### `GET /cantieri/:id/fatture` — `POST /cantieri/:id/fatture` — `PATCH /fatture/:id`
Se tipo=acconto e importo >= soglia da `configurazioni.percentuale_acconto`: aggiorna `acconto_pagato=true`.

### `GET /cantieri/:id/preventivi` — `POST /cantieri/:id/preventivi` — `PATCH /preventivi/:id`

---

## 9. Squadre

### `GET /squadre` — `GET /squadre/:id` — `POST /squadre` — `PATCH /squadre/:id`
Dettaglio include membri con ruolo.

---

## 10. Rilievi e Progetti

### `GET /cantieri/:id/rilievo` — `POST /cantieri/:id/rilievo` — `PATCH /cantieri/:id/rilievo`
### `GET /cantieri/:id/progetti` — `POST /cantieri/:id/progetti`

---

## 11. Utenti Gestionale

### `GET /utenti`
Lista utenti con ruolo e area.

### `GET /utenti/:id`

### `POST /utenti`
Crea utente gestionale collegato a Clerk.
```json
{
  "clerk_user_id": "clerk_xxx",
  "nome": "Marco",
  "cognome": "Vitaletti",
  "email_aziendale": "v.marco@lunardieforni.it",
  "whatsapp": "393382384698",
  "ruolo_id": "uuid_admin",
  "area_id": "uuid_workflow"
}
```

### `PATCH /utenti/:id`

---

## 12. Google Calendar

### `GET /calendario/eventi`
```
Query: data_inizio, data_fine, calendario_id?
```

### `POST /calendario/eventi`
```json
{
  "titolo": "Posa - Agati/Battaglia",
  "data_inizio": "2025-05-10T08:00:00",
  "data_fine": "2025-05-10T17:00:00",
  "cantiere_id": "uuid",
  "calendario_id": "calendar_squadra_nexteam",
  "descrizione": "Evolution Elite - Via Roma 42",
  "partecipanti": ["f.sinagra@...", "p.giachi@..."]
}
```

### `PATCH /calendario/eventi/:eventId`
### `DELETE /calendario/eventi/:eventId`

---

## 13. AI — Chat e Query

### `POST /ai/chat`
Messaggio alla chat AI.
```json
{
  "conversazione_id": "uuid",    // null = nuova conversazione
  "messaggio": "Quanti cantieri abbiamo in stato POSA?",
  "contesto": {                   // opzionale — contesto cantiere attivo
    "cantiere_id": "uuid"
  }
}
```
n8n:
1. Costruisce system prompt con schema DB
2. Chiama OpenRouter (modello scelto in base al task)
3. Se genera SQL: esegue con utente read-only, restituisce risultato
4. Logga in `ai_query_log`
5. Salva messaggio in `ai_messaggi`

Risposta:
```json
{
  "data": {
    "messaggio_id": "uuid",
    "contenuto": "Attualmente ci sono 3 cantieri in stato POSA.",
    "tipo_risultato": "query",     // 'testo', 'query', 'dashboard', 'tabella'
    "query_sql": "SELECT COUNT(*) ...",
    "risultato": { "colonne": ["conteggio"], "righe": [{ "conteggio": 3 }] },
    "modello_usato": "openai/gpt-4o"
  }
}
```

### `GET /ai/conversazioni`
Lista conversazioni utente.

### `GET /ai/conversazioni/:id`
Messaggi di una conversazione.

### `DELETE /ai/conversazioni/:id`

---

## 14. AI — Dashboard Dinamiche

### `POST /ai/dashboard/genera`
Genera configurazione dashboard da prompt.
```json
{
  "prompt": "Crea dashboard con grafico a torta stati cantiere e tabella cantieri in ritardo"
}
```
Risposta: config JSON dei widget (non salva ancora).

### `POST /ai/dashboard`
Salva dashboard generata.
```json
{
  "nome": "Panoramica Cantieri",
  "descrizione": "Dashboard generale stato cantieri",
  "config_widgets": { ... },
  "visibile_a": ["admin", "titolare", "venditore"]
}
```

### `GET /ai/dashboard`
Lista dashboard salvate (filtrate per ruolo).

### `GET /ai/dashboard/:id`
Config completa di una dashboard.

### `PATCH /ai/dashboard/:id`
Modifica dashboard (nome, config, visibilità).

### `DELETE /ai/dashboard/:id`

### `GET /ai/dashboard/:id/dati`
Esegue tutte le query dei widget e restituisce i dati aggiornati.

---

## 15. AI — Tabelle Dinamiche

### `POST /ai/tabelle/genera`
Genera schema tabella da prompt.
```json
{
  "prompt": "Crea una tabella omaggi con colonne nome, valore, ordinamento, categoria"
}
```
Risposta: schema_colonne + config_form + config_vista (non crea ancora).

### `POST /ai/tabelle`
Crea la tabella effettivamente.
```json
{
  "nome_tabella": "omaggi",
  "label": "Omaggi",
  "schema_colonne": { ... },
  "config_form": { ... },
  "config_vista": { ... }
}
```
n8n:
1. Esegue `CREATE TABLE` su PostgreSQL
2. Registra in `tabelle_dinamiche`
3. Crea endpoint CRUD automatici
4. Aggiorna documentazione API

### `GET /ai/tabelle`
Lista tabelle dinamiche.

### `GET /ai/tabelle/:nome`
Schema e config di una tabella.

### `DELETE /ai/tabelle/:nome`
Elimina tabella (con conferma — operazione distruttiva).

### CRUD su tabelle dinamiche (generati automaticamente)
```
GET    /dati/:nomeTabella              — lista con sort, filter, paginazione
GET    /dati/:nomeTabella/:id          — dettaglio
POST   /dati/:nomeTabella              — insert
PATCH  /dati/:nomeTabella/:id          — update
DELETE /dati/:nomeTabella/:id          — delete
GET    /dati/:nomeTabella/export/:formato  — export CSV, Excel, JSON
```

---

## 16. Dashboard / Report Statici

### `GET /dashboard/stats`
```json
{
  "cantieri_attivi": 5,
  "valore_totale": 89325.00,
  "alert_attivi": 2,
  "completati_mese": 3,
  "cantieri_per_stato": [{ "stato_label": "Posa", "conteggio": 2, "colore": "#1B8C3A" }],
  "cantieri_in_ritardo": 1
}
```

### `GET /dashboard/alert`
Lista alert attivi.

---

## 17. Export Dati

Ogni endpoint lista supporta export. Aggiungere `?format=csv|excel|json` a qualsiasi `GET` di lista:
```
GET /cantieri?format=excel
GET /clienti?format=csv
GET /dati/omaggi/export/json
```
n8n genera il file e restituisce download diretto.
