import { SignUp } from "@clerk/nextjs";

// Pagina di registrazione — Clerk gestisce tutto il form
export default function PaginaRegistrazione() {
    return (
        <main className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--pf-bg-primary)" }}>
            <SignUp />
        </main>
    );
}
