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

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: request.headers.get("cookie") || "",
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                mutation RefreshToken {
                    refreshToken {
                    __typename
                    }
                }
                `,
            }),
        })

        const result = await response.json()

        if (result.errors) {
            return NextResponse.redirect(new URL("/login", request.url))
        }

        return NextResponse.next()
    } catch (error) {
        console.error("Middleware token refresh error:", error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
