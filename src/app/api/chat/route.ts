import { NextRequest, NextResponse } from 'next/server';
import { queryPortfolioGemini, OUT_OF_DOMAIN_REJECTION } from '@/lib/gemini';

// In-memory rate limiting map: ip -> { count, expiresAt }
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 20;
const WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: '요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해 주세요.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const prompt = body?.prompt;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: '질문 내용을 입력해 주세요.',
        },
        { status: 400 }
      );
    }

    const trimmedPrompt = prompt.trim();

    // Max length validation (<= 300 characters as per PRD requirement)
    if (trimmedPrompt.length > 300) {
      return NextResponse.json(
        {
          success: false,
          error: '질문은 최대 300자 이내로 입력해 주세요.',
        },
        { status: 400 }
      );
    }

    const answer = await queryPortfolioGemini(trimmedPrompt);

    return NextResponse.json({
      success: true,
      message: answer,
      isRejection: answer === OUT_OF_DOMAIN_REJECTION,
    });
  } catch (err: unknown) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: '챗봇 응답 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
