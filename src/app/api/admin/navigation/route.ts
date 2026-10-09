import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const navigation = await dataRepository.getNavigation();
  return NextResponse.json({ navigation });
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CONTENT_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.label || !body.url) {
    return NextResponse.json({ error: 'Label and URL are required' }, { status: 400 });
  }

  // Prevent unsafe javascript: URLs
  if (body.url.toLowerCase().startsWith('javascript:')) {
    return NextResponse.json({ error: 'Unsafe URL scheme prohibited' }, { status: 400 });
  }

  const saved = await dataRepository.saveNavigationItem(body);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'NAVIGATION_ITEM_SAVED',
    entity: 'navigation',
    entityId: saved.id,
    afterData: { label: saved.label, url: saved.url },
  });

  return NextResponse.json({ success: true, item: saved });
}

export async function DELETE(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CONTENT_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await dataRepository.deleteNavigationItem(id);
  return NextResponse.json({ success });
}
