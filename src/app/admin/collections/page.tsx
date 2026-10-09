'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, BookmarkCheck, Check, X } from 'lucide-react';
import { Collection } from '@/types/database';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<Partial<Collection> | null>(null);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/collections');
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCol?.name) return;

    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCol),
      });

      if (res.ok) {
        setModalOpen(false);
        setEditingCol(null);
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;
    try {
      const res = await fetch(`/api/admin/collections?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Collections</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Curate thematic groups of pieces (e.g. Signature Atelier, Ocean & River Inlays).
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCol({
              name: '',
              slug: '',
              description: '',
              isActive: true,
              isFeatured: true,
              sortOrder: 1,
            });
            setModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-neutral-400 text-xs">
            Loading collections...
          </div>
        ) : (
          collections.map((col) => (
            <div
              key={col.id}
              className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div>
                {col.imageUrl && (
                  <div className="relative aspect-[16/9] w-full bg-[#0f1012]">
                    <Image src={col.imageUrl} alt={col.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191d] to-transparent opacity-80" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-[#c89d66] mb-1">
                    <span>Slug: {col.slug}</span>
                    {col.isFeatured && (
                      <span className="text-[10px] bg-[#c89d66]/15 text-[#c89d66] px-2 py-0.5 rounded border border-[#c89d66]/30">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-1.5">{col.name}</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">{col.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-[#2c313a] flex items-center justify-between text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    col.isActive
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {col.isActive ? 'Active' : 'Disabled'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCol(col);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(col.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && editingCol && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSave}
            className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCol.id ? 'Edit Collection' : 'Create Collection'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Collection Name *
              </label>
              <input
                type="text"
                required
                value={editingCol.name || ''}
                onChange={(e) =>
                  setEditingCol({
                    ...editingCol,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  })
                }
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={editingCol.slug || ''}
                onChange={(e) => setEditingCol({ ...editingCol, slug: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Banner Image URL
              </label>
              <input
                type="text"
                value={editingCol.imageUrl || ''}
                onChange={(e) => setEditingCol({ ...editingCol, imageUrl: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={editingCol.description || ''}
                onChange={(e) => setEditingCol({ ...editingCol, description: e.target.value })}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={editingCol.isFeatured}
                onChange={(e) => setEditingCol({ ...editingCol, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-[#c89d66] bg-[#1e2126] border-[#2c313a]"
              />
              <label htmlFor="isFeatured" className="text-xs text-neutral-300">
                Show as Featured Collection on Homepage
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#1e2126] text-neutral-300 text-xs hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#c89d66] text-[#0f1012] text-xs font-bold hover:bg-[#b58952]"
              >
                Save Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
