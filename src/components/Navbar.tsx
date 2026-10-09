'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Sparkles, SlidersHorizontal, Menu, X, PhoneCall } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const { totalCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Shop Catalog', href: '/shop' },
    { label: 'Custom Studio', href: '/custom', icon: SlidersHorizontal },
    { label: 'RawKraft AI', href: '/ai', icon: Sparkles, badge: 'Advisor' },
    { label: 'Our Craft', href: '/#philosophy' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f1012]/90 backdrop-blur-md border-b border-[#2c313a]/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#c89d66] to-[#7c5a41] flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-xl text-[#0f1012] tracking-tighter">RK</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white uppercase group-hover:text-[#c89d66] transition-colors">
                RawKraft
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#8e96a4] uppercase font-mono">
                Studio • Handcrafted
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors flex items-center gap-1.5 py-1 ${
                    isActive
                      ? 'text-[#c89d66] border-b-2 border-[#c89d66]'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[#c89d66]" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-[#c89d66]/15 text-[#c89d66] px-1.5 py-0.5 rounded border border-[#c89d66]/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="https://wa.me/923317497444"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8e96a4] hover:text-white px-3 py-1.5 rounded border border-[#2c313a] hover:border-[#c89d66]/50 transition-colors"
              title="Chat directly on WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+92 331 7497444</span>
            </a>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-[#17191d] border border-[#2c313a] hover:border-[#c89d66] text-neutral-200 hover:text-white transition-all hover:scale-105"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c89d66] text-[#0f1012] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-[#17191d]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2c313a] bg-[#17191d] px-4 pt-4 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-[#c89d66]/10 text-[#c89d66] border border-[#c89d66]/30'
                    : 'text-neutral-300 hover:bg-[#1e2126] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {Icon && <Icon className="w-4 h-4 text-[#c89d66]" />}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-[#c89d66]/20 text-[#c89d66] px-2 py-0.5 rounded">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#2c313a]">
            <a
              href="https://wa.me/923317497444"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 rounded-lg text-sm font-medium"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Workshop: +92 331 7497444</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
