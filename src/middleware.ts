import { NextRequest, NextResponse } from 'next/server';
import { isEmailWhitelisted } from './lib/admin-auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin (except /admin/login and /admin/unauthorized) and /api/admin/*
  const isAdminPage = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/unauthorized');
  const isAdminApi = pathname.startsWith('/api/admin');

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Check auth cookie: Supabase auth or demo admin session cookie
  // Supabase stores access tokens in cookies or custom header
  const authCookie = req.cookies.get('teamfit_admin_email')?.value;
  const authHeader = req.headers.get('x-admin-email');
  const userEmail = authCookie || authHeader;

  if (!userEmail) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check Whitelist
  if (!isEmailWhitelisted(userEmail)) {
    if (isAdminApi) {
      return NextResponse.json(
        {
          success: false,
          error: '접근 권한이 없습니다. 허용된 관리자 계정으로 로그인해 주세요.',
        },
        { status: 403 }
      );
    }
    const unauthorizedUrl = new URL('/admin/unauthorized', req.url);
    unauthorizedUrl.searchParams.set('email', userEmail);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
