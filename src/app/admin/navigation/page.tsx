'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Plus, Trash2, Check, ExternalLink, Link2 } from 'lucide-react';
import { NavigationItem } from '@/types/database';

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newLocation, setNewLocation] = useState<'header' | 'footer'>('header');
  const [newExternal, setNewExternal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNav = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/navigation');
      const data = await res.json();
      if (data.navigation) setItems(data.navigation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNav();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newLabel.trim() || !newUrl.trim()) return;

    if (newUrl.toLowerCase().startsWith('javascript:')) {
      setError('Unsafe javascript: URL is prohibited');
      return;
    }

    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: newLabel.trim(),
          url: newUrl.trim(),
          menuLocation: newLocation,
          isExternal: newExternal,
          isEnabled: true,
        }),
      });

      if (res.ok) {
        setNewLabel('');
        setNewUrl('');
        fetchNav();
      }
    } catch (err: any) {
      setError(err?.message || 'Error creating navigation link');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/navigation?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const headerItems = items.filter((i) => i.menuLocation === 'header');
  const footerItems = items.filter((i) => i.menuLocation === 'footer');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Navigation Menus
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure header and footer links with link validation and safety checks.
          </p>
        </div>
      </div>

      {/* Add New Link Card */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#c89d66]" />
          <span>Add Menu Item</span>
        </h2>

        {error && <div className="text-xs text-red-400 font-mono">{error}</div>}

        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Link Label
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bespoke Gallery"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Destination URL
            </label>
            <input
              type="text"
              required
              placeholder="/shop or https://..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
              Location
            </label>
            <select
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value as any)}
              className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2 focus:border-[#c89d66]"
            >
              <option value="header">Header Navigation</option>
              <option value="footer">Footer Navigation</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="isExt"
              checked={newExternal}
              onChange={(e) => setNewExternal(e.target.checked)}
              className="w-4 h-4 rounded text-[#c89d66] bg-[#1e2126] border-[#2c313a]"
            />
            <label htmlFor="isExt" className="text-xs text-neutral-300">
              Open in new tab
            </label>
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 rounded-xl bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Add Link
          </button>
        </form>
      </div>

      {/* Two columns for Header and Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Header Links */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="font-serif text-base font-bold text-white border-b border-[#2c313a] pb-2">
            Header Navigation ({headerItems.length})
          </h2>
          <div className="divide-y divide-[#2c313a]/50">
            {headerItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{item.label}</span>
                  <span className="font-mono text-[10px] text-neutral-400">{item.url}</span>
                  {item.isExternal && <ExternalLink className="w-3 h-3 text-[#c89d66]" />}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 shadow-xl space-y-3">
          <h2 className="font-serif text-base font-bold text-white border-b border-[#2c313a] pb-2">
            Footer Navigation ({footerItems.length})
          </h2>
          <div className="divide-y divide-[#2c313a]/50">
            {footerItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{item.label}</span>
                  <span className="font-mono text-[10px] text-neutral-400">{item.url}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
