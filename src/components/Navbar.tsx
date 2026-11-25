'use client';

import React from 'react';
import Link from 'next/link';
import { Users2, ShieldCheck } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">TeamFit</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500">
              스마트 포트폴리오 허브
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded-lg transition min-h-[44px]"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>관리자</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
