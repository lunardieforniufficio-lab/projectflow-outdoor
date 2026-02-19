// Provider TanStack Query per l'app
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

/** Opzioni di default per TanStack Query */
function creaQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Dati di configurazione: cache aggressiva (5 minuti)
                staleTime: 5 * 60 * 1000,
                // Retry max 2 volte
                retry: 2,
                // Non refetchare su focus per dati config
                refetchOnWindowFocus: false,
            },
        },
    });
}

interface ProviderQueryProps {
    children: ReactNode;
}

/** Provider globale per TanStack Query */
export function ProviderQuery({ children }: ProviderQueryProps) {
    const [queryClient] = useState(creaQueryClient);

    return (
        <QueryClientProvider client= { queryClient } >
        { children }
        </QueryClientProvider>
  );
}
