import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const path = request.nextUrl.pathname;

    const isPublicPath = path === "/login" || path === "/register";

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|api/graphql|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|woff|woff2|ttf|otf)).*)',
    ],
};