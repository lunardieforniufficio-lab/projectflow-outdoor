// Layout per ruolo Admin — accesso completo a tutto il sistema
"use client";

import { useRuolo } from "@/hooks/use-ruolo";
import { SkeletonLoader } from "@/components/ui/skeleton-loader";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldX } from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

/**
 * Layout wrapper per sezioni accessibili solo agli admin.
 * Mostra loading durante il caricamento ruolo, blocca l'accesso se non autorizzato.
 */
export function AdminLayout({ children }: AdminLayoutProps) {
    const { isAdmin, isCaricamento, ruoloLabel } = useRuolo();

    if (isCaricamento) {
        return (
            <div className="space-y-4 p-6">
                <SkeletonLoader righe={3} />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <EmptyState
                icona={<ShieldX size={40} />}
                titolo="Accesso non autorizzato"
                descrizione={`Il ruolo "${ruoloLabel ?? "Sconosciuto"}" non ha accesso a questa sezione. Contatta un amministratore.`}
            />
        );
    }

    return <>{children}</>;
}
