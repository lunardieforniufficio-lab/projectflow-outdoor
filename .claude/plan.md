# Piano: Maschere CRUD + Tabelle avanzate

## Approccio UX

### 1. FORM CRUD — Pannello laterale (Sheet) al posto di modali centrate
- **PannelloCrud**: Sheet che scorre da destra, 60% larghezza desktop / full-width mobile
- Header sticky con titolo + pulsanti Salva/Annulla
- Form organizzato in sezioni con accordion/divider per entità complesse (cantiere)
- Al salvataggio: toast feedback + chiusura automatica
- Animazione slide-in fluida

### 2. TABELLE — DataTable con TanStack Table v8
- **DataTable** componente riutilizzabile basato su @tanstack/react-table
- Sorting multi-colonna (click header → asc/desc/none)
- Filtri multipli per colonna (dropdown sotto header o barra filtri)
- Paginazione con page size selector
- Responsive: colonne nascoste su mobile con row-expand per dettagli
- Azioni riga: edit (apre Sheet), delete (conferma dialog)
- Checkbox selezione per azioni bulk
- Colonne riordinabili e visibilità toggle

### 3. AI SMART FILTER (v2 — per dopo)
- Input testuale "Cerca con AI" dove l'utente scrive in linguaggio naturale
- Parsifica in filtri strutturati
- Filtri salvabili come preset (pill chips sopra tabella)

## File da creare

### Componenti shared
1. `src/components/ui/data-table.tsx` — DataTable generico TanStack Table
2. `src/components/ui/data-table-header.tsx` — Header colonna sortable
3. `src/components/ui/data-table-pagination.tsx` — Paginazione
4. `src/components/ui/data-table-filtri.tsx` — Barra filtri multi-colonna
5. `src/components/ui/pannello-crud.tsx` — Sheet wrapper per form CRUD

### Form entità
6. `src/components/forms/form-cliente.tsx` — Form cliente (crea/modifica)
7. `src/components/forms/form-cantiere.tsx` — Form cantiere (crea/modifica)
8. `src/components/forms/form-fornitore.tsx` — Form fornitore (crea/modifica)
9. `src/components/forms/form-squadra.tsx` — Form squadra (crea/modifica)

### Pagine da riscrivere
10. `src/app/(dashboard)/clienti/page.tsx` — Con DataTable + PannelloCrud
11. `src/app/(dashboard)/cantieri/page.tsx` — Con DataTable + PannelloCrud
12. `src/app/(dashboard)/fornitori/page.tsx` — Con DataTable + PannelloCrud
13. `src/app/(dashboard)/squadre/page.tsx` — Con DataTable + PannelloCrud

## Ordine implementazione
1. DataTable + PannelloCrud (componenti base)
2. Form Cliente + Pagina Clienti (più semplice, 5-6 campi)
3. Form Fornitore + Pagina Fornitori
4. Form Cantiere + Pagina Cantieri (più complesso, con select relazioni)
5. Form Squadra + Pagina Squadre
