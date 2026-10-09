import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const categories = await dataRepository.getCategories();
  return NextResponse.json({ categories });
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
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  const saved = await dataRepository.saveCategory(body);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'CATEGORY_SAVED',
    entity: 'category',
    entityId: saved.id,
    afterData: { name: saved.name },
  });

  return NextResponse.json({ success: true, category: saved });
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

  const success = await dataRepository.deleteCategory(id);
  if (success) {
    await dataRepository.logAudit({
      userEmail: user.email,
      action: 'CATEGORY_DELETED',
      entity: 'category',
      entityId: id,
    });
  }
  return NextResponse.json({ success });
}
