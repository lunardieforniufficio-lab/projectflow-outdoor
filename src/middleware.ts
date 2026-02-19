import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rotte pubbliche — accessibili senza autenticazione
const isRoutaPubblica = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/demo(.*)",
]);

// Rotte riservate solo ad admin
const isRoutaAdmin = createRouteMatcher([
    "/admin(.*)",
]);

// Rotte riservate ad admin e titolare
const isRoutaDirezione = createRouteMatcher([
    "/report(.*)",
    "/ai(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
    // Rotte pubbliche: nessuna protezione
    if (isRoutaPubblica(request)) {
        return NextResponse.next();
    }

    // Tutte le altre rotte richiedono autenticazione
    const sessione = await auth.protect();

    // Leggi il ruolo dai metadata Clerk (impostato al momento della creazione utente)
    // Il ruolo è in publicMetadata.ruolo (es. "admin", "venditore", "caposquadra")
    const ruolo = (sessione.sessionClaims?.metadata as Record<string, unknown>)?.ruolo as string | undefined;

    // Rotte admin: solo admin
    if (isRoutaAdmin(request)) {
        if (!ruolo || ruolo !== "admin") {
            const urlLogin = new URL("/", request.url);
            return NextResponse.redirect(urlLogin);
        }
    }

    // Rotte direzione: admin e titolare
    if (isRoutaDirezione(request)) {
        if (!ruolo || !["admin", "titolare"].includes(ruolo)) {
            const urlHome = new URL("/", request.url);
            return NextResponse.redirect(urlHome);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Escludi file statici e _next internals
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Includi sempre le API routes
        "/(api|trpc)(.*)",
    ],
};
