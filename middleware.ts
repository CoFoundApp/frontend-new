import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Créer la réponse d'abord
    const response = NextResponse.next()
    
    // Vérifier la version de l'app
    const storedVersion = request.cookies.get("app_version")
    
    // Si la version a changé, nettoyer les cookies et rediriger
    if (storedVersion && storedVersion.value !== APP_VERSION) {
        const redirectResponse = NextResponse.redirect(new URL("/login", request.url))
        
        // Supprimer tous les cookies d'authentification
        redirectResponse.cookies.set({
            name: "access_token",
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        redirectResponse.cookies.set({
            name: "refresh_token", 
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        // Mettre à jour la version
        redirectResponse.cookies.set({
            name: "app_version",
            value: APP_VERSION,
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 an
        })
        
        return redirectResponse
    }
    
    // Définir la version si elle n'existe pas
    if (!storedVersion) {
        response.cookies.set({
            name: "app_version",
            value: APP_VERSION,
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        })
    }
    
    const accessToken = request.cookies.get("access_token")
    const refreshToken = request.cookies.get("refresh_token")
    
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    const hasTokens = !!(accessToken || refreshToken)

    if (isPublicPath && hasTokens) {
        return NextResponse.redirect(new URL("/discover", request.url))
    }

    if (isPublicPath) {
        return response // Retourner response avec le cookie version
    }

    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!isTokenValid(refreshToken.value)) {
        // Token invalide, nettoyer et rediriger
        const redirectResponse = NextResponse.redirect(new URL("/login", request.url))
        
        redirectResponse.cookies.set({
            name: "access_token",
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        redirectResponse.cookies.set({
            name: "refresh_token",
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        return redirectResponse
    }

    if (!accessToken || !isTokenValid(accessToken.value, 5 * 60)) {
        const refreshed = await refreshTokens(request)
        if (!refreshed) {
            const redirectResponse = NextResponse.redirect(new URL("/login", request.url))
            
            redirectResponse.cookies.set({
                name: "access_token",
                value: "",
                expires: new Date(0),
                path: "/",
            })
            
            redirectResponse.cookies.set({
                name: "refresh_token",
                value: "",
                expires: new Date(0),
                path: "/",
            })
            
            return redirectResponse
        }
    }

    const profileResult = await checkUserProfile(request)
    
    // Si checkUserProfile retourne une redirection, la retourner
    if (profileResult.status === 302) {
        return profileResult
    }

    // Sinon retourner la réponse avec les cookies
    return response
}

function isTokenValid(token: string, bufferSeconds: number = 0): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return (payload.exp * 1000) > (Date.now() + bufferSeconds * 1000)
    } catch {
        return false
    }
}

async function refreshTokens(request: NextRequest): Promise<boolean> {
    try {
        const refreshToken = request.cookies.get("refresh_token")
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': `refresh_token=${refreshToken?.value}`
            },
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
    const pathname = request.nextUrl.pathname

    try {
        const accessToken = request.cookies.get("access_token")
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': `access_token=${accessToken?.value}`
            },
            body: JSON.stringify({
                query: `query { myProfile { display_name } }`
            })
        })

        const result = await response.json()
        
        // Si erreur d'authentification, nettoyer les cookies
        if (result.errors) {
            const errorResponse = NextResponse.redirect(new URL("/login", request.url))
            
            errorResponse.cookies.set({
                name: "access_token",
                value: "",
                expires: new Date(0),
                path: "/",
            })
            
            errorResponse.cookies.set({
                name: "refresh_token",
                value: "",
                expires: new Date(0),
                path: "/",
            })
            
            return errorResponse
        }
        
        const displayName = result.data?.myProfile?.display_name?.trim() ?? ""

        if (pathname === "/introduction" && displayName) {
            return NextResponse.redirect(new URL("/discover", request.url))
        }
        
        if (pathname !== "/introduction" && !displayName) {
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
