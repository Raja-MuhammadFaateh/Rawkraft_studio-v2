import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const collections = await dataRepository.getCollections();
  return NextResponse.json({ collections });
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: 'Collection name is required' }, { status: 400 });
  }

  const saved = await dataRepository.saveCollection(body);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'COLLECTION_SAVED',
    entity: 'collection',
    entityId: saved.id,
    afterData: { name: saved.name },
  });

  return NextResponse.json({ success: true, collection: saved });
}

export async function DELETE(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await dataRepository.deleteCollection(id);
  if (success) {
    await dataRepository.logAudit({
      userEmail: user.email,
      action: 'COLLECTION_DELETED',
      entity: 'collection',
      entityId: id,
    });
  }
  return NextResponse.json({ success });
}
