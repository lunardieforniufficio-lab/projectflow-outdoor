// Store Zustand per cache locale configurazioni
// Complementare a TanStack Query — per accesso sincrono in contesti non-React
"use client";

import { create } from "zustand";
import type { StatoCantiere, Ruolo, TipoProdotto, AreaAziendale, Configurazione } from "@/types";

/** Cache locale delle configurazioni caricate dal DB */
interface StatoConfig {
    // Dati cached
    statiCantiere: StatoCantiere[];
    ruoli: Ruolo[];
    tipiProdotto: TipoProdotto[];
    areeAziendali: AreaAziendale[];
    configurazioni: Configurazione[];

    // Setters (chiamati dopo fetch da TanStack Query)
    setStatiCantiere: (stati: StatoCantiere[]) => void;
    setRuoli: (ruoli: Ruolo[]) => void;
    setTipiProdotto: (tipi: TipoProdotto[]) => void;
    setAreeAziendali: (aree: AreaAziendale[]) => void;
    setConfigurazioni: (config: Configurazione[]) => void;

    // Helpers per accesso rapido
    getStatoPerCodice: (codice: string) => StatoCantiere | undefined;
    getRuoloPerCodice: (codice: string) => Ruolo | undefined;
    getConfigurazione: (chiave: string) => string | undefined;
}

/** Store configurazioni con Zustand */
export const useStoreConfig = create<StatoConfig>((set, get) => ({
    // Dati iniziali vuoti
    statiCantiere: [],
    ruoli: [],
    tipiProdotto: [],
    areeAziendali: [],
    configurazioni: [],

    // Setters
    setStatiCantiere: (stati) => set({ statiCantiere: stati }),
    setRuoli: (ruoli) => set({ ruoli }),
    setTipiProdotto: (tipi) => set({ tipiProdotto: tipi }),
    setAreeAziendali: (aree) => set({ areeAziendali: aree }),
    setConfigurazioni: (config) => set({ configurazioni: config }),

    // Helpers
    getStatoPerCodice: (codice) =>
        get().statiCantiere.find((stato) => stato.codice === codice),

    getRuoloPerCodice: (codice) =>
        get().ruoli.find((ruolo) => ruolo.codice === codice),

    getConfigurazione: (chiave) =>
        get().configurazioni.find((c) => c.chiave === chiave)?.valore,
}));
