import React from 'react';
import Link from 'next/link';
import { Phone, Shield, Sparkles, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0b0c0e] border-t border-[#2c313a] text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-sm bg-[#c89d66] flex items-center justify-center">
                <span className="font-serif font-black text-base text-[#0f1012]">RK</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-wider text-white uppercase">
                RawKraft
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Bespoke furniture atelier handcrafting heirloom solid wood slabs, live-edge artistry,
              crystal epoxy rivers, and precision matte-black architectural steel.
            </p>
            <div className="pt-2 flex items-center space-x-4">
              <a
                href="https://www.instagram.com/rawkraft_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#17191d] border border-[#2c313a] flex items-center justify-center text-neutral-300 hover:text-[#c89d66] hover:border-[#c89d66] transition-colors"
                aria-label="RawKraft Studio Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1J5U7xyPwT/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#17191d] border border-[#2c313a] flex items-center justify-center text-neutral-300 hover:text-[#c89d66] hover:border-[#c89d66] transition-colors"
                aria-label="RawKraft Studio Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923317497444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#17191d] border border-[#2c313a] flex items-center justify-center text-neutral-300 hover:text-emerald-400 hover:border-emerald-500 transition-colors"
                aria-label="RawKraft Studio WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#c89d66] font-semibold mb-4">
              Explore Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Furniture & Accents
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=dining" className="hover:text-white transition-colors">
                  Live Edge Dining Tables
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=coffee-side" className="hover:text-white transition-colors">
                  Miro & Coffee Tables
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=resin-art" className="hover:text-white transition-colors">
                  Resin River Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=desks-consoles" className="hover:text-white transition-colors">
                  Consoles & Executive Desks
                </Link>
              </li>
            </ul>
          </div>

          {/* Custom & AI Studio */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#c89d66] font-semibold mb-4">
              Bespoke Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/custom" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <span>Custom Studio Builder</span>
                </Link>
              </li>
              <li>
                <Link href="/ai" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Sparkles className="w-3.5 h-3.5 text-[#c89d66]" />
                  <span>RawKraft AI Advisor</span>
                </Link>
              </li>
              <li>
                <Link href="/#timber" className="hover:text-white transition-colors">
                  Hardwood Species & Finishes
                </Link>
              </li>
              <li>
                <Link href="/#guarantee" className="hover:text-white transition-colors">
                  Lifetime Structural Warranty
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Review Cart & Inquiry
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#c89d66] hover:text-[#b58952] font-mono tracking-wider transition-colors"
                >
                  <span>Staff Admin Portal &rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop Contact */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#c89d66] font-semibold mb-4">
              Studio & Workshop
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-neutral-400">
                <span className="font-semibold text-neutral-200">RawKraft Workshop:</span>
                <br />
                Rawalpindi / Islamabad, Pakistan
              </p>
              <p className="text-neutral-400">
                <span className="font-semibold text-neutral-200">Direct WhatsApp / Call:</span>
                <br />
                <a
                  href="https://wa.me/923317497444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  +92 331 7497444
                </a>
              </p>
              <div className="pt-2 p-3 rounded bg-[#17191d] border border-[#2c313a] text-xs text-neutral-400 flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#c89d66] flex-shrink-0 mt-0.5" />
                <span>Nationwide safe wooden crate shipping across Pakistan and international freight.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2c313a] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} RawKraft Studio. All rights reserved. Handcrafted in Pakistan.</p>
          <p className="font-mono text-[11px] tracking-wider text-neutral-400">
            SOLID WOOD • LIVE EDGE • RESIN • ARCHITECTURAL STEEL
          </p>
        </div>
      </div>
    </footer>
  );
}
