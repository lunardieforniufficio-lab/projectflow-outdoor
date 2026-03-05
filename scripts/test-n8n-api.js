// Verifica API n8n disponibili
const https = require("https");

const N8N_HOST = "n8n.quarrataweb.it";
const N8N_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzFlYjQwNS0xODA0LTQ4NzgtODcwNy0zMzcwNDNiODk5NDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDI4ZDBiMjAtYTc2OS00MDY2LThjY2EtZDA2OWM0MmEyMzYyIiwiaWF0IjoxNzcwOTYwNjAzfQ.9tyaTRxjmjw-36i-Sj7wE8w5PdtEeW1WqX6wkm8R9C8";

function testEndpoint(metodo, percorso) {
    return new Promise(function (resolve) {
        var opzioni = {
            hostname: N8N_HOST,
            path: percorso,
            method: metodo,
            headers: {
                "X-N8N-API-KEY": N8N_API_KEY,
                Accept: "application/json",
            },
        };

        var req = https.request(opzioni, function (res) {
            var dati = "";
            res.on("data", function (chunk) {
                dati += chunk;
            });
            res.on("end", function () {
                resolve({
                    endpoint: metodo + " " + percorso,
                    status: res.statusCode,
                    preview: dati.substring(0, 150),
                });
            });
        });
        req.on("error", function (e) {
            resolve({
                endpoint: metodo + " " + percorso,
                status: "ERROR",
                preview: e.message,
            });
        });
        req.end();
    });
}

async function main() {
    var endpoints = [
        ["GET", "/api/v1/workflows"],
        ["GET", "/api/v1/credentials"],
        ["GET", "/api/v1/credentials?includeScopes=true"],
        ["GET", "/api/v1/executions"],
        ["GET", "/api/v1/users"],
        ["GET", "/api/v1/tags"],
        ["GET", "/api/v1/audit"],
        ["GET", "/api/v1/variables"],
    ];

    console.log("🔍 Test endpoint n8n API\n");
    for (var i = 0; i < endpoints.length; i++) {
        var r = await testEndpoint(endpoints[i][0], endpoints[i][1]);
        var statusIcon = r.status === 200 ? "✅" : "❌";
        console.log(statusIcon + " [" + r.status + "] " + r.endpoint);
        if (r.status !== 200) console.log("   Preview: " + r.preview);
    }

    // Testa un workflow specifico esistente per capire la struttura
    console.log("\n📋 Dettaglio primo workflow...");
    var res = await testEndpoint("GET", "/api/v1/workflows");
    try {
        var json = JSON.parse(
            (
                await new Promise(function (resolve) {
                    var opzioni = {
                        hostname: N8N_HOST,
                        path: "/api/v1/workflows",
                        method: "GET",
                        headers: {
                            "X-N8N-API-KEY": N8N_API_KEY,
                            Accept: "application/json",
                        },
                    };
                    var req = https.request(opzioni, function (res) {
                        var dati = "";
                        res.on("data", function (chunk) {
                            dati += chunk;
                        });
                        res.on("end", function () {
                            resolve(dati);
                        });
                    });
                    req.end();
                })
            )
        );

        // Prendi il primo workflow attivo per vedere la struttura
        var attivo = json.data.find(function (w) {
            return w.active;
        });
        if (attivo) {
            // Ottieni dettaglio
            var dettaglio = await new Promise(function (resolve) {
                var opzioni = {
                    hostname: N8N_HOST,
                    path: "/api/v1/workflows/" + attivo.id,
                    method: "GET",
                    headers: {
                        "X-N8N-API-KEY": N8N_API_KEY,
                        Accept: "application/json",
                    },
                };
                var req = https.request(opzioni, function (res) {
                    var dati = "";
                    res.on("data", function (chunk) {
                        dati += chunk;
                    });
                    res.on("end", function () {
                        resolve(dati);
                    });
                });
                req.end();
            });

            var wf = JSON.parse(dettaglio);
            console.log("Workflow: " + wf.name);
            console.log("Nodi:");
            (wf.nodes || []).forEach(function (n) {
                console.log(
                    "  - [" + n.type + " v" + n.typeVersion + "] " + n.name
                );
                if (n.credentials) {
                    console.log("    Credentials:", JSON.stringify(n.credentials));
                }
            });
        }
    } catch (e) {
        console.log("Errore parsing:", e.message);
    }
}

main().catch(console.error);
