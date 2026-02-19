// Pagina squadre — card grid con info squadra
"use client";

import { UserCog, Phone, User } from "lucide-react";
import { squadreDemo, utentiDemo } from "@/lib/dati-mock";

export default function PaginaSquadre() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl"
                    style={{ backgroundColor: "rgba(59, 130, 246, 0.12)" }}
                >
                    <UserCog size={20} style={{ color: "#3b82f6" }} />
                </div>
                <div>
                    <h1
                        className="text-xl font-bold"
                        style={{ color: "var(--pf-text-primary)" }}
                    >
                        Squadre
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        {squadreDemo.length} squadre attive
                    </p>
                </div>
            </div>

            {/* Grid squadre */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {squadreDemo.map((squadra) => {
                    // Trova responsabile
                    const responsabile = utentiDemo.find(
                        (u) => u.id === squadra.responsabileId
                    );
                    // Trova membri caposquadra/installatori assegnati (mock: filtro per area operativa)
                    const membri = utentiDemo.filter(
                        (u) =>
                            u.area?.codice === "operativa" &&
                            (u.ruolo.codice === "caposquadra" || u.ruolo.codice === "installatore")
                    );

                    return (
                        <div
                            key={squadra.id}
                            className="rounded-xl border p-5 transition-all duration-200 hover:border-[var(--pf-text-muted)] cursor-pointer"
                            style={{
                                backgroundColor: "var(--pf-bg-surface)",
                                borderColor: "var(--pf-border)",
                            }}
                        >
                            {/* Header card */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                    style={{ backgroundColor: squadra.colore ?? "#666" }}
                                >
                                    {squadra.nome.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3
                                        className="font-semibold"
                                        style={{ color: "var(--pf-text-primary)" }}
                                    >
                                        {squadra.nome}
                                    </h3>
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: squadra.attiva
                                                ? "rgba(27, 140, 58, 0.12)"
                                                : "rgba(239, 68, 68, 0.12)",
                                            color: squadra.attiva ? "#1B8C3A" : "#ef4444",
                                        }}
                                    >
                                        {squadra.attiva ? "Attiva" : "Inattiva"}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-2">
                                {responsabile && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <User
                                            size={14}
                                            style={{ color: "var(--pf-text-muted)" }}
                                        />
                                        <span style={{ color: "var(--pf-text-muted)" }}>
                                            Responsabile:
                                        </span>
                                        <span
                                            className="font-medium"
                                            style={{ color: "var(--pf-text-primary)" }}
                                        >
                                            {responsabile.nome} {responsabile.cognome}
                                        </span>
                                    </div>
                                )}
                                {squadra.telefono && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone
                                            size={14}
                                            style={{ color: "var(--pf-text-muted)" }}
                                        />
                                        <span
                                            className="font-mono text-xs"
                                            style={{ color: "var(--pf-text-secondary)" }}
                                        >
                                            {squadra.telefono}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer: membri preview */}
                            <div
                                className="mt-4 pt-3 border-t flex items-center gap-2"
                                style={{ borderColor: "var(--pf-border)" }}
                            >
                                <div className="flex -space-x-2">
                                    {membri.slice(0, 4).map((membro) => (
                                        <div
                                            key={membro.id}
                                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                                            style={{
                                                backgroundColor: membro.ruolo.colore ?? "#666",
                                                borderColor: "var(--pf-bg-surface)",
                                                color: "white",
                                            }}
                                            title={`${membro.nome} ${membro.cognome}`}
                                        >
                                            {membro.nome[0]}{membro.cognome[0]}
                                        </div>
                                    ))}
                                </div>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--pf-text-muted)" }}
                                >
                                    {membri.length} operativi
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
