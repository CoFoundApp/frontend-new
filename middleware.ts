import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const publicPaths = ["/login", "/register", "/forgot-password"]
    const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

    if (isPublicPath) {
        return NextResponse.next()
    }

    const accessToken = request.cookies.get("access_token")

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
