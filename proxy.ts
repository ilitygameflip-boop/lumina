import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'it_demo_session'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/admin/connexion') return NextResponse.next()
  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/connexion'
    url.search = `?suivant=${encodeURIComponent(pathname)}`
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
