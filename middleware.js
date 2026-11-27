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
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Tulis ke request (dibaca Server Component) dan ke response (dikirim ke browser)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect yang tetap membawa cookie hasil refresh token
  const redirectTo = (path) => {
    const redirect = NextResponse.redirect(new URL(path, request.url))
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }

  // API route menangani auth sendiri lewat requireUser() → balas 401 JSON
  if (pathname.startsWith('/api')) {
    return response
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
  // Katalog design system boleh dibuka tanpa login (hanya berisi data dummy)
  const isPublicPage = pathname.startsWith('/design')

  // Sudah login tapi membuka halaman login/register → arahkan ke dashboard
  if (user && isAuthPage) {
    return redirectTo('/dashboard')
  }

  // Belum login dan mencoba akses halaman yang diproteksi → arahkan ke login
  if (!user && !isAuthPage && !isPublicPage && pathname !== '/') {
    return redirectTo('/login')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}