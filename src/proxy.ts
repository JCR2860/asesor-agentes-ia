import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    '/chat(.*)',
    '/guia(.*)',
    '/comprar(.*)',
    '/recepcion(.*)',
    '/admin(.*)',
    '/api/chat(.*)',
    '/api/admin(.*)',
    '/api/pdf(.*)',
    '/api/upload(.*)',
    '/api/redeem(.*)',
    '/api/support-chat(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();

    // Inyectamos el pathname como header para que el layout pueda leerlo.
    // Esto permite que /sign-in y /admin bypaseen la pantalla de mantenimiento.
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", req.nextUrl.pathname);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
