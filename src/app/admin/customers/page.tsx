'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, PhoneCall, Mail, MapPin } from 'lucide-react';
import { OrderRecord } from '@/types/database';

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => {
        if (d.orders) setOrders(d.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  // Aggregate customers from orders
  const customers = Array.from(
    new Map(
      orders.map((o) => [
        o.customerPhone,
        {
          name: o.customerName,
          phone: o.customerPhone,
          email: o.customerEmail,
          city: o.customerCity,
          totalOrders: orders.filter((x) => x.customerPhone === o.customerPhone).length,
          totalSpend: orders
            .filter((x) => x.customerPhone === o.customerPhone)
            .reduce((s, x) => s + x.totalPKR, 0),
          lastOrder: o.orderNumber,
        },
      ])
    ).values()
  ).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Client Directory</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Overview of clients who have placed orders or commissioned custom furniture pieces.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by client name, city, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#17191d] border border-[#2c313a] focus:border-[#c89d66] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Total Orders</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4 text-right">Quick Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    Loading directory...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={i} className="hover:bg-[#1e2126]/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{c.name}</div>
                      {c.email && (
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{c.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">{c.phone}</td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-[#c89d66]" />
                        <span>{c.city}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {c.totalOrders}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#c89d66]">
                      PKR {c.totalSpend.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/923317497444?text=Hi%20${encodeURIComponent(
                          c.name
                        )},%20RawKraft%20Studio%20reaching%20out.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/60 text-xs transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
