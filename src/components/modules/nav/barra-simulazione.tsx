// Barra simulazione ruolo — visibile solo per super admin in sviluppo
"use client";

import { Eye, X } from "lucide-react";
import {
    useStoreSimulazione,
    ruoliSimulabili,
} from "@/stores/simulazione-store";

/**
 * Barra fissa in alto per simulare diversi ruoli utente.
 * Disponibile solo per il super admin (Marco Vitaletti).
 * Mostra una select con tutti i ruoli e filtra sidebar/contenuti di conseguenza.
 */
export function BarraSimulazione() {
    const { ruoloSimulato, setRuoloSimulato, isSimulazione } =
        useStoreSimulazione();

    const ruoloAttivo = ruoliSimulabili.find(
        (r) => r.codice === ruoloSimulato
    );

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 h-9"
            style={{
                backgroundColor: isSimulazione
                    ? ruoloAttivo?.colore ?? "#ef4444"
                    : "#1a1a1a",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            {/* Lato sinistro: icona + label */}
            <div className="flex items-center gap-2">
                <Eye size={14} className="text-white/80" />
                <span className="text-xs font-medium text-white/80">
                    Simula ruolo
                </span>
            </div>

            {/* Select ruolo */}
            <div className="flex items-center gap-2">
                <select
                    value={ruoloSimulato ?? ""}
                    onChange={(e) =>
                        setRuoloSimulato(e.target.value || null)
                    }
                    className="text-xs font-medium px-2 py-1 rounded-md border-none outline-none cursor-pointer"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        color: "#fff",
                    }}
                >
                    <option value="" style={{ backgroundColor: "#1a1a1a" }}>
                        Admin (default)
                    </option>
                    {ruoliSimulabili.map((ruolo) => (
                        <option
                            key={ruolo.codice}
                            value={ruolo.codice}
                            style={{ backgroundColor: "#1a1a1a" }}
                        >
                            {ruolo.label}
                        </option>
                    ))}
                </select>

                {/* Reset button */}
                {isSimulazione && (
                    <button
                        onClick={() => setRuoloSimulato(null)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Torna ad Admin"
                    >
                        <X size={12} className="text-white" />
                    </button>
                )}
            </div>
        </div>
    );
}
