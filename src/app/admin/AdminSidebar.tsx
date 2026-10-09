'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  BookmarkCheck,
  Boxes,
  ShoppingBag,
  Users,
  MessageSquareQuote,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Palette,
  Compass,
  Settings,
  ShieldAlert,
  History,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { AdminUser } from '@/types/auth';

interface AdminSidebarProps {
  user: AdminUser | null;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide sidebar completely on login page
  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
      group: 'Catalog',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Collections', href: '/admin/collections', icon: BookmarkCheck },
        { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
      ],
    },
    {
      group: 'Sales & Enquiries',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Custom Projects', href: '/admin/enquiries', icon: MessageSquareQuote },
        { label: 'AI Consultations', href: '/admin/ai', icon: Sparkles },
      ],
    },
    {
      group: 'Content & Studio',
      items: [
        { label: 'Homepage & CMS', href: '/admin/content', icon: FileText },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        { label: 'Theme & Styling', href: '/admin/appearance', icon: Palette },
        { label: 'Navigation', href: '/admin/navigation', icon: Compass },
      ],
    },
    {
      group: 'Administration',
      items: [
        { label: 'Business Settings', href: '/admin/settings', icon: Settings },
        { label: 'Team & Roles', href: '/admin/team', icon: ShieldAlert },
        { label: 'Audit Logs', href: '/admin/activity', icon: History },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-[#121316] border-r border-[#2c313a] flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Brand Banner */}
        <div className="h-20 px-6 border-b border-[#2c313a] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c89d66] to-[#7c5a41] flex items-center justify-center font-serif font-black text-sm text-[#0f1012]">
              RK
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white tracking-wider">
                RawKraft
              </span>
              <span className="block text-[9px] font-mono text-[#8e96a4] uppercase tracking-widest">
                Admin Atelier
              </span>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-1.5 rounded-lg bg-[#1e2126] border border-[#2c313a] text-neutral-400 hover:text-white"
            title="View Public Store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-160px)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="px-3 text-[10px] font-mono uppercase tracking-widest text-[#8e96a4] font-semibold mb-1">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#c89d66]/15 text-[#c89d66] border border-[#c89d66]/30 font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-[#1a1d22]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* User Session Footer */}
      {user && (
        <div className="p-4 border-t border-[#2c313a] bg-[#0e0f12]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1e2126] border border-[#2c313a] flex items-center justify-center text-xs font-mono font-bold text-[#c89d66]">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user.fullName}</div>
                <div className="text-[10px] text-[#c89d66] font-mono tracking-wider">
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
