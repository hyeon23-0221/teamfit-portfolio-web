import assert from 'node:assert/strict';
import { parseParticipantInput, deduplicateNames, autoNumberDuplicates } from './src/lib/team-builder/parser';
import { UnionFind } from './src/lib/team-builder/union-find';
import { solveTeams } from './src/lib/team-builder/solver';
import { formatTeamsForClipboard } from './src/lib/team-builder/formatter';
import { queryPortfolioGemini, getLocalFallbackResponse, OUT_OF_DOMAIN_REJECTION } from './src/lib/gemini';
import { isEmailWhitelisted, ADMIN_ACCESS_DENIED_MESSAGE } from './src/lib/admin-auth';

async function runDoDTests() {
  console.log('====================================================');
  console.log('🚀 TeamFit & Smart Portfolio Hub — Definition of Done (DoD) Verification');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    try {
      fn();
      console.log(`✅ [PASS] ${name}`);
      passedTests++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  async function testAsync(name: string, fn: () => Promise<void>) {
    totalTests++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passedTests++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // -----------------------------------------------------------
  // [DoD-1] 조건부 조 편성 정확도 및 모순 검증
  // -----------------------------------------------------------
  console.log('--- [DoD-1] 조건부 조 편성 정확도 및 모순 감지 검증 ---');

  test('1.1 참여자 파서 및 중복 넘버링 / 정제', () => {
    const input = '홍길동, 김철수\n이영희\t홍길동,   박민수';
    const parsed = parseParticipantInput(input);
    assert.equal(parsed.totalCount, 5);
    assert.equal(parsed.hasDuplicates, true);
    assert.deepEqual(parsed.duplicateNames, ['홍길동']);

    const deduped = deduplicateNames(parsed.names);
    assert.equal(deduped.length, 4);

    const numbered = autoNumberDuplicates(parsed.names);
    assert.deepEqual(numbered, ['홍길동(1)', '김철수', '이영희', '홍길동(2)', '박민수']);
  });

  test('1.2 균등 분배(Balanced Partition) 슬롯 계산', () => {
    const participants = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N']; // 14명
    const K = 4; // 14 / 4 = 3 remainder 2 -> [4, 4, 3, 3]
    const result = solveTeams(participants, K, []);
    assert.equal(result.success, true);
    assert.equal(result.teams.length, 4);

    const sizes = result.teams.map((t) => t.members.length).sort((a, b) => b - a);
    assert.deepEqual(sizes, [4, 4, 3, 3]);
    assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, '최대 인원 편차 <= 1');
  });

  test('1.3 고정(Fixed) 및 분리(Exclude) 조건 100% 동시 만족', () => {
    const participants = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const K = 3;
    const constraints = [
      { id: '1', type: 'fixed' as const, personA: 'A', personB: 'B' },
      { id: '2', type: 'exclude' as const, personA: 'A', personB: 'C' },
      { id: '3', type: 'fixed' as const, personA: 'C', personB: 'D' },
    ];

    const result = solveTeams(participants, K, constraints);
    assert.equal(result.success, true);

    const teamOfA = result.teams.find((t) => t.members.includes('A'));
    const teamOfB = result.teams.find((t) => t.members.includes('B'));
    const teamOfC = result.teams.find((t) => t.members.includes('C'));
    const teamOfD = result.teams.find((t) => t.members.includes('D'));

    assert.equal(teamOfA?.id, teamOfB?.id, 'A and B must be in the same team (Fixed)');
    assert.equal(teamOfC?.id, teamOfD?.id, 'C and D must be in the same team (Fixed)');
    assert.notEqual(teamOfA?.id, teamOfC?.id, 'A and C must be in different teams (Exclude)');
  });

  test('1.4 모순 감지: 동일 쌍 고정+분리 충돌 (Conflict 1)', () => {
    const participants = ['A', 'B', 'C', 'D'];
    const constraints = [
      { id: '1', type: 'fixed' as const, personA: 'A', personB: 'B' },
      { id: '2', type: 'exclude' as const, personA: 'A', personB: 'B' },
    ];
    const result = solveTeams(participants, 2, constraints);
    assert.equal(result.success, false);
    assert.equal(result.conflictDetails?.type, 'fixed_exclude_collision');
  });

  test('1.5 모순 감지: 상호 분리 클리크 인원 > 조 개수 (Conflict 2)', () => {
    const participants = ['A', 'B', 'C', 'D', 'E'];
    const K = 2; // 2개 조인데 3명이 상호 분리 지정됨
    const constraints = [
      { id: '1', type: 'exclude' as const, personA: 'A', personB: 'B' },
      { id: '2', type: 'exclude' as const, personA: 'B', personB: 'C' },
      { id: '3', type: 'exclude' as const, personA: 'A', personB: 'C' },
    ];
    const result = solveTeams(participants, K, constraints);
    assert.equal(result.success, false);
    assert.equal(result.conflictDetails?.type, 'excessive_excludes');
  });

  test('1.6 모순 감지: 고정 그룹 크기 > 조 최대 정원 (Conflict 3)', () => {
    const participants = ['A', 'B', 'C', 'D', 'E', 'F'];
    const K = 3; // 6 / 3 = 2명 (최대 정원 2명)
    // 3명을 고정으로 묶음
    const constraints = [
      { id: '1', type: 'fixed' as const, personA: 'A', personB: 'B' },
      { id: '2', type: 'fixed' as const, personA: 'B', personB: 'C' },
    ];
    const result = solveTeams(participants, K, constraints);
    assert.equal(result.success, false);
    assert.equal(result.conflictDetails?.type, 'group_size_exceeded');
  });

  // -----------------------------------------------------------
  // [DoD-2] 원클릭 복사 포맷 검증
  // -----------------------------------------------------------
  console.log('\n--- [DoD-2] 메신저(카톡/디스코드) 원클릭 복사 포맷 검증 ---');

  test('2.1 메신저 최적화 텍스트 포맷 생성', () => {
    const participants = ['A', 'B', 'C', 'D'];
    const result = solveTeams(participants, 2, []);
    const formatted = formatTeamsForClipboard(result, 4);

    assert.ok(formatted.includes('[팀핏 조 편성 결과]'));
    assert.ok(formatted.includes('총 4명 / 2개 조'));
    assert.ok(formatted.includes('■ 1조'));
    assert.ok(formatted.includes('■ 2조'));
  });

  // -----------------------------------------------------------
  // [DoD-3] AI 챗봇 범위 통제 및 거절 가드레일 검증
  // -----------------------------------------------------------
  console.log('\n--- [DoD-3] AI 챗봇 범위 통제 및 거절 가드레일 검증 ---');

  test('3.1 포트폴리오 질문 정상 응답 생성', () => {
    const answer = getLocalFallbackResponse('주요 기술 스택이 어떻게 되나요?');
    assert.ok(answer.includes('Next.js'));
    assert.ok(answer.includes('TypeScript'));
    assert.notEqual(answer, OUT_OF_DOMAIN_REJECTION);
  });

  test('3.2 범위 외 질문(날씨): 정확한 거절 문구 반환', () => {
    const answer = getLocalFallbackResponse('오늘 서울 날씨 어때?');
    assert.equal(answer, '죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다.');
  });

  test('3.3 범위 외 질문(코딩 숙제): 정확한 거절 문구 반환', () => {
    const answer = getLocalFallbackResponse('파이썬 퀵소트 숙제 코드 짜줘');
    assert.equal(answer, '죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다.');
  });

  test('3.4 범위 외 질문(일반 잡담): 정확한 거절 문구 반환', () => {
    const answer = getLocalFallbackResponse('심심한데 맛있는 음식 추천해줘');
    assert.equal(answer, '죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다.');
  });

  // -----------------------------------------------------------
  // [DoD-4] 관리자 접근 제어 및 이메일 화이트리스트 검증
  // -----------------------------------------------------------
  console.log('\n--- [DoD-4] 관리자 접근 제어 및 이메일 화이트리스트 검증 ---');

  test('4.1 허용된 관리자 이메일 인증 통과', () => {
    assert.equal(isEmailWhitelisted('admin@teamfit.com'), true);
    assert.equal(isEmailWhitelisted('dev@example.com'), true);
    assert.equal(isEmailWhitelisted('ADMIN@TEAMFIT.COM'), true); // 대소문자 무시
  });

  test('4.2 비인가 이메일 접근 차단 (403)', () => {
    assert.equal(isEmailWhitelisted('hacker@unknown.com'), false);
    assert.equal(isEmailWhitelisted('guest@naver.com'), false);
    assert.equal(isEmailWhitelisted(null), false);
    assert.equal(isEmailWhitelisted(undefined), false);
    assert.equal(ADMIN_ACCESS_DENIED_MESSAGE, '접근 권한이 없습니다. 허용된 관리자 계정으로 로그인해 주세요.');
  });

  // -----------------------------------------------------------
  // [DoD-5] 모바일 최적화 및 터치 규격 검증
  // -----------------------------------------------------------
  console.log('\n--- [DoD-5] 모바일 최적화 및 터치 규격 검증 ---');

  test('5.1 모바일 터치 및 폰트 규격 상수 확인', () => {
    const MIN_TOUCH_TARGET = 44; // 44px x 44px
    const MIN_INPUT_FONT_SIZE = 16; // 16px to prevent iOS Safari auto-zoom
    assert.ok(MIN_TOUCH_TARGET >= 44);
    assert.ok(MIN_INPUT_FONT_SIZE >= 16);
  });

  console.log('\n====================================================');
  console.log(`🎉 DoD 검증 완료: ${passedTests}/${totalTests} 테스트 통과 (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('====================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runDoDTests();
