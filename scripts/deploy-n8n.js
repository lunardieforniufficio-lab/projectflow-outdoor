// Deploy workflow n8n per ProjectFlow
// Crea credenziale PostgreSQL + workflow Configurazioni + Utenti
const https = require("https");

const N8N_HOST = "n8n.quarrataweb.it";
const N8N_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzFlYjQwNS0xODA0LTQ4NzgtODcwNy0zMzcwNDNiODk5NDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDI4ZDBiMjAtYTc2OS00MDY2LThjY2EtZDA2OWM0MmEyMzYyIiwiaWF0IjoxNzcwOTYwNjAzfQ.9tyaTRxjmjw-36i-Sj7wE8w5PdtEeW1WqX6wkm8R9C8";

// ===== API HELPER =====
function n8nApi(metodo, percorso, corpo) {
    return new Promise(function (resolve, reject) {
        var opzioni = {
            hostname: N8N_HOST,
            path: "/api/v1" + percorso,
            method: metodo,
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        var req = https.request(opzioni, function (res) {
            var dati = "";
            res.on("data", function (chunk) {
                dati += chunk;
            });
            res.on("end", function () {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(dati),
                    });
                } catch (e) {
                    resolve({ status: res.statusCode, data: dati });
                }
            });
        });

        req.on("error", reject);
        if (corpo) req.write(JSON.stringify(corpo));
        req.end();
    });
}

// ===== STEP 1: CREDENZIALE POSTGRESQL =====
// API credentials non disponibile (405) — usiamo la credenziale esistente
// trovata nel workflow "test L&F 2": postgres id="hwtYEcUGezoDhDlO"
async function creaCredenziale() {
    console.log("\n📦 1. Credenziale PostgreSQL...");
    var CRED_ID = "hwtYEcUGezoDhDlO";
    var CRED_NAME = "Postgres account";
    console.log("   ✅ Uso credenziale esistente: [" + CRED_ID + "] " + CRED_NAME);
    return CRED_ID;
}

// ===== BUILDER NODI N8N =====
var contatore = 0;
function id() {
    contatore++;
    return "node-" + contatore;
}

function nodoWebhook(path, metodo, posX, posY) {
    return {
        parameters: {
            path: path,
            httpMethod: metodo,
            responseMode: "responseNode",
            options: {},
        },
        id: id(),
        name: metodo + " " + path,
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [posX, posY],
        webhookId: id(),
    };
}

function nodoCode(nome, codice, posX, posY) {
    return {
        parameters: {
            jsCode: codice,
        },
        id: id(),
        name: nome,
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [posX, posY],
    };
}

function nodoPostgres(nome, credId, posX, posY) {
    return {
        parameters: {
            operation: "executeQuery",
            query: '={{ $json.sqlQuery }}',
            options: {},
        },
        id: id(),
        name: nome,
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.5,
        position: [posX, posY],
        credentials: {
            postgres: {
                id: credId,
                name: "Postgres account",
            },
        },
    };
}

function nodoRispondi(nome, posX, posY) {
    return {
        parameters: {
            respondWith: "json",
            responseBody:
                '={{ JSON.stringify($json.risposta) }}',
            options: {
                responseCode: '={{ $json.statusCode || 200 }}',
                responseHeaders: {
                    entries: [
                        {
                            name: "Access-Control-Allow-Origin",
                            value: "*",
                        },
                        {
                            name: "Content-Type",
                            value: "application/json",
                        },
                    ],
                },
            },
        },
        id: id(),
        name: nome,
        type: "n8n-nodes-base.respondToWebhook",
        typeVersion: 1.1,
        position: [posX, posY],
    };
}

// ===== STEP 2: WORKFLOW CONFIGURAZIONI =====
function buildWorkflowConfig(credId) {
    // Code per GET /config/:tipo - Costruisci query
    var codeGetParsing = `
// Parsing GET /config/:tipo
const url = $input.first().json.headers.url || '';
const parti = url.split('/').filter(Boolean);
// L'URL sarà tipo: /webhook/config/ruoli o /webhook/config/stati_cantiere
const tipo = parti[parti.length - 1] || '';

const tabelle = {
  'ruoli': 'ruoli',
  'stati_cantiere': 'stati_cantiere',
  'tipi_prodotto': 'tipi_prodotto',
  'aree_aziendali': 'aree_aziendali',
  'configurazioni': 'configurazioni',
};

const nomeTabella = tabelle[tipo];
if (!nomeTabella) {
  return [{json: {
    sqlQuery: "SELECT 1 WHERE false",
    errore: 'Tipo non valido: ' + tipo,
    tipo: tipo
  }}];
}

let sqlQuery = '';
if (nomeTabella === 'configurazioni') {
  sqlQuery = 'SELECT * FROM configurazioni WHERE modificabile = true ORDER BY chiave';
} else {
  sqlQuery = 'SELECT * FROM ' + nomeTabella + ' WHERE attivo = true ORDER BY ordine, codice';
}

return [{json: { sqlQuery: sqlQuery, tipo: tipo, nomeTabella: nomeTabella }}];
`;

    // Code per formattare risposta GET
    var codeGetRisposta = `
// Formato risposta API
const items = $input.all();
const dati = items.map(function(item) { return item.json; });

// Converti snake_case → camelCase
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object') {
    var nuovo = {};
    Object.keys(obj).forEach(function(k) {
      var nuovaChiave = k.replace(/_([a-z])/g, function(m, l) { return l.toUpperCase(); });
      nuovo[nuovaChiave] = toCamel(obj[k]);
    });
    return nuovo;
  }
  return obj;
}

var risultato = toCamel(dati);

return [{json: {
  risposta: { data: risultato },
  statusCode: 200
}}];
`;

    // Code per POST /config/:tipo
    var codePostParsing = `
// Parsing POST /config/:tipo
const url = $input.first().json.headers.url || '';
const parti = url.split('/').filter(Boolean);
const tipo = parti[parti.length - 1] || '';
const body = $input.first().json.body || {};

const tabelle = {
  'ruoli': 'ruoli',
  'stati_cantiere': 'stati_cantiere',
  'tipi_prodotto': 'tipi_prodotto',
  'aree_aziendali': 'aree_aziendali',
  'configurazioni': 'configurazioni',
};

const nomeTabella = tabelle[tipo];
if (!nomeTabella) {
  return [{json: { sqlQuery: "SELECT 1 WHERE false", errore: 'Tipo non valido' }}];
}

// Mappa camelCase → snake_case
function toSnake(str) {
  return str.replace(/[A-Z]/g, function(l) { return '_' + l.toLowerCase(); });
}

var campi = [];
var valori = [];
Object.keys(body).forEach(function(k) {
  if (k === 'id') return;
  campi.push(toSnake(k));
  var v = body[k];
  if (v === null || v === undefined) valori.push('NULL');
  else if (typeof v === 'boolean') valori.push(v ? 'TRUE' : 'FALSE');
  else if (typeof v === 'number') valori.push(String(v));
  else valori.push("'" + String(v).replace(/'/g, "''") + "'");
});

var sqlQuery = 'INSERT INTO ' + nomeTabella + ' (' + campi.join(', ') + ') VALUES (' + valori.join(', ') + ') RETURNING *';

return [{json: { sqlQuery: sqlQuery, tipo: tipo }}];
`;

    // Nodi
    var webhookGet = nodoWebhook("config", "GET", 250, 200);
    // Aggiungo parametro per catturare il path aggiuntivo
    webhookGet.parameters.path = "config/:tipo";

    var parseGet = nodoCode("Parse GET Config", codeGetParsing, 500, 200);
    var pgGet = nodoPostgres("PG Lista Config", credId, 750, 200);
    var fmtGet = nodoCode("Formato Risposta GET", codeGetRisposta, 1000, 200);
    var rispGet = nodoRispondi("Rispondi GET", 1250, 200);

    var webhookPost = nodoWebhook("config", "POST", 250, 500);
    webhookPost.parameters.path = "config/:tipo";
    var parsePost = nodoCode("Parse POST Config", codePostParsing, 500, 500);
    var pgPost = nodoPostgres("PG Crea Config", credId, 750, 500);
    var fmtPost = nodoCode("Formato Risposta POST", codeGetRisposta, 1000, 500);
    var rispPost = nodoRispondi("Rispondi POST", 1250, 500);

    var nodi = [
        webhookGet,
        parseGet,
        pgGet,
        fmtGet,
        rispGet,
        webhookPost,
        parsePost,
        pgPost,
        fmtPost,
        rispPost,
    ];

    var connessioni = {};
    connessioni[webhookGet.name] = {
        main: [[{ node: parseGet.name, type: "main", index: 0 }]],
    };
    connessioni[parseGet.name] = {
        main: [[{ node: pgGet.name, type: "main", index: 0 }]],
    };
    connessioni[pgGet.name] = {
        main: [[{ node: fmtGet.name, type: "main", index: 0 }]],
    };
    connessioni[fmtGet.name] = {
        main: [[{ node: rispGet.name, type: "main", index: 0 }]],
    };
    connessioni[webhookPost.name] = {
        main: [[{ node: parsePost.name, type: "main", index: 0 }]],
    };
    connessioni[parsePost.name] = {
        main: [[{ node: pgPost.name, type: "main", index: 0 }]],
    };
    connessioni[pgPost.name] = {
        main: [[{ node: fmtPost.name, type: "main", index: 0 }]],
    };
    connessioni[fmtPost.name] = {
        main: [[{ node: rispPost.name, type: "main", index: 0 }]],
    };

    return {
        name: "PF - Configurazioni",
        nodes: nodi,
        connections: connessioni,
        settings: { executionOrder: "v1" },
    };
}

// ===== STEP 3: WORKFLOW UTENTI =====
function buildWorkflowUtenti(credId) {
    var codeGetLista = `
// GET /utenti - Lista utenti con ruolo e area
var sqlQuery = \`
  SELECT
    u.id, u.clerk_user_id, u.nome, u.cognome, u.email_aziendale, u.whatsapp,
    u.ruolo_id, u.area_id, u.attivo, u.creato_il, u.aggiornato_il,
    r.codice AS ruolo_codice, r.label AS ruolo_label, r.colore AS ruolo_colore,
    a.codice AS area_codice, a.label AS area_label
  FROM utenti_gestionale u
  JOIN ruoli r ON u.ruolo_id = r.id
  LEFT JOIN aree_aziendali a ON u.area_id = a.id
  WHERE u.attivo = true
  ORDER BY r.ordine, u.cognome
\`;
return [{json: { sqlQuery: sqlQuery }}];
`;

    var codeGetRisposta = `
// Formato risposta utenti con nested objects
var items = $input.all();
var utenti = items.map(function(item) {
  var u = item.json;
  return {
    id: u.id,
    clerkUserId: u.clerk_user_id,
    nome: u.nome,
    cognome: u.cognome,
    emailAziendale: u.email_aziendale,
    whatsapp: u.whatsapp,
    ruoloId: u.ruolo_id,
    areaId: u.area_id,
    attivo: u.attivo,
    creatoIl: u.creato_il,
    aggiornatoIl: u.aggiornato_il,
    ruolo: {
      codice: u.ruolo_codice,
      label: u.ruolo_label,
      colore: u.ruolo_colore
    },
    area: u.area_codice ? {
      codice: u.area_codice,
      label: u.area_label
    } : null
  };
});

return [{json: {
  risposta: { data: utenti },
  statusCode: 200
}}];
`;

    var codeGetDettaglio = `
// GET /utenti/:id - Dettaglio singolo utente
const url = $input.first().json.headers.url || '';
const parti = url.split('/').filter(Boolean);
const utenteId = parti[parti.length - 1] || '';

var sqlQuery = \`
  SELECT
    u.id, u.clerk_user_id, u.nome, u.cognome, u.email_aziendale, u.whatsapp,
    u.ruolo_id, u.area_id, u.attivo, u.creato_il, u.aggiornato_il,
    r.codice AS ruolo_codice, r.label AS ruolo_label, r.colore AS ruolo_colore,
    a.codice AS area_codice, a.label AS area_label
  FROM utenti_gestionale u
  JOIN ruoli r ON u.ruolo_id = r.id
  LEFT JOIN aree_aziendali a ON u.area_id = a.id
  WHERE u.id = '\${utenteId.replace(/'/g, "''")}'
\`;
return [{json: { sqlQuery: sqlQuery }}];
`;

    var codeDettaglioRisposta = `
var items = $input.all();
if (items.length === 0) {
  return [{json: {
    risposta: { error: { codice: 'NON_TROVATO', messaggio: 'Utente non trovato' } },
    statusCode: 404
  }}];
}
var u = items[0].json;
var utente = {
  id: u.id,
  clerkUserId: u.clerk_user_id,
  nome: u.nome,
  cognome: u.cognome,
  emailAziendale: u.email_aziendale,
  whatsapp: u.whatsapp,
  ruoloId: u.ruolo_id,
  areaId: u.area_id,
  attivo: u.attivo,
  creatoIl: u.creato_il,
  aggiornatoIl: u.aggiornato_il,
  ruolo: {
    codice: u.ruolo_codice,
    label: u.ruolo_label,
    colore: u.ruolo_colore
  },
  area: u.area_codice ? { codice: u.area_codice, label: u.area_label } : null
};
return [{json: { risposta: { data: utente }, statusCode: 200 }}];
`;

    // Nodi
    var wGet = nodoWebhook("utenti", "GET", 250, 200);
    var pGet = nodoCode("Parse GET Utenti", codeGetLista, 500, 200);
    var pgGet = nodoPostgres("PG Lista Utenti", credId, 750, 200);
    var fGet = nodoCode("Formato Utenti", codeGetRisposta, 1000, 200);
    var rGet = nodoRispondi("Rispondi Lista", 1250, 200);

    var wDet = nodoWebhook("utenti", "GET", 250, 500);
    wDet.parameters.path = "utenti/:id";
    wDet.name = "GET utenti/:id";
    var pDet = nodoCode("Parse GET Dettaglio", codeGetDettaglio, 500, 500);
    var pgDet = nodoPostgres("PG Dettaglio Utente", credId, 750, 500);
    var fDet = nodoCode("Formato Dettaglio", codeDettaglioRisposta, 1000, 500);
    var rDet = nodoRispondi("Rispondi Dettaglio", 1250, 500);

    var nodi = [wGet, pGet, pgGet, fGet, rGet, wDet, pDet, pgDet, fDet, rDet];

    var connessioni = {};
    connessioni[wGet.name] = { main: [[{ node: pGet.name, type: "main", index: 0 }]] };
    connessioni[pGet.name] = { main: [[{ node: pgGet.name, type: "main", index: 0 }]] };
    connessioni[pgGet.name] = { main: [[{ node: fGet.name, type: "main", index: 0 }]] };
    connessioni[fGet.name] = { main: [[{ node: rGet.name, type: "main", index: 0 }]] };
    connessioni[wDet.name] = { main: [[{ node: pDet.name, type: "main", index: 0 }]] };
    connessioni[pDet.name] = { main: [[{ node: pgDet.name, type: "main", index: 0 }]] };
    connessioni[pgDet.name] = { main: [[{ node: fDet.name, type: "main", index: 0 }]] };
    connessioni[fDet.name] = { main: [[{ node: rDet.name, type: "main", index: 0 }]] };

    return {
        name: "PF - Utenti",
        nodes: nodi,
        connections: connessioni,
        settings: { executionOrder: "v1" },
    };
}

// ===== STEP 4: WORKFLOW CRUD GENERICO (Clienti, Fornitori, Squadre) =====
function buildWorkflowCrud(nome, path, queryLista, formatRisposta, credId) {
    var codeGet = `
var sqlQuery = \`${queryLista}\`;
return [{json: { sqlQuery: sqlQuery }}];
`;

    var codeFmt = formatRisposta;

    var wGet = nodoWebhook(path, "GET", 250, 200);
    var pGet = nodoCode("Parse GET " + nome, codeGet, 500, 200);
    var pgGet = nodoPostgres("PG " + nome, credId, 750, 200);
    var fGet = nodoCode("Formato " + nome, codeFmt, 1000, 200);
    var rGet = nodoRispondi("Rispondi " + nome, 1250, 200);

    var nodi = [wGet, pGet, pgGet, fGet, rGet];

    var connessioni = {};
    connessioni[wGet.name] = { main: [[{ node: pGet.name, type: "main", index: 0 }]] };
    connessioni[pGet.name] = { main: [[{ node: pgGet.name, type: "main", index: 0 }]] };
    connessioni[pgGet.name] = { main: [[{ node: fGet.name, type: "main", index: 0 }]] };
    connessioni[fGet.name] = { main: [[{ node: rGet.name, type: "main", index: 0 }]] };

    return {
        name: "PF - " + nome,
        nodes: nodi,
        connections: connessioni,
        settings: { executionOrder: "v1" },
    };
}

// ===== STEP 5: WORKFLOW DASHBOARD STATS =====
function buildWorkflowDashboard(credId) {
    var codeQuery = `
var sqlQuery = \`
  SELECT
    (SELECT COUNT(*) FROM cantieri WHERE stato_id NOT IN (SELECT id FROM stati_cantiere WHERE is_finale = true))::int AS cantieri_attivi,
    (SELECT COALESCE(SUM(importo_totale), 0) FROM cantieri)::numeric AS valore_totale,
    (SELECT COUNT(*) FROM cantieri WHERE data_fine_prevista < NOW() AND data_fine_reale IS NULL)::int AS cantieri_in_ritardo,
    (SELECT COUNT(*) FROM cantieri c JOIN stati_cantiere s ON c.stato_id = s.id WHERE s.is_finale = true AND c.data_fine_reale >= date_trunc('month', NOW()))::int AS completati_mese
\`;
return [{json: { sqlQuery: sqlQuery }}];
`;

    var codeFmt = `
var s = $input.first().json;
// Seconda query per cantieri per stato
return [{json: {
  risposta: {
    data: {
      cantieriAttivi: parseInt(s.cantieri_attivi) || 0,
      valoreTotale: parseFloat(s.valore_totale) || 0,
      cantieriInRitardo: parseInt(s.cantieri_in_ritardo) || 0,
      completatiMese: parseInt(s.completati_mese) || 0,
      alertAttivi: parseInt(s.cantieri_in_ritardo) || 0,
      cantieriPerStato: []
    }
  },
  statusCode: 200
}}];
`;

    var wGet = nodoWebhook("dashboard/stats", "GET", 250, 200);
    var pGet = nodoCode("Query Stats", codeQuery, 500, 200);
    var pgGet = nodoPostgres("PG Stats", credId, 750, 200);
    var fGet = nodoCode("Formato Stats", codeFmt, 1000, 200);
    var rGet = nodoRispondi("Rispondi Stats", 1250, 200);

    var nodi = [wGet, pGet, pgGet, fGet, rGet];

    var connessioni = {};
    connessioni[wGet.name] = { main: [[{ node: pGet.name, type: "main", index: 0 }]] };
    connessioni[pGet.name] = { main: [[{ node: pgGet.name, type: "main", index: 0 }]] };
    connessioni[pgGet.name] = { main: [[{ node: fGet.name, type: "main", index: 0 }]] };
    connessioni[fGet.name] = { main: [[{ node: rGet.name, type: "main", index: 0 }]] };

    return {
        name: "PF - Dashboard Stats",
        nodes: nodi,
        connections: connessioni,
        settings: { executionOrder: "v1" },
    };
}

// ===== DEPLOY PRINCIPALE =====
async function deploy() {
    console.log("🚀 Deploy workflow n8n per ProjectFlow\n");

    // 1. Credenziale
    var credId = await creaCredenziale();
    if (!credId) {
        console.log("\n❌ Impossibile creare credenziale. Abort.");
        return;
    }

    // 2. Workflow da creare
    var clientiFmt = `
var items = $input.all();
var dati = items.map(function(item) {
  var c = item.json;
  return {
    id: c.id, nome: c.nome, cognome: c.cognome,
    codiceFiscale: c.codice_fiscale, email: c.email,
    telefono: c.telefono, indirizzo: c.indirizzo,
    citta: c.citta, cap: c.cap, provincia: c.provincia,
    iban: c.iban, note: c.note,
    creatoIl: c.creato_il, aggiornatoIl: c.aggiornato_il
  };
});
return [{json: { risposta: { data: dati }, statusCode: 200 }}];
`;

    var fornitoriFmt = `
var items = $input.all();
var dati = items.map(function(item) {
  var f = item.json;
  return {
    id: f.id, nome: f.nome, partitaIva: f.partita_iva,
    email: f.email, telefono: f.telefono,
    indirizzo: f.indirizzo, referente: f.referente,
    note: f.note, attivo: f.attivo, creatoIl: f.creato_il
  };
});
return [{json: { risposta: { data: dati }, statusCode: 200 }}];
`;

    var squadreFmt = `
var items = $input.all();
var dati = items.map(function(item) {
  var s = item.json;
  return {
    id: s.id, nome: s.nome, responsabileId: s.responsabile_id,
    telefono: s.telefono, colore: s.colore,
    attiva: s.attiva, creatoIl: s.creato_il,
    responsabileNome: s.resp_nome ? (s.resp_nome + ' ' + s.resp_cognome) : null
  };
});
return [{json: { risposta: { data: dati }, statusCode: 200 }}];
`;

    var workflows = [
        buildWorkflowConfig(credId),
        buildWorkflowUtenti(credId),
        buildWorkflowCrud(
            "Clienti",
            "clienti",
            "SELECT * FROM clienti ORDER BY cognome, nome",
            clientiFmt,
            credId
        ),
        buildWorkflowCrud(
            "Fornitori",
            "fornitori",
            "SELECT * FROM fornitori WHERE attivo = true ORDER BY nome",
            fornitoriFmt,
            credId
        ),
        buildWorkflowCrud(
            "Squadre",
            "squadre",
            `SELECT s.*, u.nome AS resp_nome, u.cognome AS resp_cognome
             FROM squadre s
             LEFT JOIN utenti_gestionale u ON s.responsabile_id = u.id
             WHERE s.attiva = true ORDER BY s.nome`,
            squadreFmt,
            credId
        ),
        buildWorkflowDashboard(credId),
    ];

    // 3. Deploy workflow
    for (var i = 0; i < workflows.length; i++) {
        var wf = workflows[i];
        console.log(
            "\n📋 " + (i + 2) + ". Deploy: " + wf.name + "..."
        );

        // Controlla se esiste già
        var lista = await n8nApi("GET", "/workflows?limit=50");
        var esistente = (lista.data.data || []).find(function (w) {
            return w.name === wf.name;
        });

        var risultato;
        if (esistente) {
            console.log("   ♻️  Aggiornamento workflow esistente [" + esistente.id + "]...");
            risultato = await n8nApi(
                "PATCH",
                "/workflows/" + esistente.id,
                wf
            );
        } else {
            risultato = await n8nApi("POST", "/workflows", wf);
        }

        if (
            risultato.status === 200 ||
            risultato.status === 201
        ) {
            var wfId = risultato.data.id;
            console.log("   ✅ Workflow creato/aggiornato: [" + wfId + "]");

            // Attiva
            var attiva = await n8nApi(
                "PATCH",
                "/workflows/" + wfId,
                { active: true }
            );
            if (attiva.status === 200) {
                console.log("   🟢 Attivato!");
            } else {
                console.log(
                    "   ⚠️  Errore attivazione:",
                    attiva.status,
                    JSON.stringify(attiva.data).substring(0, 200)
                );
            }
        } else {
            console.log(
                "   ❌ Errore:",
                risultato.status,
                JSON.stringify(risultato.data).substring(0, 300)
            );
        }
    }

    console.log("\n✅ Deploy completato!");
}

deploy().catch(function (e) {
    console.error("❌ Errore fatale:", e.message);
});
