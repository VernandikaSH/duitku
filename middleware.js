import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Middleware ini berjalan di setiap request untuk memastikan
// sesi login user tetap valid (auto-refresh token)
export async function middleware(request) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Kalau belum login dan mencoba akses halaman selain /login & /register, redirect
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register')

  // Katalog design system boleh dibuka tanpa login (hanya berisi data dummy)
  const isPublicPage = request.nextUrl.pathname.startsWith('/design')

  if (!user && !isAuthPage && !isPublicPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
