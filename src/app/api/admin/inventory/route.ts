import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'ORDERS_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const view = searchParams.get('view');

  if (view === 'movements') {
    const movements = await dataRepository.getInventoryMovements();
    return NextResponse.json({ movements });
  }

  const inventory = await dataRepository.getInventory();
  return NextResponse.json({ inventory });
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'ORDERS_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { productId, quantityChange, movementType, reason } = body;

    if (!productId || typeof quantityChange !== 'number' || !movementType) {
      return NextResponse.json(
        { error: 'productId, numeric quantityChange, and movementType are required' },
        { status: 400 }
      );
    }

    const updated = await dataRepository.adjustStock(
      productId,
      quantityChange,
      movementType,
      reason || 'Admin manual adjustment',
      user.email
    );

    return NextResponse.json({ success: true, inventory: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to adjust inventory' },
      { status: 500 }
    );
  }
}
