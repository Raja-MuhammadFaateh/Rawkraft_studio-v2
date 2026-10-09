'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, ShoppingBag, Ruler, Check } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      pricePKR: product.pricePKR,
      priceUSD: product.priceUSD,
      image: product.image,
      wood: product.defaultWood,
      legs: product.defaultLegs,
      resinColor: product.resinOption ? product.resinDefaultColor : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative bg-[#17191d] border border-[#2c313a] hover:border-[#c89d66]/60 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 cursor-pointer flex flex-col justify-between"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] w-full bg-[#0f1012] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17191d] via-transparent to-transparent opacity-60" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {product.isSignature && (
              <span className="bg-[#c89d66] text-[#0f1012] font-semibold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow">
                Signature
              </span>
            )}
            {product.isPopular && !product.isSignature && (
              <span className="bg-[#1e2126]/90 backdrop-blur text-[#c89d66] text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-[#c89d66]/30">
                Popular
              </span>
            )}
          </div>

          {/* Hover overlay quick view button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              className="px-3.5 py-2 rounded-lg bg-[#0f1012]/90 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg border border-[#2c313a] hover:border-[#c89d66] transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#c89d66]" />
              <span>Customize & View</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mb-1">
              <span>{product.categoryLabel}</span>
              <span className="flex items-center gap-1">
                <Ruler className="w-3 h-3 text-[#c89d66]" />
                <span>{product.dimensions.split('(')[0]}</span>
              </span>
            </div>

            <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#c89d66] transition-colors mb-1">
              {product.name}
            </h3>

            <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
              {product.tagline}
            </p>

            <div className="text-[11px] text-neutral-400 bg-[#1e2126] px-2.5 py-1.5 rounded border border-[#2c313a] mb-4">
              <span className="text-neutral-400">Timber: </span>
              <span className="text-neutral-200 font-medium">{product.defaultWood}</span>
            </div>
          </div>

          {/* Pricing & Add to Cart */}
          <div className="pt-3 border-t border-[#2c313a] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#c89d66] text-base">
                PKR {product.pricePKR.toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                ~${product.priceUSD} USD
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickAdd}
              className={`p-2.5 rounded-lg border transition-all ${
                added
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-[#1e2126] border-[#2c313a] text-neutral-300 hover:text-white hover:border-[#c89d66] hover:bg-[#c89d66]/10'
              }`}
              title="Quick add with standard specs"
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <QuickViewModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
