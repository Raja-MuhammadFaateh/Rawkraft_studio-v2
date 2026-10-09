import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  const theme = await dataRepository.getThemeSettings();
  return NextResponse.json({ theme });
}

export async function PUT(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CONTENT_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const updates = await req.json();

  // Validate hex colors to prevent CSS injection
  const hexColorRegex = /^#([0-9A-Fa-f]{3}){1,2}$/;
  const colorKeys = [
    'primaryColor',
    'secondaryColor',
    'backgroundColor',
    'surfaceColor',
    'cardColor',
    'borderColor',
    'textColor',
    'mutedTextColor',
  ];

  for (const key of colorKeys) {
    if (updates[key] && !hexColorRegex.test(updates[key])) {
      return NextResponse.json(
        { error: `Invalid color format for ${key}. Expected hex format (e.g. #c89d66).` },
        { status: 400 }
      );
    }
  }

  const updated = await dataRepository.updateThemeSettings(updates);
  await dataRepository.logAudit({
    userEmail: user.email,
    action: 'THEME_UPDATED',
    entity: 'theme_settings',
    entityId: updated.id,
    afterData: updates,
  });

  return NextResponse.json({ success: true, theme: updated });
}
