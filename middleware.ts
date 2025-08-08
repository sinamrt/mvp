// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = req.cookies.get('session')?.value;

  // Protect /dashboard (and any subpaths) if there is no session cookie
  if (pathname.startsWith('/dashboard') && !session) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Only run middleware for these routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
