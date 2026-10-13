import { cookies } from 'next/headers';
import { AdminUser, AdminRole } from '@/types/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataRepository } from '@/lib/data/repository';
import { signSessionPayload, verifySessionToken, SessionPayload } from './crypto';

const SESSION_COOKIE_NAME = 'rawkraft_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Get current authenticated and verified admin user
 * Queries trusted database records to verify active status and current role.
 */
export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // 1. Check Supabase Auth session if configured
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.email) {
        // Must verify active membership from trusted team_members database table
        const member = await dataRepository.getTeamMemberByEmail(user.email);
        if (member && member.isActive) {
          return {
            id: user.id,
            email: user.email,
            fullName: member.fullName,
            role: member.role,
          };
        }
        // User exists in auth but has no active team membership -> reject
        return null;
      }
    }
  } catch (error) {
    // Supabase auth check failed or unconfigured, proceed to cryptographically signed session verification
  }

  // 2. Verify cryptographically signed session token
  if (sessionCookie) {
    const payload = verifySessionToken(sessionCookie);
    if (!payload || !payload.email) {
      return null;
    }

    // CRITICAL: Verify with trusted database records! Never trust the cookie role.
    const member = await dataRepository.getTeamMemberByEmail(payload.email);
    if (!member || !member.isActive) {
      return null;
    }

    return {
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      role: member.role, // Authoritative role from database
    };
  }

  return null;
}

/**
 * Set cryptographically signed session cookie
 */
export async function setAdminSession(user: AdminUser): Promise<void> {
  const cookieStore = await cookies();
  const now = Date.now();

  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    issuedAt: now,
    expiresAt: now + SESSION_MAX_AGE_SECONDS * 1000,
  };

  const signedToken = signSessionPayload(payload);

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: signedToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Securely clear the admin session cookie
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Guard utility for server components and API route handlers
 */
export async function requireAdminUser(
  allowedRoles?: AdminRole[]
): Promise<{ user: AdminUser | null; authorized: boolean }> {
  const user = await getCurrentAdminUser();

  if (!user) {
    return { user: null, authorized: false };
  }

  // OWNER always has full permissions
  if (user.role === 'OWNER') {
    return { user, authorized: true };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const authorized = allowedRoles.includes(user.role);
    return { user, authorized };
  }

  return { user, authorized: true };
}
