'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Save, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { ThemeSettings } from '@/types/database';

export default function AdminAppearancePage() {
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/theme')
      .then((r) => r.json())
      .then((d) => {
        if (d.theme) setTheme(d.theme);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save theme');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err?.message || 'Error updating theme settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !theme) {
    return <div className="py-12 text-center text-xs text-neutral-400">Loading styling palette...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Theme & Appearance</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Structured styling controls ensuring safe, injection-free luxury brand consistency.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-lg shadow-black/40"
        >
          {success ? (
            <>
              <Check className="w-4 h-4" />
              <span>Palette Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Validating...' : 'Save Theme'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colors Form */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#c89d66]" />
            <span>Brand Color System</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Primary Brand Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2c313a]"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 bg-[#1e2126] border border-[#2c313a] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Secondary Accent (Hover)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2c313a]"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 bg-[#1e2126] border border-[#2c313a] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Background Canvas
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2c313a]"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                  className="flex-1 bg-[#1e2126] border border-[#2c313a] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Surface & Navbar
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.surfaceColor}
                  onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-[#2c313a]"
                />
                <input
                  type="text"
                  value={theme.surfaceColor}
                  onChange={(e) => setTheme({ ...theme, surfaceColor: e.target.value })}
                  className="flex-1 bg-[#1e2126] border border-[#2c313a] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Live Sample */}
        <div className="space-y-6">
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2">
              Typography System
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Heading Font
                </label>
                <select
                  value={theme.headingFont}
                  onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2.5 focus:border-[#c89d66]"
                >
                  <option value="Playfair Display">Playfair Display (Default Luxe Serif)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Editorial Serif)</option>
                  <option value="Cinzel">Cinzel (Architectural Classic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Body Typography
                </label>
                <select
                  value={theme.bodyFont}
                  onChange={(e) => setTheme({ ...theme, bodyFont: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3 py-2.5 focus:border-[#c89d66]"
                >
                  <option value="Inter">Inter (Clean Modern Geometric)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                  <option value="System">System Neutral</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div
            className="p-6 rounded-2xl border shadow-2xl transition-all"
            style={{
              backgroundColor: theme.surfaceColor,
              borderColor: theme.borderColor,
              color: theme.textColor,
            }}
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-2">
              Live Atelier Preview
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: '#ffffff', fontFamily: theme.headingFont }}
            >
              Miro Live-Edge Walnut Slabs
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Handcrafted solid timber seasoned to 9% equilibrium and finished with pure organic
              hardwax oil.
            </p>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0f1012]"
              style={{ backgroundColor: theme.primaryColor }}
            >
              Order Signature Piece
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
