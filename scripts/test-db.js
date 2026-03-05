// Test connessione DB + verifica tabelle esistenti
const { Client } = require("pg");

async function test() {
    const c = new Client({
        host: "62.171.191.178",
        port: 5432,
        user: "postgres",
        password: "Matrox0573",
        database: "lunardieforni_db",
        connectionTimeoutMillis: 5000,
    });

    try {
        await c.connect();
        console.log("✅ Connessione OK");

        const dbRes = await c.query("SELECT current_database()");
        console.log("DB:", dbRes.rows[0].current_database);

        // Elenca tabelle esistenti
        const tabRes = await c.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
        );
        console.log("\nTabelle esistenti:", tabRes.rows.length);
        tabRes.rows.forEach((r) => console.log("  -", r.tablename));

        // Controlla se le tabelle config esistono
        const configTables = ["ruoli", "stati_cantiere", "aree_aziendali", "tipi_prodotto"];
        for (const t of configTables) {
            try {
                const countRes = await c.query(`SELECT COUNT(*) FROM ${t}`);
                console.log(`\n${t}: ${countRes.rows[0].count} righe`);
            } catch (e) {
                console.log(`\n${t}: NON ESISTE`);
            }
        }
    } catch (e) {
        console.log("❌ Errore:", e.message);
    } finally {
        await c.end();
    }
}

test();
