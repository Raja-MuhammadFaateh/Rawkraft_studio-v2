'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  PhoneCall,
  ArrowRight,
  Shield,
  Ruler,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPKR,
    totalUSD,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#17191d] border border-[#2c313a] flex items-center justify-center text-[#c89d66] mx-auto mb-6">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-white mb-2">
          Your Inquiry Cart is Empty
        </h1>
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
          Browse our collection of solid hardwood live-edge dining tables, Miro accent tables, and
          epoxy river pieces, or configure a bespoke brief.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-xl bg-[#c89d66] text-[#0f1012] font-semibold text-xs uppercase tracking-wider hover:bg-[#b58952] transition-colors"
          >
            Explore Catalog
          </Link>
          <Link
            href="/custom"
            className="px-6 py-3 rounded-xl bg-[#17191d] border border-[#2c313a] text-neutral-300 hover:text-white hover:border-[#c89d66] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Custom Studio Builder
          </Link>
        </div>
      </div>
    );
  }

  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{ orderNumber: string; totalPKR: number } | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const notesWithCity = [
    customerCity ? `Delivery City: ${customerCity}` : '',
    orderNotes ? `Notes: ${orderNotes}` : '',
  ]
    .filter(Boolean)
    .join(' | ');

  const handleOrderSubmission = async (e?: React.MouseEvent) => {
    if (!customerName.trim() || !customerCity.trim() || !customerPhone.trim()) {
      if (e) e.preventDefault();
      setOrderError('Please provide your name, phone number, and city so our workshop can contact you.');
      return;
    }

    setOrderError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerCity: customerCity.trim(),
          notes: notesWithCity,
          whatsappNotified: true,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            customWood: i.wood,
            customLegs: i.legs,
            customResin: i.resinColor,
            customDimensions: i.customDimensions,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      setConfirmedOrder({
        orderNumber: data.order.orderNumber,
        totalPKR: data.order.totalPKR,
      });

      // Open WhatsApp with confirmed order reference
      const msg = `*RAWKRAFT STUDIO — ORDER INQUIRY [Ref: ${data.order.orderNumber}]*\n\n*Client:* ${customerName.trim()}\n*Phone:* ${customerPhone.trim()}\n*City:* ${customerCity.trim()}\n\n*Verified Total:* PKR ${data.order.totalPKR.toLocaleString()}\n${notesWithCity ? `\n*Notes:* ${notesWithCity}\n` : ''}\n_Hello RawKraft Workshop! I placed order ${data.order.orderNumber} on your website. Please share available timber slabs._`;
      const url = `https://wa.me/923317497444?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      setOrderError(err.message || 'Error creating order inquiry');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = generateWhatsAppOrderUrl(customerName, notesWithCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-[#2c313a] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#c89d66] mb-1">
            Review Selection
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Commission & Inquiry Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-neutral-500 hover:text-red-400 transition-colors underline self-start sm:self-auto"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#0f1012] flex-shrink-0 border border-[#2c313a]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                    {item.name}
                  </h3>
                  <div className="text-xs text-neutral-400 space-y-0.5">
                    <div>
                      <span className="text-neutral-500">Wood:</span>{' '}
                      <span className="text-neutral-200">{item.wood}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Base:</span>{' '}
                      <span className="text-neutral-200">{item.legs}</span>
                    </div>
                    {item.resinColor && (
                      <div>
                        <span className="text-neutral-500">Resin:</span>{' '}
                        <span className="text-cyan-400">{item.resinColor}</span>
                      </div>
                    )}
                    {item.customDimensions && (
                      <div className="flex items-center gap-1 text-[11px] text-[#c89d66]">
                        <Ruler className="w-3 h-3" />
                        <span>Custom: {item.customDimensions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#2c313a]">
                <div className="flex items-center border border-[#2c313a] rounded-lg bg-[#1e2126]">
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="p-1.5 text-neutral-400 hover:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-[#c89d66]">
                    PKR {(item.pricePKR * item.quantity).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    ~${item.priceUSD * item.quantity} USD
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.cartItemId)}
                  className="p-2 text-neutral-500 hover:text-red-400 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="p-4 rounded-xl bg-[#17191d]/60 border border-[#2c313a] text-xs text-neutral-400 flex items-center justify-between">
            <span>Need more pieces added to this order?</span>
            <Link href="/shop" className="text-[#c89d66] hover:underline font-medium">
              + Continue Browsing Collection
            </Link>
          </div>
        </div>

        {/* Right Inquiry Submission Card */}
        <div className="lg:col-span-4">
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-white border-b border-[#2c313a] pb-4">
              Inquiry Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-neutral-300">
                <span>Total Items:</span>
                <span className="font-mono text-white">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Estimated Production:</span>
                <span className="text-white">3 to 4 weeks</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Packing:</span>
                <span className="text-white">Reinforced Wooden Crate</span>
              </div>
              <div className="pt-3 border-t border-[#2c313a] flex justify-between items-baseline">
                <span className="font-medium text-white text-sm">Estimated Total:</span>
                <div className="text-right">
                  <div className="font-serif text-2xl font-bold text-[#c89d66]">
                    PKR {totalPKR.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">~${totalUSD} USD</div>
                </div>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3 pt-2 border-t border-[#2c313a]">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Contact Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +92 300 1234567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Destination City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multan, Islamabad, Lahore, Karachi"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Special Notes / Delivery Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Any floor level, specific grain pattern or wood stain nuance..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            {orderError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl">
                {orderError}
              </div>
            )}

            {confirmedOrder && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Order Reference Created: {confirmedOrder.orderNumber}</span>
                </div>
                <p className="text-xs text-emerald-200">
                  Total: PKR {confirmedOrder.totalPKR.toLocaleString()}. Our workshop has logged your reservation.
                </p>
              </div>
            )}

            {/* Direct WhatsApp Order Submission */}
            <button
              type="button"
              disabled={submitting}
              onClick={handleOrderSubmission}
              className="w-full py-4 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all hover:scale-[1.02]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{submitting ? 'Verifying & Reserving...' : 'Send Order Inquiry via WhatsApp'}</span>
            </button>

            <div className="p-3 bg-[#1e2126] rounded-xl border border-[#2c313a] space-y-1.5 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Next steps after sending WhatsApp inquiry:</span>
              </div>
              <p>
                1. Our workshop verifies timber slab availability and sends you live photos.
                <br />
                2. 50% deposit to confirm.
                <br />
                3. Video progress updates throughout production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
