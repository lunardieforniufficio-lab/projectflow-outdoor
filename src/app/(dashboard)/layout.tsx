// Layout shell per tutte le pagine app (dashboard group)
// Sidebar + content area responsive + barra simulazione ruolo
import { Sidebar } from "@/components/modules/nav/sidebar";
import { BarraSimulazione } from "@/components/modules/nav/barra-simulazione";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--pf-bg-primary)]">
            {/* Barra simulazione ruolo — solo per super admin */}
            <BarraSimulazione />

            <Sidebar />

            {/* Content area — offset per sidebar desktop, padding top per topbar mobile */}
            <main className="lg:ml-[260px] min-h-screen transition-[margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {/* Spacer barra simulazione (36px = h-9) + mobile topbar */}
                <div className="h-9" />
                <div className="lg:hidden h-14" />

                {/* Page content */}
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
