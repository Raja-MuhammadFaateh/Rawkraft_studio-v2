'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('rawkraft2025');
  };

  return (
    <div className="min-h-screen bg-[#0f1012] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#c89d66] to-[#7c5a41] flex items-center justify-center shadow-xl shadow-black/60 mx-auto">
            <span className="font-serif font-black text-2xl text-[#0f1012] tracking-tighter">
              RK
            </span>
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
              RawKraft Studio
            </h1>
            <p className="text-xs font-mono tracking-widest text-[#8e96a4] uppercase mt-1">
              Atelier Management System
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#17191d] border border-[#2c313a] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Sign In</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Enter your authorized studio email and password to access the management portal.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@rawkraftstudio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1e2126] border border-[#2c313a] focus:border-[#c89d66] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#c89d66] hover:bg-[#b58952] text-[#0f1012] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper Box */}
          <div className="mt-6 pt-5 border-t border-[#2c313a] space-y-2">
            <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c89d66]" />
              <span>Studio Access Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickCredentials('faateh2006@gmail.com')}
                className="p-2 rounded-lg bg-[#1e2126] hover:bg-[#252930] border border-[#2c313a] text-left transition-colors"
              >
                <div className="font-semibold text-white">Owner Account</div>
                <div className="text-[10px] text-neutral-400 truncate">faateh2006@gmail.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin@rawkraftstudio.com')}
                className="p-2 rounded-lg bg-[#1e2126] hover:bg-[#252930] border border-[#2c313a] text-left transition-colors"
              >
                <div className="font-semibold text-white">Studio Admin</div>
                <div className="text-[10px] text-neutral-400 truncate">admin@rawkraftstudio.com</div>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-500">
          <Link href="/" className="hover:text-neutral-300 transition-colors">
            ← Return to RawKraft Public Atelier
          </Link>
        </div>
      </div>
    </div>
  );
}
