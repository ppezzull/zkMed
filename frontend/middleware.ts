import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for the profile page
  if (request.nextUrl.pathname.startsWith('/profile')) {
    // Check for JWT cookie (thirdweb auth)
    const jwt = request.cookies.get('jwt');
    
    if (!jwt) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*']
}; 