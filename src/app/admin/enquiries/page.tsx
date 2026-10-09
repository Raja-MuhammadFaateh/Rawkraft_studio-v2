'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Search,
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  X,
  Ruler,
  CheckCircle2,
} from 'lucide-react';
import { CustomProjectRequest, EnquiryStatus } from '@/types/database';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<CustomProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomProjectRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enquiries');
      const data = await res.json();
      if (data.enquiries) setEnquiries(data.enquiries);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (status: EnquiryStatus) => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedEnquiry(data.enquiry);
        setEnquiries((prev) => prev.map((e) => (e.id === data.enquiry.id ? data.enquiry : e)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Custom Project Enquiries
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Bespoke briefs submitted through the interactive Custom Studio builder.
          </p>
        </div>
      </div>

      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ref #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Archetype</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Wood & Resin</th>
                <th className="py-3 px-4">Estimate</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    Loading custom briefs...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    No custom briefs submitted yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => {
                      setSelectedEnquiry(enq);
                      setAdminNotes(enq.adminNotes || '');
                    }}
                    className="hover:bg-[#1e2126]/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#c89d66]">
                      {enq.enquiryNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{enq.customerName}</div>
                      <div className="text-[10px] text-neutral-400">{enq.customerCity}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-200 font-medium">
                      {enq.furnitureType}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">
                      {enq.lengthInches}&quot; × {enq.widthInches}&quot; × {enq.heightInches}&quot;
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-neutral-300">{enq.woodSpecies}</div>
                      <div className="text-[10px] text-neutral-500">{enq.resinOption}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      PKR {enq.estimatedPricePKR.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 uppercase">
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="p-1 rounded-lg text-neutral-400 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2c313a] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#c89d66] uppercase tracking-wider">
                  Bespoke Brief
                </span>
                <h2 className="font-serif text-2xl font-bold text-white">
                  {selectedEnquiry.enquiryNumber}
                </h2>
                <div className="text-xs text-neutral-400">
                  Received {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client & Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#1e2126] p-4 rounded-xl border border-[#2c313a]">
              <div>
                <span className="text-neutral-500 font-mono uppercase text-[10px]">Client</span>
                <div className="font-bold text-white text-sm mt-0.5">
                  {selectedEnquiry.customerName}
                </div>
                <div className="text-neutral-300 mt-1">{selectedEnquiry.customerCity}</div>
                {selectedEnquiry.customerPhone && (
                  <div className="text-neutral-400 mt-0.5">{selectedEnquiry.customerPhone}</div>
                )}
              </div>

              <div>
                <span className="text-neutral-500 font-mono uppercase text-[10px]">
                  Calculated Estimate
                </span>
                <div className="font-serif text-xl font-bold text-[#c89d66] mt-0.5">
                  PKR {selectedEnquiry.estimatedPricePKR.toLocaleString()}
                </div>
                <div className="text-neutral-400 mt-1">3 - 4 weeks production lead time</div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Archetype:</span>
                <span className="font-medium text-white">{selectedEnquiry.furnitureType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Timber Species:</span>
                <span className="font-medium text-white">{selectedEnquiry.woodSpecies}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Edge Contour:</span>
                <span className="font-medium text-white">{selectedEnquiry.edgeProfile}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Resin Inlay:</span>
                <span className="font-medium text-white">{selectedEnquiry.resinOption}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Base / Legs:</span>
                <span className="font-medium text-white">{selectedEnquiry.legStyle}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#2c313a]">
                <span className="text-neutral-400">Room Dimensions:</span>
                <span className="font-mono font-medium text-white">
                  {selectedEnquiry.lengthInches}&quot; L × {selectedEnquiry.widthInches}&quot; W ×{' '}
                  {selectedEnquiry.heightInches}&quot; H
                </span>
              </div>
            </div>

            {selectedEnquiry.customerNotes && (
              <div className="p-3 rounded-xl bg-[#1e2126] border border-[#2c313a] text-xs">
                <span className="text-neutral-400 font-mono text-[10px] uppercase block mb-1">
                  Client Blueprint / Notes
                </span>
                <p className="text-neutral-200">{selectedEnquiry.customerNotes}</p>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Internal Workshop Notes (Slab tags, warehouse availability):
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Slabs #W-41 and #W-42 selected for bookmatch pour..."
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl p-3 text-xs text-white"
              />
            </div>

            {/* Status Workflow */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-neutral-400 block">
                Update Status:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'new',
                    'reviewing',
                    'contacted',
                    'quoted',
                    'approved',
                    'rejected',
                    'completed',
                  ] as EnquiryStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(status)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all ${
                      selectedEnquiry.status === status
                        ? 'border-[#c89d66] bg-[#c89d66]/15 text-[#c89d66] font-bold'
                        : 'border-[#2c313a] bg-[#1e2126] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp reply button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/923317497444?text=Hi%20${encodeURIComponent(
                  selectedEnquiry.customerName
                )},%20RawKraft%20Studio%20master%20woodcrafters%20reviewing%20your%20custom%20brief%20(${selectedEnquiry.enquiryNumber}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Open WhatsApp Chat with Client</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
