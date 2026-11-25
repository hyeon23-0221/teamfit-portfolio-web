import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'TeamFit & Smart Portfolio Hub | 조건부 조 편성기 & 포트폴리오 AI',
  description:
    'Union-Find 기반의 조건부(고정/분리) 조 편성 유틸리티와 Gemini Flash 기반 포트폴리오 전용 AI 챗봇이 결합된 모바일 최적화 웹 서비스',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full px-3.5 sm:px-4 py-4 sm:py-6">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
