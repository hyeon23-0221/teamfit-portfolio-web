# TeamFit & Portfolio Web — AI 에이전트 및 디자인 적용 프롬프트

본 문서는 `idea_prd.md`, `prd_features.md`, `prd_tech_and_qa.md`를 바탕으로 **구글 스티치(Stitch)**와 **안티그래비티(Antigravity)**에서 즉시 실행할 수 있도록 최적화된 프롬프트 모음입니다.

---

## 🎨 1. Google Stitch (디자인 & UI 프로토타이핑) 프롬프트

> **사용 목적**: Google Stitch(또는 Stitch MCP)에서 모바일 우선 반응형 UI, 디자인 시스템, 핵심 화면 3종(조 편성기, 포트폴리오 챗봇, 관리자 대시보드)을 일관된 디자인으로 일괄 생성하기 위한 프롬프트입니다.

```markdown
Design a modern, mobile-first responsive web application named "TeamFit & Smart Portfolio Hub" (teamfit-portfolio-web).
It is a dual-purpose web utility combining a conditional team organizer, a personal portfolio with an AI chatbot, and a secure admin dashboard.

### 1. Visual Design & Theme Guidelines
- Style: Modern, clean, tech-utility aesthetic with crisp typography and subtle micro-interactions.
- Color Palette:
  - Background: Neutral Slate-50 (#F8FAFC) for light theme, Slate-900 (#0F172A) for card contrasts.
  - Primary / Brand: Indigo-600 (#4F46E5) for primary action buttons and active states.
  - Secondary / Utility: Emerald-500 (#10B981) for success/copy actions, Amber-500 (#F59E0B) for warnings, Rose-500 (#F43F5E) for conflicts/errors.
  - Text: Slate-900 for headings, Slate-600 for body text, Slate-400 for placeholders.
- Typography: Clean sans-serif (Inter / Pretendard), clear visual hierarchy (H1: 24px, H2: 18px, Body: 15-16px, Caption: 13px).
- Mobile-First Specs:
  - Base viewport: 375px~430px (iPhone/Galaxy mobile standard).
  - All touchable buttons/inputs must have a minimum touch target of 44px height.
  - Form input font sizes strictly >= 16px to prevent iOS auto-zoom.
  - Dynamic viewport height (100dvh) safe area for bottom floating bars.

### 2. Screen 1: Mobile Main — Conditional Team Builder (Tab 1)
- Header: App Logo "TeamFit", Segmented Tab control ("조 편성기" / "포트폴리오 & AI").
- Participant Input Card:
  - Multiline Textarea (placeholder: "참여자 이름을 쉼표, 줄바꿈 또는 띄어쓰기로 입력하세요").
  - Real-time Participant Count Badge: e.g. "총 14명 입력됨".
  - Duplicate detection toast/pill badge.
- Team Configuration Section:
  - Team Count ($K$) Counter/Slider with quick (+ / -) controls.
  - Real-time Slot Preview banner (e.g., "4명, 4명, 3명, 3명으로 편성됩니다").
- Rule Builder (Include / Exclude Constraints):
  - Condition Type selector (고정 - Include / 분리 - Exclude).
  - 2-person selector dropdowns and "조건 추가" button.
  - Condition Chips List (e.g. [고정: 김철수, 이영희 ✕], [분리: 박민수, 최지우 ✕]).
  - Conflict Warning Banner (Rose-50 background, Rose-600 text, icon alert when rules contradict).
- Action & Result Card:
  - Primary Call-To-Action: "조건 반영 조 편성하기" button (Full width, Indigo-600, 48px height).
  - Result Grid: Clean cards for Team 1, Team 2, Team 3 with member chip list.
  - Secondary Button: "결과 카카오톡 포맷 복사" with Emerald-500 clipboard icon and copy success toast.

### 3. Screen 2: Mobile Portfolio & Dedicated AI Assistant (Tab 2)
- Creator Profile Header: Profile avatar, developer name, 1-line intro, social/Github badges.
- Featured Project Showcase: 2-3 interactive cards showing project title, tech stack tags (Next.js, Supabase, Tailwind, Gemini), and brief highlight.
- AI Chatbot Section (Inline or Bottom Drawer):
  - Chat Header: "AI 포트폴리오 도우미" with status badge ("온라인").
  - Quick Suggestion Pills: ["주요 기술 스택은?", "조 편성 알고리즘 설명해줘", "연락처 및 이력 안내"].
  - Chat Message Feed:
    - User message bubble (Indigo-600, right-aligned).
    - Assistant message bubble (White card with border, left-aligned).
    - Out-of-Domain Guardrail Example Bubble: "죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다." (Soft Gray/Amber accent).
  - Fixed Bottom Message Input Bar:
    - Text input with rounded pill shape, send button (Paper airplane icon), 48px touch height, 100dvh keyboard safe.

### 4. Screen 3: Admin Console (/admin)
- Restricted Access Notification: Minimalist lock badge and "관리자 전용 대시보드" title.
- Login State / Whitelist Guard:
  - If unauthenticated: Centered email magic link / password login card with clear notice ("사전 등록된 관리자 이메일만 접근 가능").
  - If 403 Forbidden: Red warning screen with "접근 권한이 없습니다. 메인으로 돌아가기".
- Dashboard Layout (Mobile Vertical Stack):
  - Portfolio Knowledge Base Editor: Accordion list of Projects and FAQs.
  - Quick Edit Modal/Form: Title, description, tech stack tags, and Save button.
  - Floating status banner showing Supabase connection and active admin email.
```

---

## ⚡ 2. Antigravity (전체 풀스택 개발 및 배포 에이전트) 프롬프트

> **사용 목적**: Antigravity 에이전트에게 전체 풀스택 프로젝트 개발, 알고리즘 구현, Supabase/Gemini 연동, 모바일 최적화 및 배포 검증까지 일임할 때 사용하는 마스터 엔지니어링 프롬프트입니다.

```markdown
# Role & Project Overview
You are a Lead Full-Stack Software Engineer and AI Systems Architect.
Your task is to build, verify, and prepare for production the complete web service:
"TeamFit & Smart Portfolio Hub" (teamfit-portfolio-web).

All requirements are specified across `idea_prd.md`, `prd_features.md`, and `prd_tech_and_qa.md`.
You must strictly follow the tech stack, functional constraints, security rules, and mobile-first principles.

---

### Tech Stack & Architecture (Zero-Cost Infrastructure Rule)
- Framework: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide React
- Hosting & Serverless: Vercel Hobby Plan (Serverless Route Handlers)
- Database & Auth: Supabase Free Tier (Auth + PostgreSQL for Knowledge Base)
- AI Engine: Google Gemini Flash (e.g. gemini-2.5-flash via official Google Gen AI SDK)
- State Management: React useState / useReducer / Zustand for in-memory client state
- Note: Participant names in the team builder must NEVER be saved to any database (in-memory only).

---

### Core Implementation Directives

#### 1. Conditional Team Builder ([F-01] ~ [F-04])
- Input Parser: Cleanse names by `\n`, `,`, and whitespace. Trim and filter empties. Provide duplicate detection with auto-numbering option (e.g. "홍길동(1)").
- Balanced Partition: Distribute $N$ people into $K$ teams with maximum size difference of 1.
- Constraint Solver (Strict Adherence):
  - Fixed (Include): Must belong to the same team. Use Union-Find (Disjoint-Set) data structure to merge groups.
  - Excluded (Separate): Must belong to different teams.
  - Conflict Detection:
    1) Same pair in both Fixed and Excluded rules.
    2) Number of mutually excluded members > $K$.
    3) Any merged fixed group size > maximum team capacity $\lceil N / K \rceil$.
    4) Unsolvable constraint combination within 2,000 randomized iterations or 500ms timeout.
  - Output & Clipboard: Format output nicely for KakaoTalk/Discord with a single-click copy button and toast alert.

#### 2. Portfolio Dedicated AI Chatbot & Out-of-Domain Guardrail ([F-05])
- Create `/api/chat` serverless route proxying requests to Gemini Flash.
- Security: Never expose `GEMINI_API_KEY` to the client. Keep in `.env.local` / Vercel Environment Variables.
- Strict System Instruction:
  - The chatbot only answers questions related to the creator's portfolio (projects, tech stack, troubleshooting, background, contact).
  - Out-of-Domain Rule: When receiving any off-topic question (weather, general trivia, math/coding homework, politics, chit-chat), the AI MUST strictly return this exact Korean sentence without any hallucination or generic reply:
    "죄송합니다. 포토폴리오와 관련된 질문에만 답변할 수 있습니다."
  - Rate limiting & input max length validation (<= 300 characters).

#### 3. Specific Email-Based Admin Access Control ([F-06])
- Target Route: `/admin` and `/api/admin/*`
- Auth Mechanism: Supabase Auth (Email OTP or Email/Password).
- Whitelist Verification:
  - Check user session against `process.env.ADMIN_ALLOWED_EMAILS`.
  - Non-logged-in users: Redirect to `/admin/login`.
  - Logged-in but non-whitelisted users: Show 403 Forbidden with "접근 권한이 없습니다. 허용된 관리자 계정으로 로그인해 주세요." and redirect to `/`.
  - Dual protection via Next.js Middleware and Supabase Row Level Security (RLS).
- Feature: Manage portfolio knowledge base (FAQ, project details) stored in Supabase PostgreSQL.

#### 4. Mobile-First & Responsive UX Requirements
- Viewports 360px ~ 430px must render without any horizontal scroll (`overflow-x: hidden`).
- All interactive touch targets >= 44px × 44px.
- Form inputs font-size >= 16px to prevent iOS Safari auto-zoom.
- Mobile keyboard safe viewports using `100dvh` and sticky bottom input bar.
- Admin table and forms must fold into a clean vertical stack on mobile screens.

---

### Step-by-Step Execution Plan
1. Project Setup: Initialize Next.js project with Tailwind CSS, Lucide icons, and TypeScript types.
2. Logic & UI for Team Builder: Build the stateful parser, Union-Find solver, conflict validator, and copy utility.
3. Portfolio & AI Chatbot: Build portfolio showcase UI, Gemini API route with the strict out-of-domain prompt, and chat interface with quick suggestion pills.
4. Supabase Auth & Admin: Setup Supabase client/server helpers, middleware whitelist check, and the admin management screen.
5. Definition of Done (DoD) Verification: Validate all 6 QA criteria defined in `prd_tech_and_qa.md`.
```
