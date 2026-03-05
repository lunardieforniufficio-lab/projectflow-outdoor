// Analisi dettaglio errori esecuzioni + test con diversi formati risposta
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

async function main() {
    // 1. Dettaglio errore dell'ultima esecuzione
    console.log("🔍 Dettaglio errori esecuzioni...\n");
    var exec = await n8nApi("GET", "/executions?limit=3&status=error");
    if (exec.status === 200 && exec.data.data) {
        for (var i = 0; i < exec.data.data.length; i++) {
            var e = exec.data.data[i];
            console.log("\n=== Esecuzione " + e.id + " (wf: " + e.workflowId + ") ===");

            var det = await n8nApi("GET", "/executions/" + e.id + "?includeData=true");
            if (det.status === 200 && det.data.data) {
                // Errore principale
                if (det.data.data.resultData && det.data.data.resultData.error) {
                    var err = det.data.data.resultData.error;
                    console.log("ERRORE:", err.message);
                    if (err.node) console.log("Nodo:", err.node);
                    if (err.description) console.log("Descrizione:", err.description);
                }

                // RunData per vedere dove si è fermato
                if (det.data.data.resultData && det.data.data.resultData.runData) {
                    var runData = det.data.data.resultData.runData;
                    Object.keys(runData).forEach(function (nodeName) {
                        var runs = runData[nodeName];
                        runs.forEach(function (run) {
                            if (run.error) {
                                console.log("Nodo [" + nodeName + "] ERRORE:", run.error.message);
                            } else if (run.data && run.data.main) {
                                var items = run.data.main[0] || [];
                                console.log("Nodo [" + nodeName + "]: " + items.length + " items OK");
                                if (items.length > 0) {
                                    console.log("  Primo:", JSON.stringify(items[0].json).substring(0, 200));
                                }
                            }
                        });
                    });
                }
            }
        }
    }

    // 2. Test con diversi approcci al respondToWebhook
    var CRED_ID = "hwtYEcUGezoDhDlO";

    // Approccio 1: responseMode "lastNode" (non responseNode) — webhook restituisce direttamente il result
    console.log("\n\n🧪 Test con responseMode 'lastNode'...\n");
    var testWf1 = {
        name: "PF - Test Response A",
        nodes: [
            {
                parameters: {
                    path: "pf-test-a",
                    httpMethod: "GET",
                    responseMode: "lastNode",
                    options: {},
                },
                id: "ta-1", name: "Webhook",
                type: "n8n-nodes-base.webhook", typeVersion: 2,
                position: [250, 200], webhookId: "ta-wh",
            },
            {
                parameters: {
                    jsCode: "return [{json: {data: [{nome: 'Test', valore: 42}]}}];",
                },
                id: "ta-2", name: "Code",
                type: "n8n-nodes-base.code", typeVersion: 2,
                position: [500, 200],
            },
        ],
        connections: {
            "Webhook": { main: [[{ node: "Code", type: "main", index: 0 }]] },
        },
        settings: { executionOrder: "v1" },
    };

    var r1 = await n8nApi("POST", "/workflows", testWf1);
    if (r1.status === 200 || r1.status === 201) {
        var id1 = r1.data.id;
        await n8nApi("POST", "/workflows/" + id1 + "/activate");
        await new Promise(function (r) { setTimeout(r, 1500); });

        var res1 = await testWebhook("pf-test-a");
        console.log("lastNode → Status:", res1.status);
        console.log("lastNode → Body:", res1.data.substring(0, 500));

        await n8nApi("POST", "/workflows/" + id1 + "/deactivate");
        await n8nApi("DELETE", "/workflows/" + id1);
    }

    // Approccio 2: Con Postgres + lastNode
    console.log("\n🧪 Test con Postgres + lastNode...\n");
    var testWf2 = {
        name: "PF - Test Response B",
        nodes: [
            {
                parameters: {
                    path: "pf-test-b",
                    httpMethod: "GET",
                    responseMode: "lastNode",
                    options: {},
                },
                id: "tb-1", name: "Webhook",
                type: "n8n-nodes-base.webhook", typeVersion: 2,
                position: [250, 200], webhookId: "tb-wh",
            },
            {
                parameters: {
                    operation: "executeQuery",
                    query: "SELECT codice, label, colore FROM ruoli WHERE attivo = true ORDER BY ordine LIMIT 3",
                    options: {},
                },
                id: "tb-2", name: "Postgres",
                type: "n8n-nodes-base.postgres", typeVersion: 2.5,
                position: [500, 200],
                credentials: { postgres: { id: CRED_ID, name: "Postgres account" } },
            },
            {
                parameters: {
                    jsCode: "var items = $input.all();\nvar dati = items.map(function(i) { return i.json; });\nreturn [{json: {data: dati}}];",
                },
                id: "tb-3", name: "Format",
                type: "n8n-nodes-base.code", typeVersion: 2,
                position: [750, 200],
            },
        ],
        connections: {
            "Webhook": { main: [[{ node: "Postgres", type: "main", index: 0 }]] },
            "Postgres": { main: [[{ node: "Format", type: "main", index: 0 }]] },
        },
        settings: { executionOrder: "v1" },
    };

    var r2 = await n8nApi("POST", "/workflows", testWf2);
    if (r2.status === 200 || r2.status === 201) {
        var id2 = r2.data.id;
        await n8nApi("POST", "/workflows/" + id2 + "/activate");
        await new Promise(function (r) { setTimeout(r, 1500); });

        var res2 = await testWebhook("pf-test-b");
        console.log("Postgres+lastNode → Status:", res2.status);
        console.log("Postgres+lastNode → Body:", res2.data.substring(0, 500));

        await n8nApi("POST", "/workflows/" + id2 + "/deactivate");
        await n8nApi("DELETE", "/workflows/" + id2);
    }
}

main().catch(console.error);
