export interface Project {
  id: string;
  title: string;
  description: string;
  period: string;
  role: string;
  tags: string[];
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  troubleshooting?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'skills' | 'projects' | 'career' | 'contact';
}

export interface CreatorProfile {
  name: string;
  role: string;
  bio: string;
  email: string;
  github: string;
  blog: string;
  skills: {
    frontend: string[];
    backend: string[];
    database: string[];
    ai_devops: string[];
  };
}

export const initialCreatorProfile: CreatorProfile = {
  name: "김인재 (Lead Full-Stack & AI Engineer)",
  role: "풀스택 소프트웨어 엔지니어 & AI 시스템 아키텍트",
  bio: "Next.js, TypeScript, Python, Cloud Run 기반의 비용 효율적(Zero-Cost) 고성능 웹 서비스와 AI 워크플로우를 설계하고 구현합니다.",
  email: "dev.injekim@gmail.com",
  github: "https://github.com/injekim-dev",
  blog: "https://velog.io/@injekim",
  skills: {
    frontend: ["Next.js (App Router)", "React", "TypeScript", "Tailwind CSS", "Zustand"],
    backend: ["Node.js", "Python (FastAPI)", "Google Apps Script (GAS)", "REST API"],
    database: ["Supabase (PostgreSQL)", "Chroma DB (Vector Store)", "Redis"],
    ai_devops: ["Google Gemini Flash", "Vercel Serverless", "Google Cloud Run", "Docker", "GitHub Actions"]
  }
};

export const initialProjects: Project[] = [
  {
    id: "teamfit",
    title: "팀핏 & 스마트 포트폴리오 허브 (TeamFit)",
    description: "Union-Find 기반의 조건부 조 편성 유틸리티와 Gemini Flash 기반 포트폴리오 AI 챗봇을 결합한 반응형 웹 서비스",
    period: "2024.11",
    role: "1인 풀스택 설계 및 개발",
    tags: ["Next.js 14", "TypeScript", "Tailwind CSS", "Gemini 2.5 Flash", "Supabase", "Vercel"],
    highlights: [
      "Union-Find 및 백트래킹 기반의 분리/고정 제약 조건 동시 만족 조 편성 알고리즘 구현",
      "클릭 1회 카카오톡/디스코드 최적화 공지 포맷 클립보드 복사",
      "Gemini Flash API 연동 및 시스템 인스트럭션 기반 포트폴리오 외 질문 엄격 차단 가드레일 구현",
      "모바일 뷰포트(360px~430px) 가로 스크롤 방지 및 100dvh 모바일 키보드 반응형 레이아웃 적용"
    ],
    troubleshooting: "서로 다른 분리 조건이 얽힐 때 무한 루프 위험이 있어, Bron-Kerbosch 기반 상호 분리 클리크(Clique) 사전 검증과 최대 2,000회/500ms 탐색 제한을 적용하여 브라우저 동결 현상을 해결함."
  },
  {
    id: "algo-cloudrun",
    title: "알고리즘 시각화 & Cloud Run 마이크로서비스",
    description: "정렬(Quick/Heap) 및 그래프 탐색(BFS/DFS) 알고리즘을 실시간 시각화하고 FastAPI + Cloud Run으로 고속 연산 처리",
    period: "2024.09 ~ 2024.10",
    role: "백엔드 아키텍처 및 알고리즘 엔진 개발",
    tags: ["Python", "FastAPI", "Google Cloud Run", "Docker", "GAS", "JavaScript Canvas"],
    highlights: [
      "대용량 데이터 정렬 및 경로 탐색 연산을 컨테이너 기반 Google Cloud Run으로 오프로딩하여 응답 시간 70% 단축",
      "Google Apps Script(GAS)와 RESTful 통신을 연계한 자동화 워크플로우 구축"
    ],
    troubleshooting: "Cloud Run의 콜드 스타트 문제를 해결하기 위해 최소 인스턴스 0 환경에서도 가벼운 Alpine 베이스 Docker 이미지 최적화 및 gunicorn 워커 튜닝을 통해 콜드 스타트 지연을 1.2초대로 단축함."
  }
];

export const initialFAQs: FAQ[] = [
  {
    id: "faq-1",
    category: "skills",
    question: "주요 기술 스택과 강점은 무엇인가요?",
    answer: "Next.js, TypeScript, Tailwind CSS를 활용한 모바일 우선 반응형 프론트엔드와 Python FastAPI, Google Cloud Run을 결합한 서버리스 아키텍처 구축이 주력입니다. 특히 Google Gemini 등 LLM API를 활용한 가드레일 제어 및 프롬프트 엔지니어링에 강점이 있습니다."
  },
  {
    id: "faq-2",
    category: "projects",
    question: "조 편성 알고리즘(TeamFit)의 핵심 로직은 어떻게 동작하나요?",
    answer: "고정 조건은 Disjoint-Set(Union-Find) 자료구조로 메타 그룹으로 병합하고, 분리 조건은 상호 배제 그래프로 모델링합니다. 사전 모순 검증(정원 초과, 클리크 크기 > 조 개수 등) 후 백트래킹 및 휴리스틱 분배 알고리즘을 통해 편차 1명 이내의 공정한 조 편성을 100ms 이내에 산출합니다."
  },
  {
    id: "faq-3",
    category: "career",
    question: "협업 스타일과 문제 해결 방식은 어떤가요?",
    answer: "PRD 기반의 철저한 요구사항 분석과 단위 테스트(TDD), 모바일 사용자 관점의 세심한 인터랙션 설계를 중시합니다. 기술적 장애 발생 시 가설 설정-로그 분석-재현 테스트 사이클을 거쳐 근본 원인을 제거합니다."
  },
  {
    id: "faq-4",
    category: "contact",
    question: "연락처 및 이력서 확인은 어디서 가능한가요?",
    answer: "이메일(dev.injekim@gmail.com) 또는 깃허브(https://github.com/injekim-dev)를 통해 언제든 연락 가능하며, 상세 이력서는 이메일 요청 시 즉시 송부드립니다."
  }
];
