import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Disable static generation for pages that use client-side features
  const pathname = request.nextUrl.pathname
  
  if (pathname.startsWith('/explain') || 
      pathname.startsWith('/generate') || 
      pathname.startsWith('/deploy') || 
      pathname.startsWith('/chatbot') || 
      pathname.startsWith('/analytics') || 
      pathname.startsWith('/learning') || 
      pathname.startsWith('/test') || 
      pathname.startsWith('/context7-test')) {
    
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
