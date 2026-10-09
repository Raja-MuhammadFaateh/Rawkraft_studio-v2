import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'ORDERS_MANAGER',
    'AI_MANAGER',
    'VIEWER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const enquiries = await dataRepository.getEnquiries();
  return NextResponse.json({ enquiries });
}

export async function POST(req: NextRequest) {
  // Public or Admin can submit custom project enquiries
  try {
    const body = await req.json();
    const created = await dataRepository.createEnquiry(body);
    return NextResponse.json({ success: true, enquiry: created });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
