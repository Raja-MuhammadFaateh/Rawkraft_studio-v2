'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { AuditLog } from '@/types/database';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/activity?limit=150')
      .then((r) => r.json())
      .then((d) => {
        if (d.logs) setLogs(d.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Audit & Activity Logs
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Immutable security event tracking capturing staff operations, state changes, and before/after diffs.
          </p>
        </div>

        <div className="text-[11px] font-mono text-[#c89d66] px-3 py-1.5 rounded-lg bg-[#17191d] border border-[#2c313a]">
          Append-Only Ledger
        </div>
      </div>

      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121316] border-b border-[#2c313a] text-neutral-400 font-mono uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4 text-right">State Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c313a]/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    Loading security audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    No activity recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasPayload = log.beforeData || log.afterData;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => hasPayload && setExpandedId(isExpanded ? null : log.id)}
                        className={`hover:bg-[#1e2126]/60 transition-colors ${
                          hasPayload ? 'cursor-pointer' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1e2126] text-[#c89d66] border border-[#2c313a] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white font-medium">
                          {log.entity}
                          {log.entityId && (
                            <span className="font-mono text-[10px] text-neutral-400 ml-1.5">
                              ({log.entityId})
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-neutral-300">{log.userEmail}</td>
                        <td className="py-3.5 px-4 text-right">
                          {hasPayload && (
                            <button
                              type="button"
                              className="text-neutral-400 hover:text-white inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>Diff</span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-[#121316]">
                          <td colSpan={5} className="p-4 border-b border-[#2c313a]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                              {log.beforeData && (
                                <div className="p-3 rounded-xl bg-[#17191d] border border-[#2c313a]">
                                  <div className="text-red-400 text-[10px] uppercase font-bold mb-1">
                                    Before State
                                  </div>
                                  <pre className="text-neutral-300 text-[11px] whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(log.beforeData, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {log.afterData && (
                                <div className="p-3 rounded-xl bg-[#17191d] border border-[#2c313a]">
                                  <div className="text-emerald-400 text-[10px] uppercase font-bold mb-1">
                                    After State / Payload
                                  </div>
                                  <pre className="text-neutral-300 text-[11px] whitespace-pre-wrap overflow-x-auto">
                                    {JSON.stringify(log.afterData, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
