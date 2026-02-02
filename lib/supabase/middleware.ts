import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/register")

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    )
  }

  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL("/", request.url)
    )
  }

  return response
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
}
