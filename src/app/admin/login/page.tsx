'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('이메일을 입력해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      document.cookie = `teamfit_admin_email=${encodeURIComponent(
        trimmedEmail
      )}; path=/; max-age=86400; SameSite=Lax`;

      const res = await fetch('/api/admin/knowledge', {
        headers: {
          'x-admin-email': trimmedEmail,
        },
      });

      if (res.status === 403) {
        router.push(`/admin/unauthorized?email=${encodeURIComponent(trimmedEmail)}`);
        return;
      }

      showToast('관리자 인증에 성공했습니다.', 'success');
      router.push(redirectTarget);
    } catch (err) {
      console.error(err);
      setErrorMessage('로그인 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemoAdmin = () => {
    setEmail('admin@teamfit.com');
    setPassword('admin1234!');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">관리자 전용 로그인</h1>
        <p className="text-xs text-slate-500">
          사전 허용된 이메일 계정(ADMIN_ALLOWED_EMAILS)만 접근 가능합니다.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">관리자 이메일</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@teamfit.com"
              required
              className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">비밀번호</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-200 text-base text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold shadow-md transition min-h-[44px] disabled:opacity-50"
        >
          <span>{isLoading ? '인증 확인 중...' : '관리자 계정으로 로그인'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
        <button
          type="button"
          onClick={handleUseDemoAdmin}
          className="text-xs text-indigo-600 hover:underline font-medium min-h-[44px] flex items-center"
        >
          [테스트용] 화이트리스트 관리자 계정 채우기
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="max-w-md mx-auto pt-8 sm:pt-12 pb-12 px-4">
      <Suspense fallback={<div className="text-center text-slate-500 py-8">로딩 중...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
