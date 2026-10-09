import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'ORDERS_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const orders = await dataRepository.getOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  // Public or Admin can create orders
  try {
    const body = await req.json();
    const order = await dataRepository.createOrder(body);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
