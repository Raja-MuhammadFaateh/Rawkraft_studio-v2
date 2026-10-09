'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'm1',
    name: 'miro-side-table-primary.jpg',
    url: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
    size: '1.2 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm2',
    name: 'grand-walnut-dining.jpg',
    url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    size: '2.4 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm3',
    name: 'emerald-resin-river.jpg',
    url: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    size: '1.8 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm4',
    name: 'obsidian-executive-desk.jpg',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
    size: '1.9 MB',
    type: 'image/jpeg',
  },
  {
    id: 'm5',
    name: 'fluted-nordic-console.jpg',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    size: '1.5 MB',
    type: 'image/jpeg',
  },
];

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to upload file');
      }

      const newItem: MediaItem = {
        id: `m-${Date.now()}`,
        name: data.fileName || file.name,
        url: data.url,
        size: `${(data.fileSize / 1024 / 1024).toFixed(2)} MB`,
        type: data.mimeType || file.type,
      };

      setMediaList((prev) => [newItem, ...prev]);
    } catch (err: any) {
      setError(err?.message || 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Media Library</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Secure asset repository with server-side magic-bytes signature verification.
          </p>
        </div>

        <label className="cursor-pointer px-4 py-2.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Validating...' : 'Upload Media Asset'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mediaList.map((item) => (
          <div
            key={item.id}
            className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            <div className="relative aspect-[4/3] w-full bg-[#0f1012]">
              <Image src={item.url} alt={item.name} fill className="object-cover" />
            </div>

            <div className="p-4 space-y-2">
              <div className="text-xs font-semibold text-white truncate" title={item.name}>
                {item.name}
              </div>
              <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between">
                <span>{item.size}</span>
                <span>{item.type}</span>
              </div>

              <button
                type="button"
                onClick={() => copyUrl(item.id, item.url)}
                className="w-full py-2 px-3 rounded-lg bg-[#1e2126] border border-[#2c313a] hover:border-[#c89d66] text-neutral-300 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Asset URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
