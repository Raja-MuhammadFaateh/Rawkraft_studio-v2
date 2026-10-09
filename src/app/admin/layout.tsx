import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getCurrentAdminUser } from '@/lib/auth/session';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-invoke-path') || '';

  // Allow login page without layout wrapping or auth redirect
  const user = await getCurrentAdminUser();

  // If user is null and not accessing login page, redirect to /admin/login
  // Next.js handles route layouts hierarchically; we can inspect user
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-neutral-100 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
