'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldX, Home, LogIn } from 'lucide-react';
import { ADMIN_ACCESS_DENIED_MESSAGE } from '@/lib/admin-auth';

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const attemptedEmail = searchParams.get('email') || '';

  return (
    <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm text-center space-y-5">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-rose-600 tracking-wider uppercase">
          403 Forbidden • 접근 거부
        </span>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
          {ADMIN_ACCESS_DENIED_MESSAGE}
        </h1>
        {attemptedEmail && (
          <p className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
            로그인 시도 계정: {attemptedEmail}
          </p>
        )}
        <p className="text-xs text-slate-500 pt-1">
          본 페이지는 서버 환경 변수(ADMIN_ALLOWED_EMAILS)에 사전에 등록된 특정 관리자만 접속할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition min-h-[44px]"
        >
          <Home className="w-4 h-4" />
          <span>메인 페이지로 이동</span>
        </Link>
        <Link
          href="/admin/login"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition min-h-[44px]"
        >
          <LogIn className="w-4 h-4" />
          <span>다른 계정으로 로그인</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminUnauthorizedPage() {
  return (
    <div className="max-w-md mx-auto pt-12 pb-16 px-4">
      <Suspense fallback={<div className="text-center text-slate-500 py-8">로딩 중...</div>}>
        <UnauthorizedContent />
      </Suspense>
    </div>
  );
}
