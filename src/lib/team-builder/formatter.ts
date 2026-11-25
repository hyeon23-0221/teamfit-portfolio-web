import { TeamResult, SolveResult } from './types';

/**
 * Formats team results into a clean, copyable text optimized for KakaoTalk and Discord.
 */
export function formatTeamsForClipboard(
  result: SolveResult,
  totalParticipants: number
): string {
  if (!result.success || !result.teams || result.teams.length === 0) {
    return '';
  }

  const teamCount = result.teams.length;
  const lines: string[] = [];

  lines.push(`[팀핏 조 편성 결과]`);
  lines.push(`총 ${totalParticipants}명 / ${teamCount}개 조`);
  lines.push(``);

  for (const team of result.teams) {
    const memberList = team.members.join(', ');
    lines.push(`■ ${team.name} (${team.members.length}명): ${memberList}`);
  }

  if (result.rulesApplied) {
    lines.push(``);
    lines.push(
      `* 반영된 규칙: 고정 ${result.rulesApplied.fixedCount}건, 분리 ${result.rulesApplied.excludeCount}건`
    );
  }

  lines.push(`* 생성일시: ${new Date().toLocaleString('ko-KR')}`);
  lines.push(`* 생성도구: 팀핏 & 스마트 포트폴리오 허브`);

  return lines.join('\n');
}
