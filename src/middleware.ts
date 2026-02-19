import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rotte pubbliche — accessibili senza autenticazione
const isRoutaPubblica = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/demo(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
    // Proteggi tutte le rotte tranne quelle pubbliche
    if (!isRoutaPubblica(request)) {
        await auth.protect();
    }
});

export const config = {
    matcher: [
        // Escludi file statici e _next internals
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Includi sempre le API routes
        "/(api|trpc)(.*)",
    ],
};
