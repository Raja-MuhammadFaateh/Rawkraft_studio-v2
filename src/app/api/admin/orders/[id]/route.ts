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
    'ORDERS_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const order = await dataRepository.getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'ORDERS_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { orderStatus, paymentStatus } = await req.json();
    const updated = await dataRepository.updateOrderStatus(
      id,
      orderStatus,
      paymentStatus,
      user.email
    );
    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update order status' },
      { status: 500 }
    );
  }
}
