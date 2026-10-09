import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const product = await dataRepository.getProductById(id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const saved = await dataRepository.saveProduct({ ...body, id }, user.email);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, authorized } = await requireAdminUser(['OWNER', 'ADMIN']);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const success = await dataRepository.deleteProduct(id, user.email);
  if (!success) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
