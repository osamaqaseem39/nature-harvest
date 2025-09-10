import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the user agent from the request
  const userAgent = request.headers.get('user-agent') || ''
  
  // Check if the request is from a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  
  // Get the pathname
  const pathname = request.nextUrl.pathname
  
  // If it's a mobile device and not already on mobile page, redirect to mobile version
  if (isMobile && pathname === '/' && !pathname.startsWith('/mobile')) {
    return NextResponse.redirect(new URL('/mobile', request.url))
  }
  
  // If it's not mobile and on mobile page, redirect to main page
  if (!isMobile && pathname.startsWith('/mobile')) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}