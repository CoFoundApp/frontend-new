import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const storedVersion = request.cookies.get("app_version")
    
    if (storedVersion && storedVersion.value !== APP_VERSION) {
        const response = NextResponse.redirect(new URL("/login", request.url))
        
        response.cookies.set({
            name: "access_token",
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        response.cookies.set({
            name: "refresh_token",
            value: "",
            expires: new Date(0),
            path: "/",
        })
        
        response.cookies.set({
            name: "app_version",
            value: APP_VERSION,
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
        })
        
        return response
    }
    
    if (!storedVersion) {
        const response = NextResponse.next()
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
        return NextResponse.next()
    }

    if (!refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!isTokenValid(refreshToken.value)) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!accessToken || !isTokenValid(accessToken.value, 5 * 60)) {
        const refreshed = await refreshTokens(request)
        if (!refreshed) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

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
