// Fix workflow Configurazioni — usa un webhook per ogni tipo di config
const https = require("https");
const N8N_HOST = "n8n.quarrataweb.it";
const N8N_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzFlYjQwNS0xODA0LTQ4NzgtODcwNy0zMzcwNDNiODk5NDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDI4ZDBiMjAtYTc2OS00MDY2LThjY2EtZDA2OWM0MmEyMzYyIiwiaWF0IjoxNzcwOTYwNjAzfQ.9tyaTRxjmjw-36i-Sj7wE8w5PdtEeW1WqX6wkm8R9C8";

var CRED_ID = "hwtYEcUGezoDhDlO";

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

var contatore = 100;
function id() { contatore++; return "cfg-" + contatore; }

// Approccio: un webhook separato per ogni tipo di configurazione
// Path: config-ruoli, config-stati-cantiere, config-tipi-prodotto, config-aree-aziendali, config-transizioni
function creaChainConfig(webhookPath, querySQL, fmtCode, posY) {
    var webhook = {
        parameters: {
            path: webhookPath,
            httpMethod: "GET",
            responseMode: "responseNode",
            options: {},
        },
        id: id(),
        name: "GET " + webhookPath,
        type: "n8n-nodes-base.webhook",
        typeVersion: 2,
        position: [250, posY],
        webhookId: id(),
    };

    var codeQuery = {
        parameters: { jsCode: "return [{json: { sqlQuery: `" + querySQL + "` }}];" },
        id: id(),
        name: "Query " + webhookPath,
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [500, posY],
    };

    var postgres = {
        parameters: {
            operation: "executeQuery",
            query: "={{ $json.sqlQuery }}",
            options: {},
        },
        id: id(),
        name: "PG " + webhookPath,
        type: "n8n-nodes-base.postgres",
        typeVersion: 2.5,
        position: [750, posY],
        credentials: { postgres: { id: CRED_ID, name: "Postgres account" } },
    };

    var codeFmt = {
        parameters: { jsCode: fmtCode },
        id: id(),
        name: "Fmt " + webhookPath,
        type: "n8n-nodes-base.code",
        typeVersion: 2,
        position: [1000, posY],
    };

    var rispondi = {
        parameters: {
            respondWith: "json",
            responseBody: '={{ JSON.stringify($json.risposta) }}',
            options: {
                responseCode: "={{ $json.statusCode || 200 }}",
                responseHeaders: {
                    entries: [
                        { name: "Access-Control-Allow-Origin", value: "*" },
                        { name: "Content-Type", value: "application/json" },
                    ],
                },
            },
        },
        id: id(),
        name: "Resp " + webhookPath,
        type: "n8n-nodes-base.respondToWebhook",
        typeVersion: 1.1,
        position: [1250, posY],
    };

    return {
        nodi: [webhook, codeQuery, postgres, codeFmt, rispondi],
        connessioni: function (c) {
            c[webhook.name] = { main: [[{ node: codeQuery.name, type: "main", index: 0 }]] };
            c[codeQuery.name] = { main: [[{ node: postgres.name, type: "main", index: 0 }]] };
            c[postgres.name] = { main: [[{ node: codeFmt.name, type: "main", index: 0 }]] };
            c[codeFmt.name] = { main: [[{ node: rispondi.name, type: "main", index: 0 }]] };
        },
    };
}

// Formato risposta generico snake_case → camelCase
var FMT_CAMEL = `
var items = $input.all();
var dati = items.map(function(item) { return item.json; });
function toCamel(obj) {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === 'object') {
    var nuovo = {};
    Object.keys(obj).forEach(function(k) {
      var nc = k.replace(/_([a-z])/g, function(m, l) { return l.toUpperCase(); });
      nuovo[nc] = toCamel(obj[k]);
    });
    return nuovo;
  }
  return obj;
}
return [{json: { risposta: { data: toCamel(dati) }, statusCode: 200 }}];
`;

// Formato transizioni con nested objects
var FMT_TRANSIZIONI = `
var items = $input.all();
var transizioni = items.map(function(item) {
  var t = item.json;
  return {
    id: t.id,
    statoDa: { codice: t.da_codice, label: t.da_label },
    statoA: { codice: t.a_codice, label: t.a_label },
    attiva: t.attiva
  };
});
return [{json: { risposta: { data: transizioni }, statusCode: 200 }}];
`;

async function main() {
    console.log("🔧 Fix workflow Configurazioni...\n");

    // Definiamo le chain per ogni tipo di config
    var chains = [
        creaChainConfig(
            "config/ruoli",
            "SELECT * FROM ruoli WHERE attivo = true ORDER BY ordine",
            FMT_CAMEL, 200
        ),
        creaChainConfig(
            "config/stati_cantiere",
            "SELECT * FROM stati_cantiere WHERE attivo = true ORDER BY ordine",
            FMT_CAMEL, 500
        ),
        creaChainConfig(
            "config/tipi_prodotto",
            "SELECT * FROM tipi_prodotto WHERE attivo = true ORDER BY ordine",
            FMT_CAMEL, 800
        ),
        creaChainConfig(
            "config/aree_aziendali",
            "SELECT * FROM aree_aziendali WHERE attivo = true ORDER BY ordine",
            FMT_CAMEL, 1100
        ),
        creaChainConfig(
            "config/configurazioni",
            "SELECT * FROM configurazioni WHERE modificabile = true ORDER BY chiave",
            FMT_CAMEL, 1400
        ),
        creaChainConfig(
            "config/transizioni",
            `SELECT t.id, t.attiva,
             da.codice AS da_codice, da.label AS da_label,
             a.codice AS a_codice, a.label AS a_label
             FROM transizioni_stato t
             JOIN stati_cantiere da ON t.stato_da_id = da.id
             JOIN stati_cantiere a ON t.stato_a_id = a.id
             WHERE t.attiva = true
             ORDER BY da.ordine`,
            FMT_TRANSIZIONI, 1700
        ),
    ];

    // Costruisci workflow completo
    var tuttiNodi = [];
    var connessioni = {};
    chains.forEach(function (chain) {
        tuttiNodi = tuttiNodi.concat(chain.nodi);
        chain.connessioni(connessioni);
    });

    var workflow = {
        name: "PF - Configurazioni",
        nodes: tuttiNodi,
        connections: connessioni,
        settings: { executionOrder: "v1" },
    };

    // Aggiorna il workflow esistente
    var WF_ID = "fF7OuuU5eqxpNSil";
    console.log("📋 Aggiornamento workflow [" + WF_ID + "]...");

    // Prima disattiva
    await n8nApi("POST", "/workflows/" + WF_ID + "/deactivate");

    // Aggiorna
    var res = await n8nApi("PUT", "/workflows/" + WF_ID, workflow);
    if (res.status === 200) {
        console.log("✅ Workflow aggiornato!");
    } else {
        console.log("❌ Errore aggiornamento:", res.status, JSON.stringify(res.data).substring(0, 300));
        return;
    }

    // Riattiva
    var act = await n8nApi("POST", "/workflows/" + WF_ID + "/activate");
    console.log("🟢 Attivazione:", act.status === 200 ? "OK" : "ERRORE " + act.status);

    // Test
    console.log("\n🧪 Test endpoint config...\n");
    var endpoints = [
        "config/ruoli",
        "config/stati_cantiere",
        "config/tipi_prodotto",
        "config/aree_aziendali",
        "config/configurazioni",
        "config/transizioni",
    ];

    for (var i = 0; i < endpoints.length; i++) {
        var r = await testWebhook(endpoints[i]);
        var icon = r.status === 200 ? "✅" : "❌";
        console.log(icon + " [" + r.status + "] GET /webhook/" + endpoints[i]);
        if (r.status === 200) {
            try {
                var json = JSON.parse(r.data);
                var count = Array.isArray(json.data) ? json.data.length + " risultati" : "OK";
                console.log("   → " + count);
                // Mostra primo elemento
                if (Array.isArray(json.data) && json.data.length > 0) {
                    var primo = json.data[0];
                    console.log("   → Primo: " + JSON.stringify(primo).substring(0, 150));
                }
            } catch (e) {
                console.log("   → " + r.data.substring(0, 100));
            }
        } else {
            console.log("   " + r.data.substring(0, 200));
        }
    }
}

main().catch(console.error);
