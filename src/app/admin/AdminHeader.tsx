'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { AdminUser } from '@/types/auth';

interface AdminHeaderProps {
  user: AdminUser | null;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();

  // Hide top header on login page
  if (pathname === '/admin/login') {
    return null;
  }

  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumb = pathParts.map((part) =>
    part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
  );

  return (
    <header className="h-16 px-6 border-b border-[#2c313a] bg-[#121316]/90 backdrop-blur flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
        <span className="text-neutral-500">RawKraft Studio</span>
        {breadcrumb.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className="text-neutral-600">/</span>
            <span className={idx === breadcrumb.length - 1 ? 'text-[#c89d66] font-semibold' : ''}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/products/new"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2126] border border-[#2c313a] hover:border-[#c89d66] text-neutral-300 hover:text-white text-xs rounded-lg transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#c89d66]" />
          <span>Public Store</span>
        </Link>
      </div>
    </header>
  );
}
