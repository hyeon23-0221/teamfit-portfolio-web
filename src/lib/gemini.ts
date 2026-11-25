import { GoogleGenerativeAI } from '@google/generative-ai';
import { initialCreatorProfile, initialProjects, initialFAQs } from './portfolio-data';

export const OUT_OF_DOMAIN_REJECTION = '죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다.';

/**
 * Builds the strict system instruction embedding creator portfolio knowledge.
 */
function buildSystemInstruction(): string {
  const profileJson = JSON.stringify(initialCreatorProfile, null, 2);
  const projectsJson = JSON.stringify(initialProjects, null, 2);
  const faqsJson = JSON.stringify(initialFAQs, null, 2);

  return `당신은 '팀핏 & 스마트 포트폴리오 허브(teamfit-portfolio-web)' 제작자 김인재의 포트폴리오 안내 전용 AI 어시스턴트입니다.

[역할 및 엄격한 규칙]
1. 당신의 유일한 임무는 아래 [포트폴리오 데이터]에 기반하여 제작자의 프로젝트(팀핏, Cloud Run 알고리즘 시각화 등), 기술 스택, 개발 배경, 트러블슈팅, 이력, 협업 스타일, 연락처에 대한 질문에만 정중하고 명확하게 답변하는 것입니다.
2. [범위 외 질문(Out-of-Domain) 차단 규칙 - 절대 준수]:
   - 날씨, 일반 상식, 역사, 코딩 숙제 대행, 범용 알고리즘/수학 문제 풀이, 정치, 사회, 연예, 번역, 일반 잡담 등 제작자의 포트폴리오와 무관한 질문을 받으면,
   - 어떠한 부가 설명, 사과 미사여구, 대안 제시, 일반적인 지식 답변도 절대 하지 말고,
   - 오직 아래 지정된 한국어 문장 하나만을 토씨 하나 바꾸지 말고 정확히 출력하십시오:
   "${OUT_OF_DOMAIN_REJECTION}"
3. 포트폴리오와 관련된 질문이라도 데이터에 없는 허위 사실(할루시네이션)을 지어내지 말고, 사실에 입각하여 답변하십시오.

[포트폴리오 데이터]
1. 제작자 프로필:
${profileJson}

2. 주요 프로젝트:
${projectsJson}

3. 자주 묻는 질문(FAQ):
${faqsJson}
`;
}

/**
 * Fallback response generator when GEMINI_API_KEY is not configured or in offline/test mode.
 */
export function getLocalFallbackResponse(query: string): string {
  const lower = query.toLowerCase().trim();

  // Out of domain patterns
  const outOfDomainPatterns = [
    /날씨/, /오늘.*온도/, /비.*와/, /미세먼지/,
    /수학/, /미적분/, /방정식/,
    /파이썬.*(풀어|짜줘|코드.*작성)/, /자바스크립트.*(풀어|짜줘)/, /숙제/,
    /정치/, /대통령/, /주식/, /비트코인/,
    /안녕.*뭐해/, /심심해/, /농담/, /노래/, /영화/, /음식.*추천/, /맛집/
  ];

  for (const pattern of outOfDomainPatterns) {
    if (pattern.test(lower)) {
      return OUT_OF_DOMAIN_REJECTION;
    }
  }

  // Portfolio matches
  if (/스택|기술|언어|프레임워크|frontend|backend/.test(lower)) {
    return `제작자 김인재의 주요 기술 스택은 다음과 같습니다:
• Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Zustand
• Backend: Node.js, Python (FastAPI), Google Apps Script (GAS)
• Database & Cloud: Supabase (PostgreSQL), Google Cloud Run, Vercel, Docker
• AI: Google Gemini Flash API 연동 및 시스템 인스트럭션 기반 가드레일 설계`;
  }

  if (/조.*편성|알고리즘|팀핏|teamfit|유니온파인드|union-find|백트래킹|클리크/.test(lower)) {
    return `팀핏(TeamFit)의 조 편성 알고리즘은 다음과 같이 동작합니다:
1. 고정 조건: Disjoint-Set (Union-Find) 자료구조를 사용하여 필수 동반 인원들을 메타 그룹으로 병합합니다.
2. 분리 조건: 상호 배제 그래프로 관리하며, Bron-Kerbosch 알고리즘으로 상호 분리 클리크 크기가 조 개수(K)를 초과하는지 사전 검증합니다.
3. 균등 분배: 조별 인원 편차를 최대 1명 이내로 제한하고 백트래킹 탐색(최대 2,000회/500ms 제한)으로 브라우저 멈춤 없이 100ms 이내에 최적 편성을 산출합니다.`;
  }

  if (/프로젝트|작업|만든.*것/.test(lower)) {
    return `대표 프로젝트는 다음과 같습니다:
1. 팀핏 & 스마트 포트폴리오 허브 (TeamFit): Union-Find 기반 조건부 조 편성기와 Gemini Flash 포트폴리오 챗봇이 결합된 반응형 웹
2. 알고리즘 시각화 & Cloud Run 마이크로서비스: Quick/Heap Sort 및 BFS/DFS 연산을 FastAPI + Google Cloud Run으로 오프로딩하여 고속 처리`;
  }

  if (/연락처|이메일|github|깃허브|블로그|이력서/.test(lower)) {
    return `제작자 연락처 정보입니다:
• 이메일: dev.injekim@gmail.com
• GitHub: https://github.com/injekim-dev
• 기술 블로그: https://velog.io/@injekim
상세 이력서 및 협업 문의는 이메일로 연락주시면 신속히 회신드립니다.`;
  }

  if (/트러블.*슈팅|문제.*해결|장애/.test(lower)) {
    return `주요 트러블슈팅 경험입니다:
1. 팀핏 조 편성: 복합 분리 조건 탐색 시 무한 루프 위험을 상호 분리 클리크 사전 감지 및 2,000회/500ms 상한으로 해결
2. Cloud Run 서버리스: 콜드 스타트 지연을 Alpine 경량 컨테이너와 gunicorn 튜닝으로 1.2초대로 최적화`;
  }

  // If general query that doesn't clearly match portfolio
  return OUT_OF_DOMAIN_REJECTION;
}

/**
 * Queries Gemini Flash model with strict out-of-domain guardrail.
 */
export async function queryPortfolioGemini(userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key or placeholder, use the deterministic fallback matcher
  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('mock-')) {
    return getLocalFallbackResponse(userPrompt);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash or gemini-2.0-flash / gemini-2.5-flash
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemInstruction(),
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
      },
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text()?.trim() || '';

    // Guardrail Post-Processing: check if model attempted to refuse with similar wording
    if (
      responseText.includes('포토폴리오') ||
      responseText.includes('포트폴리오와 관련된 질문') ||
      responseText.includes('관련된 질문에만')
    ) {
      return OUT_OF_DOMAIN_REJECTION;
    }

    return responseText;
  } catch (err: unknown) {
    console.error('Gemini API call failed, falling back to local matcher:', err);
    return getLocalFallbackResponse(userPrompt);
  }
}
