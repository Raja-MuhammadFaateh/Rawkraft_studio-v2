'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ProductRecord, Category } from '@/types/database';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Deletion modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (typeFilter !== 'all') params.set('type', typeFilter);

      const [resProd, resCat] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`),
        fetch('/api/admin/categories'),
      ]);

      const dataProd = await resProd.json();
      const dataCat = await resCat.json();

      if (dataProd.products) setProducts(dataProd.products);
      if (dataCat.categories) setCategories(dataCat.categories);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [statusFilter, categoryFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleDuplicate = async (product: ProductRecord) => {
    try {
      const duplicated = {
        ...product,
        id: undefined,
        name: `${product.name} (Copy)`,
        sku: `${product.sku}-COPY-${Math.floor(100 + Math.random() * 900)}`,
        slug: `${product.slug}-copy-${Math.floor(100 + Math.random() * 900)}`,
        status: 'draft' as const,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to duplicate:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & New Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Product Catalog</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Database-driven furniture master records, finishes, and specs.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-4 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by title, SKU, or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#c89d66]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Online</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#c89d66]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#c89d66]"
          >
            <option value="all">All Types</option>
            <option value="made_to_order">Made to Order</option>
            <option value="ready_stock">Ready Stock</option>
            <option value="custom">Custom Brief</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">SKU / Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    Loading studio catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#1e2126]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0f1012] border border-[#2c313a] flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white hover:text-[#c89d66] transition-colors">
                            <Link href={`/admin/products/${product.id}`}>{product.name}</Link>
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {product.primaryWood} • {product.dimensions}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-300 font-medium">
                      {product.sku}
                    </td>

                    <td className="py-3 px-4 text-neutral-300">
                      {product.categoryName || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#c89d66]">
                        PKR {product.pricePKR.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono">
                        ~${product.priceUSD} USD
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {product.inventory ? (
                        <div>
                          <span
                            className={`font-mono font-bold ${
                              product.inventory.quantityOnHand <=
                              product.inventory.lowStockThreshold
                                ? 'text-amber-400'
                                : 'text-neutral-200'
                            }`}
                          >
                            {product.inventory.quantityOnHand} on hand
                          </span>
                          <span className="text-[10px] text-neutral-400 block font-mono">
                            ({product.inventory.quantityReserved} reserved)
                          </span>
                        </div>
                      ) : (
                        <span className="text-neutral-500 font-mono">Untracked</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider font-semibold ${
                          product.status === 'active'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : product.status === 'draft'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#c89d66] hover:bg-neutral-800"
                          title="Duplicate product"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Product Confirmation</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you sure you want to permanently delete this product? This action cannot be
              undone and will remove associated inventory records.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-[#1e2126] text-neutral-300 text-xs font-medium hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
