// DataTable generico con TanStack Table v8
// Sorting, filtri multi-colonna, paginazione, responsive, azioni riga
"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
    type ColumnFiltersState,
    type VisibilityState,
    type Row,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
    Columns3,
    MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// === INTERFACCE ===

interface DataTableProps<TData> {
    /** Definizione colonne TanStack Table */
    colonne: ColumnDef<TData, unknown>[];
    /** Dati da mostrare */
    dati: TData[];
    /** Placeholder ricerca globale */
    placeholderRicerca?: string;
    /** Callback click su riga */
    onClickRiga?: (riga: TData) => void;
    /** Azioni extra nell'header (es. bottone "Nuovo") */
    azioniHeader?: ReactNode;
    /** Toolbar export */
    toolbarExport?: ReactNode;
    /** Mostra ricerca globale */
    mostraRicerca?: boolean;
    /** Mostra toggle colonne */
    mostraToggleColonne?: boolean;
    /** Pagina size default */
    paginaSize?: number;
    /** Colonne nascoste di default su mobile (id colonna) */
    colonneNascosteMobile?: string[];
    /** ID entità per chiave univoca */
    getRowId?: (riga: TData) => string;
    /** Stato vuoto personalizzato */
    emptyState?: ReactNode;
    /** Riga espandibile per mobile */
    rigaEspandibile?: (riga: TData) => ReactNode;
}

// === COMPONENTE ===

export function DataTable<TData>({
    colonne,
    dati,
    placeholderRicerca = "Cerca...",
    onClickRiga,
    azioniHeader,
    toolbarExport,
    mostraRicerca = true,
    mostraToggleColonne = false,
    paginaSize = 25,
    colonneNascosteMobile = [],
    getRowId,
    emptyState,
    rigaEspandibile,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [mostraColonne, setMostraColonne] = useState(false);
    const [righeEspanse, setRigheEspanse] = useState<Set<string>>(new Set());

    // Nascondi colonne su mobile via CSS (gestito con classi responsive nelle colonne)
    const tabella = useReactTable({
        data: dati,
        columns: colonne,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getRowId: getRowId ? (row) => getRowId(row) : undefined,
        initialState: {
            pagination: { pageSize: paginaSize },
        },
    });

    const toggleRigaEspansa = (id: string) => {
        setRigheEspanse((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-4">
            {/* === TOOLBAR === */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Ricerca globale */}
                {mostraRicerca && (
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: "var(--pf-text-muted)" }}
                        />
                        <input
                            type="text"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder={placeholderRicerca}
                            className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm border outline-none transition-colors focus:border-[var(--pf-accent-primary)]"
                            style={{
                                backgroundColor: "var(--pf-bg-surface)",
                                borderColor: "var(--pf-border)",
                                color: "var(--pf-text-primary)",
                            }}
                        />
                        {globalFilter && (
                            <button
                                onClick={() => setGlobalFilter("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[var(--pf-bg-hover)]"
                            >
                                <X size={14} style={{ color: "var(--pf-text-muted)" }} />
                            </button>
                        )}
                    </div>
                )}

                {/* Azioni destra */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle colonne */}
                    {mostraToggleColonne && (
                        <div className="relative">
                            <button
                                onClick={() => setMostraColonne(!mostraColonne)}
                                className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors hover:bg-[var(--pf-bg-hover)]"
                                style={{
                                    borderColor: "var(--pf-border)",
                                    color: "var(--pf-text-secondary)",
                                }}
                            >
                                <Columns3 size={14} />
                                Colonne
                            </button>
                            {mostraColonne && (
                                <DropdownColonne
                                    tabella={tabella}
                                    onChiudi={() => setMostraColonne(false)}
                                />
                            )}
                        </div>
                    )}

                    {toolbarExport}
                    {azioniHeader}
                </div>
            </div>

            {/* === FILTRI ATTIVI === */}
            {columnFilters.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: "var(--pf-text-muted)" }}>
                        Filtri:
                    </span>
                    {columnFilters.map((filtro) => (
                        <span
                            key={filtro.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                            style={{
                                backgroundColor: "var(--pf-accent-primary-subtle)",
                                color: "var(--pf-accent-primary)",
                            }}
                        >
                            {filtro.id}: {String(filtro.value)}
                            <button
                                onClick={() =>
                                    setColumnFilters((prev) =>
                                        prev.filter((f) => f.id !== filtro.id)
                                    )
                                }
                                className="ml-0.5 hover:opacity-70"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={() => setColumnFilters([])}
                        className="text-xs hover:underline"
                        style={{ color: "var(--pf-text-muted)" }}
                    >
                        Rimuovi tutti
                    </button>
                </div>
            )}

            {/* === TABELLA === */}
            <div
                className="rounded-xl border overflow-hidden"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10" style={{ backgroundColor: "var(--pf-bg-surface)" }}>
                            {tabella.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    key={headerGroup.id}
                                    className="border-b"
                                    style={{ borderColor: "var(--pf-border)" }}
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={cn(
                                                "text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider select-none",
                                                header.column.getCanSort() && "cursor-pointer hover:bg-[var(--pf-bg-hover)]"
                                            )}
                                            style={{ color: "var(--pf-text-muted)" }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column.columnDef.header,
                                                          header.getContext()
                                                      )}
                                                {header.column.getCanSort() && (
                                                    <SortIcon direzione={header.column.getIsSorted()} />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {tabella.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={colonne.length}
                                        className="text-center py-12"
                                    >
                                        {emptyState ?? (
                                            <div>
                                                <p className="text-sm" style={{ color: "var(--pf-text-secondary)" }}>
                                                    Nessun risultato
                                                </p>
                                                <p className="text-xs mt-1" style={{ color: "var(--pf-text-muted)" }}>
                                                    Prova a modificare i filtri
                                                </p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                tabella.getRowModel().rows.map((row) => (
                                    <RigaTabella
                                        key={row.id}
                                        row={row}
                                        onClick={onClickRiga}
                                        isEspansa={righeEspanse.has(row.id)}
                                        onToggleEspandi={rigaEspandibile ? () => toggleRigaEspansa(row.id) : undefined}
                                        contenutoEspanso={rigaEspandibile ? rigaEspandibile(row.original) : undefined}
                                        colonneCount={colonne.length}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* === PAGINAZIONE === */}
            <Paginazione tabella={tabella} />
        </div>
    );
}

// === SUB-COMPONENTI ===

/** Icona sorting nella header */
function SortIcon({ direzione }: { direzione: false | "asc" | "desc" }) {
    if (!direzione) return <ArrowUpDown size={12} className="opacity-30" />;
    if (direzione === "asc") return <ArrowUp size={12} style={{ color: "var(--pf-accent-primary)" }} />;
    return <ArrowDown size={12} style={{ color: "var(--pf-accent-primary)" }} />;
}

/** Riga singola della tabella */
function RigaTabella<TData>({
    row,
    onClick,
    isEspansa,
    onToggleEspandi,
    contenutoEspanso,
    colonneCount,
}: {
    row: Row<TData>;
    onClick?: (riga: TData) => void;
    isEspansa: boolean;
    onToggleEspandi?: () => void;
    contenutoEspanso?: ReactNode;
    colonneCount: number;
}) {
    return (
        <>
            <tr
                className={cn(
                    "border-b last:border-b-0 transition-colors",
                    (onClick || onToggleEspandi) && "cursor-pointer hover:bg-[var(--pf-bg-hover)]"
                )}
                style={{ borderColor: "var(--pf-border)" }}
                onClick={() => {
                    if (onClick) onClick(row.original);
                    else if (onToggleEspandi) onToggleEspandi();
                }}
            >
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
            </tr>
            {/* Riga espansa (mobile detail) */}
            {isEspansa && contenutoEspanso && (
                <tr
                    className="border-b"
                    style={{
                        borderColor: "var(--pf-border)",
                        backgroundColor: "var(--pf-bg-hover)",
                    }}
                >
                    <td colSpan={colonneCount} className="px-4 py-3">
                        {contenutoEspanso}
                    </td>
                </tr>
            )}
        </>
    );
}

/** Paginazione */
function Paginazione<TData>({ tabella }: { tabella: ReturnType<typeof useReactTable<TData>> }) {
    const paginaCorrente = tabella.getState().pagination.pageIndex;
    const pagineTotali = tabella.getPageCount();
    const righeTotali = tabella.getFilteredRowModel().rows.length;

    if (righeTotali <= tabella.getState().pagination.pageSize) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Info righe */}
            <p className="text-xs" style={{ color: "var(--pf-text-muted)" }}>
                {righeTotali} risultati — pagina {paginaCorrente + 1} di {pagineTotali}
            </p>

            <div className="flex items-center gap-2">
                {/* Page size */}
                <select
                    value={tabella.getState().pagination.pageSize}
                    onChange={(e) => tabella.setPageSize(Number(e.target.value))}
                    className="px-2 py-1.5 rounded-lg border text-xs outline-none"
                    style={{
                        backgroundColor: "var(--pf-bg-surface)",
                        borderColor: "var(--pf-border)",
                        color: "var(--pf-text-secondary)",
                    }}
                >
                    {[10, 25, 50, 100].map((size) => (
                        <option key={size} value={size}>
                            {size} righe
                        </option>
                    ))}
                </select>

                {/* Navigazione pagine */}
                <div className="flex items-center gap-1">
                    <PagBtn
                        onClick={() => tabella.setPageIndex(0)}
                        disabled={!tabella.getCanPreviousPage()}
                    >
                        <ChevronsLeft size={14} />
                    </PagBtn>
                    <PagBtn
                        onClick={() => tabella.previousPage()}
                        disabled={!tabella.getCanPreviousPage()}
                    >
                        <ChevronLeft size={14} />
                    </PagBtn>
                    <PagBtn
                        onClick={() => tabella.nextPage()}
                        disabled={!tabella.getCanNextPage()}
                    >
                        <ChevronRight size={14} />
                    </PagBtn>
                    <PagBtn
                        onClick={() => tabella.setPageIndex(pagineTotali - 1)}
                        disabled={!tabella.getCanNextPage()}
                    >
                        <ChevronsRight size={14} />
                    </PagBtn>
                </div>
            </div>
        </div>
    );
}

/** Bottone paginazione */
function PagBtn({
    children,
    onClick,
    disabled,
}: {
    children: ReactNode;
    onClick: () => void;
    disabled: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-1.5 rounded-lg border transition-colors",
                disabled
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-[var(--pf-bg-hover)] cursor-pointer"
            )}
            style={{
                borderColor: "var(--pf-border)",
                color: "var(--pf-text-secondary)",
            }}
        >
            {children}
        </button>
    );
}

/** Dropdown toggle colonne */
function DropdownColonne<TData>({
    tabella,
    onChiudi,
}: {
    tabella: ReturnType<typeof useReactTable<TData>>;
    onChiudi: () => void;
}) {
    return (
        <>
            {/* Overlay per chiudere */}
            <div className="fixed inset-0 z-40" onClick={onChiudi} />
            <div
                className="absolute right-0 top-full mt-1 z-50 w-48 rounded-lg border shadow-lg p-2"
                style={{
                    backgroundColor: "var(--pf-bg-surface)",
                    borderColor: "var(--pf-border)",
                }}
            >
                <p
                    className="text-xs font-semibold uppercase tracking-wider mb-2 px-2"
                    style={{ color: "var(--pf-text-muted)" }}
                >
                    Colonne visibili
                </p>
                {tabella.getAllLeafColumns().map((colonna) => {
                    if (colonna.id === "azioni") return null;
                    return (
                        <label
                            key={colonna.id}
                            className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--pf-bg-hover)] cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={colonna.getIsVisible()}
                                onChange={colonna.getToggleVisibilityHandler()}
                                className="rounded"
                            />
                            <span
                                className="text-xs"
                                style={{ color: "var(--pf-text-secondary)" }}
                            >
                                {typeof colonna.columnDef.header === "string"
                                    ? colonna.columnDef.header
                                    : colonna.id}
                            </span>
                        </label>
                    );
                })}
            </div>
        </>
    );
}

// === HELPER per colonne azioni ===

export { type ColumnDef };
