import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const settings = await dataRepository.getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const { user, authorized } = await requireAdminUser(['OWNER', 'ADMIN']);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updates = await req.json();
  const updated = await dataRepository.updateSiteSettings(updates);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'SITE_SETTINGS_UPDATED',
    entity: 'site_settings',
    afterData: updates,
  });

  return NextResponse.json({ success: true, settings: updated });
}
