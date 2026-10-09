'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Check, ShoppingBag, PhoneCall, Sparkles, Ruler, Shield, Layers } from 'lucide-react';
import { Product } from '@/lib/products';
import { useCart } from '@/context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [selectedWood, setSelectedWood] = useState<string>(product?.defaultWood || '');
  const [selectedLegs, setSelectedLegs] = useState<string>(product?.defaultLegs || '');
  const [selectedResin, setSelectedResin] = useState<string>(product?.resinDefaultColor || '');
  const [customDimensionNotes, setCustomDimensionNotes] = useState<string>('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const currentWood = selectedWood || product.defaultWood;
  const currentLegs = selectedLegs || product.defaultLegs;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      pricePKR: product.pricePKR,
      priceUSD: product.priceUSD,
      image: product.image,
      wood: currentWood,
      legs: currentLegs,
      resinColor: product.resinOption ? selectedResin || product.resinDefaultColor : undefined,
      customDimensions: customDimensionNotes || undefined,
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const getWhatsAppInquiryUrl = () => {
    const text = `Hi RawKraft Studio! I'm interested in the *${product.name}* (PKR ${product.pricePKR.toLocaleString()}).
• Wood finish: ${currentWood}
• Base/Legs: ${currentLegs}
${product.resinOption ? `• Resin style: ${selectedResin || product.resinDefaultColor}\n` : ''}${customDimensionNotes ? `• Custom sizing requirement: ${customDimensionNotes}\n` : ''}
Could you please share available slab photos and production timeline?`;
    return `https://wa.me/923317497444?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="relative bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0f1012]/80 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Column */}
        <div className="md:w-1/2 relative min-h-[300px] md:min-h-[500px] bg-[#0f1012]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#17191d] via-transparent to-transparent opacity-80 md:opacity-40" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.isSignature && (
              <span className="bg-[#c89d66] text-[#0f1012] font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded">
                Signature Piece
              </span>
            )}
            <span className="bg-[#0f1012]/80 backdrop-blur-sm text-neutral-300 text-xs px-2.5 py-1 rounded border border-neutral-700">
              {product.categoryLabel}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-xs text-neutral-300 bg-[#0f1012]/80 backdrop-blur-md p-3 rounded-lg border border-[#2c313a]">
            <div className="flex items-center gap-2 text-[#c89d66] font-medium mb-1">
              <Ruler className="w-3.5 h-3.5" />
              <span>Standard Size: {product.dimensions}</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              Every piece can be customized to your room dimensions.
            </p>
          </div>
        </div>

        {/* Product Details & Customizer Column */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1.5">
                {product.name}
              </h2>
              <p className="text-sm text-neutral-400 italic">{product.tagline}</p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-6 pb-4 border-b border-[#2c313a]">
              <span className="text-2xl font-bold text-[#c89d66]">
                PKR {product.pricePKR.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                (~${product.priceUSD} USD)
              </span>
              <span className="ml-auto text-xs bg-emerald-950/60 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800/40">
                Lead: {product.leadTimeWeeks}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Wood Selection */}
            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c89d66]" />
                <span>Wood Species:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.availableWoods.map((wood) => {
                  const isSelected = (selectedWood || product.defaultWood) === wood;
                  return (
                    <button
                      key={wood}
                      type="button"
                      onClick={() => setSelectedWood(wood)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium'
                          : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="truncate pr-1">{wood}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c89d66] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base / Leg Style */}
            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#c89d66]" />
                <span>Base & Frame:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.availableLegs.map((legs) => {
                  const isSelected = (selectedLegs || product.defaultLegs) === legs;
                  return (
                    <button
                      key={legs}
                      type="button"
                      onClick={() => setSelectedLegs(legs)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#c89d66] bg-[#c89d66]/10 text-white font-medium'
                          : 'border-[#2c313a] bg-[#1e2126] text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="truncate pr-1">{legs}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c89d66] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Custom Dimension Notes */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#c89d66]" />
                <span>Custom Dimensions (Optional):</span>
              </label>
              <input
                type="text"
                placeholder={`e.g. Standard is ${product.dimensions}, or custom e.g. 72" x 36"`}
                value={customDimensionNotes}
                onChange={(e) => setCustomDimensionNotes(e.target.value)}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#2c313a] flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c89d66] text-[#0f1012] hover:bg-[#b58952] active:scale-95'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Inquiry Cart</span>
                </>
              )}
            </button>

            <a
              href={getWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl font-medium text-sm bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60 flex items-center justify-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Slab Inquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
