import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    const accessToken = request.cookies.get("access_token")
    
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))

    if (isPublicPath && accessToken) {
        return NextResponse.redirect(new URL("/discover", request.url))
    }

    if (isPublicPath) {
        return NextResponse.next()
    }

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return checkUserProfile(request)
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
        
        if (result.errors) {
            return NextResponse.redirect(new URL("/login", request.url))
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
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',]
}
