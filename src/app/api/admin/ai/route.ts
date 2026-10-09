import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'AI_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const consultations = await dataRepository.getAIConsultations();
  return NextResponse.json({ consultations });
}
