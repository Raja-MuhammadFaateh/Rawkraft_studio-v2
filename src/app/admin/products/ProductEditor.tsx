'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Check,
  Upload,
  AlertCircle,
  Eye,
  Layers,
  Sparkles,
  Shield,
  Ruler,
  DollarSign,
  Package,
} from 'lucide-react';
import { ProductRecord, Category } from '@/types/database';

interface ProductEditorProps {
  initialProduct?: ProductRecord | null;
  isNew?: boolean;
}

export default function ProductEditor({ initialProduct, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('general');

  // Form State
  const [form, setForm] = useState<Partial<ProductRecord>>({
    name: initialProduct?.name || '',
    slug: initialProduct?.slug || '',
    sku: initialProduct?.sku || '',
    shortDescription: initialProduct?.shortDescription || '',
    fullDescription: initialProduct?.fullDescription || '',
    status: initialProduct?.status || 'draft',
    productType: initialProduct?.productType || 'made_to_order',
    pricePKR: initialProduct?.pricePKR ?? 0,
    salePricePKR: initialProduct?.salePricePKR,
    priceUSD: initialProduct?.priceUSD ?? 0,
    isQuoteOnly: initialProduct?.isQuoteOnly || false,
    categoryId: initialProduct?.categoryId || '',
    dimensions: initialProduct?.dimensions || '',
    weightKg: initialProduct?.weightKg,
    leadTimeWeeks: initialProduct?.leadTimeWeeks || '3-4 weeks',
    isCustomizable: initialProduct?.isCustomizable !== false,
    primaryWood: initialProduct?.primaryWood || 'Natural Sheesham Rosewood',
    availableWoods: initialProduct?.availableWoods || [
      'Natural Sheesham Rosewood',
      'American Walnut',
      'White Oak',
      'Golden Teak',
    ],
    primaryLegStyle: initialProduct?.primaryLegStyle || 'Matte Black Geometric Steel',
    availableLegStyles: initialProduct?.availableLegStyles || [
      'Matte Black Geometric Steel',
      'Spider Starburst Base',
      'Heavy U-Frames',
      'Brushed Brass Accent',
    ],
    hasResinOption: initialProduct?.hasResinOption || false,
    defaultResinColor: initialProduct?.defaultResinColor || 'None',
    availableResinColors: initialProduct?.availableResinColors || [
      'Deep Ocean Blue',
      'Emerald Forest Green',
      'Smoked Obsidian Black',
    ],
    imageUrl:
      initialProduct?.imageUrl ||
      'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    galleryImages: initialProduct?.galleryImages || [],
    inventory: initialProduct?.inventory || {
      id: '',
      productId: '',
      trackInventory: true,
      quantityOnHand: 2,
      quantityReserved: 0,
      lowStockThreshold: 1,
      createdAt: '',
      updatedAt: '',
    },
    aiSuitableRooms: initialProduct?.aiSuitableRooms || ['Living Room', 'Dining Room'],
    aiStyleTags: initialProduct?.aiStyleTags || ['Modern Organic', 'Live Edge'],
    aiSearchSummary: initialProduct?.aiSearchSummary || '',
    metaTitle: initialProduct?.metaTitle || '',
    metaDescription: initialProduct?.metaDescription || '',
    isSignature: initialProduct?.isSignature || false,
    isPopular: initialProduct?.isPopular || false,
  });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.categories) setCategories(d.categories);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleNameChange = (name: string) => {
    setForm((prev) => {
      const slug = isNew
        ? name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, name, slug };
    });
  };

  const handlePricePKRChange = (pricePKR: number) => {
    setForm((prev) => ({
      ...prev,
      pricePKR,
      priceUSD: Math.round(pricePKR / 280),
    }));
  };

  const handleSave = async (publishNow = false) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        id: initialProduct?.id,
        status: publishNow ? 'active' : form.status,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);

      if (isNew && data.product?.id) {
        router.push(`/admin/products/${data.product.id}`);
      }
    } catch (err: any) {
      setError(err?.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'general', label: '1. General' },
    { id: 'pricing', label: '2. Pricing' },
    { id: 'inventory', label: '3. Inventory' },
    { id: 'specs', label: '4. Specs' },
    { id: 'materials', label: '5. Materials & Finishes' },
    { id: 'customization', label: '6. Customization' },
    { id: 'media', label: '7. Media' },
    { id: 'seo', label: '8. SEO' },
    { id: 'ai', label: '9. AI Metadata' },
    { id: 'publishing', label: '10. Publishing' },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6 sticky top-16 bg-[#0b0c0e]/95 backdrop-blur z-20 pt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-[#17191d] border border-[#2c313a] text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {isNew ? 'Create New Masterpiece' : `Edit: ${form.name || 'Untitled Piece'}`}
            </h1>
            <p className="text-xs font-mono text-neutral-400">
              SKU: {form.sku || 'Auto-generated'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-4 py-2 rounded-xl bg-[#17191d] border border-[#2c313a] hover:border-[#c89d66] text-neutral-300 hover:text-white text-xs font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="px-5 py-2 rounded-xl bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-lg shadow-black/40"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publish to Store</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#2c313a] scrollbar-none">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveTab(sec.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === sec.id
                ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-[#17191d]'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* 1. General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              General Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  SKU Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3.5 py-2 focus:border-[#c89d66]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Short Description / Tagline
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Full Craft Story & Description
              </label>
              <textarea
                rows={4}
                value={form.fullDescription}
                onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* 2. Pricing */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Commercial & Pricing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Price in PKR *
                </label>
                <input
                  type="number"
                  required
                  value={form.pricePKR}
                  onChange={(e) => handlePricePKRChange(Number(e.target.value) || 0)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Sale Price in PKR (Optional)
                </label>
                <input
                  type="number"
                  value={form.salePricePKR || ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      salePricePKR: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Calculated USD (~$280/PKR)
                </label>
                <input
                  type="number"
                  readOnly
                  value={form.priceUSD}
                  className="w-full bg-[#1e2126]/60 border border-[#2c313a] text-neutral-400 rounded-xl px-3.5 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isQuoteOnly"
                checked={form.isQuoteOnly}
                onChange={(e) => setForm({ ...form, isQuoteOnly: e.target.checked })}
                className="w-4 h-4 rounded text-[#c89d66] focus:ring-0 bg-[#1e2126] border-[#2c313a]"
              />
              <label htmlFor="isQuoteOnly" className="text-xs text-neutral-300">
                Mark as &apos;Quote Only&apos; (Price hidden on public shop, prompts WhatsApp consultation)
              </label>
            </div>
          </div>
        )}

        {/* 3. Inventory */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Inventory & Warehouse
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Quantity On Hand
                </label>
                <input
                  type="number"
                  value={form.inventory?.quantityOnHand ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      inventory: {
                        ...(form.inventory as any),
                        quantityOnHand: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Quantity Reserved
                </label>
                <input
                  type="number"
                  value={form.inventory?.quantityReserved ?? 0}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      inventory: {
                        ...(form.inventory as any),
                        quantityReserved: Number(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  value={form.inventory?.lowStockThreshold ?? 1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      inventory: {
                        ...(form.inventory as any),
                        lowStockThreshold: Number(e.target.value) || 1,
                      },
                    })
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs text-neutral-400 bg-[#1e2126] p-4 rounded-xl border border-[#2c313a]">
              Available Stock ={' '}
              <span className="text-[#c89d66] font-mono font-bold">
                {Math.max(
                  0,
                  (form.inventory?.quantityOnHand ?? 0) - (form.inventory?.quantityReserved ?? 0)
                )}
              </span>{' '}
              units available for immediate dispatch.
            </div>
          </div>
        )}

        {/* 4. Specifications */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Physical Specifications & Lead Time
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Dimensions (L × W × H)
                </label>
                <input
                  type="text"
                  placeholder='e.g. 84" L x 38" W x 30" H'
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={form.weightKg || ''}
                  onChange={(e) =>
                    setForm({ ...form, weightKg: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Lead Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3 - 4 weeks"
                  value={form.leadTimeWeeks}
                  onChange={(e) => setForm({ ...form, leadTimeWeeks: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. Materials & Finishes */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Timber & Metal Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Primary Hardwood
                </label>
                <input
                  type="text"
                  value={form.primaryWood}
                  onChange={(e) => setForm({ ...form, primaryWood: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Primary Base / Leg Style
                </label>
                <input
                  type="text"
                  value={form.primaryLegStyle}
                  onChange={(e) => setForm({ ...form, primaryLegStyle: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. Customization */}
        {activeTab === 'customization' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Customization & Resin Inlay
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="hasResin"
                checked={form.hasResinOption}
                onChange={(e) => setForm({ ...form, hasResinOption: e.target.checked })}
                className="w-4 h-4 rounded text-[#c89d66] focus:ring-0 bg-[#1e2126] border-[#2c313a]"
              />
              <label htmlFor="hasResin" className="text-xs text-neutral-300 font-medium">
                Enable Epoxy Resin River / Inlay Options for this piece
              </label>
            </div>

            {form.hasResinOption && (
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Default Resin Color
                </label>
                <input
                  type="text"
                  value={form.defaultResinColor}
                  onChange={(e) => setForm({ ...form, defaultResinColor: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>
            )}
          </div>
        )}

        {/* 7. Media */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Product Imagery
            </h2>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Primary Image URL *
              </label>
              <input
                type="text"
                required
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            {form.imageUrl && (
              <div className="relative w-48 h-36 rounded-xl overflow-hidden border border-[#2c313a]">
                <Image src={form.imageUrl} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        )}

        {/* 8. SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Search Engine Optimization
            </h2>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* 9. AI Metadata */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              AI Knowledge & Search Metadata
            </h2>
            <p className="text-xs text-neutral-400">
              This structured data is consumed by RawKraft AI to accurately recommend this piece
              based on customer room dimensions and styling briefs.
            </p>
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                AI Search Summary
              </label>
              <textarea
                rows={2}
                value={form.aiSearchSummary}
                onChange={(e) => setForm({ ...form, aiSearchSummary: e.target.value })}
                placeholder="e.g. 8-seater live edge walnut dining table with spider base..."
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-3 text-xs text-white"
              />
            </div>
          </div>
        )}

        {/* 10. Publishing */}
        {activeTab === 'publishing' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Status & Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Publishing Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3.5 py-2 focus:border-[#c89d66]"
                >
                  <option value="draft">Draft (Admin Only)</option>
                  <option value="active">Active (Published Online)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Product Type
                </label>
                <select
                  value={form.productType}
                  onChange={(e) => setForm({ ...form, productType: e.target.value as any })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3.5 py-2 focus:border-[#c89d66]"
                >
                  <option value="made_to_order">Made to Order</option>
                  <option value="ready_stock">Ready Stock</option>
                  <option value="custom">Custom Service</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-2">
              <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSignature}
                  onChange={(e) => setForm({ ...form, isSignature: e.target.checked })}
                  className="w-4 h-4 rounded text-[#c89d66] bg-[#1e2126] border-[#2c313a]"
                />
                <span>Feature as Studio Signature Piece</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPopular}
                  onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded text-[#c89d66] bg-[#1e2126] border-[#2c313a]"
                />
                <span>Display &apos;Popular&apos; Badge</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
