import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/session';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import { dataRepository } from '@/lib/data/repository';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Magic bytes validation for safe images
function isValidImageSignature(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 12) return { valid: false, ext: '', mime: '' };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: 'jpg', mime: 'image/jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: 'png', mime: 'image/png' };
  }

  // WEBP: RIFF .... WEBP
  const isRiff =
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
  const isWebp =
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;
  if (isRiff && isWebp) {
    return { valid: true, ext: 'webp', mime: 'image/webp' };
  }

  return { valid: false, ext: '', mime: '' };
}

export async function POST(req: NextRequest) {
  const { user, authorized } = await requireAdminUser([
    'OWNER',
    'ADMIN',
    'CATALOG_MANAGER',
    'CONTENT_MANAGER',
  ]);
  if (!authorized || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed 10MB limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify magic bytes signature
    const signature = isValidImageSignature(buffer);
    if (!signature.valid) {
      return NextResponse.json(
        {
          error:
            'Invalid or unverified image file. Only valid JPEG, PNG, or WEBP images with matching signatures are accepted.',
        },
        { status: 400 }
      );
    }

    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${signature.ext}`;

    // 1. Upload to Supabase Storage if configured
    const supabase = createAdminSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('rawkraft-media')
          .upload(filename, buffer, {
            contentType: signature.mime,
            upsert: false,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('rawkraft-media')
            .getPublicUrl(filename);

          await dataRepository.logAudit({
            userEmail: user.email,
            action: 'MEDIA_UPLOADED',
            entity: 'media_asset',
            afterData: { path: filename, size: file.size, mime: signature.mime },
          });

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: signature.mime,
          });
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, using data URI fallback:', err);
      }
    }

    // In local dev without active Supabase Storage bucket, return base64 Data URL
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${signature.mime};base64,${base64Data}`;

    await dataRepository.logAudit({
      userEmail: user.email,
      action: 'MEDIA_UPLOADED_LOCAL',
      entity: 'media_asset',
      afterData: { name: file.name, size: file.size, mime: signature.mime },
    });

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: signature.mime,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload media asset' },
      { status: 500 }
    );
  }
}
