import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
    console.log("🚀 MIDDLEWARE START:", request.nextUrl.pathname)
    
    const { pathname } = request.nextUrl

    const accessToken = request.cookies.get("access_token")
    const refreshToken = request.cookies.get("refresh_token")
    
    console.log("🍪 TOKENS:", { 
        accessToken: accessToken ? "EXISTS" : "MISSING",
        refreshToken: refreshToken ? "EXISTS" : "MISSING" 
    })
    
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    const hasTokens = !!(accessToken || refreshToken)

    console.log("📍 PATH CHECK:", { pathname, isPublicPath, hasTokens })

    if (isPublicPath && hasTokens) {
        console.log("↩️  REDIRECT: Public path with tokens -> /discover")
        return NextResponse.redirect(new URL("/discover", request.url))
    }

    if (isPublicPath) {
        console.log("✅ ALLOW: Public path without tokens")
        return NextResponse.next()
    }

    if (!refreshToken) {
        console.log("❌ REDIRECT: No refresh token -> /login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    const isRefreshValid = isTokenValid(refreshToken.value)
    console.log("🔍 REFRESH TOKEN VALIDATION:", isRefreshValid)

    if (!isRefreshValid) {
        console.log("❌ REDIRECT: Invalid refresh token -> /login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    const isAccessValid = accessToken ? isTokenValid(accessToken.value, 5 * 60) : false
    console.log("🔍 ACCESS TOKEN VALIDATION:", { 
        exists: !!accessToken, 
        valid: isAccessValid 
    })

    if (!accessToken || !isAccessValid) {
        console.log("🔄 ATTEMPTING TOKEN REFRESH...")
        const refreshed = await refreshTokens(request)
        console.log("🔄 REFRESH RESULT:", refreshed)
        
        if (!refreshed) {
            console.log("❌ REDIRECT: Refresh failed -> /login")
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    console.log("👤 CHECKING USER PROFILE...")
    return checkUserProfile(request)
}

function isTokenValid(token: string, bufferSeconds: number = 0): boolean {
    try {
        console.log("🔍 VALIDATING TOKEN:", token.substring(0, 20) + "...")
        const payload = JSON.parse(atob(token.split('.')[1]))
        const isValid = (payload.exp * 1000) > (Date.now() + bufferSeconds * 1000)
        console.log("🔍 TOKEN PAYLOAD:", { exp: payload.exp, valid: isValid })
        return isValid
    } catch (error) {
        console.error("❌ TOKEN VALIDATION ERROR:", error)
        return false
    }
}

async function refreshTokens(request: NextRequest): Promise<boolean> {
    try {
        const refreshToken = request.cookies.get("refresh_token")
        console.log("🔄 REFRESHING WITH TOKEN:", refreshToken?.value?.substring(0, 20) + "...")
        
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
        
        console.log("🔄 REFRESH RESPONSE STATUS:", response.status)
        const result = await response.json()
        console.log("🔄 REFRESH RESPONSE:", { 
            hasErrors: !!result.errors,
            errors: result.errors,
            hasData: !!result.data 
        })
        
        return !result.errors
    } catch (error) {
        console.error("❌ REFRESH ERROR:", error)
        return false
    }
}

async function checkUserProfile(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log("👤 CHECKING PROFILE FOR PATH:", pathname)

    try {
        const accessToken = request.cookies.get("access_token")
        console.log("👤 USING ACCESS TOKEN:", accessToken?.value?.substring(0, 20) + "...")
        
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

        console.log("👤 PROFILE RESPONSE STATUS:", response.status)
        const result = await response.json()
        console.log("👤 PROFILE RESPONSE:", { 
            hasErrors: !!result.errors,
            errors: result.errors,
            data: result.data 
        })
        
        const displayName = result.data?.myProfile?.display_name?.trim() ?? ""
        console.log("👤 DISPLAY NAME:", `"${displayName}"`)

        if (pathname === "/introduction" && displayName) {
            console.log("↩️  REDIRECT: Has profile but on intro -> /discover")
            return NextResponse.redirect(new URL("/discover", request.url))
        }
        
        if (pathname !== "/introduction" && !displayName) {
            console.log("↩️  REDIRECT: No profile -> /introduction")
            return NextResponse.redirect(new URL("/introduction", request.url))
        }
        
        console.log("✅ ALLOW: Profile check passed")
        
    } catch (error) {
        console.error("❌ PROFILE CHECK ERROR:", error)
    }

    console.log("🏁 MIDDLEWARE END: NextResponse.next()")
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',]
}
