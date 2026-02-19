// Pagina demo di tutti i componenti atomici — Task 2.15
// Accessibile su /demo per visualizzare tutti i componenti
"use client";

import { useState } from "react";
import { BadgeStato } from "@/components/ui/badge-stato";
import { ProgressArc } from "@/components/ui/progress-arc";
import { PillTabs } from "@/components/ui/pill-tabs";
import { CampoRicerca } from "@/components/ui/campo-ricerca";
import { ExportToolbar } from "@/components/ui/export-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { ConfermaDialog } from "@/components/ui/conferma-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CampoCodiceFiscale } from "@/components/forms/campo-codice-fiscale";
import { CampoTelefono } from "@/components/forms/campo-telefono";
import { CampoIban } from "@/components/forms/campo-iban";
import { CampoEmail } from "@/components/forms/campo-email";
import { CampoValuta } from "@/components/forms/campo-valuta";
import { CampoData } from "@/components/forms/campo-data";
import { CampoSelectConfig } from "@/components/forms/campo-select-config";
import { CampoUploadFile, type FileCaricato } from "@/components/forms/campo-upload-file";

// Dati mock per la demo (in produzione verranno da DB)
const STATI_DEMO = [
    { codice: "LEAD", label: "Lead", colore: "#3b82f6" },
    { codice: "VENDITA", label: "Vendita", colore: "#f59e0b" },
    { codice: "ACCONTO", label: "Acconto", colore: "#8b5cf6" },
    { codice: "RILIEVO", label: "Rilievo", colore: "#06b6d4" },
    { codice: "PROGETTAZIONE", label: "Progettazione", colore: "#ec4899" },
    { codice: "ORDINE", label: "Ordine", colore: "#f97316" },
    { codice: "MAGAZZINO", label: "Magazzino", colore: "#14b8a6" },
    { codice: "POSA", label: "Posa", colore: "#1B8C3A" },
    { codice: "COMPLETATO", label: "Completato", colore: "#22c55e" },
    { codice: "ANNULLATO", label: "Annullato", colore: "#ef4444" },
];

const TABS_DEMO = [
    { id: "tutti", label: "Tutti", conteggio: 42 },
    { id: "attivi", label: "Attivi", conteggio: 28 },
    { id: "in_ritardo", label: "In ritardo", conteggio: 3 },
    { id: "completati", label: "Completati", conteggio: 11 },
];

const DATI_EXPORT_DEMO = [
    { nome: "Cantiere Rossi", stato: "Posa", importo: 18500, citta: "Bologna" },
    { nome: "Cantiere Bianchi", stato: "Rilievo", importo: 24000, citta: "Firenze" },
    { nome: "Cantiere Verdi", stato: "Lead", importo: 12000, citta: "Roma" },
];

const COLONNE_EXPORT = [
    { chiave: "nome", label: "Nome" },
    { chiave: "stato", label: "Stato" },
    { chiave: "importo", label: "Importo (€)" },
    { chiave: "citta", label: "Città" },
];

const OPZIONI_STATO_DEMO = [
    { id: "1", label: "Lead", colore: "#3b82f6" },
    { id: "2", label: "Vendita", colore: "#f59e0b" },
    { id: "3", label: "Acconto", colore: "#8b5cf6" },
    { id: "4", label: "Rilievo", colore: "#06b6d4" },
    { id: "5", label: "Progettazione", colore: "#ec4899" },
    { id: "6", label: "Posa", colore: "#1B8C3A" },
];

export default function PaginaDemo() {
    const [tabAttivo, setTabAttivo] = useState("tutti");
    const [ricerca, setRicerca] = useState("");
    const [confermaAperta, setConfermaAperta] = useState(false);
    const [confermaDistruttivaAperta, setConfermaDistruttivaAperta] = useState(false);
    const [progressDemo, setProgressDemo] = useState(72);
    const [cf, setCf] = useState("");
    const [telefono, setTelefono] = useState("");
    const [iban, setIban] = useState("");
    const [email, setEmail] = useState("");
    const [importo, setImporto] = useState<number | null>(null);
    const [data, setData] = useState<Date | null>(null);
    const [statoSelezionato, setStatoSelezionato] = useState("");
    const [filesCaricati, setFilesCaricati] = useState<FileCaricato[]>([]);

    return (
        <div className="min-h-screen bg-[var(--pf-bg-primary)] text-[var(--pf-text-primary)]">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-[var(--pf-border)] bg-[var(--pf-bg-primary)]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            🧩 Catalogo Componenti
                        </h1>
                        <p className="text-sm text-[var(--pf-text-muted)] mt-0.5">
                            ProjectFlow — Lunardi & Forni · Anteprima componenti Blocco 2
                        </p>
                    </div>
                    <Badge variant="outline" className="text-[var(--pf-accent-primary)] border-[var(--pf-accent-primary)]">
                        v0.2.0-dev
                    </Badge>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-12">

                {/* === SEZIONE 1: Badge Stato === */}
                <SezioneDemo
                    titolo="Badge Stato"
                    descrizione="Pill colorate con colori dal database — zero hardcoding. Dimensioni sm/md, con effetto glow opzionale."
                >
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {STATI_DEMO.map((stato) => (
                                <BadgeStato
                                    key={stato.codice}
                                    label={stato.label}
                                    colore={stato.colore}
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {STATI_DEMO.slice(0, 4).map((stato) => (
                                <BadgeStato
                                    key={stato.codice}
                                    label={stato.label}
                                    colore={stato.colore}
                                    dimensione="sm"
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {STATI_DEMO.slice(0, 3).map((stato) => (
                                <BadgeStato
                                    key={stato.codice}
                                    label={stato.label}
                                    colore={stato.colore}
                                    conGlow
                                />
                            ))}
                        </div>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 2: Progress Arc === */}
                <SezioneDemo
                    titolo="Progress Arc"
                    descrizione="Arco SVG circolare per percentuali. Dimensione, colore e spessore configurabili."
                >
                    <div className="flex flex-wrap items-end gap-6">
                        <div className="text-center space-y-2">
                            <ProgressArc percentuale={progressDemo} />
                            <p className="text-xs text-[var(--pf-text-muted)]">Default (72px)</p>
                        </div>
                        <div className="text-center space-y-2">
                            <ProgressArc percentuale={100} dimensione={56} colore="#22c55e" />
                            <p className="text-xs text-[var(--pf-text-muted)]">100% verde</p>
                        </div>
                        <div className="text-center space-y-2">
                            <ProgressArc percentuale={35} dimensione={96} spessore={6} colore="#f59e0b" />
                            <p className="text-xs text-[var(--pf-text-muted)]">35% grande</p>
                        </div>
                        <div className="text-center space-y-2">
                            <ProgressArc percentuale={15} dimensione={48} colore="#ef4444" />
                            <p className="text-xs text-[var(--pf-text-muted)]">15% piccolo</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <Input
                                type="range"
                                min={0}
                                max={100}
                                value={progressDemo}
                                onChange={(e) => setProgressDemo(Number(e.target.value))}
                                className="w-32"
                            />
                            <span className="text-sm text-[var(--pf-text-muted)]">{progressDemo}%</span>
                        </div>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 3: Pill Tabs === */}
                <SezioneDemo
                    titolo="Pill Tabs"
                    descrizione="Tabs a pillola con conteggio. Supporta dimensione sm e md."
                >
                    <div className="space-y-4">
                        <PillTabs
                            tabs={TABS_DEMO}
                            tabAttivo={tabAttivo}
                            onTabChange={setTabAttivo}
                        />
                        <PillTabs
                            tabs={TABS_DEMO}
                            tabAttivo={tabAttivo}
                            onTabChange={setTabAttivo}
                            dimensione="sm"
                        />
                        <p className="text-sm text-[var(--pf-text-muted)]">
                            Tab selezionato: <code className="text-[var(--pf-accent-primary)]">{tabAttivo}</code>
                        </p>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 4: Campo Ricerca === */}
                <SezioneDemo
                    titolo="Campo Ricerca"
                    descrizione="Input con debounce 300ms, icona lente, bottone pulisci."
                >
                    <div className="max-w-md space-y-2">
                        <CampoRicerca
                            valore={ricerca}
                            onCambia={setRicerca}
                            placeholder="Cerca cantiere, cliente, codice..."
                        />
                        {ricerca && (
                            <p className="text-sm text-[var(--pf-text-muted)]">
                                Cercando: <code className="text-[var(--pf-accent-primary)]">&quot;{ricerca}&quot;</code>
                            </p>
                        )}
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 5: Export Toolbar === */}
                <SezioneDemo
                    titolo="Export Toolbar"
                    descrizione="Obbligatoria su ogni lista. CSV (BOM UTF-8), Excel (xlsx), JSON."
                >
                    <ExportToolbar
                        dati={DATI_EXPORT_DEMO}
                        nomeFile="demo-cantieri"
                        colonne={COLONNE_EXPORT}
                    />
                </SezioneDemo>

                {/* === SEZIONE 6: Buttons (shadcn) === */}
                <SezioneDemo
                    titolo="Buttons"
                    descrizione="Varianti shadcn/ui personalizzate con tema ProjectFlow."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button>Primario</Button>
                        <Button variant="secondary">Secondario</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Distruttivo</Button>
                        <Button variant="link">Link</Button>
                        <Button disabled>Disabilitato</Button>
                        <Button size="sm">Piccolo</Button>
                        <Button size="lg">Grande</Button>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 7: Avatar + Badge === */}
                <SezioneDemo
                    titolo="Avatar & Badge"
                    descrizione="Componenti shadcn/ui personalizzati."
                >
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarFallback className="bg-[var(--pf-accent-primary)] text-white">MV</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarFallback className="bg-purple-600 text-white">FS</AvatarFallback>
                        </Avatar>
                        <Avatar>
                            <AvatarFallback className="bg-orange-600 text-white">PG</AvatarFallback>
                        </Avatar>
                        <Separator orientation="vertical" className="h-8" />
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondario</Badge>
                        <Badge variant="outline">Outline</Badge>
                        <Badge variant="destructive">Errore</Badge>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 8: Skeleton Loader === */}
                <SezioneDemo
                    titolo="Skeleton Loader"
                    descrizione="Loading placeholder animati per diversi tipi di contenuto."
                >
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
                        <div>
                            <p className="text-xs text-[var(--pf-text-muted)] mb-3 uppercase tracking-wider">Righe</p>
                            <SkeletonLoader tipo="riga" righe={3} />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--pf-text-muted)] mb-3 uppercase tracking-wider">Badge</p>
                            <SkeletonLoader tipo="badge" righe={5} />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--pf-text-muted)] mb-3 uppercase tracking-wider">Tabella</p>
                            <SkeletonLoader tipo="tabella" righe={4} />
                        </div>
                        <div>
                            <p className="text-xs text-[var(--pf-text-muted)] mb-3 uppercase tracking-wider">Form</p>
                            <SkeletonLoader tipo="form" righe={3} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-xs text-[var(--pf-text-muted)] mb-3 uppercase tracking-wider">Card Grid</p>
                        <SkeletonLoader tipo="card" righe={3} />
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 9: Empty State === */}
                <SezioneDemo
                    titolo="Empty State"
                    descrizione="Placeholder per liste vuote con icona, titolo, descrizione e azione opzionale."
                >
                    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                        <Card className="bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]">
                            <CardContent className="p-0">
                                <EmptyState
                                    titolo="Nessun cantiere"
                                    descrizione="Non ci sono cantieri che corrispondono ai filtri selezionati."
                                    icona="🏗️"
                                    azione={<Button size="sm">Nuovo Cantiere</Button>}
                                />
                            </CardContent>
                        </Card>
                        <Card className="bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]">
                            <CardContent className="p-0">
                                <EmptyState
                                    titolo="Nessun risultato"
                                    descrizione="Prova a cambiare i termini di ricerca."
                                    icona="🔍"
                                />
                            </CardContent>
                        </Card>
                        <Card className="bg-[var(--pf-surface-secondary)] border-[var(--pf-border)]">
                            <CardContent className="p-0">
                                <EmptyState
                                    titolo="Nessuna foto"
                                    descrizione="Carica le foto del rilievo per procedere."
                                    icona="📸"
                                    azione={<Button size="sm" variant="outline">Carica Foto</Button>}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 10: Conferma Dialog === */}
                <SezioneDemo
                    titolo="Conferma Dialog"
                    descrizione="Dialog modale per azioni critiche. Supporta stile distruttivo."
                >
                    <div className="flex gap-3">
                        <Button onClick={() => setConfermaAperta(true)}>
                            Conferma Standard
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setConfermaDistruttivaAperta(true)}
                        >
                            Conferma Distruttiva
                        </Button>
                    </div>
                    <ConfermaDialog
                        aperto={confermaAperta}
                        onChiudi={() => setConfermaAperta(false)}
                        onConferma={() => setConfermaAperta(false)}
                        titolo="Conferma transizione"
                        descrizione="Vuoi spostare il cantiere da ACCONTO a RILIEVO? Questa azione verrà registrata nella timeline."
                    />
                    <ConfermaDialog
                        aperto={confermaDistruttivaAperta}
                        onChiudi={() => setConfermaDistruttivaAperta(false)}
                        onConferma={() => setConfermaDistruttivaAperta(false)}
                        titolo="Eliminare il cantiere?"
                        descrizione="Questa azione non può essere annullata. Tutti i dati associati verranno persi."
                        testoConferma="Elimina"
                        isDistrutivo
                    />
                </SezioneDemo>

                {/* === SEZIONE 11: Input & Switch & Checkbox === */}
                <SezioneDemo
                    titolo="Input, Switch, Checkbox"
                    descrizione="Componenti form base da shadcn/ui."
                >
                    <div className="max-w-md space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Nome cantiere</label>
                            <Input placeholder="Es. Rossi - Via Roma 42" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch id="notifiche" />
                            <label htmlFor="notifiche" className="text-sm">Abilita notifiche WhatsApp</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <Checkbox id="acconto" />
                            <label htmlFor="acconto" className="text-sm">Acconto 40% ricevuto</label>
                        </div>
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 12: Campi Form Validati === */}
                <SezioneDemo
                    titolo="Campi Form con Validazione"
                    descrizione="Campi personalizzati con validazione integrata: CF, telefono, IBAN, email, valuta, data."
                >
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 max-w-3xl">
                        <CampoCodiceFiscale
                            valore={cf}
                            onCambia={setCf}
                        />
                        <CampoTelefono
                            valore={telefono}
                            onCambia={setTelefono}
                            obbligatorio
                        />
                        <CampoIban
                            valore={iban}
                            onCambia={setIban}
                        />
                        <CampoEmail
                            valore={email}
                            onCambia={setEmail}
                            obbligatorio
                        />
                        <CampoValuta
                            valore={importo}
                            onCambia={setImporto}
                            label="Importo preventivo"
                            obbligatorio
                        />
                        <CampoData
                            valore={data}
                            onCambia={setData}
                            label="Data sopralluogo"
                            obbligatorio
                        />
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 13: Select Config === */}
                <SezioneDemo
                    titolo="Select Config (da DB)"
                    descrizione="Select generico che carica opzioni dalla tabella config DB. I pallini colorati riflettono il colore dello stato."
                >
                    <div className="max-w-sm">
                        <CampoSelectConfig
                            valore={statoSelezionato}
                            onCambia={setStatoSelezionato}
                            label="Stato cantiere"
                            opzioni={OPZIONI_STATO_DEMO}
                            obbligatorio
                        />
                        {statoSelezionato && (
                            <p className="mt-2 text-sm text-[var(--pf-text-muted)]">
                                Selezionato: <code className="text-[var(--pf-accent-primary)]">{statoSelezionato}</code>
                            </p>
                        )}
                    </div>
                </SezioneDemo>

                {/* === SEZIONE 14: Upload File === */}
                <SezioneDemo
                    titolo="Upload File"
                    descrizione="Drag & drop con react-dropzone. Anteprima immagini, validazione tipo e dimensione."
                >
                    <div className="max-w-lg">
                        <CampoUploadFile
                            files={filesCaricati}
                            onFilesChange={setFilesCaricati}
                            label="Foto rilievo"
                            maxFiles={5}
                        />
                    </div>
                </SezioneDemo>

            </main>

            {/* Footer */}
            <footer className="border-t border-[var(--pf-border)] py-6 mt-12">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[var(--pf-text-muted)]">
                    ProjectFlow Outdoor · Gestionale Cantieri · Lunardi & Forni
                </div>
            </footer>
        </div>
    );
}

// === Componente helper per le sezioni demo ===

interface SezioneDemoProps {
    titolo: string;
    descrizione: string;
    children: React.ReactNode;
}

function SezioneDemo({ titolo, descrizione, children }: SezioneDemoProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--pf-text-primary)]">{titolo}</h2>
                <p className="text-sm text-[var(--pf-text-muted)]">{descrizione}</p>
            </div>
            <Card className="bg-[var(--pf-surface-secondary)]/50 border-[var(--pf-border)]">
                <CardContent className="p-6">
                    {children}
                </CardContent>
            </Card>
        </section>
    );
}
