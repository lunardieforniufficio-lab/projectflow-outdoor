# Schema Database — ProjectFlow v2

> PostgreSQL 15+. Tutto ciò che è configurazione, lista, opzione è una tabella. Zero hardcoding.

---

## Tabelle di Configurazione (Zero Hardcoding)

Queste tabelle sostituiscono OGNI enum, array o costante che prima era nel codice.

### `ruoli`
```sql
CREATE TABLE ruoli (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,   -- 'admin', 'venditore', 'centralino'...
  label           VARCHAR(100) NOT NULL,          -- 'Amministratore', 'Venditore'...
  descrizione     TEXT,
  colore          VARCHAR(7),                     -- '#1B8C3A'
  icona           VARCHAR(50),                    -- nome icona lucide-react
  ordine          INT DEFAULT 0,
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
```

### `permessi_ruolo`
```sql
CREATE TABLE permessi_ruolo (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruolo_id        UUID NOT NULL REFERENCES ruoli(id) ON DELETE CASCADE,
  sezione         VARCHAR(50) NOT NULL,           -- 'cantieri', 'clienti', 'ai_chat', 'admin'...
  azione          VARCHAR(50) NOT NULL,           -- 'visualizza', 'crea', 'modifica', 'elimina', 'avanza_stato'...
  filtro_cantieri VARCHAR(30) DEFAULT 'tutti',    -- 'tutti', 'assegnati', 'per_stato'
  stati_visibili  TEXT[],                          -- array stati se filtro = 'per_stato'
  attivo          BOOLEAN DEFAULT TRUE,

  UNIQUE(ruolo_id, sezione, azione)
);

CREATE INDEX idx_permessi_ruolo ON permessi_ruolo(ruolo_id);
```

### `stati_cantiere`
```sql
CREATE TABLE stati_cantiere (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(30) UNIQUE NOT NULL,    -- 'LEAD', 'VENDITA', 'ACCONTO'...
  label           VARCHAR(50) NOT NULL,           -- 'Lead', 'Vendita'...
  descrizione     TEXT,
  colore          VARCHAR(7) NOT NULL,            -- '#1B8C3A'
  icona           VARCHAR(50),
  ordine          INT NOT NULL,                   -- ordine nella pipeline
  is_iniziale     BOOLEAN DEFAULT FALSE,          -- LEAD
  is_finale       BOOLEAN DEFAULT FALSE,          -- SALDO
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
```

### `transizioni_stato`
```sql
CREATE TABLE transizioni_stato (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stato_da_id     UUID NOT NULL REFERENCES stati_cantiere(id),
  stato_a_id      UUID NOT NULL REFERENCES stati_cantiere(id),
  attiva          BOOLEAN DEFAULT TRUE,

  UNIQUE(stato_da_id, stato_a_id)
);
```

### `vincoli_transizione`
```sql
CREATE TABLE vincoli_transizione (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transizione_id  UUID NOT NULL REFERENCES transizioni_stato(id) ON DELETE CASCADE,
  descrizione     VARCHAR(200) NOT NULL,          -- 'Acconto 40% registrato'
  tipo_verifica   VARCHAR(50) NOT NULL,           -- 'campo_cantiere', 'conteggio_media', 'flag_booleano', 'custom'
  campo           VARCHAR(100),                    -- 'acconto_pagato' se tipo = 'campo_cantiere'
  valore_atteso   TEXT,                            -- 'true'
  ordine          INT DEFAULT 0,
  attivo          BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_vincoli_transizione ON vincoli_transizione(transizione_id);
```

### `tipi_prodotto`
```sql
CREATE TABLE tipi_prodotto (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,
  label           VARCHAR(100) NOT NULL,          -- 'Evolution Elite', 'Bioclimatica Plus'...
  categoria       VARCHAR(50),                     -- 'pergola', 'bioclimatica', 'pergotenda', 'copertura'
  descrizione     TEXT,
  attivo          BOOLEAN DEFAULT TRUE,
  ordine          INT DEFAULT 0,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
```

### `aree_aziendali`
```sql
CREATE TABLE aree_aziendali (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,
  label           VARCHAR(100) NOT NULL,          -- 'Commerciale', 'Operativa', 'Uff. Tecnico'...
  descrizione     TEXT,
  responsabile_id VARCHAR(255),                   -- clerk user_id
  attivo          BOOLEAN DEFAULT TRUE,
  ordine          INT DEFAULT 0
);
```

### `configurazioni`
Tabella chiave-valore per configurazioni generiche che non meritano una tabella dedicata.
```sql
CREATE TABLE configurazioni (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chiave          VARCHAR(100) UNIQUE NOT NULL,   -- 'percentuale_acconto', 'giorni_alert_ritardo'
  valore          TEXT NOT NULL,                   -- '40', '7'
  tipo            VARCHAR(20) DEFAULT 'testo',    -- 'testo', 'numero', 'booleano', 'json'
  descrizione     TEXT,
  modificabile    BOOLEAN DEFAULT TRUE,
  aggiornato_il   TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_da   VARCHAR(255)
);
```

---

## Tabelle Entità Principali

### `utenti_gestionale`
Estensione dei dati Clerk con info aziendali. Clerk gestisce auth, qui teniamo i dati operativi.
```sql
CREATE TABLE utenti_gestionale (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   VARCHAR(255) UNIQUE NOT NULL,
  nome            VARCHAR(100) NOT NULL,
  cognome         VARCHAR(100) NOT NULL,
  email_aziendale VARCHAR(255),
  whatsapp        VARCHAR(20),
  ruolo_id        UUID NOT NULL REFERENCES ruoli(id),
  area_id         UUID REFERENCES aree_aziendali(id),
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_utenti_clerk ON utenti_gestionale(clerk_user_id);
CREATE INDEX idx_utenti_ruolo ON utenti_gestionale(ruolo_id);
```

### `clienti`
```sql
CREATE TABLE clienti (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(100) NOT NULL,
  cognome         VARCHAR(100) NOT NULL,
  codice_fiscale  CHAR(16) UNIQUE NOT NULL,
  email           VARCHAR(255),
  telefono        VARCHAR(20) NOT NULL,
  indirizzo       TEXT,
  citta           VARCHAR(100),
  cap             VARCHAR(5),
  provincia       CHAR(2),
  iban            VARCHAR(34),
  note            TEXT,
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il   TIMESTAMPTZ DEFAULT NOW(),
  creato_da       VARCHAR(255) NOT NULL
);

CREATE INDEX idx_clienti_cf ON clienti(codice_fiscale);
CREATE INDEX idx_clienti_cognome ON clienti(cognome);
```

### `cantieri`
```sql
CREATE TABLE cantieri (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice              VARCHAR(20) UNIQUE NOT NULL,
  cliente_id          UUID NOT NULL REFERENCES clienti(id),
  tipo_prodotto_id    UUID NOT NULL REFERENCES tipi_prodotto(id),   -- FK, non stringa
  stato_id            UUID NOT NULL REFERENCES stati_cantiere(id),  -- FK, non stringa
  importo_totale      DECIMAL(10,2),
  importo_acconto     DECIMAL(10,2),
  acconto_pagato      BOOLEAN DEFAULT FALSE,
  indirizzo_cantiere  TEXT NOT NULL,
  citta_cantiere      VARCHAR(100),
  squadra_id          UUID REFERENCES squadre(id),
  venditore_id        UUID REFERENCES utenti_gestionale(id),
  progettista_id      UUID REFERENCES utenti_gestionale(id),
  data_inizio         DATE,
  data_fine_prevista  DATE,
  data_fine_reale     DATE,
  note_interne        TEXT,
  google_calendar_event_id VARCHAR(255),       -- ID evento Google Calendar
  google_drive_folder_id   VARCHAR(255),       -- ID cartella Google Drive del cantiere
  creato_il           TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da           UUID REFERENCES utenti_gestionale(id)
);

CREATE INDEX idx_cantieri_stato ON cantieri(stato_id);
CREATE INDEX idx_cantieri_cliente ON cantieri(cliente_id);
CREATE INDEX idx_cantieri_squadra ON cantieri(squadra_id);
CREATE INDEX idx_cantieri_venditore ON cantieri(venditore_id);
CREATE INDEX idx_cantieri_codice ON cantieri(codice);
```

### `timeline_entries`
```sql
CREATE TABLE timeline_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  tipo            VARCHAR(20) NOT NULL,
  autore_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  autore_nome     VARCHAR(100) NOT NULL,
  contenuto       TEXT NOT NULL,
  metadata        JSONB,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_cantiere ON timeline_entries(cantiere_id);
CREATE INDEX idx_timeline_cantiere_data ON timeline_entries(cantiere_id, creato_il DESC);
```

### `media_files`
```sql
CREATE TABLE media_files (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id         UUID NOT NULL REFERENCES cantieri(id),
  timeline_entry_id   UUID REFERENCES timeline_entries(id),
  tipo                VARCHAR(20) NOT NULL,
  nome_file           VARCHAR(255) NOT NULL,
  google_drive_file_id VARCHAR(255) NOT NULL,     -- ID file su Google Drive
  google_drive_url     TEXT,                       -- URL condivisibile
  dimensione_bytes    BIGINT,
  mime_type           VARCHAR(100),
  thumbnail_drive_id  VARCHAR(255),
  caricato_da         UUID NOT NULL REFERENCES utenti_gestionale(id),
  caricato_il         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_cantiere ON media_files(cantiere_id);
```

### `squadre`
```sql
CREATE TABLE squadre (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(100) NOT NULL,
  responsabile_id UUID REFERENCES utenti_gestionale(id),
  telefono        VARCHAR(20),
  colore          VARCHAR(7),
  attiva          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
```

### `membri_squadra`
```sql
CREATE TABLE membri_squadra (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squadra_id      UUID NOT NULL REFERENCES squadre(id),
  utente_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  ruolo_squadra   VARCHAR(50),
  attivo          BOOLEAN DEFAULT TRUE,
  aggiunto_il     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(squadra_id, utente_id)
);
```

### `preventivi`
```sql
CREATE TABLE preventivi (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  numero          VARCHAR(20) NOT NULL,
  descrizione     TEXT,
  importo         DECIMAL(10,2) NOT NULL,
  stato           VARCHAR(20) DEFAULT 'emesso',
  google_drive_file_id VARCHAR(255),
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da       UUID REFERENCES utenti_gestionale(id)
);
```

### `fatture`
```sql
CREATE TABLE fatture (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  numero          VARCHAR(20) NOT NULL,
  tipo            VARCHAR(20) NOT NULL,
  importo         DECIMAL(10,2) NOT NULL,
  data_emissione  DATE NOT NULL,
  data_pagamento  DATE,
  stato           VARCHAR(20) DEFAULT 'emessa',
  google_drive_file_id VARCHAR(255),
  note            TEXT,
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da       UUID REFERENCES utenti_gestionale(id)
);
```

### `fornitori`
```sql
CREATE TABLE fornitori (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(200) NOT NULL,
  partita_iva     VARCHAR(11),
  email           VARCHAR(255),
  telefono        VARCHAR(20),
  indirizzo       TEXT,
  referente       VARCHAR(100),
  note            TEXT,
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
```

### `ordini_fornitore`
```sql
CREATE TABLE ordini_fornitore (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  fornitore_id    UUID NOT NULL REFERENCES fornitori(id),
  numero_ordine   VARCHAR(50),
  descrizione     TEXT NOT NULL,
  importo         DECIMAL(10,2),
  stato           VARCHAR(30) DEFAULT 'inviato',
  data_ordine     DATE NOT NULL,
  data_consegna_prevista DATE,
  data_consegna_reale DATE,
  note            TEXT,
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da       UUID REFERENCES utenti_gestionale(id)
);
```

### `rilievi`
```sql
CREATE TABLE rilievi (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID UNIQUE NOT NULL REFERENCES cantieri(id),
  larghezza_cm    DECIMAL(8,2),
  profondita_cm   DECIMAL(8,2),
  altezza_max_cm  DECIMAL(8,2),
  note_tecniche   TEXT,
  ostacoli        JSONB,
  eseguito_da     UUID NOT NULL REFERENCES utenti_gestionale(id),
  eseguito_il     TIMESTAMPTZ DEFAULT NOW()
);
```

### `progetti`
```sql
CREATE TABLE progetti (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  fornitore       VARCHAR(100),
  descrizione     TEXT,
  larghezza_cm    DECIMAL(8,2),
  profondita_cm   DECIMAL(8,2),
  altezza_max_cm  DECIMAL(8,2),
  google_drive_file_id VARCHAR(255) NOT NULL,
  approvato       BOOLEAN DEFAULT FALSE,
  non_modificabile BOOLEAN DEFAULT FALSE,
  creato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da       UUID REFERENCES utenti_gestionale(id)
);
```

---

## Meta-Schema: Tabelle Dinamiche (create da AI)

Questo sistema permette all'AI di creare nuove tabelle con interfaccia CRUD completa.

### `tabelle_dinamiche`
Registro di tutte le tabelle create dall'AI.
```sql
CREATE TABLE tabelle_dinamiche (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_tabella    VARCHAR(100) UNIQUE NOT NULL,   -- nome SQL reale (es. 'omaggi')
  label           VARCHAR(200) NOT NULL,          -- nome visualizzato ('Omaggi')
  descrizione     TEXT,
  schema_colonne  JSONB NOT NULL,                 -- definizione colonne (vedi sotto)
  config_form     JSONB NOT NULL,                 -- configurazione form insert/update
  config_vista    JSONB NOT NULL,                 -- configurazione vista tabella
  creata_da       UUID REFERENCES utenti_gestionale(id),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);
```

#### Formato `schema_colonne` (esempio per tabella "omaggi"):
```json
{
  "colonne": [
    { "nome": "id", "tipo": "uuid", "primaria": true, "auto": true },
    { "nome": "nome", "tipo": "varchar", "lunghezza": 200, "obbligatorio": true, "label": "Nome omaggio" },
    { "nome": "valore", "tipo": "decimal", "precisione": [10,2], "obbligatorio": true, "label": "Valore €" },
    { "nome": "ordinamento", "tipo": "integer", "default": 0, "label": "Ordinamento" },
    { "nome": "categoria", "tipo": "varchar", "lunghezza": 100, "label": "Categoria" },
    { "nome": "creato_il", "tipo": "timestamptz", "auto": true },
    { "nome": "creato_da", "tipo": "uuid", "auto": true, "ref": "utenti_gestionale" }
  ]
}
```

#### Formato `config_form` (per form insert/update):
```json
{
  "campi": [
    { "nome": "nome", "tipo_input": "testo", "placeholder": "Nome omaggio", "obbligatorio": true },
    { "nome": "valore", "tipo_input": "valuta", "obbligatorio": true },
    { "nome": "ordinamento", "tipo_input": "numero" },
    { "nome": "categoria", "tipo_input": "select_libero" }
  ]
}
```

#### Formato `config_vista` (per vista tabella):
```json
{
  "colonne_visibili": ["nome", "valore", "categoria", "creato_il"],
  "ordinamento_default": { "campo": "ordinamento", "direzione": "asc" },
  "filtri": ["categoria"],
  "ricerca_campi": ["nome"],
  "export": ["csv", "excel", "json"]
}
```

### `dashboard_salvate`
Dashboard generate dall'AI e salvate dall'utente.
```sql
CREATE TABLE dashboard_salvate (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(200) NOT NULL,
  descrizione     TEXT,
  config_widgets  JSONB NOT NULL,                 -- array widget con tipo, query, posizione
  visibile_a      TEXT[],                          -- array ruoli che la possono vedere
  creata_da       UUID REFERENCES utenti_gestionale(id),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);
```

#### Formato `config_widgets` (esempio):
```json
{
  "widgets": [
    {
      "id": "w1",
      "tipo": "grafico_torta",
      "titolo": "Cantieri per stato",
      "query_sql": "SELECT sc.label, COUNT(*) as conteggio FROM cantieri c JOIN stati_cantiere sc ON c.stato_id = sc.id GROUP BY sc.label",
      "posizione": { "riga": 0, "colonna": 0, "larghezza": 6, "altezza": 4 },
      "config_grafico": { "campo_label": "label", "campo_valore": "conteggio" }
    },
    {
      "id": "w2",
      "tipo": "tabella",
      "titolo": "Cantieri in ritardo",
      "query_sql": "SELECT c.codice, cl.cognome, c.data_fine_prevista FROM cantieri c JOIN clienti cl ON c.cliente_id = cl.id WHERE c.data_fine_prevista < NOW() AND c.data_fine_reale IS NULL",
      "posizione": { "riga": 0, "colonna": 6, "larghezza": 6, "altezza": 4 }
    }
  ]
}
```

---

## Tabelle AI

### `ai_conversazioni`
```sql
CREATE TABLE ai_conversazioni (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  titolo          VARCHAR(200),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);
```

### `ai_messaggi`
```sql
CREATE TABLE ai_messaggi (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversazione_id UUID NOT NULL REFERENCES ai_conversazioni(id) ON DELETE CASCADE,
  ruolo           VARCHAR(10) NOT NULL,           -- 'user', 'assistant'
  contenuto       TEXT NOT NULL,
  query_sql       TEXT,                            -- SQL generato (se query)
  risultato_query JSONB,                           -- risultato (se query)
  modello_usato   VARCHAR(100),                    -- 'openai/gpt-4o', 'anthropic/claude-sonnet'
  token_input     INT,
  token_output    INT,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_msg_conv ON ai_messaggi(conversazione_id, creato_il);
```

### `ai_query_log`
Log di sicurezza per tutte le query SQL generate dall'AI.
```sql
CREATE TABLE ai_query_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  prompt_originale TEXT NOT NULL,
  query_generata  TEXT NOT NULL,
  eseguita        BOOLEAN DEFAULT FALSE,
  risultato_ok    BOOLEAN,
  errore          TEXT,
  tempo_esecuzione_ms INT,
  righe_restituite INT,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_log_utente ON ai_query_log(utente_id, creato_il DESC);
```

---

## Funzioni Utility

```sql
-- Generazione codice cantiere
CREATE OR REPLACE FUNCTION genera_codice_cantiere()
RETURNS VARCHAR(20) AS $$
DECLARE
  anno TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  ultimo_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(codice FROM 8) AS INT)), 0)
  INTO ultimo_num FROM cantieri WHERE codice LIKE 'C-' || anno || '-%';
  RETURN 'C-' || anno || '-' || LPAD((ultimo_num + 1)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Utente read-only per query AI
CREATE ROLE ai_readonly WITH LOGIN PASSWORD 'INSERIRE_PASSWORD_SICURA';
GRANT CONNECT ON DATABASE projectflow TO ai_readonly;
GRANT USAGE ON SCHEMA public TO ai_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ai_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ai_readonly;
```

---

## Convenzioni

- **UUID** come primary key ovunque
- **TIMESTAMPTZ** per tutti i timestamp (UTC, frontend converte)
- **FK verso `utenti_gestionale`** (non clerk_user_id diretto) per integrità referenziale
- **JSONB** per dati semi-strutturati (config widget, ostacoli, metadata)
- **Google Drive file_id** nei campi file (non path filesystem)
- **Tabelle config** per tutto ciò che è enum: ruoli, stati, tipi prodotto, aree
- **`attivo` flag** su tutte le tabelle config per soft-delete (non si cancella mai)
- **Indici** su tutte le FK e sui campi di ricerca
