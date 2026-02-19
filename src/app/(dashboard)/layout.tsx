// Layout shell per tutte le pagine app (dashboard group)
// Sidebar + content area responsive
import { Sidebar } from "@/components/modules/nav/sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-[var(--pf-bg-primary)]">
            <Sidebar />

            {/* Content area — offset per sidebar desktop, padding top per topbar mobile */}
            <main className="lg:ml-[260px] min-h-screen transition-[margin] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                {/* Mobile topbar spacer */}
                <div className="lg:hidden h-14" />

                {/* Page content */}
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
