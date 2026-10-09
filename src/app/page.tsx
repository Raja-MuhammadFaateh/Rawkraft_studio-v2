'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  Flame,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  SlidersHorizontal,
  Hammer,
} from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [selectedFinishTab, setSelectedFinishTab] = useState<'woods' | 'resins' | 'metals'>('woods');
  const signatureProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#2c313a]">
        {/* Background Image with dramatic gradient vignette */}
        <div className="absolute inset-0 bg-[#0f1012]">
          <Image
            src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=2000&q=85"
            alt="RawKraft Studio Live Edge Craftsmanship"
            fill
            priority
            className="object-cover opacity-35 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1012] via-[#0f1012]/75 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0f1012]/60 to-[#0f1012]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#17191d]/90 border border-[#c89d66]/40 text-[#c89d66] text-xs font-mono uppercase tracking-widest mb-8 shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Raw Wood • Crystal Epoxy Resin • Architectural Steel</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Where Raw Nature Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c89d66] via-[#e2be8f] to-[#b58952]">
              Surgical Craftsmanship
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-10">
            Bespoke solid hardwood furniture sculpted from generational Sheesham, American Walnut,
            White Oak, and crystal resin river slabs. Built to your exact room dimensions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c89d66] text-[#0f1012] font-semibold text-sm tracking-wider uppercase hover:bg-[#b58952] transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-[#c89d66]/15 hover:scale-[1.02]"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/custom"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#17191d] border border-[#2c313a] hover:border-[#c89d66] text-neutral-200 hover:text-white font-medium text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#c89d66]" />
              <span>Commission Custom Piece</span>
            </Link>

            <Link
              href="/ai"
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#17191d]/60 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Ask AI Consultant</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 pt-8 border-t border-[#2c313a]/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
            <div>
              <div className="font-serif text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-neutral-400 font-mono">Kiln-Dried Hardwood</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-white">82+ Shore D</div>
              <div className="text-xs text-neutral-400 font-mono">UV-Stable Resin</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-white">Bespoke</div>
              <div className="text-xs text-neutral-400 font-mono">Custom Dimensions</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-white">Lifetime</div>
              <div className="text-xs text-neutral-400 font-mono">Joinery Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Signature Spotlight & Featured Pieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#c89d66] mb-2 flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              <span>Handcrafted In Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Signature Creations
            </h2>
            <p className="text-neutral-400 text-sm mt-1 max-w-xl">
              From our acclaimed Miro side table to monolithic walnut live-edge dining tables and
              crystal river inlays.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-[#c89d66] hover:text-[#b58952] font-medium"
          >
            <span>View All Pieces</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. The Miro Side Table Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#17191d] to-[#1e2126] border border-[#2c313a] overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c89d66]/15 border border-[#c89d66]/30 text-[#c89d66] text-xs font-mono uppercase tracking-wider">
              Studio Icon
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              The Miro Side Table
            </h2>
            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Our iconic round accent piece featuring hand-selected natural solid hardwood and
              precision matte-black architectural steel. Clean geometric balance, organic natural
              grain lines, and customizable dimensions to suit any reading nook, lounge, or bedside.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d66]" />
                <span>Available in Sheesham, American Walnut, White Oak, or Golden Teak</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d66]" />
                <span>Hand-finished in non-toxic matte hardwax oil</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c89d66]" />
                <span>High-durability electrostatic matte-black powder coat</span>
              </li>
            </ul>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-xl bg-[#c89d66] text-[#0f1012] font-semibold text-xs uppercase tracking-wider hover:bg-[#b58952] transition-colors"
              >
                Order Miro Table
              </Link>
              <a
                href="https://wa.me/923317497444?text=Hi%20RawKraft%20Studio!%20I'd%20like%20to%20inquire%20about%20ordering%20the%20Miro%20Side%20Table."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#17191d] border border-[#2c313a] text-neutral-200 text-xs font-medium hover:border-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Slab Inquiry</span>
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 relative aspect-square sm:aspect-[4/3] w-full rounded-xl overflow-hidden shadow-2xl border border-[#2c313a]">
            <Image
              src="https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80"
              alt="Miro Side Table natural wood and matte black metal"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 right-4 bg-[#0f1012]/85 backdrop-blur px-3 py-1.5 rounded-lg border border-[#2c313a] text-xs font-mono text-[#c89d66]">
              PKR 28,500 (~$105 USD)
            </div>
          </div>
        </div>
      </section>

      {/* 4. Materials & Finishes Explorer */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-[#c89d66] mb-2 flex items-center justify-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Master Materials</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
            Pure Hardwood, Crystal Resin & Heavy Steel
          </h2>
          <p className="text-neutral-400 text-sm">
            We source responsibly seasoned timber slabs dried to 8-12% moisture equilibrium to
            ensure stability against climate fluctuations.
          </p>

          {/* Toggle buttons */}
          <div className="flex justify-center gap-2 mt-6 p-1 bg-[#17191d] rounded-xl border border-[#2c313a] max-w-sm mx-auto">
            <button
              onClick={() => setSelectedFinishTab('woods')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                selectedFinishTab === 'woods'
                  ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Hardwood Slabs
            </button>
            <button
              onClick={() => setSelectedFinishTab('resins')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                selectedFinishTab === 'resins'
                  ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Epoxy Resin Rivers
            </button>
            <button
              onClick={() => setSelectedFinishTab('metals')}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                selectedFinishTab === 'metals'
                  ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Architectural Bases
            </button>
          </div>
        </div>

        {selectedFinishTab === 'woods' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-2 w-12 bg-[#6c3b20] rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-1">Sheesham (Rosewood)</h3>
              <p className="text-xs text-[#c89d66] font-mono mb-3">Dalbergia sissoo</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Native to Pakistan. Dramatic contrast between golden sapwood and deep espresso
                heartwood. Tremendous natural rot-resistance and density.
              </p>
              <div className="text-[11px] text-neutral-500 font-mono">
                Best For: Dining tables, executive desks, consoles
              </div>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-2 w-12 bg-[#4a3424] rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-1">American Walnut</h3>
              <p className="text-xs text-[#c89d66] font-mono mb-3">Juglans nigra</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Rich chocolate-brown tones with purplish undertones and velvety straight-to-wavy
                graining. Exceptional dimensional stability.
              </p>
              <div className="text-[11px] text-neutral-500 font-mono">
                Best For: Modern statement tables, luxury suites
              </div>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-2 w-12 bg-[#b89980] rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-1">White Oak</h3>
              <p className="text-xs text-[#c89d66] font-mono mb-3">Quercus alba</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Bright Nordic grain with prominent medullary rays and cathedrals. Extremely hard,
                abrasion-resistant, clean modern aesthetic.
              </p>
              <div className="text-[11px] text-neutral-500 font-mono">
                Best For: Minimalist dining, fluted consoles
              </div>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-2 w-12 bg-[#9b765a] rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-1">Golden Teak</h3>
              <p className="text-xs text-[#c89d66] font-mono mb-3">Tectona grandis</p>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Silky oil-rich hardwood with golden amber luster. Inherent weather resilience and
                heirloom structural integrity.
              </p>
              <div className="text-[11px] text-neutral-500 font-mono">
                Best For: Wet bar tops, vanity counters, luxury dining
              </div>
            </div>
          </div>
        )}

        {selectedFinishTab === 'resins' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-cyan-600 rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">Deep Ocean Blue</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Translucent cyan-blue river pour with subtle mica shimmer simulating underwater
                ocean depth along natural wood edges.
              </p>
              <div className="text-[11px] text-[#c89d66] font-mono">UV-Stable • Shore D 82+</div>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-emerald-600 rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">Emerald Forest Jewel</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Rich jewel-tone green offering luxury depth. Buffed to 3000-grit piano gloss with
                zero internal bubbles.
              </p>
              <div className="text-[11px] text-[#c89d66] font-mono">100% Food Safe Cured</div>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-neutral-800 rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">Smoked Obsidian</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                Semi-transparent tinted black river. Subtle moodiness that reveals underlying wood
                bark contours when light passes through.
              </p>
              <div className="text-[11px] text-[#c89d66] font-mono">Heat-Resistant to 75°C</div>
            </div>
          </div>
        )}

        {selectedFinishTab === 'metals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-neutral-900 border border-neutral-700 rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Matte Black Powder Coat
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Heavy-gauge mild steel electrostatically coated and baked at 200°C for zero chip
                or peel. Our signature studio finish.
              </p>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-[#c89d66] rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Brushed Brass & Gold
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Hand-brushed metallic sheen sealed in clear acrylic lacquer to prevent tarnishing
                while offering refined European luxury.
              </p>
            </div>

            <div className="bg-[#17191d] p-6 rounded-xl border border-[#2c313a]">
              <div className="h-3 w-16 bg-neutral-600 rounded mb-4" />
              <h3 className="font-serif text-lg font-bold text-white mb-2">
                Raw Industrial Steel
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Visible ground welds and raw mill scale coated in ultra-matte protective clear
                sealant. Perfect for industrial loft aesthetics.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. 4-Step Custom Commission Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-8 sm:p-12 lg:p-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-[#c89d66] mb-2">
              Bespoke Commission Flow
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
              How We Build Your One-of-a-Kind Piece
            </h2>
            <p className="text-neutral-400 text-sm">
              We guide you from initial room measurements to raw timber slab selection and final
              white-glove delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#c89d66]/15 border border-[#c89d66]/40 flex items-center justify-center text-[#c89d66] font-mono font-bold text-lg">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Dimension & Brief</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Use our Custom Studio Builder to specify your room dimensions, target seating, wood
                preference, and resin style.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#c89d66]/15 border border-[#c89d66]/40 flex items-center justify-center text-[#c89d66] font-mono font-bold text-lg">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Live Slab Selection</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We share real-time HD photos and 4K videos of unworked raw timber slabs available in
                the studio for your personal blessing.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#c89d66]/15 border border-[#c89d66]/40 flex items-center justify-center text-[#c89d66] font-mono font-bold text-lg">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Artisan Handcrafting</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Multi-layer slow epoxy pour, precision TIG steel frame welding, progressive sanding
                up to 3000 grit, and natural oil sealing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#c89d66]/15 border border-[#c89d66]/40 flex items-center justify-center text-[#c89d66] font-mono font-bold text-lg">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Crated Safe Delivery</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Protected in reinforced shock-absorbent wooden crates, dispatched nationwide across
                Pakistan with full transit coverage.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#c89d66] text-[#0f1012] font-semibold text-xs tracking-wider uppercase hover:bg-[#b58952] transition-colors"
            >
              <span>Start Your Custom Commission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. AI Consultant Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#17191d] via-[#1a1528] to-[#12131a] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-purple-950/60 border border-purple-700/40 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Studio AI Advisor</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white">
              Need Sizing Advice or Timber Comparison?
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Our studio AI consultant can help you calculate the exact dining table length for your
              room, compare Sheesham vs American Walnut durability, and advise on resin heat care.
            </p>
          </div>

          <Link
            href="/ai"
            className="px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center gap-2 transition-colors flex-shrink-0 shadow-lg shadow-purple-900/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Consult RawKraft AI</span>
          </Link>
        </div>
      </section>

      {/* 7. Direct Contact / Studio Guarantee */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-[#2c313a] pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-neutral-300">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#17191d] border border-[#2c313a] text-[#c89d66]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white mb-1">
                Lifetime Structural Guarantee
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every mortise, tenon, and steel weld is backed by our studio commitment against
                structural degradation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#17191d] border border-[#2c313a] text-[#c89d66]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white mb-1">
                Kiln-Seasoned Hardwoods
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We test moisture saturation to 8-12% equilibrium before any cut or resin pour,
                eliminating post-delivery cracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#17191d] border border-[#2c313a] text-emerald-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white mb-1">
                Direct WhatsApp Support
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Connect directly with our master woodworkers at{' '}
                <a
                  href="https://wa.me/923317497444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline font-mono"
                >
                  +92 331 7497444
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
