import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

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
    const { status, adminNotes } = await req.json();
    const updated = await dataRepository.updateEnquiryStatus(
      id,
      status,
      adminNotes,
      user.email
    );
    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}
