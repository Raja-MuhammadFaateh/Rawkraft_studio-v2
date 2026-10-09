import { NextResponse } from 'next/server';
import { getCurrentAdminUser } from '@/lib/auth/session';
import { ROLE_PERMISSIONS } from '@/types/auth';

export async function GET() {
  try {
    const user = await getCurrentAdminUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return NextResponse.json({
      authenticated: true,
      user,
      permissions,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
