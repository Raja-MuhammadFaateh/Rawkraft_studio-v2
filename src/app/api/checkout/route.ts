import { NextRequest, NextResponse } from 'next/server';
import { dataRepository } from '@/lib/data/repository';
import { checkRateLimit } from '@/lib/auth/crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // 1. Rate limiting (max 10 checkout submissions per 15 mins per IP)
    const rateCheck = checkRateLimit(`checkout:${ip}`, 10, 15 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      shippingAddress,
      notes,
      items,
      whatsappNotified,
    } = body;

    // 2. Strict Input Validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Customer name is required (minimum 2 characters)' },
        { status: 400 }
      );
    }

    if (!customerCity || typeof customerCity !== 'string' || customerCity.trim().length < 2) {
      return NextResponse.json(
        { error: 'Delivery city is required' },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim().length < 7) {
      return NextResponse.json(
        { error: 'A valid contact phone number is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (!item.productId || typeof item.productId !== 'string') {
        return NextResponse.json({ error: 'Each item must have a valid productId' }, { status: 400 });
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0 || item.quantity > 50) {
        return NextResponse.json({ error: 'Item quantity must be between 1 and 50' }, { status: 400 });
      }
    }

    // 3. Create Order with authoritative server pricing & stock reservation
    const order = await dataRepository.createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail?.trim() || undefined,
      customerCity: customerCity.trim(),
      shippingAddress: shippingAddress?.trim() || '',
      notes: notes?.trim() || undefined,
      whatsappNotified: Boolean(whatsappNotified),
      items: items.map((i) => ({
        productId: i.productId,
        quantity: Math.floor(i.quantity),
        customWood: typeof i.customWood === 'string' ? i.customWood : undefined,
        customLegs: typeof i.customLegs === 'string' ? i.customLegs : undefined,
        customResin: typeof i.customResin === 'string' ? i.customResin : undefined,
        customDimensions: typeof i.customDimensions === 'string' ? i.customDimensions : undefined,
      })),
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        totalPKR: order.totalPKR,
        subtotalPKR: order.subtotalPKR,
        shippingPKR: order.shippingPKR,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}
