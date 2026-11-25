import { NextRequest, NextResponse } from 'next/server';
import { isEmailWhitelisted, ADMIN_ACCESS_DENIED_MESSAGE } from '@/lib/admin-auth';
import { getKnowledgeData, updateKnowledgeData } from '@/lib/knowledge-store';

function checkAdminAuth(req: NextRequest): { authorized: boolean; email?: string } {
  const cookieEmail = req.cookies.get('teamfit_admin_email')?.value;
  const headerEmail = req.headers.get('x-admin-email');
  const email = cookieEmail || headerEmail;

  if (!email || !isEmailWhitelisted(email)) {
    return { authorized: false, email: email || undefined };
  }

  return { authorized: true, email };
}

export async function GET(req: NextRequest) {
  const { authorized } = checkAdminAuth(req);
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: ADMIN_ACCESS_DENIED_MESSAGE },
      { status: 403 }
    );
  }

  const data = getKnowledgeData();
  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(req: NextRequest) {
  const { authorized } = checkAdminAuth(req);
  if (!authorized) {
    return NextResponse.json(
      { success: false, error: ADMIN_ACCESS_DENIED_MESSAGE },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const updated = updateKnowledgeData(body);
    return NextResponse.json({
      success: true,
      message: '지식 베이스가 성공적으로 저장되었습니다.',
      data: updated,
    });
  } catch (err: unknown) {
    console.error('Knowledge Update Error:', err);
    return NextResponse.json(
      { success: false, error: '지식 베이스 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
