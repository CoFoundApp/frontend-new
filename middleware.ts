import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log("🔍 [MIDDLEWARE] Processing path:", pathname)

    const publicPaths = ["/login", "/register", "/forgot-password"]
    const isPublicPath = publicPaths.some((path) => 
        pathname.startsWith(path)
    )

    if (isPublicPath) {
        console.log("✅ [MIDDLEWARE] Public path, skipping auth checks")
        return NextResponse.next()
    }

    const accessToken = request.cookies.get("access_token")
    const refreshToken = request.cookies.get("refresh_token")
    
    console.log("🍪 [MIDDLEWARE] Tokens present:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
    })

    if (!accessToken && !refreshToken) {
        console.log("❌ [MIDDLEWARE] No tokens found, redirecting to login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!refreshToken) {
        console.log("❌ [MIDDLEWARE] No refresh token, redirecting to login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
        const refreshPayload = JSON.parse(atob(refreshToken.value.split('.')[1]))
        const refreshTokenExp = refreshPayload.exp * 1000
        const now = Date.now()

        console.log("⏰ [MIDDLEWARE] Refresh token expiry check:", {
            refreshTokenExp: new Date(refreshTokenExp).toISOString(),
            now: new Date(now).toISOString(),
            isExpired: refreshTokenExp <= now
        })

        if (refreshTokenExp <= now) {
            console.log("❌ [MIDDLEWARE] Refresh token expired, redirecting to login")
            return NextResponse.redirect(new URL("/login", request.url))
        }
    } catch (error) {
        console.log("❌ [MIDDLEWARE] Cannot decode refresh token:", error)
        return NextResponse.redirect(new URL("/login", request.url))
    }

    let needsRefresh = false
    
    if (!accessToken) {
        console.log("⚠️ [MIDDLEWARE] No access token, needs refresh")
        needsRefresh = true
    } else {
        try {
            const accessPayload = JSON.parse(atob(accessToken.value.split('.')[1]))
            const accessTokenExp = accessPayload.exp * 1000
            const now = Date.now()
            const fiveMinutes = 5 * 60 * 1000

            console.log("⏰ [MIDDLEWARE] Access token expiry check:", {
                accessTokenExp: new Date(accessTokenExp).toISOString(),
                now: new Date(now).toISOString(),
                timeUntilExp: accessTokenExp - now,
                needsRefresh: (accessTokenExp - now) <= fiveMinutes
            })

            if (accessTokenExp - now <= fiveMinutes) {
                console.log("⚠️ [MIDDLEWARE] Access token expires soon, needs refresh")
                needsRefresh = true
            }
        } catch (error) {
            console.log("⚠️ [MIDDLEWARE] Cannot decode access token:", error)
            needsRefresh = true
        }
    }

    if (needsRefresh) {
        console.log("🔄 [MIDDLEWARE] Starting token refresh...")
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
            console.log("🔄 [MIDDLEWARE] Refresh response:", {
                hasErrors: !!refreshResult.errors,
                errors: refreshResult.errors,
                hasData: !!refreshResult.data
            })

            if (refreshResult.errors) {
                console.error("❌ [MIDDLEWARE] Token refresh error:", refreshResult.errors)
                return NextResponse.redirect(new URL("/login", request.url))
            }
            console.log("✅ [MIDDLEWARE] Token refresh successful")
        } catch (error) {
            console.error("❌ [MIDDLEWARE] Token refresh failed:", error)
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    console.log("👤 [MIDDLEWARE] Checking user profile...")
    return await checkUserProfileAndRedirect(request)
}

async function checkUserProfileAndRedirect(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log("👤 [PROFILE_CHECK] Starting profile check for path:", pathname)

    if (pathname === "/introduction") {
        console.log("✅ [PROFILE_CHECK] Already on introduction page, allowing access")
        return NextResponse.next()
    }

    try {
        console.log("📡 [PROFILE_CHECK] Fetching user profile from GraphQL...")
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
        console.log("📡 [PROFILE_CHECK] GraphQL response:", {
            hasErrors: !!result.errors,
            errors: result.errors,
            hasData: !!result.data,
            hasProfile: !!result.data?.myProfile,
            hasEmail: !!result.data?.myEmail
        })

        if (!result.errors && result.data?.myProfile) {
            const displayName = result.data.myProfile.display_name?.toString().trim() ?? ""
            console.log("👤 [PROFILE_CHECK] User profile data:", {
                displayName: displayName,
                displayNameLength: displayName.length,
                needsIntroduction: displayName.length === 0
            })
            
            if (displayName.length === 0) {
                console.log("🔄 [PROFILE_CHECK] Display name empty, redirecting to /introduction")
                return NextResponse.redirect(new URL("/introduction", request.url))
            } else {
                console.log("✅ [PROFILE_CHECK] Display name present, allowing access")
            }
        } else {
            console.log("⚠️ [PROFILE_CHECK] No profile data or errors present")
        }

        console.log("✅ [PROFILE_CHECK] Profile check complete, continuing")
        return NextResponse.next()
    } catch (error) {
        console.error("❌ [PROFILE_CHECK] Error checking user profile:", error)
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\..*).*)',
    ],
}
