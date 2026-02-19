---
trigger: always_on
description: Regole di codice obbligatorie per ogni task del progetto ProjectFlow
---

# Regole Codice ProjectFlow

## Lingua
- Scrivi TUTTO in italiano: variabili, commenti, messaggi UI, nomi funzioni
- Eccezione: keyword TypeScript/JS e nomi librerie npm

## Zero Hardcoding
- OGNI lista, enum, ruolo, stato, tipo viene da database via API
- Usa `useConfigurazione(tipo)` per caricare opzioni
- Se il dato non è ancora disponibile: mostra `<SkeletonLoader />`, NON un fallback hardcoded

## Qualità Codice
- TypeScript strict: niente `any`, `as any`, `@ts-ignore`
- Solo componenti functional (mai class)
- Props tipizzate con interfaccia `NomeComponenteProps`
- TanStack Query per OGNI fetch (mai `useEffect` + `fetch`)
- File max 150 righe — se superi, spezza
- Funzione max 30 righe — se superi, spezza

## Naming
- File componenti: `kebab-case.tsx`
- Componenti React: `PascalCase`
- Hook: `camelCase` con prefisso `use`
- Variabili CSS: `--pf-*`
- Callback props: prefisso `on`
- Flag booleani: prefisso `is/has/can`

## Export Dati
- OGNI componente che mostra una lista/tabella DEVE avere `<ExportToolbar />`
- Formati: CSV, Excel (.xlsx), JSON

## Git
- Commit dopo ogni task completato
- Formato: `tipo(scope): descrizione in italiano`
- Aggiorna ROADMAP.md dopo ogni commit
