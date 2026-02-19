// Campo Upload File — drag & drop con react-dropzone
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { CampoFormWrapper } from "./campo-form-wrapper";
import { Button } from "@/components/ui/button";

export interface FileCaricato {
    file: File;
    anteprima: string | null;
}

interface CampoUploadFileProps {
    /** File caricati */
    files: FileCaricato[];
    /** Callback al cambio */
    onFilesChange: (files: FileCaricato[]) => void;
    /** Tipi MIME accettati */
    accetta?: Record<string, string[]>;
    /** Max file contemporanei */
    maxFiles?: number;
    /** Max dimensione file in bytes */
    maxDimensione?: number;
    /** Messaggio di errore esterno */
    errore?: string;
    /** Se il campo è obbligatorio */
    obbligatorio?: boolean;
    /** Se il campo è disabilitato */
    disabilitato?: boolean;
    /** Label personalizzata */
    label?: string;
    /** Classe CSS aggiuntiva */
    className?: string;
}

/** Campo upload con drag & drop */
export function CampoUploadFile({
    files,
    onFilesChange,
    accetta = {
        "image/*": [".jpg", ".jpeg", ".png", ".webp"],
        "application/pdf": [".pdf"],
    },
    maxFiles = 10,
    maxDimensione = 10 * 1024 * 1024, // 10MB
    errore,
    obbligatorio = false,
    disabilitato = false,
    label = "File",
    className,
}: CampoUploadFileProps) {
    const [erroreLocale, setErroreLocale] = useState<string | null>(null);

    const onDrop = useCallback(
        (fileAccettati: File[]) => {
            setErroreLocale(null);
            const nuoviFiles: FileCaricato[] = fileAccettati.map((file) => ({
                file,
                anteprima: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null,
            }));
            onFilesChange([...files, ...nuoviFiles].slice(0, maxFiles));
        },
        [files, onFilesChange, maxFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: accetta,
        maxFiles: maxFiles - files.length,
        maxSize: maxDimensione,
        disabled: disabilitato,
        onDropRejected: (rifiutati) => {
            const primo = rifiutati[0]?.errors[0];
            if (primo?.code === "file-too-large") {
                setErroreLocale(`File troppo grande (max ${Math.round(maxDimensione / 1024 / 1024)}MB)`);
            } else if (primo?.code === "file-invalid-type") {
                setErroreLocale("Tipo file non supportato");
            } else {
                setErroreLocale(primo?.message ?? "Errore upload");
            }
        },
    });

    function rimuoviFile(indice: number) {
        const fileRimosso = files[indice];
        if (fileRimosso?.anteprima) {
            URL.revokeObjectURL(fileRimosso.anteprima);
        }
        onFilesChange(files.filter((_, i) => i !== indice));
    }

    function formattaDimensione(bytes: number): string {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return (
        <CampoFormWrapper
            label={label}
            errore={errore ?? erroreLocale ?? undefined}
            obbligatorio={obbligatorio}
            className={className}
        >
            {/* Drop zone */}
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200",
                    isDragActive
                        ? "border-[var(--pf-accent-primary)] bg-[var(--pf-accent-primary)]/5"
                        : "border-[var(--pf-border)] hover:border-[var(--pf-text-muted)]",
                    disabilitato && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                <div className="text-3xl mb-2">📁</div>
                {isDragActive ? (
                    <p className="text-sm text-[var(--pf-accent-primary)]">Rilascia i file qui...</p>
                ) : (
                    <>
                        <p className="text-sm text-[var(--pf-text-secondary)]">
                            Trascina i file qui o <span className="text-[var(--pf-accent-primary)] underline">clicca per selezionare</span>
                        </p>
                        <p className="text-xs text-[var(--pf-text-muted)] mt-1">
                            Max {maxFiles} file · Max {Math.round(maxDimensione / 1024 / 1024)}MB ciascuno
                        </p>
                    </>
                )}
            </div>

            {/* Preview file caricati */}
            {files.length > 0 && (
                <div className="mt-3 space-y-2">
                    {files.map((fileCaricato, indice) => (
                        <div
                            key={indice}
                            className="flex items-center gap-3 rounded-md border border-[var(--pf-border)] bg-[var(--pf-surface-secondary)] px-3 py-2"
                        >
                            {fileCaricato.anteprima ? (
                                <img
                                    src={fileCaricato.anteprima}
                                    alt={fileCaricato.file.name}
                                    className="h-10 w-10 rounded object-cover"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded bg-[var(--pf-surface-tertiary)] flex items-center justify-center text-lg">
                                    📄
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm truncate text-[var(--pf-text-primary)]">
                                    {fileCaricato.file.name}
                                </p>
                                <p className="text-xs text-[var(--pf-text-muted)]">
                                    {formattaDimensione(fileCaricato.file.size)}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => rimuoviFile(indice)}
                                className="text-[var(--pf-text-muted)] hover:text-red-400"
                            >
                                ✕
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </CampoFormWrapper>
    );
}
