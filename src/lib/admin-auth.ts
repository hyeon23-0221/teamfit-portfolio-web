/**
 * Helper to check whether a given email is whitelisted in ADMIN_ALLOWED_EMAILS environment variable.
 */
export function isEmailWhitelisted(email: string | null | undefined): boolean {
  if (!email) return false;

  const rawAllowed = process.env.ADMIN_ALLOWED_EMAILS || 'admin@teamfit.com,dev@example.com';
  const allowedList = rawAllowed
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0);

  return allowedList.includes(email.trim().toLowerCase());
}

export const ADMIN_ACCESS_DENIED_MESSAGE =
  '접근 권한이 없습니다. 허용된 관리자 계정으로 로그인해 주세요.';
