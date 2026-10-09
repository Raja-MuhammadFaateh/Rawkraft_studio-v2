'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Clock, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { AIConsultation } from '@/types/database';
import { RAWKRAFT_FAQ } from '@/lib/rawkraft-knowledge';

export default function AdminAIPage() {
  const [consultations, setConsultations] = useState<AIConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'consultations' | 'knowledge'>('consultations');

  useEffect(() => {
    fetch('/api/admin/ai')
      .then((r) => r.json())
      .then((d) => {
        if (d.consultations) setConsultations(d.consultations);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c313a] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            AI Consultations & Knowledge
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Monitor client consultations, audit grounding accuracy, and inspect studio policies.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#17191d] p-1 rounded-xl border border-[#2c313a]">
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'consultations'
                ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Consultation Logs ({consultations.length})
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'knowledge'
                ? 'bg-[#c89d66] text-[#0f1012] font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Studio Knowledge Base
          </button>
        </div>
      </div>

      {activeTab === 'consultations' ? (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              Loading AI consultation history...
            </div>
          ) : consultations.length === 0 ? (
            <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-12 text-center text-xs text-neutral-400">
              <Bot className="w-8 h-8 text-[#c89d66] mx-auto mb-3" />
              <div className="font-semibold text-white">No Consultations Logged Yet</div>
              <p className="text-neutral-400 max-w-sm mx-auto mt-1">
                As visitors interact with the RawKraft AI design consultant at /ai, conversations
                will be archived here.
              </p>
            </div>
          ) : (
            consultations.map((c) => (
              <div
                key={c.id}
                className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                      {c.sourceUsed}
                    </span>
                    <span className="text-neutral-400 font-mono text-[11px]">
                      Session: {c.sessionId}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#1e2126] border border-[#2c313a] text-xs">
                  <div className="text-neutral-500 font-mono text-[10px] uppercase mb-0.5">
                    User Question
                  </div>
                  <div className="font-semibold text-white">{c.userQuery}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#121316] border border-[#2c313a] text-xs">
                  <div className="text-[#c89d66] font-mono text-[10px] uppercase mb-0.5">
                    Studio AI Answer
                  </div>
                  <div className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                    {c.aiResponse}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Knowledge Base FAQs */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RAWKRAFT_FAQ.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-5 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#c89d66] mb-1">
                  <span>{faq.category.toUpperCase()}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Verified Policy</span>
                </div>
                <h3 className="font-semibold text-sm text-white mb-2">{faq.question}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="pt-3 border-t border-[#2c313a] flex flex-wrap gap-1.5">
                {faq.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2126] text-neutral-400"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
