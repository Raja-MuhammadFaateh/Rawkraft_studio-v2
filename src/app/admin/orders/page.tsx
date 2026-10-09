'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ChevronRight, PhoneCall, Check, X } from 'lucide-react';
import { OrderRecord, OrderStatus, PaymentStatus } from '@/types/database';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderStatus: OrderStatus, paymentStatus?: PaymentStatus) => {
    if (!selectedOrder) return;
    setStatusUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Client Orders</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track inquiries, confirmed commissions, delivery milestones, and payment status.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-[#1e2126]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#c89d66]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{order.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">{order.customerCity}</td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      {order.items.length} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white font-mono">
                      PKR {order.totalPKR.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#c89d66]/15 text-[#c89d66] border border-[#c89d66]/30 uppercase">
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded-lg text-neutral-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Side Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c313a] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#c89d66] uppercase tracking-wider">
                  Order Details
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedOrder.orderNumber}
                </h2>
                <div className="text-xs text-neutral-400">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#1e2126] p-4 rounded-xl border border-[#2c313a]">
              <div>
                <span className="text-neutral-400 font-mono uppercase text-[10px]">Client</span>
                <div className="font-bold text-white text-sm mt-0.5">
                  {selectedOrder.customerName}
                </div>
                <div className="text-neutral-300 mt-1">{selectedOrder.customerPhone}</div>
                {selectedOrder.customerEmail && (
                  <div className="text-neutral-400">{selectedOrder.customerEmail}</div>
                )}
              </div>

              <div>
                <span className="text-neutral-400 font-mono uppercase text-[10px]">
                  Crated Delivery Destination
                </span>
                <div className="font-semibold text-white mt-0.5">{selectedOrder.customerCity}</div>
                <div className="text-neutral-400 mt-1">
                  {selectedOrder.shippingAddress || 'Address will be finalized before dispatch.'}
                </div>
              </div>
            </div>

            {/* Items Ordered */}
            <div>
              <h3 className="text-xs font-mono uppercase text-neutral-400 mb-2">Pieces</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#1e2126] border border-[#2c313a] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[11px] text-neutral-400">
                        {item.customWood} • {item.customLegs}
                        {item.customDimensions && ` • ${item.customDimensions}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-[#c89d66]">
                        PKR {item.totalPricePKR.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-[#2c313a] pt-3 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono">PKR {selectedOrder.subtotalPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Crated Freight:</span>
                <span className="font-mono">PKR {selectedOrder.shippingPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-[#2c313a]">
                <span>Total:</span>
                <span className="font-mono text-[#c89d66]">
                  PKR {selectedOrder.totalPKR.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Order Status Workflow Controls */}
            <div className="space-y-3 pt-2 border-t border-[#2c313a]">
              <label className="text-xs font-mono uppercase text-neutral-400 block">
                Update Production & Order Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'pending',
                    'confirmed',
                    'processing',
                    'ready',
                    'shipped',
                    'delivered',
                    'cancelled',
                  ] as OrderStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus(status)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all ${
                      selectedOrder.orderStatus === status
                        ? 'border-[#c89d66] bg-[#c89d66]/15 text-[#c89d66] font-bold'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp follow-up button */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/923317497444?text=Hi%20${encodeURIComponent(
                  selectedOrder.customerName
                )},%20updating%20you%20on%20RawKraft%20Studio%20order%20${selectedOrder.orderNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Message Client on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
