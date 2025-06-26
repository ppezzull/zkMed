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
  '/register': { requireWallet: true, blockRegistered: true }, // Block registered users from accessing registration
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
  config: RouteConfig,
  pathname: string
): Promise<{ allowed: boolean; redirectTo?: string; reason?: string }> {
  // No wallet required routes (like home page)
  if (!config.requireWallet && !config.requireUserType && !config.requireAdmin) {
    return { allowed: true };
  }

  // No wallet connected but route requires one
  if (!walletAddress && (config.requireWallet || config.requireUserType || config.requireAdmin)) {
    return {
      allowed: false,
      redirectTo: '/',
      reason: 'Wallet connection required'
    };
  }

  if (!walletAddress) {
    return { allowed: true }; // Allow if no wallet required
  }

  try {
    // Get user verification data
    const userVerification = await getUserVerificationData(walletAddress);
    
    // Handle registration routes
    if (pathname.startsWith('/register') && config.blockRegistered) {
      if (userVerification?.isActive && userVerification.userType !== null) {
        // User is already registered, redirect to their dashboard
        const dashboardPath = getUserDashboardPath(userVerification.userType, userVerification.isAdmin, walletAddress);
        return {
          allowed: false,
          redirectTo: dashboardPath,
          reason: 'Already registered'
        };
      }
      // Allow access to registration for unregistered users
      return { allowed: true };
    }

    // Handle admin routes
    if (config.requireAdmin) {
      if (!userVerification?.isAdmin) {
        return {
          allowed: false,
          redirectTo: '/',
          reason: 'Admin access required'
        };
      }

      if (config.minRole && userVerification.adminRole !== undefined) {
        if (userVerification.adminRole < config.minRole) {
          return {
            allowed: false,
            redirectTo: '/admin',
            reason: 'Insufficient admin privileges'
          };
        }
      }

      return { allowed: true };
    }

    // Handle user type specific routes
    if (config.requireUserType) {
      if (!userVerification?.isActive || userVerification.userType !== config.requireUserType) {
        return {
          allowed: false,
          redirectTo: '/register',
          reason: 'User not registered or wrong user type'
        };
      }

      // Check if accessing correct user dashboard
      if (pathname.includes('/patient/') || pathname.includes('/hospital/') || pathname.includes('/insurance/')) {
        const addressFromPath = pathname.split('/').pop();
        if (addressFromPath && addressFromPath.toLowerCase() !== walletAddress.toLowerCase()) {
          return {
            allowed: false,
            redirectTo: getUserDashboardPath(userVerification.userType, userVerification.isAdmin, walletAddress),
            reason: 'Accessing wrong user dashboard'
          };
        }
      }

      return { allowed: true };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking user permissions:', error);
    return {
      allowed: false,
      redirectTo: '/',
      reason: 'Error checking permissions'
    };
  }
}

export function getUserDashboardPath(userType: UserType | null, isAdmin: boolean, walletAddress?: string): string {
  if (isAdmin) {
    return '/admin';
  }

  // Use provided wallet address or fall back to generic paths
  const addressPart = walletAddress || '[address]';

  switch (userType) {
    case UserType.PATIENT:
      return `/patient/${addressPart}`;
    case UserType.HOSPITAL:
      return `/hospital/${addressPart}`;
    case UserType.INSURER:
      return `/insurance/${addressPart}`;
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

  // 3. From URL parameters (for dashboard routes)
  const url = new URL(request.url);
  const { pathname } = url;
  
  // Extract wallet address from dashboard routes like /patient/0x123...
  const dashboardMatch = pathname.match(/\/(patient|hospital|insurance)\/([a-fA-F0-9x]+)/);
  if (dashboardMatch && dashboardMatch[2]) {
    return dashboardMatch[2];
  }

  // 4. From URL parameters (not recommended for production)
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
  const permissionCheck = await checkUserPermissions(walletAddress, config, pathname);

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

// Helper function to check registration status for client components
export async function checkUserRegistrationStatus(walletAddress: string) {
  try {
    const userVerification = await getUserVerificationData(walletAddress);
    
    return {
      isRegistered: userVerification?.isActive || false,
      userType: userVerification?.userType || null,
      isAdmin: userVerification?.isAdmin || false,
      dashboardPath: userVerification?.isActive 
        ? getUserDashboardPath(userVerification.userType, userVerification.isAdmin, walletAddress)
        : null
    };
  } catch (error) {
    console.error('Error checking user registration status:', error);
    return {
      isRegistered: false,
      userType: null,
      isAdmin: false,
      dashboardPath: null
    };
  }
}