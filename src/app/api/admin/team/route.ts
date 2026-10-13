import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const { user, authorized } = await requireAdminUser(['OWNER', 'ADMIN']);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const team = await dataRepository.getTeamMembers();
  // Strip password hash and salt from public output
  const safeTeam = team.map(({ passwordHash, salt, ...rest }) => rest);
  return NextResponse.json({ team: safeTeam });
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser(['OWNER']);
  if (!authorized || !user) {
    return NextResponse.json(
      { error: 'Forbidden: Only studio OWNER can add or invite team members' },
      { status: 403 }
    );
  }

  const body = await req.json();
  if (!body.email || !body.fullName || !body.role) {
    return NextResponse.json({ error: 'email, fullName, and role are required' }, { status: 400 });
  }

  const cleanEmail = body.email.trim().toLowerCase();
  const existing = await dataRepository.getTeamMemberByEmail(cleanEmail);
  if (existing) {
    return NextResponse.json(
      { error: 'A team member with this email address already exists' },
      { status: 409 }
    );
  }

  const saved = await dataRepository.saveTeamMember({
    ...body,
    email: cleanEmail,
    invitedBy: user.email,
  });

  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'TEAM_MEMBER_INVITED',
    entity: 'team_member',
    entityId: saved.id,
    afterData: { email: saved.email, role: saved.role },
  });

  const { passwordHash, salt, ...safeMember } = saved;
  return NextResponse.json({ success: true, member: safeMember });
}

export async function PATCH(req: NextRequest) {
  const { user, authorized } = await requireAdminUser(['OWNER']);
  if (!authorized || !user) {
    return NextResponse.json(
      { error: 'Forbidden: Only studio OWNER can modify team roles or status' },
      { status: 403 }
    );
  }

  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const existing = (await dataRepository.getTeamMembers()).find((m) => m.id === body.id);
  if (!existing) {
    return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
  }

  // Prevent demoting the last active OWNER
  if (existing.role === 'OWNER' && body.role && body.role !== 'OWNER') {
    const owners = (await dataRepository.getTeamMembers()).filter(
      (m) => m.role === 'OWNER' && m.isActive
    );
    if (owners.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot demote the only remaining active studio OWNER' },
        { status: 400 }
      );
    }
  }

  const updated = await dataRepository.saveTeamMember({
    ...existing,
    ...body,
    id: existing.id,
  });

  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'TEAM_MEMBER_UPDATED',
    entity: 'team_member',
    entityId: updated.id,
    beforeData: { role: existing.role, isActive: existing.isActive },
    afterData: { role: updated.role, isActive: updated.isActive },
  });

  const { passwordHash, salt, ...safeMember } = updated;
  return NextResponse.json({ success: true, member: safeMember });
}

export async function DELETE(req: NextRequest) {
  const { user, authorized } = await requireAdminUser(['OWNER']);
  if (!authorized || !user) {
    return NextResponse.json(
      { error: 'Forbidden: Only studio OWNER can remove team members' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const existing = (await dataRepository.getTeamMembers()).find((m) => m.id === id);
  if (!existing) {
    return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
  }

  if (existing.role === 'OWNER') {
    const owners = (await dataRepository.getTeamMembers()).filter(
      (m) => m.role === 'OWNER' && m.isActive
    );
    if (owners.length <= 1) {
      return NextResponse.json(
        { error: 'Cannot remove the only remaining active studio OWNER' },
        { status: 400 }
      );
    }
  }

  // Deactivate instead of hard deleting to preserve audit integrity
  await dataRepository.saveTeamMember({
    ...existing,
    isActive: false,
  });

  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'TEAM_MEMBER_DEACTIVATED',
    entity: 'team_member',
    entityId: existing.id,
    afterData: { email: existing.email },
  });

  return NextResponse.json({ success: true });
}
