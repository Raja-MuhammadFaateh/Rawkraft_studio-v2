import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const { user, authorized } = await requireAdminUser(['OWNER', 'ADMIN']);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const team = await dataRepository.getTeamMembers();
  return NextResponse.json({ team });
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser(['OWNER']);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized: Only OWNER can manage team members' }, { status: 403 });
  }

  const body = await req.json();
  if (!body.email || !body.fullName || !body.role) {
    return NextResponse.json({ error: 'email, fullName, and role are required' }, { status: 400 });
  }

  const saved = await dataRepository.saveTeamMember(body);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'TEAM_MEMBER_INVITED',
    entity: 'team_member',
    entityId: saved.id,
    afterData: { email: saved.email, role: saved.role },
  });

  return NextResponse.json({ success: true, member: saved });
}
