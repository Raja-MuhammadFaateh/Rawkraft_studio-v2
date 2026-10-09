import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const sections = await dataRepository.getPageSections();
  return NextResponse.json({ sections });
}

export async function PUT(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CONTENT_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id, ...updates } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Section id is required' }, { status: 400 });
  }

  const updated = await dataRepository.updatePageSection(id, updates);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'PAGE_SECTION_UPDATED',
    entity: 'page_section',
    entityId: id,
    afterData: updates,
  });

  return NextResponse.json({ success: true, section: updated });
}
