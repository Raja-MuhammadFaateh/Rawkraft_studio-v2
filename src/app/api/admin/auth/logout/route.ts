import { NextResponse } from 'next/server';
import { clearAdminSession, getCurrentAdminUser } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { dataRepository } from '@/lib/data/repository';

export async function POST() {
  try {
    const user = await getCurrentAdminUser();
    if (user) {
      await dataRepository.logAudit({
        userEmail: user.email,
        action: 'ADMIN_LOGOUT',
        entity: 'auth',
      });
    }

    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }

    await clearAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    await clearAdminSession();
    return NextResponse.json({ success: true });
  }
}
