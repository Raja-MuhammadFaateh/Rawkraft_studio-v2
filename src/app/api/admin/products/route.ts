import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get('status') || undefined;
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const type = searchParams.get('type') || undefined;

  const products = await dataRepository.getProducts({ status, category, search, type });
  return NextResponse.json({ products });
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

  try {
    const body = await req.json();

    // Server-side validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (typeof body.pricePKR !== 'number' || body.pricePKR < 0) {
      return NextResponse.json({ error: 'Valid price in PKR is required' }, { status: 400 });
    }

    const saved = await dataRepository.saveProduct(body, user.email);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}
