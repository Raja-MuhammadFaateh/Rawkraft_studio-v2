import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Package,
  ShoppingBag,
  Boxes,
  MessageSquareQuote,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  History,
  PhoneCall,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { getCurrentAdminUser } from '@/lib/auth/session';
import { dataRepository } from '@/lib/data/repository';

export default async function AdminOverviewPage() {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect('/admin/login');
  }

  const [products, orders, enquiries, inventory, auditLogs] = await Promise.all([
    dataRepository.getProducts(),
    dataRepository.getOrders(),
    dataRepository.getEnquiries(),
    dataRepository.getInventory(),
    dataRepository.getAuditLogs(8),
  ]);

  const totalRevenuePKR = orders.reduce((sum, o) => sum + o.totalPKR, 0);
  const lowStockCount = inventory.filter(
    (i) => i.inventory.trackInventory && i.inventory.quantityOnHand <= i.inventory.lowStockThreshold
  ).length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'processing');
  const newEnquiries = enquiries.filter((e) => e.status === 'new' || e.status === 'reviewing');

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <div className="text-[11px] font-mono text-[#c89d66] uppercase tracking-wider mb-1">
            Studio Operations Overview
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {user.fullName}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            RawKraft Studio central command: catalog, bespoke custom commissions, stock & AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Product</span>
          </Link>
          <Link
            href="/admin/inventory"
            className="px-4 py-2 bg-[#17191d] border border-[#2c313a] hover:border-[#c89d66] text-neutral-200 text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Boxes className="w-4 h-4 text-[#c89d66]" />
            <span>Stock Ledger</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Orders Revenue</span>
            <div className="p-2 rounded-lg bg-[#c89d66]/10 text-[#c89d66]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            PKR {totalRevenuePKR.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
            <span>{orders.length} total recorded orders</span>
            <span className="text-emerald-400 font-mono font-medium">
              {pendingOrders.length} active
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Catalog Items</span>
            <div className="p-2 rounded-lg bg-[#c89d66]/10 text-[#c89d66]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">{products.length} Pieces</div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
            <span>{products.filter((p) => p.status === 'active').length} active online</span>
            <span className="text-neutral-500 font-mono">
              {products.filter((p) => p.isSignature).length} signature
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Custom Projects</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            {enquiries.length} Enquiries
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
            <span>From /custom brief builder</span>
            <span className="text-emerald-400 font-mono font-medium">
              {newEnquiries.length} reviewing
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Inventory Health</span>
            <div
              className={`p-2 rounded-lg ${
                lowStockCount > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-white">
            {lowStockCount > 0 ? `${lowStockCount} Low Stock` : 'Healthy Stock'}
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1">
            <span>Threshold monitored</span>
            <Link
              href="/admin/inventory"
              className="text-[#c89d66] hover:underline font-mono text-[10px]"
            >
              Manage &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Enquiries & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Custom Project Requests */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Recent Custom Commissions
              </h2>
              <p className="text-xs text-neutral-400">Briefs created in the Custom Studio</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-[#c89d66] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {enquiries.slice(0, 3).map((enq) => (
              <div
                key={enq.id}
                className="p-3.5 rounded-xl bg-[#1e2126] border border-[#2c313a] flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{enq.customerName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      {enq.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {enq.furnitureType} • {enq.woodSpecies} • {enq.lengthInches}&quot;×{enq.widthInches}&quot;
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Est: PKR {enq.estimatedPricePKR.toLocaleString()} • {enq.customerCity}
                  </div>
                </div>

                <a
                  href={`https://wa.me/923317497444?text=Hi%20${encodeURIComponent(enq.customerName)},%20following%20up%20on%20your%20RawKraft%20Studio%20custom%20brief%20(${enq.enquiryNumber}).`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors flex-shrink-0"
                  title="Direct WhatsApp response"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Recent Client Orders</h2>
              <p className="text-xs text-neutral-400">Order inquiries placed on website</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#c89d66] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 3).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-[#1e2126] border border-[#2c313a] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-white">
                      {ord.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-300">• {ord.customerName}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {ord.items.length} item(s) • Total: PKR {ord.totalPKR.toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c89d66]/15 text-[#c89d66] border border-[#c89d66]/30">
                    {ord.orderStatus}
                  </span>
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    {ord.paymentStatus}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Audit Log Activity Stream */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#c89d66]" />
            <h2 className="font-serif text-lg font-bold text-white">Audit & Operations Stream</h2>
          </div>
          <Link href="/admin/activity" className="text-xs text-[#c89d66] hover:underline">
            Complete Audit Log &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[#2c313a]/50">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2126] text-neutral-400 border border-[#2c313a]">
                  {log.action}
                </span>
                <span className="text-neutral-300">
                  <strong className="text-white font-medium">{log.entity}</strong>{' '}
                  {log.entityId && <span className="font-mono text-[11px]">({log.entityId})</span>}
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.userEmail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
