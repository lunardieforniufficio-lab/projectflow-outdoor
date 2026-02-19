// Store Zustand per stato UI globale
"use client";

import { create } from "zustand";

/** Stato della UI globale */
interface StatoUi {
    // Sidebar
    isSidebarAperta: boolean;
    toggleSidebar: () => void;
    setSidebarAperta: (aperta: boolean) => void;

    // Modale generico
    modaleAttivo: string | null;
    datiModale: Record<string, unknown> | null;
    apriModale: (id: string, dati?: Record<string, unknown>) => void;
    chiudiModale: () => void;

    // Sheet (pannello laterale)
    isSheetAperto: boolean;
    contenutoSheet: string | null;
    datiSheet: Record<string, unknown> | null;
    apriSheet: (contenuto: string, dati?: Record<string, unknown>) => void;
    chiudiSheet: () => void;

    // Vista corrente (kanban, lista, griglia)
    vistaCorrente: "kanban" | "lista" | "griglia";
    setVistaCorrente: (vista: "kanban" | "lista" | "griglia") => void;

    // Ricerca globale
    termineRicerca: string;
    setTermineRicerca: (termine: string) => void;
}

/** Store UI globale con Zustand */
export const useStoreUi = create<StatoUi>((set) => ({
    // Sidebar
    isSidebarAperta: true,
    toggleSidebar: () => set((stato) => ({ isSidebarAperta: !stato.isSidebarAperta })),
    setSidebarAperta: (aperta) => set({ isSidebarAperta: aperta }),

    // Modale
    modaleAttivo: null,
    datiModale: null,
    apriModale: (id, dati) => set({ modaleAttivo: id, datiModale: dati ?? null }),
    chiudiModale: () => set({ modaleAttivo: null, datiModale: null }),

    // Sheet
    isSheetAperto: false,
    contenutoSheet: null,
    datiSheet: null,
    apriSheet: (contenuto, dati) =>
        set({ isSheetAperto: true, contenutoSheet: contenuto, datiSheet: dati ?? null }),
    chiudiSheet: () =>
        set({ isSheetAperto: false, contenutoSheet: null, datiSheet: null }),

    // Vista
    vistaCorrente: "kanban",
    setVistaCorrente: (vista) => set({ vistaCorrente: vista }),

    // Ricerca
    termineRicerca: "",
    setTermineRicerca: (termine) => set({ termineRicerca: termine }),
}));
