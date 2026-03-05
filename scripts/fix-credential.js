// Tentativo creazione credenziale con schema completo n8n
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

async function main() {
    // Tentativo con schema Postgres completo (tutti i campi richiesti)
    var schemas = [
        // Schema 1: tutti i campi SSH e tunnel
        {
            name: "PF PostgreSQL",
            type: "postgres",
            data: {
                host: "localhost",
                port: 5432,
                database: "lunardieforni_db",
                user: "postgres",
                password: "Matrox0573",
                ssl: "disable",
                sshAuthenticateWith: "password",
                sshTunnel: false,
            },
        },
        // Schema 2: sshTunnel = false con tutti i default
        {
            name: "PF PostgreSQL",
            type: "postgres",
            data: {
                host: "localhost",
                port: 5432,
                database: "lunardieforni_db",
                user: "postgres",
                password: "Matrox0573",
                ssl: "disable",
                sshAuthenticateWith: "password",
                sshTunnel: false,
                sshHost: "",
                sshPort: 22,
                sshUser: "",
                sshPassword: "",
            },
        },
        // Schema 3: sshTunnel esplicitamente off
        {
            name: "PF PostgreSQL",
            type: "postgres",
            data: {
                host: "localhost",
                database: "lunardieforni_db",
                user: "postgres",
                password: "Matrox0573",
                port: 5432,
                ssl: "disable",
                sshAuthenticateWith: "password",
                sshTunnel: false,
                sshHost: "",
                sshPort: 22,
                sshUser: "",
                sshPassword: "",
                privateKey: "",
                passphrase: "",
            },
        },
    ];

    for (var i = 0; i < schemas.length; i++) {
        console.log("\nTentativo " + (i + 1) + "...");
        var res = await n8nApi("POST", "/credentials", schemas[i]);
        console.log("  Status:", res.status);
        if (res.status === 200 || res.status === 201) {
            console.log("  ✅ SUCCESS! ID:", res.data.id);
            return;
        }
        console.log("  Body:", JSON.stringify(res.data).substring(0, 500));
    }

    // Se tutti falliscono, prova a PATCHARE la credenziale esistente
    console.log("\n\nTentativo PATCH credenziale esistente...");
    var patchSchemas = [
        // Prova PATCH con solo il database
        { data: { database: "lunardieforni_db" } },
        // Prova PUT completo
        {
            name: "Postgres account",
            type: "postgres",
            data: {
                host: "localhost",
                port: 5432,
                database: "lunardieforni_db",
                user: "postgres",
                password: "Matrox0573",
                ssl: "disable",
                sshAuthenticateWith: "password",
                sshTunnel: false,
            },
        },
    ];

    for (var j = 0; j < patchSchemas.length; j++) {
        console.log("\nPATCH tentativo " + (j + 1) + "...");
        var res = await n8nApi("PATCH", "/credentials/hwtYEcUGezoDhDlO", patchSchemas[j]);
        console.log("  Status:", res.status);
        if (res.status === 200) {
            console.log("  ✅ Aggiornata!");
            return;
        }
        console.log("  Body:", JSON.stringify(res.data).substring(0, 500));
    }

    // Prova DELETE + ricreazione
    console.log("\n\nUltimo tentativo: elimina la vecchia e ricrea...");
    var delRes = await n8nApi("DELETE", "/credentials/hwtYEcUGezoDhDlO");
    console.log("DELETE:", delRes.status);
    if (delRes.status === 200 || delRes.status === 204) {
        // Ricrea con schema completo
        var createRes = await n8nApi("POST", "/credentials", schemas[2]);
        console.log("POST:", createRes.status);
        if (createRes.status === 200 || createRes.status === 201) {
            console.log("✅ Nuova credenziale:", createRes.data.id);
        } else {
            console.log("Body:", JSON.stringify(createRes.data).substring(0, 500));
        }
    }
}

main().catch(console.error);
