import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { setAdminSession } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';
import { AdminUser, AdminRole } from '@/types/auth';
import { verifyPassword, checkRateLimit, resetRateLimit } from '@/lib/auth/crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Rate Limiting Check (5 attempts per 15 minutes per IP + email)
    const rateLimitKey = `login:${ip}:${cleanEmail}`;
    const rateCheck = checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      const waitMinutes = Math.ceil((rateCheck.resetAt - Date.now()) / (60 * 1000));
      return NextResponse.json(
        { error: `Too many failed login attempts. Please try again in ${waitMinutes} minutes.` },
        { status: 429 }
      );
    }

    // 2. Try Supabase Auth if configured
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.user) {
          // Verify team membership in database
          const member = await dataRepository.getTeamMemberByEmail(cleanEmail);

          if (!member || !member.isActive) {
            // Sign out from Supabase immediately if not an active team member
            await supabase.auth.signOut();
            return NextResponse.json(
              { error: 'Invalid email or password.' },
              { status: 401 }
            );
          }

          const user: AdminUser = {
            id: data.user.id,
            email: cleanEmail,
            fullName: member.fullName,
            role: member.role, // Authoritative role from team_members table
          };

          resetRateLimit(rateLimitKey);
          await setAdminSession(user);
          await dataRepository.logAudit({
            userEmail: cleanEmail,
            action: 'ADMIN_LOGIN_SUCCESS',
            entity: 'auth',
            afterData: { method: 'supabase_auth', role: user.role },
          });

          return NextResponse.json({ success: true, user });
        }
      } catch (err) {
        // Supabase sign-in failed, fall through to verified database credential verification
      }
    }

    // 3. Database Password Verification
    const member = await dataRepository.getTeamMemberByEmail(cleanEmail);

    if (member && member.isActive && member.passwordHash && member.salt) {
      const isValid = await verifyPassword(password, member.passwordHash, member.salt);

      if (isValid) {
        const user: AdminUser = {
          id: member.id,
          email: member.email,
          fullName: member.fullName,
          role: member.role,
        };

        resetRateLimit(rateLimitKey);
        await setAdminSession(user);
        await dataRepository.logAudit({
          userEmail: cleanEmail,
          action: 'ADMIN_LOGIN_SUCCESS',
          entity: 'auth',
          afterData: { role: member.role },
        });

        return NextResponse.json({ success: true, user });
      }
    }

    // Failed attempt logging
    await dataRepository.logAudit({
      userEmail: cleanEmail,
      action: 'ADMIN_LOGIN_FAILED',
      entity: 'auth',
      afterData: { ip },
    });

    // Constant-time generic error response to prevent user enumeration
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred.' },
      { status: 500 }
    );
  }
}
