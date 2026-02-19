-- =============================================
-- ProjectFlow — Creazione Schema Database
-- PostgreSQL 15+  
-- =============================================

-- === TABELLE DI CONFIGURAZIONE ===

CREATE TABLE IF NOT EXISTS ruoli (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,
  label           VARCHAR(100) NOT NULL,
  descrizione     TEXT,
  colore          VARCHAR(7),
  icona           VARCHAR(50),
  ordine          INT DEFAULT 0,
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permessi_ruolo (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ruolo_id        UUID NOT NULL REFERENCES ruoli(id) ON DELETE CASCADE,
  sezione         VARCHAR(50) NOT NULL,
  azione          VARCHAR(50) NOT NULL,
  filtro_cantieri VARCHAR(30) DEFAULT 'tutti',
  stati_visibili  TEXT[],
  attivo          BOOLEAN DEFAULT TRUE,
  UNIQUE(ruolo_id, sezione, azione)
);
CREATE INDEX IF NOT EXISTS idx_permessi_ruolo ON permessi_ruolo(ruolo_id);

CREATE TABLE IF NOT EXISTS stati_cantiere (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(30) UNIQUE NOT NULL,
  label           VARCHAR(50) NOT NULL,
  descrizione     TEXT,
  colore          VARCHAR(7) NOT NULL,
  icona           VARCHAR(50),
  ordine          INT NOT NULL,
  is_iniziale     BOOLEAN DEFAULT FALSE,
  is_finale       BOOLEAN DEFAULT FALSE,
  attivo          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transizioni_stato (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stato_da_id     UUID NOT NULL REFERENCES stati_cantiere(id),
  stato_a_id      UUID NOT NULL REFERENCES stati_cantiere(id),
  attiva          BOOLEAN DEFAULT TRUE,
  UNIQUE(stato_da_id, stato_a_id)
);

CREATE TABLE IF NOT EXISTS vincoli_transizione (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transizione_id  UUID NOT NULL REFERENCES transizioni_stato(id) ON DELETE CASCADE,
  descrizione     VARCHAR(200) NOT NULL,
  tipo_verifica   VARCHAR(50) NOT NULL,
  campo           VARCHAR(100),
  valore_atteso   TEXT,
  ordine          INT DEFAULT 0,
  attivo          BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_vincoli_transizione ON vincoli_transizione(transizione_id);

CREATE TABLE IF NOT EXISTS tipi_prodotto (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,
  label           VARCHAR(100) NOT NULL,
  categoria       VARCHAR(50),
  descrizione     TEXT,
  attivo          BOOLEAN DEFAULT TRUE,
  ordine          INT DEFAULT 0,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS aree_aziendali (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice          VARCHAR(50) UNIQUE NOT NULL,
  label           VARCHAR(100) NOT NULL,
  descrizione     TEXT,
  responsabile_id VARCHAR(255),
  attivo          BOOLEAN DEFAULT TRUE,
  ordine          INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS configurazioni (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chiave          VARCHAR(100) UNIQUE NOT NULL,
  valore          TEXT NOT NULL,
  tipo            VARCHAR(20) DEFAULT 'testo',
  descrizione     TEXT,
  modificabile    BOOLEAN DEFAULT TRUE,
  aggiornato_il   TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_da   VARCHAR(255)
);

-- === TABELLE ENTITA PRINCIPALI ===

CREATE TABLE IF NOT EXISTS utenti_gestionale (
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
CREATE INDEX IF NOT EXISTS idx_utenti_clerk ON utenti_gestionale(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_utenti_ruolo ON utenti_gestionale(ruolo_id);

CREATE TABLE IF NOT EXISTS clienti (
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
CREATE INDEX IF NOT EXISTS idx_clienti_cf ON clienti(codice_fiscale);
CREATE INDEX IF NOT EXISTS idx_clienti_cognome ON clienti(cognome);

CREATE TABLE IF NOT EXISTS fornitori (
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

CREATE TABLE IF NOT EXISTS squadre (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(100) NOT NULL,
  responsabile_id UUID REFERENCES utenti_gestionale(id),
  telefono        VARCHAR(20),
  colore          VARCHAR(7),
  attiva          BOOLEAN DEFAULT TRUE,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cantieri (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codice              VARCHAR(20) UNIQUE NOT NULL,
  cliente_id          UUID NOT NULL REFERENCES clienti(id),
  tipo_prodotto_id    UUID NOT NULL REFERENCES tipi_prodotto(id),
  stato_id            UUID NOT NULL REFERENCES stati_cantiere(id),
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
  google_calendar_event_id VARCHAR(255),
  google_drive_folder_id   VARCHAR(255),
  creato_il           TIMESTAMPTZ DEFAULT NOW(),
  aggiornato_il       TIMESTAMPTZ DEFAULT NOW(),
  creato_da           UUID REFERENCES utenti_gestionale(id)
);
CREATE INDEX IF NOT EXISTS idx_cantieri_stato ON cantieri(stato_id);
CREATE INDEX IF NOT EXISTS idx_cantieri_cliente ON cantieri(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cantieri_squadra ON cantieri(squadra_id);
CREATE INDEX IF NOT EXISTS idx_cantieri_venditore ON cantieri(venditore_id);
CREATE INDEX IF NOT EXISTS idx_cantieri_codice ON cantieri(codice);

CREATE TABLE IF NOT EXISTS timeline_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id     UUID NOT NULL REFERENCES cantieri(id),
  tipo            VARCHAR(20) NOT NULL,
  autore_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  autore_nome     VARCHAR(100) NOT NULL,
  contenuto       TEXT NOT NULL,
  metadata        JSONB,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_timeline_cantiere ON timeline_entries(cantiere_id);
CREATE INDEX IF NOT EXISTS idx_timeline_cantiere_data ON timeline_entries(cantiere_id, creato_il DESC);

CREATE TABLE IF NOT EXISTS media_files (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cantiere_id         UUID NOT NULL REFERENCES cantieri(id),
  timeline_entry_id   UUID REFERENCES timeline_entries(id),
  tipo                VARCHAR(20) NOT NULL,
  nome_file           VARCHAR(255) NOT NULL,
  google_drive_file_id VARCHAR(255) NOT NULL,
  google_drive_url     TEXT,
  dimensione_bytes    BIGINT,
  mime_type           VARCHAR(100),
  thumbnail_drive_id  VARCHAR(255),
  caricato_da         UUID NOT NULL REFERENCES utenti_gestionale(id),
  caricato_il         TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_cantiere ON media_files(cantiere_id);

CREATE TABLE IF NOT EXISTS membri_squadra (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  squadra_id      UUID NOT NULL REFERENCES squadre(id),
  utente_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  ruolo_squadra   VARCHAR(50),
  attivo          BOOLEAN DEFAULT TRUE,
  aggiunto_il     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(squadra_id, utente_id)
);

CREATE TABLE IF NOT EXISTS preventivi (
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

CREATE TABLE IF NOT EXISTS fatture (
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

CREATE TABLE IF NOT EXISTS ordini_fornitore (
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

CREATE TABLE IF NOT EXISTS rilievi (
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

CREATE TABLE IF NOT EXISTS progetti (
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

-- === META-SCHEMA: TABELLE DINAMICHE ===

CREATE TABLE IF NOT EXISTS tabelle_dinamiche (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_tabella    VARCHAR(100) UNIQUE NOT NULL,
  label           VARCHAR(200) NOT NULL,
  descrizione     TEXT,
  schema_colonne  JSONB NOT NULL,
  config_form     JSONB NOT NULL,
  config_vista    JSONB NOT NULL,
  creata_da       UUID REFERENCES utenti_gestionale(id),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dashboard_salvate (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome            VARCHAR(200) NOT NULL,
  descrizione     TEXT,
  config_widgets  JSONB NOT NULL,
  visibile_a      TEXT[],
  creata_da       UUID REFERENCES utenti_gestionale(id),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);

-- === TABELLE AI ===

CREATE TABLE IF NOT EXISTS ai_conversazioni (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utente_id       UUID NOT NULL REFERENCES utenti_gestionale(id),
  titolo          VARCHAR(200),
  creata_il       TIMESTAMPTZ DEFAULT NOW(),
  aggiornata_il   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messaggi (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversazione_id UUID NOT NULL REFERENCES ai_conversazioni(id) ON DELETE CASCADE,
  ruolo           VARCHAR(10) NOT NULL,
  contenuto       TEXT NOT NULL,
  query_sql       TEXT,
  risultato_query JSONB,
  modello_usato   VARCHAR(100),
  token_input     INT,
  token_output    INT,
  creato_il       TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_msg_conv ON ai_messaggi(conversazione_id, creato_il);

CREATE TABLE IF NOT EXISTS ai_query_log (
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
CREATE INDEX IF NOT EXISTS idx_ai_log_utente ON ai_query_log(utente_id, creato_il DESC);

-- === FUNZIONI UTILITY ===

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
