// Attiva workflow + testa endpoint
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
            res.on("end", function () {
                resolve({ status: res.statusCode, data: dati.substring(0, 500) });
            });
        });
        req.on("error", reject);
        req.end();
    });
}

async function main() {
    // 1. Prova endpoint di attivazione
    var workflowIds = [
        "fF7OuuU5eqxpNSil", // Configurazioni
        "K9NHil7JBci8Cv94", // Utenti
        "eINlO0D1CMX5pGvr", // Clienti
        "9pKkyVWjG9br0LzL", // Fornitori
        "nSa8uIAbXjqELUpP", // Squadre
        "ZWdTidynF2e975rG", // Dashboard Stats
    ];

    console.log("🔄 Tentativo attivazione workflow...\n");

    // Prova POST /workflows/:id/activate
    for (var i = 0; i < workflowIds.length; i++) {
        var id = workflowIds[i];

        // Metodo 1: POST activate
        var r1 = await n8nApi("POST", "/workflows/" + id + "/activate");
        console.log("[" + id + "] POST /activate: " + r1.status);

        if (r1.status !== 200) {
            // Metodo 2: PUT con active:true
            var r2 = await n8nApi("PUT", "/workflows/" + id, { active: true });
            console.log("[" + id + "] PUT active: " + r2.status);
        }

        if (r1.status !== 200) {
            // Metodo 3: PATCH sull'update di workflow completo
            var dettaglio = await n8nApi("GET", "/workflows/" + id);
            if (dettaglio.status === 200) {
                var wf = dettaglio.data;
                wf.active = true;
                var r3 = await n8nApi("PUT", "/workflows/" + id, wf);
                console.log("[" + id + "] PUT full workflow: " + r3.status);
                if (r3.status === 200) {
                    console.log("  ✅ Attivato con PUT!");
                } else {
                    console.log("  Preview:", JSON.stringify(r3.data).substring(0, 200));
                }
            }
        }
    }

    // 2. Test webhook endpoints
    console.log("\n🧪 Test webhook endpoints...\n");
    var endpoints = [
        "config/ruoli",
        "config/stati_cantiere",
        "utenti",
        "clienti",
        "fornitori",
        "squadre",
        "dashboard/stats",
    ];

    for (var j = 0; j < endpoints.length; j++) {
        var r = await testWebhook(endpoints[j]);
        var icon = r.status === 200 ? "✅" : "❌";
        console.log(icon + " [" + r.status + "] GET /webhook/" + endpoints[j]);
        if (r.status !== 200) {
            console.log("   " + r.data.substring(0, 200));
        } else {
            // Mostra un'anteprima dei dati
            try {
                var json = JSON.parse(r.data);
                var count = Array.isArray(json.data) ? json.data.length : "N/A";
                console.log("   → " + count + " risultati");
            } catch (e) {
                console.log("   → " + r.data.substring(0, 100));
            }
        }
    }
}

main().catch(console.error);
