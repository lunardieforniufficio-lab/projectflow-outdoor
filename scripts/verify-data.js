// Verifica dati reali dagli endpoint
const https = require("https");
const N8N_HOST = "n8n.quarrataweb.it";

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
    var endpoints = [
        "config/ruoli",
        "config/stati_cantiere",
        "utenti",
        "dashboard/stats",
    ];

    for (var i = 0; i < endpoints.length; i++) {
        var ep = endpoints[i];
        console.log("\n===== " + ep + " =====");
        var r = await testWebhook(ep);
        console.log("Status:", r.status);
        try {
            var json = JSON.parse(r.data);
            console.log("Struttura:", typeof json);
            if (json.data && Array.isArray(json.data)) {
                console.log("Elementi:", json.data.length);
                if (json.data.length > 0) {
                    console.log("Primo:", JSON.stringify(json.data[0], null, 2));
                }
            } else if (json.data) {
                console.log("Dati:", JSON.stringify(json.data, null, 2).substring(0, 500));
            } else {
                console.log("Raw:", r.data.substring(0, 500));
            }
        } catch (e) {
            console.log("Non JSON! Raw:", r.data.substring(0, 500));
        }
    }
}

main().catch(console.error);
