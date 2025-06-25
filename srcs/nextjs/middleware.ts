import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAuthMiddleware } from '@/utils/thirdweb/middleware';

export async function middleware(request: NextRequest) {
  return await createAuthMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 