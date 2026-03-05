// Crea nuova credenziale PostgreSQL per lunardieforni_db e ricostruisci TUTTI i workflow
const https = require("https");
const N8N_HOST = "n8n.quarrataweb.it";
const N8N_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzFlYjQwNS0xODA0LTQ4NzgtODcwNy0zMzcwNDNiODk5NDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDI4ZDBiMjAtYTc2OS00MDY2LThjY2EtZDA2OWM0MmEyMzYyIiwiaWF0IjoxNzcwOTYwNjAzfQ.9tyaTRxjmjw-36i-Sj7wE8w5PdtEeW1WqX6wkm8R9C8";

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
            res.on("data", function (chunk) { dati += chunk; });
            res.on("end", function () {
                try { resolve({ status: res.statusCode, data: JSON.parse(dati) }); }
                catch (e) { resolve({ status: res.statusCode, data: dati }); }
            });
        });
        req.on("error", reject);
        if (corpo) req.write(JSON.stringify(corpo));
        req.end();
    });
}

function testWebhook(percorso) {
    return new Promise(function (resolve, reject) {
        var opzioni = {
            hostname: N8N_HOST,
            path: "/webhook/" + percorso,
            method: "GET",
            headers: { Accept: "application/json" },
        };
        var req = https.request(opzioni, function (res) {
            var dati = "";
            res.on("data", function (chunk) { dati += chunk; });
            res.on("end", function () { resolve({ status: res.statusCode, data: dati }); });
        });
        req.on("error", reject);
        req.end();
    });
}

// ===== STEP 1: CREA CREDENZIALE =====
async function creaCredenziale() {
    console.log("📦 Step 1: Creo credenziale PostgreSQL per lunardieforni_db...\n");

    // Prova POST per creare
    var res = await n8nApi("POST", "/credentials", {
        name: "PF PostgreSQL",
        type: "postgres",
        data: {
            host: "localhost",
            port: 5432,
            database: "lunardieforni_db",
            user: "postgres",
            password: "Matrox0573",
            ssl: "disable",
        },
    });

    console.log("   Status:", res.status);
    if (res.status === 200 || res.status === 201) {
        console.log("   ✅ Credenziale creata! ID:", res.data.id);
        return res.data.id;
    } else {
        console.log("   Risposta:", JSON.stringify(res.data).substring(0, 300));
        // Se POST fallisce, prova con schema diverso (n8n potrebbe volere formato diverso)
        var res2 = await n8nApi("POST", "/credentials", {
            name: "PF PostgreSQL",
            type: "postgres",
            nodesAccess: [{ nodeType: "n8n-nodes-base.postgres" }],
            data: {
                host: "localhost",
                port: 5432,
                database: "lunardieforni_db",
                user: "postgres",
                password: "Matrox0573",
                ssl: "disable",
            },
        });
        console.log("   Tentativo 2 status:", res2.status);
        if (res2.status === 200 || res2.status === 201) {
            console.log("   ✅ Credenziale creata! ID:", res2.data.id);
            return res2.data.id;
        }
        console.log("   Tentativo 2:", JSON.stringify(res2.data).substring(0, 300));
        return null;
    }
}

// ===== STEP 2: BUILDER WORKFLOW v2 (lastNode) =====
var cnt = 200;
function uid() { cnt++; return "pf-" + cnt; }

function buildChain(webhookPath, querySQL, fmtCode, posY) {
    var wh = {
        parameters: {
            path: webhookPath,
            httpMethod: "GET",
            responseMode: "lastNode",
            options: {},
        },
        id: uid(), name: "GET " + webhookPath,
        type: "n8n-nodes-base.webhook", typeVersion: 2,
        position: [250, posY], webhookId: uid(),
    };
    var cq = {
        parameters: { jsCode: "return [{json: { sqlQuery: `" + querySQL + "` }}];" },
        id: uid(), name: "Q " + webhookPath,
        type: "n8n-nodes-base.code", typeVersion: 2,
        position: [500, posY],
    };
    // credId verrà sostituita dopo
    var pg = {
        parameters: { operation: "executeQuery", query: "={{ $json.sqlQuery }}", options: {} },
        id: uid(), name: "PG " + webhookPath,
        type: "n8n-nodes-base.postgres", typeVersion: 2.5,
        position: [750, posY],
        credentials: { postgres: { id: "PLACEHOLDER", name: "PF PostgreSQL" } },
    };
    var fm = {
        parameters: { jsCode: fmtCode },
        id: uid(), name: "F " + webhookPath,
        type: "n8n-nodes-base.code", typeVersion: 2,
        position: [1000, posY],
    };
    return {
        nodi: [wh, cq, pg, fm], conn: function (c) {
            c[wh.name] = { main: [[{ node: cq.name, type: "main", index: 0 }]] };
            c[cq.name] = { main: [[{ node: pg.name, type: "main", index: 0 }]] };
            c[pg.name] = { main: [[{ node: fm.name, type: "main", index: 0 }]] };
        }
    };
}

// ===== FORMATTATORI =====
var FMT_CAMEL = `
var items = $input.all();
var dati = items.map(function(item) { return item.json; });
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object') {
    var n = {};
    Object.keys(obj).forEach(function(k) {
      var nc = k.replace(/_([a-z])/g, function(m, l) { return l.toUpperCase(); });
      n[nc] = toCamel(obj[k]);
    });
    return n;
  }
  return obj;
}
return [{json: { data: toCamel(dati) }}];
`;

var FMT_UTENTI = `
var items = $input.all();
var utenti = items.map(function(item) {
  var u = item.json;
  return {
    id: u.id, clerkUserId: u.clerk_user_id,
    nome: u.nome, cognome: u.cognome,
    emailAziendale: u.email_aziendale, whatsapp: u.whatsapp,
    ruoloId: u.ruolo_id, areaId: u.area_id,
    attivo: u.attivo, creatoIl: u.creato_il, aggiornatoIl: u.aggiornato_il,
    ruolo: { codice: u.ruolo_codice, label: u.ruolo_label, colore: u.ruolo_colore },
    area: u.area_codice ? { codice: u.area_codice, label: u.area_label } : null
  };
});
return [{json: { data: utenti }}];
`;

var FMT_CLIENTI = `
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
return [{json: { data: dati }}];
`;

var FMT_FORNITORI = `
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
return [{json: { data: dati }}];
`;

var FMT_SQUADRE = `
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
return [{json: { data: dati }}];
`;

var FMT_TRANSIZIONI = `
var items = $input.all();
var t = items.map(function(item) {
  var r = item.json;
  return {
    id: r.id,
    statoDa: { codice: r.da_codice, label: r.da_label },
    statoA: { codice: r.a_codice, label: r.a_label },
    attiva: r.attiva
  };
});
return [{json: { data: t }}];
`;

var FMT_STATS = `
var s = $input.first().json;
return [{json: { data: {
  cantieriAttivi: parseInt(s.cantieri_attivi) || 0,
  valoreTotale: parseFloat(s.valore_totale) || 0,
  cantieriInRitardo: parseInt(s.cantieri_in_ritardo) || 0,
  completatiMese: parseInt(s.completati_mese) || 0,
  alertAttivi: parseInt(s.cantieri_in_ritardo) || 0,
  cantieriPerStato: []
}}}];
`;

// ===== STEP 3: DEPLOY =====
async function deploy() {
    console.log("🚀 Rebuild completo workflow n8n v2\n");

    // 1. Crea credenziale
    var credId = await creaCredenziale();
    if (!credId) {
        console.log("\n❌ Impossibile creare credenziale via API.");
        console.log("   Credenziale esistente: hwtYEcUGezoDhDlO (punta a DB diverso)");
        console.log("\n   AZIONE RICHIESTA: Vai su https://n8n.quarrataweb.it");
        console.log("   1. Settings → Credentials → Postgres account");
        console.log("   2. Cambia 'Database' in 'lunardieforni_db'");
        console.log("   3. Salva e ritesta");
        console.log("\n   Oppure crea una nuova credenziale 'PF PostgreSQL':");
        console.log("   Host: localhost, Port: 5432, DB: lunardieforni_db");
        console.log("   User: postgres, Password: Matrox0573, SSL: disable");

        // Intanto aggiorniamo i workflow con lastNode usando la credenziale vecchia
        credId = "hwtYEcUGezoDhDlO";
        console.log("\n   Per ora uso la credenziale esistente per testare responseMode...\n");
    }

    // 2. Definisci tutti i workflow
    var defs = {
        "PF - Configurazioni": function () {
            var chains = [
                buildChain("config/ruoli", "SELECT * FROM ruoli WHERE attivo = true ORDER BY ordine", FMT_CAMEL, 200),
                buildChain("config/stati_cantiere", "SELECT * FROM stati_cantiere WHERE attivo = true ORDER BY ordine", FMT_CAMEL, 500),
                buildChain("config/tipi_prodotto", "SELECT * FROM tipi_prodotto WHERE attivo = true ORDER BY ordine", FMT_CAMEL, 800),
                buildChain("config/aree_aziendali", "SELECT * FROM aree_aziendali WHERE attivo = true ORDER BY ordine", FMT_CAMEL, 1100),
                buildChain("config/configurazioni", "SELECT * FROM configurazioni WHERE modificabile = true ORDER BY chiave", FMT_CAMEL, 1400),
                buildChain("config/transizioni",
                    "SELECT t.id, t.attiva, da.codice AS da_codice, da.label AS da_label, a.codice AS a_codice, a.label AS a_label FROM transizioni_stato t JOIN stati_cantiere da ON t.stato_da_id = da.id JOIN stati_cantiere a ON t.stato_a_id = a.id WHERE t.attiva = true ORDER BY da.ordine",
                    FMT_TRANSIZIONI, 1700),
            ];
            var nodi = []; var conn = {};
            chains.forEach(function (ch) { nodi = nodi.concat(ch.nodi); ch.conn(conn); });
            return { name: "PF - Configurazioni", nodes: nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
        "PF - Utenti": function () {
            var ch = buildChain("utenti",
                "SELECT u.id, u.clerk_user_id, u.nome, u.cognome, u.email_aziendale, u.whatsapp, u.ruolo_id, u.area_id, u.attivo, u.creato_il, u.aggiornato_il, r.codice AS ruolo_codice, r.label AS ruolo_label, r.colore AS ruolo_colore, a.codice AS area_codice, a.label AS area_label FROM utenti_gestionale u JOIN ruoli r ON u.ruolo_id = r.id LEFT JOIN aree_aziendali a ON u.area_id = a.id WHERE u.attivo = true ORDER BY r.ordine, u.cognome",
                FMT_UTENTI, 200);
            var conn = {}; ch.conn(conn);
            return { name: "PF - Utenti", nodes: ch.nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
        "PF - Clienti": function () {
            var ch = buildChain("clienti", "SELECT * FROM clienti ORDER BY cognome, nome", FMT_CLIENTI, 200);
            var conn = {}; ch.conn(conn);
            return { name: "PF - Clienti", nodes: ch.nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
        "PF - Fornitori": function () {
            var ch = buildChain("fornitori", "SELECT * FROM fornitori WHERE attivo = true ORDER BY nome", FMT_FORNITORI, 200);
            var conn = {}; ch.conn(conn);
            return { name: "PF - Fornitori", nodes: ch.nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
        "PF - Squadre": function () {
            var ch = buildChain("squadre",
                "SELECT s.*, u.nome AS resp_nome, u.cognome AS resp_cognome FROM squadre s LEFT JOIN utenti_gestionale u ON s.responsabile_id = u.id WHERE s.attiva = true ORDER BY s.nome",
                FMT_SQUADRE, 200);
            var conn = {}; ch.conn(conn);
            return { name: "PF - Squadre", nodes: ch.nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
        "PF - Dashboard Stats": function () {
            var ch = buildChain("dashboard/stats",
                "SELECT (SELECT COUNT(*) FROM cantieri WHERE stato_id NOT IN (SELECT id FROM stati_cantiere WHERE is_finale = true))::int AS cantieri_attivi, (SELECT COALESCE(SUM(importo_totale), 0) FROM cantieri)::numeric AS valore_totale, (SELECT COUNT(*) FROM cantieri WHERE data_fine_prevista < NOW() AND data_fine_reale IS NULL)::int AS cantieri_in_ritardo, (SELECT COUNT(*) FROM cantieri c JOIN stati_cantiere s ON c.stato_id = s.id WHERE s.is_finale = true AND c.data_fine_reale >= date_trunc('month', NOW()))::int AS completati_mese",
                FMT_STATS, 200);
            var conn = {}; ch.conn(conn);
            return { name: "PF - Dashboard Stats", nodes: ch.nodi, connections: conn, settings: { executionOrder: "v1" } };
        },
    };

    // 3. Deploy ciascun workflow
    var listaRes = await n8nApi("GET", "/workflows?limit=50");
    var listaWf = (listaRes.data && listaRes.data.data) || [];

    var nomi = Object.keys(defs);
    for (var i = 0; i < nomi.length; i++) {
        var nome = nomi[i];
        var wf = defs[nome]();

        // Sostituisci PLACEHOLDER con credId
        wf.nodes.forEach(function (n) {
            if (n.credentials && n.credentials.postgres && n.credentials.postgres.id === "PLACEHOLDER") {
                n.credentials.postgres.id = credId;
                n.credentials.postgres.name = credId === "hwtYEcUGezoDhDlO" ? "Postgres account" : "PF PostgreSQL";
            }
        });

        console.log("\n📋 " + (i + 1) + ". " + nome + "...");

        var esistente = listaWf.find(function (w) { return w.name === nome; });
        var res;

        if (esistente) {
            await n8nApi("POST", "/workflows/" + esistente.id + "/deactivate");
            res = await n8nApi("PUT", "/workflows/" + esistente.id, wf);
        } else {
            res = await n8nApi("POST", "/workflows", wf);
        }

        if (res.status === 200 || res.status === 201) {
            var wfId = res.data.id;
            console.log("   ✅ [" + wfId + "]");
            var act = await n8nApi("POST", "/workflows/" + wfId + "/activate");
            console.log("   🟢 " + (act.status === 200 ? "Attivato" : "Errore attivazione"));
        } else {
            console.log("   ❌ " + res.status + ": " + JSON.stringify(res.data).substring(0, 200));
        }
    }

    // 4. Test rapido
    console.log("\n\n🧪 Test endpoint...\n");
    await new Promise(function (r) { setTimeout(r, 2000); });

    var endpoints = [
        "config/ruoli", "config/stati_cantiere", "utenti",
        "clienti", "fornitori", "squadre", "dashboard/stats",
    ];

    for (var j = 0; j < endpoints.length; j++) {
        var r = await testWebhook(endpoints[j]);
        var icon = r.status === 200 ? "✅" : "❌";
        var preview = "";
        try {
            var json = JSON.parse(r.data);
            if (json.data && Array.isArray(json.data)) preview = json.data.length + " risultati";
            else if (json.data) preview = JSON.stringify(json.data).substring(0, 100);
            else preview = r.data.substring(0, 100);
        } catch (e) {
            preview = r.data.substring(0, 80) || "(vuoto)";
        }
        console.log(icon + " [" + r.status + "] " + endpoints[j] + " → " + preview);
    }

    console.log("\n✅ Rebuild completato!");
}

deploy().catch(function (e) { console.error("❌", e.message); });
