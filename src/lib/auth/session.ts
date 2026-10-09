import { cookies } from 'next/headers';
import { AdminUser, AdminRole } from '@/types/auth';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const SESSION_COOKIE_NAME = 'rawkraft_admin_session';

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // 1. Try Supabase Auth session first if configured
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Query team_members role
        const { data: member } = await supabase
          .from('team_members')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (member) {
          return {
            id: user.id,
            email: user.email || member.email,
            fullName: member.full_name,
            role: member.role as AdminRole,
          };
        }
      }
    }
  } catch (error) {
    console.error('Error fetching Supabase auth user:', error);
  }

  // 2. Parse encrypted/signed cookie session
  if (sessionCookie) {
    try {
      const parsed = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8'));
      if (parsed && parsed.id && parsed.email && parsed.role) {
        return parsed as AdminUser;
      }
    } catch {
      // Invalid session
    }
  }

  return null;
}

export async function setAdminSession(user: AdminUser): Promise<void> {
  const cookieStore = await cookies();
  const serialized = Buffer.from(JSON.stringify(user)).toString('base64');

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: serialized,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAdminUser(
  allowedRoles?: AdminRole[]
): Promise<{ user: AdminUser | null; authorized: boolean }> {
  const user = await getCurrentAdminUser();

  if (!user) {
    return { user: null, authorized: false };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (user.role === 'OWNER') {
      return { user, authorized: true };
    }
    const authorized = allowedRoles.includes(user.role);
    return { user, authorized };
  }

  return { user, authorized: true };
}
