# Dati Iniziali (Seed) — ProjectFlow

> SQL per popolare le tabelle di configurazione con i dati reali di Lunardi & Forni. Eseguire dopo la creazione delle tabelle.

---

## Ruoli

```sql
INSERT INTO ruoli (codice, label, descrizione, colore, ordine) VALUES
('titolare',        'Titolare',              'Accesso totale, visione strategica',        '#a78bfa', 1),
('admin',           'Amministratore',        'Accesso totale, gestione tecnica e workflow','#1B8C3A', 2),
('centralino',      'Centralino',            'Primo contatto, creazione lead',            '#38bdf8', 3),
('venditore',       'Venditore',             'Area commerciale, preventivi, trattative',  '#f59e0b', 4),
('logistica',       'Logistica e Acquisti',   'Ordini fornitori, approvvigionamento',      '#fb923c', 5),
('tecnico',         'Tecnico',               'Rilievi, progettazione esecutiva',          '#3b82f6', 6),
('magazziniere',    'Magazziniere',          'Ricezione materiali, preparazione',         '#8b5cf6', 7),
('caposquadra',     'Caposquadra',           'Coordinamento squadra operativa',           '#1B8C3A', 8),
('installatore',    'Installatore',          'Montaggio e installazione in cantiere',     '#22c55e', 9),
('amministrazione', 'Amministrazione',       'Gestione generale, clienti, reportistica',  '#64748b', 10),
('contabilita',     'Contabilità',           'Fatturazione, pagamenti, scadenze',         '#94a3b8', 11);
```

## Aree Aziendali

```sql
INSERT INTO aree_aziendali (codice, label, descrizione, ordine) VALUES
('direzione',      'Direzione',                'Direzione aziendale',          1),
('workflow',       'Workflow e Automazione',    'Gestione processi e IT',       2),
('primo_contatto', 'Primo Contatto',           'Accoglienza e centralino',     3),
('commerciale',    'Commerciale',              'Vendita e consulenza',         4),
('logistica',      'Logistica e Acquisti',     'Ordini e approvvigionamento',  5),
('uff_tecnico',    'Ufficio Tecnico',          'Progettazione e rilievi',      6),
('operativa',      'Operativa',                'Montaggio e installazione',    7),
('amministrazione','Amministrazione',          'Gestione e contabilità',       8);
```

## Utenti Gestionale (da collegare a Clerk dopo creazione account)

```sql
-- NOTA: clerk_user_id va inserito dopo la creazione degli account Clerk
-- Qui usiamo placeholder che andranno sostituiti

INSERT INTO utenti_gestionale (clerk_user_id, nome, cognome, email_aziendale, whatsapp, ruolo_id, area_id) VALUES
('clerk_GABRIELE',  'Gabriele',    'Forni',      'gabriele@lunardieforni.it',       '393807577669',  (SELECT id FROM ruoli WHERE codice='titolare'),     (SELECT id FROM aree_aziendali WHERE codice='direzione')),
('clerk_MARCO',     'Marco',       'Vitaletti',  'v.marco@lunardieforni.it',        '393382384698',  (SELECT id FROM ruoli WHERE codice='admin'),         (SELECT id FROM aree_aziendali WHERE codice='workflow')),
('clerk_MARTINA_C', 'Martina',     'Cialdi',     'assistenza@lunardieforni.it',     '393339260568',  (SELECT id FROM ruoli WHERE codice='centralino'),    (SELECT id FROM aree_aziendali WHERE codice='primo_contatto')),
('clerk_ALBERTO',   'Alberto',     'Bini',       'b.alberto@lunardieforni.it',      '393791250334',  (SELECT id FROM ruoli WHERE codice='venditore'),     (SELECT id FROM aree_aziendali WHERE codice='commerciale')),
('clerk_DAVIDE',    'Davide',      'Guidotti',   'commerciale@lunardieforni.it',    '393513523817',  (SELECT id FROM ruoli WHERE codice='venditore'),     (SELECT id FROM aree_aziendali WHERE codice='commerciale')),
('clerk_GABRIELE_A','Gabriele',    'Albanese',   'a.gabriele@lunardieforni.it',     '393474994794',  (SELECT id FROM ruoli WHERE codice='venditore'),     (SELECT id FROM aree_aziendali WHERE codice='commerciale')),
('clerk_SIMONE',    'Simone',      'Cocci',      'ordini@lunardieforni.it',         '3933934176687', (SELECT id FROM ruoli WHERE codice='logistica'),     (SELECT id FROM aree_aziendali WHERE codice='logistica')),
('clerk_MICHELE',   'Michele',     'Ciolini',    'tecnico@lunardieforni.it',        '393470815738',  (SELECT id FROM ruoli WHERE codice='tecnico'),       (SELECT id FROM aree_aziendali WHERE codice='uff_tecnico')),
('clerk_LEONARDO_M','Leonardo',    'Manzone',    NULL,                               '393348263964',  (SELECT id FROM ruoli WHERE codice='magazziniere'),  (SELECT id FROM aree_aziendali WHERE codice='uff_tecnico')),
('clerk_MARTINA_F', 'Martina',     'Forni',      'info@lunardieforni.it',           '393205736549',  (SELECT id FROM ruoli WHERE codice='amministrazione'),(SELECT id FROM aree_aziendali WHERE codice='amministrazione')),
('clerk_LARA',      'Lara',        'Cappellini', 'amministrazionelef@gmail.com',    '39337694586',   (SELECT id FROM ruoli WHERE codice='contabilita'),   (SELECT id FROM aree_aziendali WHERE codice='amministrazione')),
('clerk_FRANCESCO_S','Francesco',  'Sinagra',    NULL,                               '393345822834',  (SELECT id FROM ruoli WHERE codice='caposquadra'),   (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_ROBERTO',   'Roberto',     'Giglioni',   NULL,                               '393382836075',  (SELECT id FROM ruoli WHERE codice='caposquadra'),   (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_LEONARDO_S','Leonardo',    'Sinagra',    NULL,                               '393791696651',  (SELECT id FROM ruoli WHERE codice='caposquadra'),   (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_ANTONINO',  'Antonino',    'Sanfilippo', NULL,                               '393883472804',  (SELECT id FROM ruoli WHERE codice='caposquadra'),   (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_PIERPAOLO', 'Pierpaolo',   'Giachi',     NULL,                               '393385494413',  (SELECT id FROM ruoli WHERE codice='installatore'),  (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_FRANCESCO_P','Francesco',  'Ponziani',   NULL,                               '393281331131',  (SELECT id FROM ruoli WHERE codice='installatore'),  (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_DANIELE',   'Daniele',     'Falcetta',   NULL,                               '393384298070',  (SELECT id FROM ruoli WHERE codice='installatore'),  (SELECT id FROM aree_aziendali WHERE codice='operativa')),
('clerk_ALESSIO',   'Alessio',     'Consales',   NULL,                               '393400814330',  (SELECT id FROM ruoli WHERE codice='installatore'),  (SELECT id FROM aree_aziendali WHERE codice='operativa'));
```

## Stati Cantiere (FSM)

```sql
INSERT INTO stati_cantiere (codice, label, descrizione, colore, ordine, is_iniziale, is_finale) VALUES
('LEAD',              'Lead',                'Primo contatto, acquisizione',       '#38bdf8',  1,  TRUE,  FALSE),
('VENDITA',           'Vendita',             'Preventivazione e trattativa',       '#f59e0b',  2,  FALSE, FALSE),
('ACCONTO',           'Acconto',             'Riscossione acconto ed ecobonus',    '#fb923c',  3,  FALSE, FALSE),
('RILIEVO',           'Rilievo',             'Rilievo tecnico, foto e misure',     '#8b5cf6',  4,  FALSE, FALSE),
('PROGETTAZIONE',     'Progettazione',       'Sviluppo progetto esecutivo',        '#3b82f6',  5,  FALSE, FALSE),
('ORDINE_FORNITORE',  'Ordine Fornitore',    'Invio ordini e approvvigionamento',  '#06b6d4',  6,  FALSE, FALSE),
('MAGAZZINO',         'Magazzino',           'Ricezione e preparazione materiali', '#a78bfa',  7,  FALSE, FALSE),
('POSA',              'Posa',                'Installazione in cantiere',          '#1B8C3A',  8,  FALSE, FALSE),
('COLLAUDO',          'Collaudo',            'Verifica e accettazione cliente',    '#22c55e',  9,  FALSE, FALSE),
('SALDO',             'Saldo',               'Chiusura contabile e archiviazione', '#64748b', 10,  FALSE, TRUE);
```

## Transizioni Stato e Vincoli

```sql
-- Transizioni (inserire dopo stati_cantiere)
INSERT INTO transizioni_stato (stato_da_id, stato_a_id)
SELECT da.id, a.id FROM stati_cantiere da, stati_cantiere a
WHERE (da.codice, a.codice) IN (
  ('LEAD', 'VENDITA'),
  ('VENDITA', 'ACCONTO'),
  ('ACCONTO', 'RILIEVO'),
  ('RILIEVO', 'PROGETTAZIONE'),
  ('PROGETTAZIONE', 'ORDINE_FORNITORE'),
  ('ORDINE_FORNITORE', 'MAGAZZINO'),
  ('MAGAZZINO', 'POSA'),
  ('POSA', 'COLLAUDO'),
  ('COLLAUDO', 'SALDO')
);

-- Vincoli
INSERT INTO vincoli_transizione (transizione_id, descrizione, tipo_verifica, campo, valore_atteso, ordine)
VALUES
-- ACCONTO → RILIEVO
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='ACCONTO' AND a.codice='RILIEVO'),
  'Acconto 40% registrato', 'campo_cantiere', 'acconto_pagato', 'true', 1),

-- RILIEVO → PROGETTAZIONE
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='RILIEVO' AND a.codice='PROGETTAZIONE'),
  'Foto rilievo caricate', 'conteggio_media', 'foto_rilievo', '>0', 1),
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='RILIEVO' AND a.codice='PROGETTAZIONE'),
  'Misure inserite', 'campo_rilievo', 'larghezza_cm', 'NOT NULL', 2),

-- PROGETTAZIONE → ORDINE_FORNITORE
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='PROGETTAZIONE' AND a.codice='ORDINE_FORNITORE'),
  'Progetto approvato', 'campo_progetto', 'approvato', 'true', 1),

-- MAGAZZINO → POSA
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='MAGAZZINO' AND a.codice='POSA'),
  'Squadra assegnata', 'campo_cantiere', 'squadra_id', 'NOT NULL', 1),

-- POSA → COLLAUDO
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='POSA' AND a.codice='COLLAUDO'),
  'Resoconto giornaliero compilato', 'conteggio_timeline', 'tipo_nota_posa', '>0', 1),

-- COLLAUDO → SALDO
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='COLLAUDO' AND a.codice='SALDO'),
  'Benestare cliente firmato', 'campo_cantiere', 'benestare_firmato', 'true', 1),
((SELECT t.id FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id=da.id JOIN stati_cantiere a ON t.stato_a_id=a.id WHERE da.codice='COLLAUDO' AND a.codice='SALDO'),
  'Foto finali caricate', 'conteggio_media', 'foto_finali', '>0', 2);
```

## Tipi Prodotto

```sql
INSERT INTO tipi_prodotto (codice, label, categoria, ordine) VALUES
('evolution_elite',    'Evolution Elite',     'pergola',       1),
('bioclimatica_plus',  'Bioclimatica Plus',   'bioclimatica',  2),
('pergotenda',         'Pergotenda',          'pergotenda',    3),
('pannelli_sandwich',  'Pannelli Sandwich',   'copertura',     4),
('tettoia',            'Tettoia',             'copertura',     5),
('frangitratta',       'Frangitratta',        'complemento',   6);
```

## Configurazioni Generali

```sql
INSERT INTO configurazioni (chiave, valore, tipo, descrizione) VALUES
('percentuale_acconto',     '40',    'numero',   'Percentuale acconto minimo richiesto'),
('giorni_alert_ritardo',    '7',     'numero',   'Giorni di ritardo consegna prima di generare alert'),
('garanzia_mesi',           '12',    'numero',   'Mesi di garanzia dalla fine lavori'),
('valuta',                  'EUR',   'testo',    'Valuta predefinita'),
('formato_data',            'dd/MM/yyyy', 'testo', 'Formato data visualizzato'),
('nome_azienda',            'Lunardi & Forni', 'testo', 'Ragione sociale'),
('sito_web',                'https://lunardieforni.com', 'testo', 'Sito web aziendale'),
('email_principale',        'info@lunardieforni.it', 'testo', 'Email principale aziendale');
```

## Permessi Ruolo (seed iniziale per i ruoli principali)

```sql
-- Admin: tutto
INSERT INTO permessi_ruolo (ruolo_id, sezione, azione, filtro_cantieri)
SELECT r.id, sezione, azione, 'tutti'
FROM ruoli r,
(VALUES
  ('dashboard','visualizza'), ('cantieri','visualizza'), ('cantieri','crea'), ('cantieri','modifica'),
  ('cantieri','avanza_stato'), ('cantieri','elimina'), ('cantieri','assegna_squadra'),
  ('clienti','visualizza'), ('clienti','crea'), ('clienti','modifica'),
  ('fornitori','visualizza'), ('fornitori','crea'), ('fornitori','modifica'),
  ('squadre','visualizza'), ('squadre','crea'), ('squadre','modifica'),
  ('report','visualizza'), ('calendario','visualizza'), ('calendario','modifica'),
  ('ai_chat','visualizza'), ('ai_dashboard','visualizza'), ('ai_dashboard','crea'),
  ('ai_tabelle','visualizza'), ('ai_tabelle','crea'),
  ('admin','visualizza'), ('admin','modifica')
) AS p(sezione, azione)
WHERE r.codice = 'admin';

-- Titolare: come admin ma senza admin tecnico
INSERT INTO permessi_ruolo (ruolo_id, sezione, azione, filtro_cantieri)
SELECT r.id, sezione, azione, 'tutti'
FROM ruoli r,
(VALUES
  ('dashboard','visualizza'), ('cantieri','visualizza'), ('cantieri','crea'), ('cantieri','modifica'),
  ('cantieri','avanza_stato'), ('cantieri','assegna_squadra'),
  ('clienti','visualizza'), ('clienti','crea'), ('clienti','modifica'),
  ('fornitori','visualizza'), ('fornitori','crea'), ('fornitori','modifica'),
  ('squadre','visualizza'), ('squadre','modifica'),
  ('report','visualizza'), ('calendario','visualizza'), ('calendario','modifica'),
  ('ai_chat','visualizza'), ('ai_dashboard','visualizza'), ('ai_dashboard','crea')
) AS p(sezione, azione)
WHERE r.codice = 'titolare';

-- Venditore
INSERT INTO permessi_ruolo (ruolo_id, sezione, azione, filtro_cantieri)
SELECT r.id, sezione, azione, 'assegnati'
FROM ruoli r,
(VALUES
  ('dashboard','visualizza'), ('cantieri','visualizza'), ('cantieri','crea'), ('cantieri','modifica'),
  ('cantieri','avanza_stato'), ('clienti','visualizza'), ('clienti','crea'), ('clienti','modifica'),
  ('calendario','visualizza'), ('ai_chat','visualizza')
) AS p(sezione, azione)
WHERE r.codice = 'venditore';

-- Caposquadra (mobile-first)
INSERT INTO permessi_ruolo (ruolo_id, sezione, azione, filtro_cantieri)
SELECT r.id, sezione, azione, 'assegnati'
FROM ruoli r,
(VALUES
  ('cantieri','visualizza'), ('cantieri','nota'), ('cantieri','foto'), ('cantieri','video'),
  ('cantieri','segnala_problema'), ('cantieri','fine_giornata'),
  ('calendario','visualizza')
) AS p(sezione, azione)
WHERE r.codice = 'caposquadra';

-- Installatore (come caposquadra ma meno azioni)
INSERT INTO permessi_ruolo (ruolo_id, sezione, azione, filtro_cantieri)
SELECT r.id, sezione, azione, 'assegnati'
FROM ruoli r,
(VALUES
  ('cantieri','visualizza'), ('cantieri','nota'), ('cantieri','foto'), ('cantieri','video'),
  ('cantieri','segnala_problema')
) AS p(sezione, azione)
WHERE r.codice = 'installatore';
```
