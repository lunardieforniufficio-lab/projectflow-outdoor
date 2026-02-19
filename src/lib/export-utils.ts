// Utilità per esportazione dati in CSV, Excel e JSON
// Ogni componente lista DEVE avere l'ExportToolbar che usa queste funzioni

import { utils, writeFileXLSX } from "xlsx";

/** Definizione colonna per export */
export interface ColonnaExport {
    chiave: string;
    label: string;
}

/** Scarica un file nel browser */
function scaricaFile(contenuto: BlobPart, nomeFile: string, mimeType: string): void {
    const blob = new Blob([contenuto], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/** Formatta la data corrente per il nome file */
function dataPerNomeFile(): string {
    return new Date().toISOString().slice(0, 10);
}

/** Estrai valore da un oggetto dato il percorso chiave */
function estraiValore(oggetto: Record<string, unknown>, chiave: string): string {
    const valore = chiave.split(".").reduce<unknown>((acc, parte) => {
        if (acc && typeof acc === "object") {
            return (acc as Record<string, unknown>)[parte];
        }
        return undefined;
    }, oggetto);

    if (valore === null || valore === undefined) return "";
    if (typeof valore === "boolean") return valore ? "Sì" : "No";
    if (valore instanceof Date) return valore.toLocaleDateString("it-IT");
    return String(valore);
}

/**
 * Esporta dati in formato CSV
 * @param dati - Array di oggetti da esportare
 * @param colonne - Definizione colonne (chiave + label intestazione)
 * @param nomeFile - Nome base del file (senza estensione)
 */
export function esportaCSV(
    dati: Record<string, unknown>[],
    colonne: ColonnaExport[],
    nomeFile: string
): void {
    // Intestazione
    const intestazione = colonne.map((col) => `"${col.label}"`).join(";");

    // Righe
    const righe = dati.map((riga) =>
        colonne
            .map((col) => {
                const valore = estraiValore(riga, col.chiave);
                // Escape virgolette interne
                return `"${valore.replace(/"/g, '""')}"`;
            })
            .join(";")
    );

    const csv = [intestazione, ...righe].join("\n");

    // BOM per corretto encoding UTF-8 in Excel
    const bom = "\uFEFF";
    scaricaFile(bom + csv, `${nomeFile}_${dataPerNomeFile()}.csv`, "text/csv;charset=utf-8");
}

/**
 * Esporta dati in formato Excel (.xlsx)
 * @param dati - Array di oggetti da esportare
 * @param colonne - Definizione colonne
 * @param nomeFile - Nome base del file
 */
export function esportaExcel(
    dati: Record<string, unknown>[],
    colonne: ColonnaExport[],
    nomeFile: string
): void {
    // Prepara dati per xlsx
    const righeExcel = dati.map((riga) => {
        const rigaFormattata: Record<string, string> = {};
        colonne.forEach((col) => {
            rigaFormattata[col.label] = estraiValore(riga, col.chiave);
        });
        return rigaFormattata;
    });

    const foglio = utils.json_to_sheet(righeExcel);

    // Larghezza colonne auto
    foglio["!cols"] = colonne.map((col) => ({
        wch: Math.max(
            col.label.length,
            ...dati.map((riga) => estraiValore(riga, col.chiave).length)
        ) + 2,
    }));

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, foglio, "Dati");

    writeFileXLSX(workbook, `${nomeFile}_${dataPerNomeFile()}.xlsx`);
}

/**
 * Esporta dati in formato JSON
 * @param dati - Array di oggetti da esportare
 * @param nomeFile - Nome base del file
 */
export function esportaJSON(
    dati: Record<string, unknown>[],
    nomeFile: string
): void {
    const json = JSON.stringify(dati, null, 2);
    scaricaFile(json, `${nomeFile}_${dataPerNomeFile()}.json`, "application/json");
}

/** Tipo formato export */
export type FormatoExport = "csv" | "excel" | "json";

/** Esporta nel formato specificato */
export function esporta(
    formato: FormatoExport,
    dati: Record<string, unknown>[],
    colonne: ColonnaExport[],
    nomeFile: string
): void {
    switch (formato) {
        case "csv":
            esportaCSV(dati, colonne, nomeFile);
            break;
        case "excel":
            esportaExcel(dati, colonne, nomeFile);
            break;
        case "json":
            esportaJSON(dati, nomeFile);
            break;
    }
}
