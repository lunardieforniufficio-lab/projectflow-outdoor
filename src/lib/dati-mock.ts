// Dati mock per sviluppo UI — verranno rimpiazzati da hook API reali
// NOTA: questi dati servono SOLO per il rendering delle pagine durante lo sviluppo

import type {
    Cantiere,
    CantiereDettaglio,
    DashboardStats,
    Alert,
    Cliente,
    Squadra,
    Fornitore,
    TimelineEntry,
} from "@/types";

// === STATI CANTIERE (simula DB) ===
export const statiCantiereDemo = [
    { id: "s1", codice: "LEAD", label: "Lead", colore: "#3b82f6", icona: "user-plus", ordine: 1 },
    { id: "s2", codice: "VENDITA", label: "Vendita", colore: "#f59e0b", icona: "handshake", ordine: 2 },
    { id: "s3", codice: "ACCONTO", label: "Acconto", colore: "#8b5cf6", icona: "credit-card", ordine: 3 },
    { id: "s4", codice: "RILIEVO", label: "Rilievo", colore: "#06b6d4", icona: "ruler", ordine: 4 },
    { id: "s5", codice: "PROGETTO", label: "Progetto", colore: "#ec4899", icona: "pencil-ruler", ordine: 5 },
    { id: "s6", codice: "ORDINE", label: "Ordine", colore: "#f97316", icona: "package", ordine: 6 },
    { id: "s7", codice: "POSA", label: "Posa", colore: "#1B8C3A", icona: "hammer", ordine: 7 },
    { id: "s8", codice: "COLLAUDO", label: "Collaudo", colore: "#14b8a6", icona: "check-circle", ordine: 8 },
    { id: "s9", codice: "SALDO", label: "Saldo", colore: "#22c55e", icona: "banknote", ordine: 9 },
];

// === CLIENTI DEMO ===
export const clientiDemo: Cliente[] = [
    { id: "c1", nome: "Mario", cognome: "Rossi", codiceFiscale: "RSSMRA80A01H501Z", email: "mario.rossi@email.it", telefono: "+393331234567", indirizzo: "Via Roma 42", citta: "Firenze", cap: "50100", provincia: "FI", iban: null, note: null, creatoIl: "2025-01-15T10:00:00Z", aggiornatoIl: "2025-01-15T10:00:00Z", creatoDa: "u1" },
    { id: "c2", nome: "Anna", cognome: "Bianchi", codiceFiscale: "BNCNNA85B41F205X", email: "anna.bianchi@email.it", telefono: "+393339876543", indirizzo: "Via Garibaldi 15", citta: "Prato", cap: "59100", provincia: "PO", iban: null, note: null, creatoIl: "2025-02-01T10:00:00Z", aggiornatoIl: "2025-02-01T10:00:00Z", creatoDa: "u1" },
    { id: "c3", nome: "Luca", cognome: "Verdi", codiceFiscale: "VRDLCU90C01G999Z", email: "luca.verdi@email.it", telefono: "+393335551234", indirizzo: "Via Mazzini 8", citta: "Pistoia", cap: "51100", provincia: "PT", iban: null, note: null, creatoIl: "2025-02-10T10:00:00Z", aggiornatoIl: "2025-02-10T10:00:00Z", creatoDa: "u1" },
    { id: "c4", nome: "Giulia", cognome: "Neri", codiceFiscale: "NRIGLI88D41A944X", email: "giulia.neri@email.it", telefono: "+393337778899", indirizzo: "Via Dante 22", citta: "Bologna", cap: "40100", provincia: "BO", iban: null, note: null, creatoIl: "2025-03-05T10:00:00Z", aggiornatoIl: "2025-03-05T10:00:00Z", creatoDa: "u1" },
    { id: "c5", nome: "Roberto", cognome: "Agati", codiceFiscale: "GTARRT75E01D612Z", email: "r.agati@email.it", telefono: "+393332224455", indirizzo: "Via Petrarca 10", citta: "Quarrata", cap: "51039", provincia: "PT", iban: null, note: null, creatoIl: "2025-03-20T10:00:00Z", aggiornatoIl: "2025-03-20T10:00:00Z", creatoDa: "u1" },
];

// === SQUADRE DEMO ===
export const squadreDemo: Squadra[] = [
    { id: "sq1", nome: "Nexteam", responsabileId: "u3", telefono: "+393331112233", colore: "#1B8C3A", attiva: true, creatoIl: "2025-01-01T10:00:00Z" },
    { id: "sq2", nome: "Alfateam", responsabileId: "u4", telefono: "+393334445566", colore: "#3b82f6", attiva: true, creatoIl: "2025-01-01T10:00:00Z" },
    { id: "sq3", nome: "Team Esterni", responsabileId: null, telefono: null, colore: "#f59e0b", attiva: true, creatoIl: "2025-01-01T10:00:00Z" },
];

// === TIPI PRODOTTO DEMO ===
export const tipiProdottoDemo = [
    { id: "tp1", codice: "evolution_elite", label: "Evolution Elite", categoria: "pergola" },
    { id: "tp2", codice: "bioclimatica_plus", label: "Bioclimatica Plus", categoria: "bioclimatica" },
    { id: "tp3", codice: "pergotenda_classic", label: "Pergotenda Classic", categoria: "pergotenda" },
];

// === CANTIERI DEMO ===
export const cantieriDemo: Cantiere[] = [
    { id: "k1", codice: "C-2025-001", clienteId: "c1", tipoProdottoId: "tp1", statoId: "s7", importoTotale: 18425.00, importoAcconto: 7370.00, accontoPagato: true, indirizzoCantiere: "Via Roma 42, Firenze", cittaCantiere: "Firenze", squadraId: "sq1", venditoreId: "u2", progettistaId: null, dataInizio: "2025-04-15", dataFinePrevista: "2025-05-20", dataFineReale: null, noteInterne: "Pergola bioclimatica con illuminazione LED", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-01-15T10:00:00Z", aggiornatoIl: "2025-04-15T10:00:00Z", creatoDa: "u1" },
    { id: "k2", codice: "C-2025-002", clienteId: "c2", tipoProdottoId: "tp2", statoId: "s3", importoTotale: 12800.00, importoAcconto: 5120.00, accontoPagato: true, indirizzoCantiere: "Via Garibaldi 15, Prato", cittaCantiere: "Prato", squadraId: null, venditoreId: "u2", progettistaId: null, dataInizio: null, dataFinePrevista: "2025-06-30", dataFineReale: null, noteInterne: null, googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-02-01T10:00:00Z", aggiornatoIl: "2025-03-10T10:00:00Z", creatoDa: "u1" },
    { id: "k3", codice: "C-2025-003", clienteId: "c3", tipoProdottoId: "tp1", statoId: "s2", importoTotale: 22000.00, importoAcconto: null, accontoPagato: false, indirizzoCantiere: "Via Mazzini 8, Pistoia", cittaCantiere: "Pistoia", squadraId: null, venditoreId: "u2", progettistaId: null, dataInizio: null, dataFinePrevista: null, dataFineReale: null, noteInterne: "Cliente indeciso tra Evolution e Bioclimatica", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-02-10T10:00:00Z", aggiornatoIl: "2025-02-20T10:00:00Z", creatoDa: "u1" },
    { id: "k4", codice: "C-2025-004", clienteId: "c4", tipoProdottoId: "tp3", statoId: "s6", importoTotale: 9500.00, importoAcconto: 3800.00, accontoPagato: true, indirizzoCantiere: "Via Dante 22, Bologna", cittaCantiere: "Bologna", squadraId: "sq2", venditoreId: "u2", progettistaId: null, dataInizio: "2025-05-01", dataFinePrevista: "2025-05-30", dataFineReale: null, noteInterne: null, googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-03-05T10:00:00Z", aggiornatoIl: "2025-04-20T10:00:00Z", creatoDa: "u1" },
    { id: "k5", codice: "C-2025-005", clienteId: "c5", tipoProdottoId: "tp2", statoId: "s1", importoTotale: null, importoAcconto: null, accontoPagato: false, indirizzoCantiere: "Via Petrarca 10, Quarrata", cittaCantiere: "Quarrata", squadraId: null, venditoreId: null, progettistaId: null, dataInizio: null, dataFinePrevista: null, dataFineReale: null, noteInterne: "Primo contatto, da richiamare lunedì", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-03-20T10:00:00Z", aggiornatoIl: "2025-03-20T10:00:00Z", creatoDa: "u1" },
    { id: "k6", codice: "C-2025-006", clienteId: "c1", tipoProdottoId: "tp1", statoId: "s9", importoTotale: 15200.00, importoAcconto: 6080.00, accontoPagato: true, indirizzoCantiere: "Via Leopardi 5, Firenze", cittaCantiere: "Firenze", squadraId: "sq1", venditoreId: "u2", progettistaId: null, dataInizio: "2025-02-01", dataFinePrevista: "2025-03-15", dataFineReale: "2025-03-12", noteInterne: "Completato con successo", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2024-12-01T10:00:00Z", aggiornatoIl: "2025-03-12T10:00:00Z", creatoDa: "u1" },
    { id: "k7", codice: "C-2025-007", clienteId: "c3", tipoProdottoId: "tp3", statoId: "s5", importoTotale: 11200.00, importoAcconto: 4480.00, accontoPagato: true, indirizzoCantiere: "Via Verdi 18, Pistoia", cittaCantiere: "Pistoia", squadraId: null, venditoreId: "u2", progettistaId: null, dataInizio: null, dataFinePrevista: "2025-07-15", dataFineReale: null, noteInterne: "In attesa progetto esecutivo dal fornitore", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-03-01T10:00:00Z", aggiornatoIl: "2025-04-01T10:00:00Z", creatoDa: "u1" },
    { id: "k8", codice: "C-2025-008", clienteId: "c4", tipoProdottoId: "tp1", statoId: "s4", importoTotale: 28000.00, importoAcconto: 11200.00, accontoPagato: true, indirizzoCantiere: "Viale Europa 33, Bologna", cittaCantiere: "Bologna", squadraId: null, venditoreId: "u2", progettistaId: null, dataInizio: null, dataFinePrevista: "2025-08-01", dataFineReale: null, noteInterne: "Rilievo programmato per prossima settimana", googleCalendarEventId: null, googleDriveFolderId: null, creatoIl: "2025-03-15T10:00:00Z", aggiornatoIl: "2025-04-05T10:00:00Z", creatoDa: "u1" },
];

// === DETTAGLIO CANTIERI (con relazioni espanse) ===
export const cantieriDettaglioDemo: CantiereDettaglio[] = cantieriDemo.map((cantiere) => {
    const cliente = clientiDemo.find((c) => c.id === cantiere.clienteId);
    const stato = statiCantiereDemo.find((s) => s.id === cantiere.statoId);
    const squadra = squadreDemo.find((s) => s.id === cantiere.squadraId);
    const tipo = tipiProdottoDemo.find((t) => t.id === cantiere.tipoProdottoId);

    return {
        ...cantiere,
        cliente: cliente ? { id: cliente.id, nome: cliente.nome, cognome: cliente.cognome, telefono: cliente.telefono, email: cliente.email } : { id: "", nome: "", cognome: "", telefono: "", email: null },
        stato: stato ? { codice: stato.codice, label: stato.label, colore: stato.colore } : { codice: "", label: "", colore: "#666" },
        tipoProdotto: tipo ? { codice: tipo.codice, label: tipo.label, categoria: tipo.categoria } : { codice: "evolution_elite", label: "Evolution Elite", categoria: "pergola" },
        squadra: squadra ? { id: squadra.id, nome: squadra.nome, colore: squadra.colore } : null,
        venditore: { id: "u2", nome: "Francesco", cognome: "Sinagra" },
    };
});

// === DASHBOARD STATS DEMO ===
export const dashboardStatsDemo: DashboardStats = {
    cantieriAttivi: 6,
    valoreTotale: 117125.00,
    alertAttivi: 2,
    completatiMese: 1,
    cantieriPerStato: [
        { statoLabel: "Lead", conteggio: 1, colore: "#3b82f6" },
        { statoLabel: "Vendita", conteggio: 1, colore: "#f59e0b" },
        { statoLabel: "Acconto", conteggio: 1, colore: "#8b5cf6" },
        { statoLabel: "Rilievo", conteggio: 1, colore: "#06b6d4" },
        { statoLabel: "Progetto", conteggio: 1, colore: "#ec4899" },
        { statoLabel: "Ordine", conteggio: 1, colore: "#f97316" },
        { statoLabel: "Posa", conteggio: 1, colore: "#1B8C3A" },
        { statoLabel: "Saldo", conteggio: 1, colore: "#22c55e" },
    ],
    cantieriInRitardo: 1,
};

// === ALERT DEMO ===
export const alertDemo: Alert[] = [
    { id: "a1", tipo: "ritardo_fornitore", messaggio: "Ordine #ORD-2025-012 in ritardo di 5 giorni — fornitore KE Outdoor", cantiereId: "k4", cantiereCodice: "C-2025-004", gravita: "alta", creatoIl: "2025-04-25T08:00:00Z", letto: false },
    { id: "a2", tipo: "scadenza_prevista", messaggio: "Cantiere C-2025-001 supera data fine prevista tra 3 giorni", cantiereId: "k1", cantiereCodice: "C-2025-001", gravita: "media", creatoIl: "2025-05-17T08:00:00Z", letto: false },
];

// === FORNITORI DEMO ===
export const fornitoriDemo: Fornitore[] = [
    { id: "f1", nome: "KE Outdoor Design", partitaIva: "04056850265", referente: "Marco Zago", email: "ordini@keoutdoor.com", telefono: "+390423738600", indirizzo: "Via Serenissima 1, Godega di Sant'Urbano (TV)", note: "Fornitore principale pergole", attivo: true, creatoIl: "2025-01-01T10:00:00Z" },
    { id: "f2", nome: "Frigerio Living", partitaIva: "03228530137", referente: "Laura Frigerio", email: "info@frigerioliving.com", telefono: "+390318210700", indirizzo: "Via Lecco 12, Cisano Bergamasco (BG)", note: "Bioclimatiche e tende", attivo: true, creatoIl: "2025-01-01T10:00:00Z" },
    { id: "f3", nome: "Corradi Outdoor Living", partitaIva: "01234567890", referente: "Andrea Corradi", email: "ordini@corradi.eu", telefono: "+39049877000", indirizzo: "Via Corte Garofolo 100, Bologna (BO)", note: null, attivo: true, creatoIl: "2025-01-01T10:00:00Z" },
    { id: "f4", nome: "Ferramenta Industriale Toscana", partitaIva: "09876543210", referente: "Giovanni Bruni", email: "vendite@fit-srl.it", telefono: "+390573445566", indirizzo: "Via dell'Industria 5, Pistoia (PT)", note: "Minuteria e ferramenta", attivo: true, creatoIl: "2025-01-15T10:00:00Z" },
];

// === TIMELINE DEMO ===
export const timelineDemo: TimelineEntry[] = [
    { id: "tl1", cantiereId: "k1", tipo: "cambio_stato", autoreId: "u1", autoreNome: "Marco Vitaletti", contenuto: "Stato aggiornato da Acconto a Rilievo", metadata: { statoDa: "ACCONTO", statoA: "RILIEVO" }, creatoIl: "2025-02-15T09:00:00Z" },
    { id: "tl2", cantiereId: "k1", tipo: "nota", autoreId: "u2", autoreNome: "Francesco Sinagra", contenuto: "Verificato accesso cantiere dal lato giardino. Nessun ostacolo per il montaggio.", metadata: null, creatoIl: "2025-02-20T14:30:00Z" },
    { id: "tl3", cantiereId: "k1", tipo: "cambio_stato", autoreId: "u1", autoreNome: "Marco Vitaletti", contenuto: "Stato aggiornato da Rilievo a Progetto", metadata: { statoDa: "RILIEVO", statoA: "PROGETTO" }, creatoIl: "2025-03-01T10:00:00Z" },
    { id: "tl4", cantiereId: "k1", tipo: "foto", autoreId: "u3", autoreNome: "Francesco Sinagra", contenuto: "Foto rilievo area di installazione", metadata: { mediaCount: 3, mediaType: "foto" }, creatoIl: "2025-03-02T11:15:00Z" },
    { id: "tl5", cantiereId: "k1", tipo: "cambio_stato", autoreId: "u1", autoreNome: "Marco Vitaletti", contenuto: "Stato aggiornato da Ordine a Posa", metadata: { statoDa: "ORDINE", statoA: "POSA" }, creatoIl: "2025-04-10T08:00:00Z" },
    { id: "tl6", cantiereId: "k1", tipo: "nota", autoreId: "u3", autoreNome: "Francesco Sinagra", contenuto: "Inizio posa previsto per lunedì 15. Squadra Nexteam confermata. Portare scala telescopica.", metadata: null, creatoIl: "2025-04-12T16:45:00Z" },
    { id: "tl7", cantiereId: "k2", tipo: "cambio_stato", autoreId: "u1", autoreNome: "Marco Vitaletti", contenuto: "Stato aggiornato da Vendita a Acconto", metadata: { statoDa: "VENDITA", statoA: "ACCONTO" }, creatoIl: "2025-03-10T10:00:00Z" },
    { id: "tl8", cantiereId: "k2", tipo: "nota", autoreId: "u2", autoreNome: "Alberto Bini", contenuto: "Cliente ha confermato modello Bioclimatica Plus con LED integrati. Acconto ricevuto.", metadata: null, creatoIl: "2025-03-10T11:00:00Z" },
    { id: "tl9", cantiereId: "k4", tipo: "ordine", autoreId: "u5", autoreNome: "Simone Cocci", contenuto: "Ordine #ORD-2025-012 inviato a KE Outdoor — consegna prevista 20/04", metadata: { fornitore: "KE Outdoor Design", ordineId: "ord1" }, creatoIl: "2025-04-01T09:30:00Z" },
    { id: "tl10", cantiereId: "k4", tipo: "nota", autoreId: "u5", autoreNome: "Simone Cocci", contenuto: "Ritardo fornitore comunicato: slittamento di 5 giorni per problemi di produzione.", metadata: null, creatoIl: "2025-04-25T08:00:00Z" },
    { id: "tl11", cantiereId: "k6", tipo: "cambio_stato", autoreId: "u1", autoreNome: "Marco Vitaletti", contenuto: "Stato aggiornato da Collaudo a Saldo", metadata: { statoDa: "COLLAUDO", statoA: "SALDO" }, creatoIl: "2025-03-12T10:00:00Z" },
    { id: "tl12", cantiereId: "k6", tipo: "nota", autoreId: "u2", autoreNome: "Alberto Bini", contenuto: "Collaudo superato. Cliente molto soddisfatto. Richiedere recensione Google.", metadata: null, creatoIl: "2025-03-12T15:00:00Z" },
];
