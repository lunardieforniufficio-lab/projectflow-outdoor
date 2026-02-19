// Schemi di validazione Zod per tutti i form del gestionale

import { z } from "zod";
import { isValidIBAN } from "ibantools";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// === Validatori custom ===

/** Validazione codice fiscale italiano (16 caratteri alfanumerici) */
export const schemaCF = z
    .string()
    .length(16, "Il codice fiscale deve avere 16 caratteri")
    .regex(/^[A-Z0-9]+$/i, "Il codice fiscale contiene caratteri non validi")
    .transform((valore) => valore.toUpperCase());

/** Validazione numero di telefono (formato italiano) */
export const schemaTelefono = z
    .string()
    .min(8, "Numero di telefono troppo corto")
    .refine((valore) => {
        const numero = parsePhoneNumberFromString(valore, "IT");
        return numero?.isValid() ?? false;
    }, "Numero di telefono non valido");

/** Validazione IBAN */
export const schemaIBAN = z
    .string()
    .refine((valore) => {
        if (!valore || valore.trim() === "") return true; // Opzionale
        return isValidIBAN(valore.replace(/\s/g, "").toUpperCase());
    }, "IBAN non valido")
    .transform((valore) => valore.replace(/\s/g, "").toUpperCase());

/** Validazione email */
export const schemaEmail = z
    .string()
    .email("Indirizzo email non valido");

/** Validazione importo valuta (decimale positivo) */
export const schemaValuta = z
    .number()
    .min(0, "L'importo non può essere negativo");

/** Validazione CAP italiano */
export const schemaCAP = z
    .string()
    .regex(/^\d{5}$/, "CAP non valido (5 cifre)");

/** Validazione provincia italiana */
export const schemaProvincia = z
    .string()
    .length(2, "Provincia deve essere di 2 lettere")
    .regex(/^[A-Z]+$/i, "Provincia non valida")
    .transform((valore) => valore.toUpperCase());

// === Schemi form completi ===

/** Schema creazione/modifica cliente */
export const schemaCliente = z.object({
    nome: z.string().min(2, "Nome troppo corto").max(100),
    cognome: z.string().min(2, "Cognome troppo corto").max(100),
    codiceFiscale: schemaCF,
    email: schemaEmail.optional().or(z.literal("")),
    telefono: schemaTelefono,
    indirizzo: z.string().max(500).optional(),
    citta: z.string().max(100).optional(),
    cap: schemaCAP.optional().or(z.literal("")),
    provincia: schemaProvincia.optional().or(z.literal("")),
    iban: schemaIBAN.optional().or(z.literal("")),
    note: z.string().max(2000).optional(),
});
export type DatiCliente = z.infer<typeof schemaCliente>;

/** Schema creazione cantiere */
export const schemaCantiere = z.object({
    clienteId: z.string().uuid("Seleziona un cliente"),
    tipoProdottoId: z.string().uuid("Seleziona un tipo prodotto"),
    indirizzoCantiere: z.string().min(5, "Indirizzo troppo corto").max(500),
    cittaCantiere: z.string().max(100).optional(),
    importoTotale: schemaValuta.optional(),
    note: z.string().max(5000).optional(),
});
export type DatiCantiere = z.infer<typeof schemaCantiere>;

/** Schema creazione fornitore */
export const schemaFornitore = z.object({
    nome: z.string().min(2, "Nome troppo corto").max(200),
    partitaIva: z
        .string()
        .regex(/^\d{11}$/, "Partita IVA deve avere 11 cifre")
        .optional()
        .or(z.literal("")),
    email: schemaEmail.optional().or(z.literal("")),
    telefono: schemaTelefono.optional().or(z.literal("")),
    indirizzo: z.string().max(500).optional(),
    referente: z.string().max(100).optional(),
    note: z.string().max(2000).optional(),
});
export type DatiFornitore = z.infer<typeof schemaFornitore>;

/** Schema nota timeline */
export const schemaNotaTimeline = z.object({
    tipo: z.string().min(1),
    contenuto: z.string().min(1, "Scrivi qualcosa").max(5000),
    mediaIds: z.array(z.string().uuid()).optional(),
});
export type DatiNotaTimeline = z.infer<typeof schemaNotaTimeline>;

/** Schema rilievo tecnico */
export const schemaRilievo = z.object({
    larghezzaCm: z.number().positive("Larghezza deve essere positiva").optional(),
    profonditaCm: z.number().positive("Profondità deve essere positiva").optional(),
    altezzaMaxCm: z.number().positive("Altezza deve essere positiva").optional(),
    noteTecniche: z.string().max(5000).optional(),
    ostacoli: z.record(z.string(), z.unknown()).optional(),
});
export type DatiRilievo = z.infer<typeof schemaRilievo>;
