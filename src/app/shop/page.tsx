'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { PRODUCTS, Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedWood, setSelectedWood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  React.useEffect(() => {
    fetch('/api/admin/products?status=active')
      .then((r) => r.json())
      .then((d) => {
        if (d.products && d.products.length > 0) {
          const mapped = d.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            tagline: p.shortDescription || p.name,
            category: p.categoryName?.toLowerCase().includes('coffee')
              ? 'coffee-side'
              : p.categoryName?.toLowerCase().includes('resin')
              ? 'resin-art'
              : p.categoryName?.toLowerCase().includes('desk')
              ? 'desks-consoles'
              : 'dining',
            categoryLabel: p.categoryName || 'Furniture Piece',
            pricePKR: p.pricePKR,
            priceUSD: p.priceUSD,
            image: p.imageUrl,
            dimensions: p.dimensions,
            defaultWood: p.primaryWood,
            availableWoods: p.availableWoods,
            defaultLegs: p.primaryLegStyle,
            availableLegs: p.availableLegStyles,
            resinOption: p.hasResinOption,
            resinDefaultColor: p.defaultResinColor,
            description: p.fullDescription || p.shortDescription,
            features: [
              `Solid timber: ${p.primaryWood}`,
              `Architectural base: ${p.primaryLegStyle}`,
              `Lead time: ${p.leadTimeWeeks}`,
            ],
            leadTimeWeeks: p.leadTimeWeeks,
            isSignature: p.isSignature,
            isPopular: p.isPopular,
          }));
          setProductList(mapped);
        }
      })
      .catch((e) => console.warn('Catalog dynamic sync:', e));
  }, []);

  const categories = [
    { id: 'all', label: 'All Furniture' },
    { id: 'dining', label: 'Dining Tables' },
    { id: 'coffee-side', label: 'Coffee & Side' },
    { id: 'desks-consoles', label: 'Consoles & Desks' },
    { id: 'resin-art', label: 'Resin River Art' },
  ];

  const woods = [
    { id: 'all', label: 'All Hardwoods' },
    { id: 'Sheesham', label: 'Sheesham (Rosewood)' },
    { id: 'Walnut', label: 'American Walnut' },
    { id: 'Oak', label: 'White Oak' },
    { id: 'Teak', label: 'Teak' },
  ];

  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }
      // Wood filter
      if (selectedWood !== 'all') {
        const matchesWood =
          product.defaultWood.toLowerCase().includes(selectedWood.toLowerCase()) ||
          product.availableWoods.some((w) => w.toLowerCase().includes(selectedWood.toLowerCase()));
        if (!matchesWood) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesTag = product.tagline.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTag) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
      // Default: signature first, then popular
      if (a.isSignature && !b.isSignature) return -1;
      if (!a.isSignature && b.isSignature) return 1;
      return 0;
    });
  }, [activeCategory, selectedWood, searchQuery, sortBy]);

  const hasActiveFilters = activeCategory !== 'all' || selectedWood !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setActiveCategory('all');
    setSelectedWood('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#2c313a] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#c89d66] mb-1.5 flex items-center gap-2">
              <span>Catalog & Collections</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Studio Furniture & Slabs
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Every piece shown can be crafted in your choice of seasoned timber species, custom
              dimensions, and base configuration.
            </p>
          </div>

          {/* Custom prompt banner */}
          <Link
            href="/custom"
            className="p-4 rounded-xl bg-gradient-to-r from-[#17191d] to-[#1e2126] border border-[#c89d66]/40 hover:border-[#c89d66] transition-all flex items-center gap-3 text-xs max-w-sm"
          >
            <div className="p-2 rounded-lg bg-[#c89d66]/15 text-[#c89d66]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Need Custom Dimensions?</div>
              <div className="text-neutral-400 text-[11px]">
                Build a bespoke brief for your exact room dimensions.
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#c89d66] text-[#0f1012] font-semibold shadow-md'
                  : 'bg-[#17191d] border border-[#2c313a] text-neutral-300 hover:text-white hover:border-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Wood Selector & Sorter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search table, miro, walnut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#17191d] border border-[#2c313a] focus:border-[#c89d66] rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Wood filter */}
            <select
              value={selectedWood}
              onChange={(e) => setSelectedWood(e.target.value)}
              className="bg-[#17191d] border border-[#2c313a] text-neutral-300 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-[#c89d66]"
            >
              {woods.map((wood) => (
                <option key={wood.id} value={wood.id} className="bg-[#17191d] text-white">
                  {wood.label}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#17191d] border border-[#2c313a] text-neutral-300 rounded-lg text-xs px-3 py-2 focus:outline-none focus:border-[#c89d66]"
            >
              <option value="featured" className="bg-[#17191d] text-white">
                Featured & Signature
              </option>
              <option value="price-asc" className="bg-[#17191d] text-white">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-[#17191d] text-white">
                Price: High to Low
              </option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-neutral-400 hover:text-[#c89d66] underline whitespace-nowrap pl-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Results */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#17191d] border border-[#2c313a] rounded-2xl p-8">
          <div className="w-12 h-12 rounded-full bg-[#1e2126] text-neutral-500 mx-auto flex items-center justify-center mb-4">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-white mb-2">No matching pieces found</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            We haven't found items matching your specific filters. However, we custom craft any
            piece to order in our Rawalpindi/Islamabad workshop.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-[#2c313a] hover:bg-neutral-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Clear All Filters
            </button>
            <Link
              href="/custom"
              className="px-4 py-2 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] rounded-lg text-xs font-semibold transition-colors"
            >
              Build Custom Brief
            </Link>
          </div>
        </div>
      )}

      {/* Need Help Banner */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-white mb-1">
            Need Wood Grain or Slab Sizing Advice?
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Our AI consultant is trained on RawKraft Studio’s timber stocks, dimensions, and epoxy
            rules.
          </p>
        </div>
        <Link
          href="/ai"
          className="px-5 py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-medium flex items-center gap-2 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask RawKraft AI</span>
        </Link>
      </div>
    </div>
  );
}
