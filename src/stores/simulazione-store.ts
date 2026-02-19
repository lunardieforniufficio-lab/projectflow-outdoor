// Store Zustand per simulazione ruolo — solo per super admin (sviluppo/test)
"use client";

import { create } from "zustand";

/** Ruoli simulabili con le relative voci sidebar */
export interface RuoloSimulabile {
    codice: string;
    label: string;
    colore: string;
    sezioniVisibili: string[];
}

/** Definizione ruoli e sezioni visibili per ciascuno */
export const ruoliSimulabili: RuoloSimulabile[] = [
    {
        codice: "admin",
        label: "Admin",
        colore: "#ef4444",
        sezioniVisibili: ["dashboard", "cantieri", "kanban", "clienti", "fornitori", "squadre", "organigramma", "calendario", "ai", "report", "admin"],
    },
    {
        codice: "titolare",
        label: "Titolare",
        colore: "#f59e0b",
        sezioniVisibili: ["dashboard", "cantieri", "kanban", "clienti", "fornitori", "squadre", "organigramma", "calendario", "ai", "report"],
    },
    {
        codice: "venditore",
        label: "Venditore",
        colore: "#3b82f6",
        sezioniVisibili: ["dashboard", "cantieri", "clienti", "calendario", "report"],
    },
    {
        codice: "centralino",
        label: "Centralino",
        colore: "#8b5cf6",
        sezioniVisibili: ["dashboard", "cantieri", "clienti", "calendario"],
    },
    {
        codice: "tecnico",
        label: "Tecnico",
        colore: "#06b6d4",
        sezioniVisibili: ["dashboard", "cantieri", "calendario"],
    },
    {
        codice: "logistica",
        label: "Logistica",
        colore: "#f97316",
        sezioniVisibili: ["dashboard", "cantieri", "fornitori", "calendario"],
    },
    {
        codice: "caposquadra",
        label: "Caposquadra",
        colore: "#1B8C3A",
        sezioniVisibili: ["dashboard", "cantieri", "calendario", "squadre"],
    },
    {
        codice: "installatore",
        label: "Installatore",
        colore: "#22c55e",
        sezioniVisibili: ["dashboard", "cantieri", "calendario"],
    },
    {
        codice: "magazziniere",
        label: "Magazziniere",
        colore: "#a78bfa",
        sezioniVisibili: ["dashboard", "cantieri", "fornitori", "calendario"],
    },
    {
        codice: "amministrazione",
        label: "Amministrazione",
        colore: "#ec4899",
        sezioniVisibili: ["dashboard", "cantieri", "clienti", "report", "calendario"],
    },
    {
        codice: "contabilita",
        label: "Contabilità",
        colore: "#14b8a6",
        sezioniVisibili: ["dashboard", "cantieri", "clienti", "report", "calendario"],
    },
];

/** Stato dello store simulazione */
interface StatoSimulazione {
    ruoloSimulato: string | null;
    setRuoloSimulato: (codice: string | null) => void;
    isSimulazione: boolean;
}

/** Store simulazione ruolo */
export const useStoreSimulazione = create<StatoSimulazione>((set) => ({
    ruoloSimulato: null,
    setRuoloSimulato: (codice) =>
        set({ ruoloSimulato: codice, isSimulazione: codice !== null }),
    isSimulazione: false,
}));
