import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'CONTENT_MANAGER',
    'ORDERS_MANAGER',
    'AI_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const limit = Number(req.nextUrl.searchParams.get('limit')) || 100;
  const logs = await dataRepository.getAuditLogs(limit);
  return NextResponse.json({ logs });
}
