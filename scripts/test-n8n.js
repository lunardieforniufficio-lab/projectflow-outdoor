// Test accesso API n8n
const https = require("https");

const options = {
    hostname: "n8n.quarrataweb.it",
    path: "/api/v1/workflows?limit=5",
    method: "GET",
    headers: {
        "X-N8N-API-KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiYzFlYjQwNS0xODA0LTQ4NzgtODcwNy0zMzcwNDNiODk5NDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiMDI4ZDBiMjAtYTc2OS00MDY2LThjY2EtZDA2OWM0MmEyMzYyIiwiaWF0IjoxNzcwOTYwNjAzfQ.9tyaTRxjmjw-36i-Sj7wE8w5PdtEeW1WqX6wkm8R9C8",
    },
};

const req = https.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
        console.log("Status:", res.statusCode);
        try {
            const json = JSON.parse(data);
            console.log("Workflows trovati:", json.data ? json.data.length : "N/A");
            if (json.data) {
                json.data.forEach((w) => console.log(`  - [${w.id}] ${w.name} (${w.active ? "attivo" : "inattivo"})`));
            } else {
                console.log("Risposta:", data.substring(0, 200));
            }
        } catch (e) {
            console.log("Risposta raw:", data.substring(0, 300));
        }
    });
});
req.on("error", (e) => console.log("Errore:", e.message));
req.end();
