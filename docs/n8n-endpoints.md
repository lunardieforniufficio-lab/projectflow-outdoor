# Endpoint n8n — Lunardi e Forni Gestionale

Base URL: `https://n8n.quarrataweb.it/webhook`

Tutti gli endpoint ricevono `Authorization: Bearer {clerkToken}` nell'header.
Tutti gli endpoint restituiscono `Content-Type: application/json`.

## Formato risposta standard

```json
{
  "data": [...] | {...},
  "meta": {
    "totale": 100,
    "pagina": 1,
    "perPagina": 25,
    "totalePagine": 4
  }
}
```

---

## 1. CANTIERI

### GET /cantieri
Lista cantieri con filtri opzionali.

**Query params**: `stato_id`, `squadra_id`, `search`, `pagina`, `limite`, `ordine`

**Response**: `{ data: Cantiere[], meta: PaginaMeta }`

### GET /cantieri/:id
Dettaglio cantiere con relazioni espanse (cliente, stato, squadra, venditore, tipo).

**Response**: `{ data: CantiereDettaglio }`

### POST /cantieri
Crea nuovo cantiere.

**Body**:
```json
{
  "clienteId": "string",
  "tipoProdottoId": "string",
  "statoId": "string",
  "importoTotale": 15000.00,
  "importoAcconto": 6000.00,
  "accontoPagato": false,
  "indirizzoCantiere": "Via Roma 1, Firenze",
  "cittaCantiere": "Firenze",
  "squadraId": null,
  "venditoreId": "string",
  "dataInizio": "2025-06-01",
  "dataFinePrevista": "2025-07-15",
  "noteInterne": null
}
```

### PATCH /cantieri/:id
Aggiorna cantiere parzialmente.

**Body**: subset dei campi sopra.

### DELETE /cantieri/:id
Elimina cantiere.

### POST /cantieri/:id/stato
Transizione di stato (FSM).

**Body**:
```json
{
  "nuovoStatoId": "string",
  "note": "opzionale"
}
```

### GET /cantieri/:id/vincoli
Vincoli di transizione per il cantiere.

**Response**: `{ data: VincoloStatoRisposta[] }`

---

## 2. CLIENTI

### GET /clienti
Lista clienti.

**Query params**: `search`, `pagina`, `limite`

**Response**: `{ data: Cliente[], meta: PaginaMeta }`

### GET /clienti/:id
Dettaglio cliente.

### POST /clienti
Crea cliente.

**Body**:
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "codiceFiscale": "RSSMRA80A01H501Z",
  "telefono": "+39 055 123 456",
  "email": "mario@email.it",
  "indirizzo": "Via Roma 1",
  "citta": "Firenze",
  "cap": "50100",
  "provincia": "FI",
  "iban": null,
  "note": null
}
```

### PATCH /clienti/:id
Aggiorna cliente.

### DELETE /clienti/:id
Elimina cliente.

---

## 3. FORNITORI

### GET /fornitori
Lista fornitori.

**Query params**: `search`, `attivo` (true/false), `pagina`, `limite`

**Response**: `{ data: Fornitore[], meta: PaginaMeta }`

### GET /fornitori/:id
Dettaglio fornitore.

### POST /fornitori
Crea fornitore.

**Body**:
```json
{
  "nome": "Fornitore Srl",
  "partitaIva": "12345678901",
  "referente": "Marco Bianchi",
  "email": "info@fornitore.it",
  "telefono": "+39 055 987 654",
  "indirizzo": "Via Industria 10",
  "attivo": true,
  "note": null
}
```

### PATCH /fornitori/:id
Aggiorna fornitore.

### DELETE /fornitori/:id
Elimina fornitore.

---

## 4. UTENTI

### GET /utenti
Lista utenti gestionale (con ruolo espanso).

**Response**: `{ data: UtenteDettaglio[] }`

### GET /utenti/:id
Dettaglio utente.

### POST /utenti
Crea utente gestionale (deve già esistere su Clerk).

**Body**:
```json
{
  "clerkUserId": "user_xxx",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario@email.it",
  "telefono": null,
  "ruoloId": "string",
  "attivo": true
}
```

### PATCH /utenti/:id
Aggiorna utente.

**Body**: subset dei campi (escluso `clerkUserId`).

### DELETE /utenti/:id
Disattiva/elimina utente.

---

## 5. SQUADRE

### GET /squadre
Lista squadre.

**Response**: `{ data: Squadra[] }`

### GET /squadre/:id
Dettaglio squadra con membri.

**Response**: `{ data: SquadraDettaglio }`

### POST /squadre
Crea squadra.

**Body**:
```json
{
  "nome": "Nexteam",
  "responsabileId": "string",
  "telefono": "+39 333 111 2233",
  "colore": "#1B8C3A",
  "attiva": true
}
```

### PATCH /squadre/:id
Aggiorna squadra.

### DELETE /squadre/:id
Elimina squadra.

### POST /squadre/:id/membri
Aggiungi membro a squadra.

**Body**:
```json
{
  "utenteId": "string",
  "ruolo": "caposquadra" | "installatore" | "altro"
}
```

### DELETE /squadre/:squadraId/membri/:membroId
Rimuovi membro da squadra.

---

## 6. CONFIGURAZIONE (admin)

### GET /config/stati_cantiere
Lista stati cantiere.

**Response**: `{ data: StatoCantiere[] }`

### POST /config/stati_cantiere
Crea stato cantiere.

**Body**:
```json
{
  "codice": "ATTESA",
  "label": "In Attesa",
  "colore": "#f59e0b",
  "icona": "clock",
  "ordine": 10,
  "descrizione": null,
  "isIniziale": false,
  "isFinale": false,
  "attivo": true
}
```

### PATCH /config/stati_cantiere/:id
Aggiorna stato cantiere.

### DELETE /config/stati_cantiere/:id
Elimina stato cantiere.

### GET /config/tipi_prodotto
Lista tipi prodotto.

**Response**: `{ data: TipoProdotto[] }`

### POST /config/tipi_prodotto
Crea tipo prodotto.

**Body**:
```json
{
  "codice": "pergola_vetro",
  "label": "Pergola Vetro",
  "categoria": "pergola",
  "descrizione": null,
  "ordine": 4,
  "attivo": true
}
```

### PATCH /config/tipi_prodotto/:id
Aggiorna tipo prodotto.

### DELETE /config/tipi_prodotto/:id
Elimina tipo prodotto.

### GET /config/ruoli
Lista ruoli (read-only).

### GET /config/transizioni
Transizioni FSM con vincoli.

---

## 7. DASHBOARD

### GET /dashboard/stats
Statistiche globali.

**Response**:
```json
{
  "data": {
    "cantieriAttivi": 6,
    "valoreTotale": 117125.00,
    "alertAttivi": 2,
    "completatiMese": 1,
    "cantieriPerStato": [
      { "statoLabel": "Lead", "conteggio": 1, "colore": "#3b82f6" }
    ],
    "ultimiCantieri": [...]
  }
}
```

### GET /dashboard/alert
Alert attivi per l'utente.

**Response**: `{ data: Alert[] }`

---

## 8. TIMELINE

### GET /timeline
Timeline eventi cantiere.

**Query params**: `cantiere_id` (obbligatorio), `pagina`, `limite`

**Response**: `{ data: TimelineEntry[], meta: PaginaMeta }`

### POST /timeline
Crea entry timeline.

**Body**:
```json
{
  "cantiereId": "string",
  "tipo": "nota" | "stato" | "documento" | "comunicazione",
  "titolo": "Nota lavorazione",
  "descrizione": "Testo nota",
  "allegati": []
}
```

---

## 9. MEDIA

### GET /media
Lista media per cantiere.

**Query params**: `cantiere_id`

### POST /media
Upload file (multipart/form-data).

**Body**: `FormData` con `file`, `cantiereId`, `tipo`, `titolo`

### GET /media/:id/url
URL firmato per download.

---

## 10. RILIEVI

### GET /rilievi/:cantiereId
Rilievo del cantiere.

### POST /rilievi
Crea rilievo.

### PATCH /rilievi/:id
Aggiorna rilievo.

---

## 11. PREVENTIVI

### GET /preventivi
Lista preventivi (per cantiere).

**Query params**: `cantiere_id`

### POST /preventivi
Crea preventivo.

### PATCH /preventivi/:id
Aggiorna preventivo.

---

## 12. ORDINI

### GET /ordini
Lista ordini (per cantiere).

**Query params**: `cantiere_id`

### POST /ordini
Crea ordine.

### PATCH /ordini/:id
Aggiorna ordine.

---

## 13. FATTURE

### GET /fatture
Lista fatture (per cantiere).

**Query params**: `cantiere_id`

### POST /fatture
Crea fattura.

### PATCH /fatture/:id
Aggiorna fattura.

---

## Note implementative n8n

- Ogni webhook riceve il Clerk JWT nell'header `Authorization: Bearer {token}`
- Verificare il JWT con la Clerk public key prima di processare
- Estrarre `userId` dal JWT per logging e permessi
- Usare PostgreSQL (credenziali in `.env.local`) per tutte le query
- Rispettare il formato di risposta `{ data, meta }` per tutte le liste
- Codici errore standard:
  - `400` — input non valido (con dettagli sui campi)
  - `401` — token mancante o scaduto
  - `403` — permessi insufficienti
  - `404` — risorsa non trovata
  - `409` — conflitto (es. codice duplicato)
  - `500` — errore server interno
