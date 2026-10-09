'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FileText, Save, Check, Eye, EyeOff } from 'lucide-react';
import { PageSection } from '@/types/database';

export default function AdminContentPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((d) => {
        if (d.sections) setSections(d.sections);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (id: string, updates: Partial<PageSection>) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        setSections((prev) =>
          prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Homepage & CMS Sections
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Controlled content management for the public RawKraft Studio experience.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-neutral-400 text-xs">
            Loading page sections...
          </div>
        ) : (
          sections.map((section) => (
            <div
              key={section.id}
              className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-[#c89d66] font-bold uppercase">
                    [{section.sectionType}]
                  </span>
                  <h3 className="text-sm font-bold text-white">{section.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleUpdate(section.id, { isEnabled: !section.isEnabled })}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                      section.isEnabled
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {section.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{section.isEnabled ? 'Enabled' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSections((prev) =>
                        prev.map((s) => (s.id === section.id ? { ...s, title: val } : s))
                      );
                    }}
                    onBlur={(e) => handleUpdate(section.id, { title: e.target.value })}
                    className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Subtitle / Badge
                  </label>
                  <input
                    type="text"
                    value={section.subtitle || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSections((prev) =>
                        prev.map((s) => (s.id === section.id ? { ...s, subtitle: val } : s))
                      );
                    }}
                    onBlur={(e) => handleUpdate(section.id, { subtitle: e.target.value })}
                    className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                  Content Copy
                </label>
                <textarea
                  rows={2}
                  value={section.content || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSections((prev) =>
                      prev.map((s) => (s.id === section.id ? { ...s, content: val } : s))
                    );
                  }}
                  onBlur={(e) => handleUpdate(section.id, { content: e.target.value })}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Call To Action Label
                  </label>
                  <input
                    type="text"
                    value={section.ctaLabel || ''}
                    onBlur={(e) => handleUpdate(section.id, { ctaLabel: e.target.value })}
                    className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                    Call To Action Link
                  </label>
                  <input
                    type="text"
                    value={section.ctaUrl || ''}
                    onBlur={(e) => handleUpdate(section.id, { ctaUrl: e.target.value })}
                    className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
