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
        const payload = JSON.parse(atob(accessToken.value.split('.')[1]))
        const tokenExp = payload.exp * 1000
        const now = Date.now()
        const timeUntilExp = tokenExp - now
        const fiveMinutes = 5 * 60 * 1000

        if (timeUntilExp > fiveMinutes) {
            return NextResponse.next()
        }
    } catch (error) {
        console.log("Cannot decode token, proceeding with refresh")
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation Refresh {
                        refresh {
                            accessToken
                            refreshToken
                        }
                    }
                    `,
            }),
        })

        const result = await response.json()

        if (result.errors) {
            console.error("Middleware token refresh error:", result.errors)
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
