'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  Bot,
  User,
  SlidersHorizontal,
  PhoneCall,
  Loader2,
  Info,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function RawKraftAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **RawKraft Studio Design & Timber Consultant**.\n\nI can help you explore:\n• Sizing a dining table for your exact room dimensions\n• Comparing **Sheesham**, **American Walnut**, **White Oak**, and **Teak**\n• Epoxy resin care, heat resistance, and custom canyon tints\n• The story and options for our signature **Miro side table**\n• Our 3–4 week handcrafting process and nationwide crated delivery\n\nHow can I assist your bespoke project today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'Which wood is best for a dining table: Walnut or Sheesham?',
    'What size dining table do I need for 8 people?',
    'How do I care for and clean epoxy resin tables?',
    'Can I customize the Miro side table dimensions and finish?',
    'What is your typical production turnaround time?',
    'How does delivery and crate shipping work across Pakistan?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history: historyPayload }),
      });

      const data = await res.json();
      const reply = data.reply || 'Thank you for your inquiry. Please reach out to our workshop directly on WhatsApp at +92 331 7497444.';

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I apologize, but I could not reach the studio knowledge base at this moment. You can reach our artisans directly on WhatsApp at **+92 331 7497444** or build your brief in our Custom Studio.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Grounded Studio Consultant</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
          RawKraft AI Design & Sizing Advisor
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400">
          Ask questions about hardwoods, slab stability, dining room clearances, epoxy resin care,
          and custom commissions.
        </p>
      </div>

      {/* Main Chat Box */}
      <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
        {/* Top status bar */}
        <div className="px-6 py-4 border-b border-[#2c313a] bg-[#121316] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-[#c89d66] flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>RawKraft Studio AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                Official Knowledge Base • Pakistan Workshop
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/custom"
              className="hidden sm:flex items-center gap-1.5 text-neutral-400 hover:text-[#c89d66] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Custom Studio</span>
            </Link>
            <a
              href="https://wa.me/923317497444"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:underline"
            >
              <PhoneCall className="w-3 h-3" />
              <span>+92 331 7497444</span>
            </a>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#1e2126] border border-[#2c313a] flex items-center justify-center text-[#c89d66] flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#c89d66] text-[#0f1012] font-medium rounded-tr-none'
                      : 'bg-[#1e2126] text-neutral-200 border border-[#2c313a] rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <div>{msg.text}</div>
                  <div
                    className={`text-[9px] mt-1.5 font-mono text-right ${
                      isUser ? 'text-[#0f1012]/70' : 'text-neutral-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#c89d66]/20 border border-[#c89d66]/40 flex items-center justify-center text-[#c89d66] flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-xs text-neutral-400 italic">
              <div className="w-8 h-8 rounded-full bg-[#1e2126] border border-[#2c313a] flex items-center justify-center text-[#c89d66]">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#1e2126] px-4 py-2 rounded-xl border border-[#2c313a]">
                Consulting RawKraft studio specifications...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-[#2c313a]/60 bg-[#121316]/50 overflow-x-auto flex gap-2 scrollbar-none">
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
            <HelpCircle className="w-3 h-3" />
            <span>Suggested:</span>
          </span>
          {promptSuggestions.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#1e2126] border border-[#2c313a] text-neutral-300 hover:text-white hover:border-[#c89d66] transition-colors whitespace-nowrap flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 border-t border-[#2c313a] bg-[#121316] flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Ask about table sizing, Sheesham vs Walnut, Miro side table, epoxy resin..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-[#17191d] border border-[#2c313a] focus:border-[#c89d66] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-[#c89d66] text-[#0f1012] font-semibold hover:bg-[#b58952] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Grounding note */}
      <div className="mt-6 flex items-start gap-2 text-neutral-500 text-[11px] max-w-2xl mx-auto text-center justify-center">
        <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>
          RawKraft AI strictly cites verified facts from our studio catalog, kiln-seasoned hardwoods
          and resin specifications.
        </span>
      </div>
    </div>
  );
}
