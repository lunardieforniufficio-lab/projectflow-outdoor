---
trigger: creating or modifying files in components/
description: Regole per creazione componenti UI, form, moduli ProjectFlow
---

# Regole Componenti

## Prima di Creare
1. Verifica se shadcn/ui ha già il componente (`npx shadcn@latest add ...`)
2. Cerca su npm un pacchetto che fa quel lavoro
3. Proponi la libreria trovata prima di scrivere codice custom

## Gerarchia (dipendenze solo verso il basso)
- `ui/` — atomici, non importano da `modules/` o `layouts/`
- `forms/` — campi form, usano `ui/` + React Hook Form + Zod
- `modules/` — blocchi funzionali, usano `ui/` + `forms/` + hook
- `layouts/` — composizioni per ruolo, usano `modules/`

## Campi Form
- SEMPRE integrati con `useFormContext()` di React Hook Form
- SEMPRE validazione Zod (schema in `lib/validations.ts`)
- SEMPRE: error inline, supporto `required`, `disabled`, `label` custom

## Tema
- Dark theme unico, variabili `--pf-*`
- Verde brand: `#1B8C3A` (accento primario)
- Border radius: 8px (elementi), 14-16px (card), 20-50px (pill)
- Font: Outfit (body), monospace (codici, importi)

## Leggere prima di lavorare
- `docs/COMPONENT_CATALOG.md` per interfacce Props e dipendenze
- `docs/PROJECT_RULES.md` per palette e convenzioni
