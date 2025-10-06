import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
    console.log("🚀 MIDDLEWARE START:", request.nextUrl.pathname)
    
    const { pathname } = request.nextUrl
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))
    
    console.log("📍 PATH CHECK:", { pathname, isPublicPath })

    if (isPublicPath) {
        const accessToken = request.cookies.get("access_token")
        console.log("🍪 PUBLIC PATH - Access token:", accessToken ? "EXISTS" : "MISSING")
        
        if (accessToken) {
            console.log("↩️  REDIRECT: Public path with token -> /discover")
            return NextResponse.redirect(new URL("/discover", request.url))
        }
        
        console.log("✅ ALLOW: Public path access")
        return NextResponse.next()
    }

    console.log("🔒 PROTECTED PATH - Calling whoami first...")
    const whoamiResult = await callWhoami(request)
    
    console.log("🔍 WHOAMI RESULT:", whoamiResult)
    
    if (!whoamiResult.success) {
        console.log("❌ REDIRECT: Whoami failed -> /login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    console.log("✅ WHOAMI SUCCESS - Checking user profile...")
    return checkUserProfile(request)
}

async function callWhoami(request: NextRequest) {
    console.log("🔍 CALLING WHOAMI...")
    
    try {
        const cookieHeader = request.headers.get('cookie') || ''
        console.log("🍪 COOKIES HEADER:", cookieHeader.substring(0, 100) + "...")
        
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieHeader
            },
            body: JSON.stringify({
                query: `query { whoami }`
            })
        })

        console.log("🌐 WHOAMI RESPONSE STATUS:", response.status)
        const result = await response.json()
        console.log("🌐 WHOAMI RESPONSE:", {
            hasErrors: !!result.errors,
            errors: result.errors,
            data: result.data
        })
        
        if (result.errors) {
            console.error("❌ WHOAMI ERROR:", result.errors)
            return { success: false }
        }
        
        console.log("✅ WHOAMI SUCCESS - User ID:", result.data?.whoami)
        return { success: true, whoami: result.data?.whoami }
        
    } catch (error) {
        console.error("❌ WHOAMI CALL ERROR:", error)
        return { success: false }
    }
}

async function checkUserProfile(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log("👤 CHECKING USER PROFILE FOR PATH:", pathname)

    try {
        const cookieHeader = request.headers.get('cookie') || ''
        console.log("🍪 PROFILE CHECK - Using cookies:", cookieHeader.substring(0, 100) + "...")
        
        const response = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
            method: "POST",
            headers: { 
                'Content-Type': 'application/json',
                'Cookie': cookieHeader
            },
            body: JSON.stringify({
                query: `query { myProfile { display_name } }`
            })
        })

        console.log("🌐 PROFILE RESPONSE STATUS:", response.status)
        const result = await response.json()
        console.log("🌐 PROFILE RESPONSE:", {
            hasErrors: !!result.errors,
            errors: result.errors,
            data: result.data
        })
        
        if (result.errors) {
            console.error("❌ PROFILE ERROR:", result.errors)
            console.log("❌ REDIRECT: Profile check failed -> /login")
            return NextResponse.redirect(new URL("/login", request.url))
        }
        
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
        
        console.log("✅ PROFILE CHECK PASSED")
        
    } catch (error) {
        console.error("❌ PROFILE CHECK ERROR:", error)
        console.log("❌ REDIRECT: Network error -> /login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    console.log("🏁 MIDDLEWARE END: NextResponse.next()")
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',]
}
