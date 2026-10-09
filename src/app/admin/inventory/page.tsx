'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Boxes,
  Plus,
  Minus,
  History,
  AlertTriangle,
  CheckCircle2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { ProductRecord, InventoryRecord, InventoryMovement } from '@/types/database';

export default function AdminInventoryPage() {
  const [inventoryList, setInventoryList] = useState<
    { product: ProductRecord; inventory: InventoryRecord }[]
  >([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  // Adjustment Modal
  const [adjustItem, setAdjustItem] = useState<{
    product: ProductRecord;
    inventory: InventoryRecord;
  } | null>(null);
  const [quantityChange, setQuantityChange] = useState<number>(1);
  const [movementType, setMovementType] = useState<string>('manual_adjustment');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [resInv, resMov] = await Promise.all([
        fetch('/api/admin/inventory'),
        fetch('/api/admin/inventory?view=movements'),
      ]);
      const dataInv = await resInv.json();
      const dataMov = await resMov.json();
      if (dataInv.inventory) setInventoryList(dataInv.inventory);
      if (dataMov.movements) setMovements(dataMov.movements);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustItem || !reason.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: adjustItem.product.id,
          quantityChange,
          movementType,
          reason,
        }),
      });

      if (res.ok) {
        setAdjustItem(null);
        setReason('');
        setQuantityChange(1);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Inventory & Warehouse
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time stock ledger with audit movement tracking and threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#17191d] p-1 rounded-xl border border-[#2c313a]">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'current'
                ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Current Stock Levels
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Movement Audit History
          </button>
        </div>
      </div>

      {activeTab === 'current' ? (
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Piece</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4 text-center">On Hand</th>
                  <th className="py-3 px-4 text-center">Reserved</th>
                  <th className="py-3 px-4 text-center">Available</th>
                  <th className="py-3 px-4 text-center">Threshold</th>
                  <th className="py-3 px-4">Health Status</th>
                  <th className="py-3 px-4 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c313a]/50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      Loading inventory...
                    </td>
                  </tr>
                ) : (
                  inventoryList.map(({ product, inventory }) => {
                    const available = Math.max(
                      0,
                      inventory.quantityOnHand - inventory.quantityReserved
                    );
                    const isLow = available <= inventory.lowStockThreshold;

                    return (
                      <tr key={product.id} className="hover:bg-[#1e2126]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#0f1012] border border-[#2c313a]">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-white">{product.name}</div>
                              <div className="text-[10px] text-neutral-400">
                                {product.primaryWood}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-300 font-medium">
                          {product.sku}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                          {inventory.quantityOnHand}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-neutral-400">
                          {inventory.quantityReserved}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#c89d66]">
                          {available}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono text-neutral-500">
                          {inventory.lowStockThreshold}
                        </td>

                        <td className="py-3.5 px-4">
                          {available === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Out of Stock</span>
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Optimal</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustItem({ product, inventory });
                              setQuantityChange(1);
                              setMovementType('manual_adjustment');
                              setReason('');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#1e2126] border border-[#2c313a] text-neutral-200 hover:text-white hover:border-[#c89d66] text-xs font-medium transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Movement Audit Ledger */
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#2c313a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#c89d66]" />
              <span className="text-xs font-bold text-white">Immutable Stock Audit Log</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {movements.length} recorded movements
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4 text-center">Qty After</th>
                  <th className="py-3 px-4">Reason / Reference</th>
                  <th className="py-3 px-4">Staff Member</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c313a]/50">
                {movements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-[#1e2126]/60">
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                      {new Date(mov.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">{mov.productName}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2126] text-neutral-300 border border-[#2c313a]">
                        {mov.movementType}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-mono font-bold ${
                        mov.quantityChange > 0
                          ? 'text-emerald-400'
                          : mov.quantityChange < 0
                          ? 'text-red-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-white font-medium">
                      {mov.quantityAfter}
                    </td>
                    <td className="py-3 px-4 text-neutral-300">{mov.reason || '—'}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-400">
                      {mov.performedByEmail || 'system'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAdjustSubmit}
            className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Adjust Stock Level</h3>
                <p className="text-xs text-[#c89d66] font-mono mt-0.5">
                  {adjustItem.product.name} ({adjustItem.product.sku})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#1e2126] border border-[#2c313a] text-xs flex justify-between">
              <span className="text-neutral-400">Current On Hand:</span>
              <span className="font-mono font-bold text-white">
                {adjustItem.inventory.quantityOnHand} units
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Quantity Change (+ or -) *
              </label>
              <input
                type="number"
                required
                value={quantityChange}
                onChange={(e) => setQuantityChange(Number(e.target.value) || 0)}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-sm text-white font-mono"
              />
              <span className="text-[10px] text-neutral-500 font-mono mt-1 block">
                Resulting stock: {Math.max(0, adjustItem.inventory.quantityOnHand + quantityChange)}{' '}
                units
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Movement Type *
              </label>
              <select
                value={movementType}
                onChange={(e) => setMovementType(e.target.value)}
                className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3.5 py-2 focus:border-[#c89d66]"
              >
                <option value="manual_adjustment">Manual Adjustment</option>
                <option value="purchase">Purchase / Restock</option>
                <option value="reservation">Client Order Reservation</option>
                <option value="release">Release Reservation</option>
                <option value="damaged">Damaged Timber / Defect</option>
                <option value="correction">Audit Count Correction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Reason / Justification *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2 dining tables seasoned and ready for dispatch"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setAdjustItem(null)}
                className="px-4 py-2 rounded-xl bg-[#1e2126] text-neutral-300 text-xs hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#c89d66] text-[#0f1012] text-xs font-bold hover:bg-[#b58952] disabled:opacity-50"
              >
                {submitting ? 'Recording...' : 'Record Movement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
