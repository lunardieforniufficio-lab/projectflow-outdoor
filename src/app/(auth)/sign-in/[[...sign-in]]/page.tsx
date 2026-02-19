import { SignIn } from "@clerk/nextjs";

// Pagina di login — Clerk gestisce tutto il form
export default function PaginaLogin() {
    return (
        <main className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "var(--pf-bg-primary)" }}>
            <SignIn />
        </main>
    );
}
