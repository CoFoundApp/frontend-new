import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get("access_token")
    const refreshToken = request.cookies.get("refresh_token")
    
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    const hasTokens = !!(accessToken || refreshToken)

    // Rediriger utilisateurs authentifiés des pages publiques
    if (isPublicPath && hasTokens) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    // Autoriser accès aux pages publiques
    if (isPublicPath) {
        return NextResponse.next()
    }

    // Vérifier présence des tokens pour routes protégées
    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Vérifier expiration du refresh token
    if (!isTokenValid(refreshToken.value)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // Vérifier si access token nécessite refresh
    if (!accessToken || !isTokenValid(accessToken.value, 5 * 60)) {
        const refreshed = await refreshTokens()
        if (!refreshed) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    // Vérifier profil utilisateur
    return checkUserProfile(request)
}

function isTokenValid(token: string, bufferSeconds: number = 0): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return (payload.exp * 1000) > (Date.now() + bufferSeconds * 1000)
    } catch {
        return false
    }
}

async function refreshTokens(): Promise<boolean> {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `mutation { refresh { accessToken refreshToken } }`
            })
        })
        const result = await response.json()
        return !result.errors
    } catch {
        return false
    }
}

async function checkUserProfile(request: NextRequest) {
    if (request.nextUrl.pathname === "/introduction") {
        return NextResponse.next()
    }

    try {
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `query { myProfile { display_name } }`
            })
        })

        const result = await response.json()
        const displayName = result.data?.myProfile?.display_name?.trim() ?? ""

        if (!displayName) {
            return NextResponse.redirect(new URL("/introduction", request.url))
        }
    } catch (error) {
        console.error("Profile check error:", error)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',]
}