import { NextResponse } from 'next/server';
import { getAuthSession, JWTPayload } from './auth';

export type UserRole = 'reader' | 'writer' | 'admin';

export interface RBACResult {
  authorized: boolean;
  user: JWTPayload | null;
  response?: NextResponse;
}

/**
 * Ensures request is from an authenticated user. Returns 401 Unauthorized if missing/invalid session.
 */
export async function requireAuth(): Promise<RBACResult> {
  const session = await getAuthSession();
  if (!session) {
    return {
      authorized: false,
      user: null,
      response: NextResponse.json(
        { error: 'Unauthorized. Please sign in to perform this action.' },
        { status: 401 }
      ),
    };
  }
  return { authorized: true, user: session };
}

/**
 * Ensures request is from an authenticated user possessing one of the allowed roles.
 * Returns 401 if unauthenticated, or 403 Forbidden if user lacks permitted role.
 */
export async function requireRole(...allowedRoles: UserRole[]): Promise<RBACResult> {
  const authRes = await requireAuth();
  if (!authRes.authorized || !authRes.user) {
    return authRes;
  }

  const userRole = authRes.user.role;
  if (!allowedRoles.includes(userRole)) {
    return {
      authorized: false,
      user: authRes.user,
      response: NextResponse.json(
        { error: `Forbidden. Role '${userRole}' does not have sufficient permissions.` },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user: authRes.user };
}
