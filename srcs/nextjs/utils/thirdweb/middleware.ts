import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserVerificationData, isUserRegistered } from '@/lib/actions/user';
import { UserType, AdminRole } from '@/utils/types/healthcare';

// Define protected routes and their requirements
export const protectedRoutes = {
  '/admin': { requireAdmin: true, minRole: AdminRole.BASIC },
  '/admin/super': { requireAdmin: true, minRole: AdminRole.SUPER_ADMIN },
  '/admin/moderate': { requireAdmin: true, minRole: AdminRole.MODERATOR },
  '/patient': { requireUserType: UserType.PATIENT },
  '/hospital': { requireUserType: UserType.HOSPITAL },
  '/insurance': { requireUserType: UserType.INSURER },
  '/register': { requireWallet: true, blockRegistered: false }, // Allow access but will redirect if already registered
} as const;

export type RouteConfig = {
  requireAdmin?: boolean;
  minRole?: AdminRole;
  requireUserType?: UserType;
  requireWallet?: boolean;
  blockRegistered?: boolean;
};

export async function checkUserPermissions(
  walletAddress: string | null,
  config: RouteConfig
): Promise<{ allowed: boolean; redirectTo?: string; reason?: string }> {
  if (!walletAddress && config.requireWallet) {
    return {
      allowed: false,
      redirectTo: '/',
      reason: 'Wallet connection required'
    };
  }

  if (!walletAddress) {
    return { allowed: true }; // No restrictions for non-wallet routes
  }

  try {
    // First, do a quick check if user is registered at all
    const isRegistered = await isUserRegistered(walletAddress);

    // If user is not registered
    if (!isRegistered) {
      if (config.requireUserType !== undefined || config.requireAdmin) {
        return {
          allowed: false,
          redirectTo: '/register',
          reason: 'Registration required'
        };
      }
      return { allowed: true };
    }

    // If route blocks registered users (like registration page)
    if (config.blockRegistered) {
      // Need full user data to determine redirect path
      const userVerification = await getUserVerificationData(walletAddress);
      return {
        allowed: false,
        redirectTo: getUserDashboardPath(userVerification?.userType || null, userVerification?.isAdmin || false),
        reason: 'Already registered'
      };
    }

    // For other checks, we need full verification data
    const userVerification = await getUserVerificationData(walletAddress);
    
    if (!userVerification) {
      return {
        allowed: false,
        redirectTo: '/register',
        reason: 'User verification failed'
      };
    }

    // Check user type requirement
    if (config.requireUserType !== undefined && userVerification.userType !== config.requireUserType) {
      return {
        allowed: false,
        redirectTo: getUserDashboardPath(userVerification.userType || UserType.PATIENT, userVerification.isAdmin),
        reason: `Access denied: requires ${getUserTypeName(config.requireUserType)} role`
      };
    }

    // Check admin requirement
    if (config.requireAdmin && !userVerification.isAdmin) {
      return {
        allowed: false,
        redirectTo: getUserDashboardPath(userVerification.userType || UserType.PATIENT, userVerification.isAdmin),
        reason: 'Admin access required'
      };
    }

    // Check minimum admin role requirement
    if (config.minRole !== undefined && userVerification.adminRole !== undefined) {
      if (userVerification.adminRole < config.minRole) {
        return {
          allowed: false,
          redirectTo: '/admin',
          reason: `Insufficient admin privileges: requires ${getAdminRoleName(config.minRole)}`
        };
      }
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking user permissions:', error);
    return {
      allowed: false,
      redirectTo: '/',
      reason: 'Permission check failed'
    };
  }
}

export function getUserDashboardPath(userType: UserType | null, isAdmin: boolean): string {
  if (isAdmin) {
    return '/admin';
  }

  switch (userType) {
    case UserType.PATIENT:
      return '/patient';
    case UserType.HOSPITAL:
      return '/hospital';
    case UserType.INSURER:
      return '/insurance';
    default:
      return '/'; // Fallback for null or unknown user types
  }
}

export function getUserTypeName(userType: UserType): string {
  switch (userType) {
    case UserType.PATIENT:
      return 'Patient';
    case UserType.HOSPITAL:
      return 'Hospital';
    case UserType.INSURER:
      return 'Insurance Company';
    default:
      return 'Unknown';
  }
}

export function getAdminRoleName(role: AdminRole): string {
  switch (role) {
    case AdminRole.BASIC:
      return 'Basic Admin';
    case AdminRole.MODERATOR:
      return 'Moderator';
    case AdminRole.SUPER_ADMIN:
      return 'Super Admin';
    default:
      return 'Unknown Role';
  }
}

export function extractWalletAddress(request: NextRequest): string | null {
  // Try to get wallet address from different sources
  
  // 1. From authorization header (if using wallet-based auth)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // This would contain a JWT or signed message with wallet address
    // For now, we'll skip this implementation
  }

  // 2. From cookies (if wallet address is stored in cookies)
  const walletCookie = request.cookies.get('wallet_address');
  if (walletCookie?.value) {
    return walletCookie.value;
  }

  // 3. From URL parameters (not recommended for production)
  const url = new URL(request.url);
  const walletParam = url.searchParams.get('wallet');
  if (walletParam) {
    return walletParam;
  }

  return null;
}

export async function createAuthMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the current path is protected
  const matchedRoute = Object.entries(protectedRoutes).find(([route]) => 
    pathname.startsWith(route)
  );

  if (!matchedRoute) {
    return NextResponse.next();
  }

  const [, config] = matchedRoute;
  const walletAddress = extractWalletAddress(request);

  // Check permissions
  const permissionCheck = await checkUserPermissions(walletAddress, config);

  if (!permissionCheck.allowed) {
    const redirectUrl = new URL(permissionCheck.redirectTo || '/', request.url);
    
    // Add reason as query parameter for better UX
    if (permissionCheck.reason) {
      redirectUrl.searchParams.set('error', permissionCheck.reason);
    }

    // If coming from a protected route, add the original path for redirect after auth
    if (permissionCheck.redirectTo === '/register' || permissionCheck.redirectTo === '/') {
      redirectUrl.searchParams.set('redirect', pathname);
    }

    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}