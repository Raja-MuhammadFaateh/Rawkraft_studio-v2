'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, PhoneCall, Globe, Shield, Instagram, Facebook } from 'lucide-react';
import { SiteSettings } from '@/types/database';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) setSettings(d.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="py-12 text-center text-xs text-neutral-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Business & Store Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Global studio contacts, WhatsApp integration parameters, and SEO defaults.
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
              <span>Saved Settings!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business & Contact Details */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#c89d66]" />
            <span>Studio Identity & Contacts</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Studio Brand Name
              </label>
              <input
                type="text"
                value={settings.businessInfo.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, name: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Studio City / Region
              </label>
              <input
                type="text"
                value={settings.businessInfo.city}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, city: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={settings.businessInfo.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, whatsapp: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Studio Email
              </label>
              <input
                type="email"
                value={settings.businessInfo.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, email: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-[#c89d66]" />
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="text"
                value={settings.businessInfo.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, instagram: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-[#c89d66]" />
                <span>Facebook Profile URL</span>
              </label>
              <input
                type="text"
                value={settings.businessInfo.facebook}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessInfo: { ...settings.businessInfo, facebook: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Crated Shipping & Deposit Policy */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white border-b border-[#2c313a] pb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#c89d66]" />
            <span>Manufacturing & Shipping Policy</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Standard Lead Time
              </label>
              <input
                type="text"
                value={settings.shippingPolicy.leadTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingPolicy: { ...settings.shippingPolicy, leadTime: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Advance Deposit (%)
              </label>
              <input
                type="number"
                value={settings.shippingPolicy.depositPct}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingPolicy: {
                      ...settings.shippingPolicy,
                      depositPct: Number(e.target.value) || 50,
                    },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Delivery Scope
              </label>
              <input
                type="text"
                value={settings.shippingPolicy.deliveryScope}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    shippingPolicy: { ...settings.shippingPolicy, deliveryScope: e.target.value },
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
