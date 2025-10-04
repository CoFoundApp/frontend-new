import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    const publicPaths = ["/login", "/register", "/forgot-password"]
    const isPublicPath = publicPaths.some((path) => 
        pathname.startsWith(path)
    )

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
            return await checkUserProfileAndRedirect(request)
        }
    } catch (error) {
        console.log("Cannot decode token, proceeding with refresh")
    }

    try {
        const refreshResponse = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': request.headers.get('Cookie') || '',
            },
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

        const refreshResult = await refreshResponse.json()

        if (refreshResult.errors) {
            console.error("Middleware token refresh error:", refreshResult.errors)
            return NextResponse.redirect(new URL("/login", request.url))
        }

        return await checkUserProfileAndRedirect(request)
    } catch (error) {
        console.error("Middleware token refresh error:", error)
        return NextResponse.redirect(new URL("/login", request.url))
    }
}

async function checkUserProfileAndRedirect(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    if (pathname === "/introduction") {
        return NextResponse.next()
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': request.headers.get('Cookie') || '',
            },
            body: JSON.stringify({
                query: `
                    query GetCurrentUser {
                        myProfile {
                            display_name
                        }
                        myEmail
                    }
                `,
            }),
        })

        const result = await response.json()

        if (!result.errors && result.data?.myProfile) {
            const displayName = result.data.myProfile.display_name?.toString().trim() ?? ""
            
            if (displayName.length === 0) {
                return NextResponse.redirect(new URL("/introduction", request.url))
            }
        }

        return NextResponse.next()
    } catch (error) {
        console.error("Error checking user profile in middleware:", error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        /*
         * Matcher pour toutes les routes sauf :
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - robots.txt (robots file)
         * - fichiers avec extensions (images, CSS, JS, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
    ],
}
