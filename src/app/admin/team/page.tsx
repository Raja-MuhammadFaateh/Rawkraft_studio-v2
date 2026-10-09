'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, UserPlus, Check, X, ShieldCheck } from 'lucide-react';
import { TeamMember, AdminRole } from '@/types/database';

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AdminRole>('CATALOG_MANAGER');
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (data.team) setTeam(data.team);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !fullName.trim()) return;

    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim(), role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add team member');

      setModalOpen(false);
      setEmail('');
      setFullName('');
      fetchTeam();
    } catch (err: any) {
      setError(err?.message || 'Error adding staff member');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">Team & Roles</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Role-based access control (RBAC) governing studio operations, inventory, and content.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto shadow-lg shadow-black/40"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    Loading team members...
                  </td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-[#1e2126]/60">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{member.fullName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-300">{member.email}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-[#c89d66]/15 text-[#c89d66] border border-[#c89d66]/30 font-bold uppercase">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          member.isActive
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {member.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400 font-mono text-[11px]">
                      {member.role === 'OWNER'
                        ? 'Unrestricted'
                        : member.role === 'ADMIN'
                        ? 'High Privilege'
                        : 'Scoped'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInvite}
            className="bg-[#17191d] border border-[#2c313a] rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#2c313a] pb-3">
              <h3 className="text-base font-bold text-white">Add Team Member</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <div className="text-xs text-red-400 font-mono">{error}</div>}

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Assigned RBAC Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full bg-[#1e2126] border border-[#2c313a] text-xs text-neutral-300 rounded-xl px-3.5 py-2 focus:border-[#c89d66]"
              >
                <option value="CATALOG_MANAGER">CATALOG_MANAGER (Products, Inventory, Media)</option>
                <option value="ORDERS_MANAGER">ORDERS_MANAGER (Orders, Custom Enquiries)</option>
                <option value="CONTENT_MANAGER">CONTENT_MANAGER (Homepage CMS, Theme, Nav)</option>
                <option value="AI_MANAGER">AI_MANAGER (AI Knowledge, Consultations)</option>
                <option value="ADMIN">ADMIN (Full Operational Access)</option>
                <option value="VIEWER">VIEWER (Read-Only Access)</option>
              </select>
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
                Invite Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
