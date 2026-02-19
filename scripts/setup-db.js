// Script per creare database e eseguire SQL sulla VPS PostgreSQL
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function eseguiSQL() {
    // Prima: crea il database se non esiste
    const clientAdmin = new Client({
        host: '62.171.191.178',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'Matrox0573',
        ssl: false,
        connectionTimeoutMillis: 10000,
    });

    try {
        console.log('📡 Connessione al server PostgreSQL...');
        await clientAdmin.connect();
        console.log('✅ Connesso!');

        // Crea database se non esiste
        const risultato = await clientAdmin.query(
            "SELECT 1 FROM pg_database WHERE datname = 'lunardieforni_db'"
        );
        if (risultato.rows.length === 0) {
            console.log('🔧 Creo database lunardieforni_db...');
            await clientAdmin.query('CREATE DATABASE lunardieforni_db');
            console.log('✅ Database creato!');
        } else {
            console.log('ℹ️  Database lunardieforni_db già esistente');
        }
        await clientAdmin.end();
    } catch (errore) {
        console.error('❌ Errore connessione admin:', errore.message);
        await clientAdmin.end().catch(() => { });
        process.exit(1);
    }

    // Seconda: esegui schema e seed sul database creato
    const client = new Client({
        host: '62.171.191.178',
        port: 5432,
        database: 'lunardieforni_db',
        user: 'postgres',
        password: 'Matrox0573',
        ssl: false,
        connectionTimeoutMillis: 10000,
    });

    try {
        await client.connect();
        console.log('📡 Connesso a lunardieforni_db');

        // Esegui schema
        const schemaSQL = fs.readFileSync(
            path.join(__dirname, '001-schema.sql'),
            'utf8'
        );
        console.log('🏗️  Esecuzione schema tabelle...');
        await client.query(schemaSQL);
        console.log('✅ Schema creato!');

        // Esegui seed
        const seedSQL = fs.readFileSync(
            path.join(__dirname, '002-seed.sql'),
            'utf8'
        );
        console.log('🌱 Esecuzione seed data...');
        await client.query(seedSQL);
        console.log('✅ Seed data inseriti!');

        // Verifica: conta righe nelle tabelle principali
        const tabelle = ['ruoli', 'aree_aziendali', 'stati_cantiere', 'tipi_prodotto', 'configurazioni', 'utenti_gestionale', 'transizioni_stato', 'vincoli_transizione', 'permessi_ruolo'];
        console.log('\n📊 Verifica conteggi:');
        for (const tabella of tabelle) {
            const ris = await client.query(`SELECT COUNT(*) as conteggio FROM ${tabella}`);
            console.log(`   ${tabella}: ${ris.rows[0].conteggio} righe`);
        }

        await client.end();
        console.log('\n🎉 Setup database completato con successo!');
    } catch (errore) {
        console.error('❌ Errore esecuzione SQL:', errore.message);
        if (errore.detail) console.error('   Dettaglio:', errore.detail);
        if (errore.position) console.error('   Posizione:', errore.position);
        await client.end().catch(() => { });
        process.exit(1);
    }
}

eseguiSQL();
