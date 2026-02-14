# MVP 기획서: BookForge — AI 전자책 제작 웹앱

> 작성일: 2026-02-12
> 기반: final_ideas.md 1위 + 2위 + 3위 아이디어 통합
> 목표: 1인 개발자가 AI 도구로 6주 내 MVP 완성
> 제품명(가칭): BookForge

---

## 1. 제품 개요

**한 줄 요약**: 기존 콘텐츠(블로그 URL, 파일, 유튜브)를 AI로 전자책으로 변환하거나, 처음부터 작성할 수 있는 모바일 대응 전자책 제작 웹앱

**해결하는 문제**

크리에이터와 작가들은 전자책을 만들고 싶지만, 세 가지 핵심 장벽에 부딪힌다.

1. **콘텐츠 재활용의 수작업 부담**: 블로그, 유튜브, SNS에 이미 쌓인 콘텐츠를 전자책으로 만들려면 수집, 구조화, 편집, 포매팅을 모두 수동으로 해야 한다. Designrr이 이 문제를 공략하지만 "기본 플랜($29/월)은 기능이 매우 제한적이고 대부분의 기능에 접근하려면 $100까지 업그레이드해야 한다"(Reddit r/selfpublish)는 불만이 반복된다.
2. **모바일 작업 환경의 부재**: Vellum은 Mac 전용($249.99), Atticus($147)는 데스크톱 중심 PWA로 모바일 편집 경험이 제한적이다. 53%의 작가가 멀티태스킹하며 작업하지만, 모바일에서 제대로 작동하는 전자책 편집 도구가 사실상 없다.
3. **디자인 역량의 부족**: 커버 디자인에 전문 디자이너를 고용하면 $300~$800, Canva 템플릿은 "모두 비슷해 보이는" 동질화 문제가 있다.

**솔루션 접근 방식**

AI(Claude Haiku/Sonnet API + DALL-E 3)를 핵심 엔진으로 활용하여 세 가지 진입 경로를 하나의 제품으로 통합한다.

1. **Import & Transform**: URL 입력, 파일 업로드, 유튜브 링크 등 기존 콘텐츠를 AI가 자동으로 수집하고, 챕터 구조화/목차 생성/어조 통일을 수행하여 전자책 초안을 즉시 생성
2. **Create & Edit**: Tiptap 기반 모바일 최적화 WYSIWYG 에디터에서 처음부터 작성하거나, AI 생성 초안을 편집. 터치 최적화 UI로 스마트폰에서도 완전한 편집 가능
3. **Design & Export**: AI 커버 이미지 자동 생성, 내지 템플릿 적용, EPUB/PDF 원클릭 내보내기로 출판 준비 완료

---

## 2. 사용자 페르소나

### 페르소나 1: 김서연 (콘텐츠 크리에이터)
- **프로필**: 32세, 마케팅 관련 블로그 운영 3년차, 구독자 5,000명
- **핵심 고통점**: 블로그에 150개 이상의 포스트가 쌓여 있지만, 이를 전자책으로 재활용하는 데 엄두를 내지 못한다. Designrr을 시도했으나 $29/월 기본 플랜에서는 URL 임포트 품질이 낮고, 제대로 쓰려면 $100/월 플랜이 필요하다는 것을 알고 포기했다.
- **목표**: 블로그의 "마케팅 초보 가이드" 시리즈 20개 포스트를 전자책 1권으로 만들어 크몽에서 판매하고 패시브 인컴을 만들고 싶다.
- **사용 시나리오**:
  1. 아침 출근길 지하철에서 스마트폰으로 BookForge를 열고, 블로그 URL 5개를 붙여넣기
  2. AI가 자동으로 콘텐츠를 수집하고 챕터 구조를 제안 — 10분 만에 전자책 초안 완성
  3. 점심시간에 태블릿에서 목차와 챕터 순서를 조정하고, AI에게 어조 통일을 요청
  4. 퇴근 후 PC에서 커버 이미지를 AI로 생성하고 템플릿을 선택한 뒤 EPUB/PDF로 내보내기
  5. 크몽에 업로드하여 판매 시작

### 페르소나 2: 박준호 (첫 전자책 출판 도전자)
- **프로필**: 28세, 프리랜서 개발자, 사이드 프로젝트로 "비전공자를 위한 코딩 입문" 전자책을 쓰고 싶다
- **핵심 고통점**: 전자책을 처음부터 쓰고 싶지만, Vellum은 Mac 전용이라 쓸 수 없고(Windows 사용자), Atticus($147)는 일회성 구매라 부담된다. 출퇴근 시간에 스마트폰으로 조금씩 쓰고 싶은데 모바일에서 제대로 작동하는 편집 도구가 없다.
- **목표**: 통근 시간과 자투리 시간을 활용해 3개월 내에 전자책 1권을 완성하고, Amazon KDP에 출판하고 싶다.
- **사용 시나리오**:
  1. 출근길 지하철에서 스마트폰으로 BookForge 에디터를 열고 새 프로젝트 생성
  2. "비전공자를 위한 코딩 입문"이라는 주제로 AI에게 목차 구조를 제안받음
  3. 매일 자투리 시간에 모바일 에디터로 한 챕터씩 작성 — 자동 저장으로 데이터 유실 걱정 없음
  4. 주말에 PC에서 전체 내용을 검토하고, AI 포매팅 검증으로 EPUB 오류를 자동 수정
  5. AI 커버 생성으로 "기술서적" 장르에 맞는 커버를 만들고 KDP에 직접 업로드

### 페르소나 3: 이미나 (B2B 마케터)
- **프로필**: 35세, 스타트업 마케팅 매니저, 리드마그넷용 전자책을 분기마다 제작해야 함
- **핵심 고통점**: 분기마다 리드마그넷(lead magnet) 전자책을 만들어야 하는데, 매번 디자이너와 협업하는 과정이 2~3주씩 걸린다. Canva로 만들면 30페이지 제한에 걸리고 디자인 퀄리티가 떨어진다.
- **목표**: 회사 블로그의 최신 콘텐츠를 빠르게 전자책으로 변환하여, 리드마그넷으로 활용하고 싶다. 브랜드 컬러와 로고를 적용한 전문적인 디자인이 필요하다.
- **사용 시나리오**:
  1. 회사 블로그에서 이번 분기 핵심 포스트 10개의 URL을 BookForge에 입력
  2. AI가 자동으로 챕터 구조화, 중복 제거, 마케팅 어조로 통일
  3. 비즈니스 템플릿을 선택하고 브랜드 컬러를 적용
  4. AI 커버에 회사 로고를 추가하고 전문적인 표지 완성
  5. PDF로 내보내 랜딩페이지에 "전자책 다운로드" 게이트로 활용 — 전체 과정 2시간 내 완료

---

## 3. 기능 명세

### MVP 범위 (In-Scope)

#### F1: 콘텐츠 임포트 시스템 — P0
- **설명**: 블로그 URL, 파일 업로드(Word/PDF/Markdown/TXT), 유튜브 URL, 직접 텍스트 입력 등 다양한 소스에서 콘텐츠를 수집하여 에디터로 가져오는 기능
- **사용자 스토리**: As a 김서연(콘텐츠 크리에이터), I want to 블로그 URL 여러 개를 한 번에 입력하여 콘텐츠를 자동으로 수집하고 싶다 so that 수작업 복사-붙여넣기 없이 전자책 초안을 빠르게 만들 수 있다
- **수용 기준**:
  1. 블로그 URL을 입력하면 본문 텍스트와 이미지가 자동으로 추출되어 에디터에 마크다운 형태로 로드된다 (Mozilla Readability.js 활용)
  2. Word(.docx), PDF, Markdown(.md), TXT 파일을 드래그 앤 드롭 또는 파일 선택으로 업로드하면 콘텐츠가 파싱되어 에디터에 로드된다
  3. 유튜브 URL을 입력하면 자막/스크립트가 자동 추출되어 텍스트로 변환된다 (youtube-transcript npm 패키지 활용)
  4. 한 번에 최대 20개의 URL/파일을 배치로 임포트할 수 있다
  5. 임포트 진행 상황이 프로그레스 바로 표시된다
- **기술 노트**:
  - URL 스크래핑: Mozilla Readability.js로 본문 추출 (서버사이드 Next.js API Route에서 실행). 자바스크립트 렌더링이 필요한 페이지는 실패 메시지로 안내하고, 수동 복사-붙여넣기를 유도
  - 파일 파싱: `mammoth`(Word -> HTML), `pdf-parse`(PDF -> 텍스트), 마크다운은 네이티브 처리
  - 유튜브: `youtube-transcript` npm 패키지로 자막 추출 (API 키 불필요)
  - 업로드된 파일은 Supabase Storage에 임시 저장 후 파싱, 완료 후 삭제

#### F2: AI 자동 구조화 엔진 — P0
- **설명**: 임포트된 콘텐츠를 AI가 분석하여 챕터 분리, 목차 생성, 중복 제거, 어조 통일, 서문/결론 자동 생성을 수행하는 핵심 AI 기능
- **사용자 스토리**: As a 이미나(B2B 마케터), I want to 블로그 10개 포스트를 임포트한 후 AI가 자동으로 챕터를 분리하고 목차를 만들어주길 원한다 so that 콘텐츠 구조화에 시간을 쓰지 않고 편집에만 집중할 수 있다
- **수용 기준**:
  1. "구조화 시작" 버튼을 누르면 AI가 전체 콘텐츠를 분석하여 챕터 구조(제목, 순서)를 제안한다
  2. 중복되는 내용이 자동으로 감지되어 병합/삭제 제안이 표시된다
  3. AI가 제안한 구조를 사용자가 드래그 앤 드롭으로 수정할 수 있다
  4. "어조 통일" 옵션을 선택하면 전체 텍스트의 문체가 선택한 스타일(격식체/대화체/비즈니스)로 통일된다
  5. 구조화 결과가 30초 이내에 생성된다 (콘텐츠 50,000자 기준)
- **기술 노트**:
  - AI 모델: Claude Sonnet 4.5 API 사용 (비용 효율 + 충분한 품질). $3/1M input tokens, $15/1M output tokens
  - 프롬프트 설계: 시스템 프롬프트에 "전자책 편집자" 역할 부여, 입력 콘텐츠 전체를 컨텍스트로 전달
  - 구조화 파이프라인: (1) 전체 콘텐츠 분석 -> (2) 주제 클러스터링 -> (3) 챕터 분리 제안 -> (4) 목차 생성 -> (5) 중복 감지 -> (6) 어조 통일 (각 단계를 별도 API 호출로 처리하여 안정성 확보)
  - Prompt Caching 활용: 반복 편집 시 컨텍스트 재사용으로 비용 90% 절감

#### F3: 모바일 대응 WYSIWYG 에디터 — P0
- **설명**: Tiptap 기반의 반응형 리치 텍스트 에디터로, 데스크톱과 모바일 모두에서 완전한 편집 경험을 제공. 처음부터 새로 작성하거나 AI 생성 초안을 편집할 수 있다.
- **사용자 스토리**: As a 박준호(첫 전자책 출판자), I want to 출퇴근 시간에 스마트폰에서 전자책을 조금씩 작성하고 싶다 so that 자투리 시간을 활용하여 전자책 완성에 걸리는 시간을 줄일 수 있다
- **수용 기준**:
  1. 모바일(375px 이상)에서 편집 가능한 터치 최적화 툴바가 표시된다 (굵게, 기울임, 제목 1-3, 리스트, 인용, 이미지 삽입)
  2. 데스크톱에서는 사이드바에 챕터 목차가 표시되고, 모바일에서는 하단 시트로 전환된다
  3. 자동 저장이 3초 간격으로 작동하여 타이핑 중 데이터 유실이 없다 (debounce 적용)
  4. 챕터 간 이동이 모바일에서 스와이프 또는 목차 탭으로 가능하다
  5. 에디터에서 텍스트를 선택하면 BubbleMenu로 서식 옵션이 표시된다
- **기술 노트**:
  - Tiptap Editor + StarterKit + 커스텀 Extension (챕터 관리, 이미지 삽입)
  - `useEditor` 훅으로 React 통합, `EditorContent` + `BubbleMenu` + `FloatingMenu` 활용
  - `immediatelyRender: false` 설정으로 SSR 호환
  - 모바일 툴바: 하단 고정 Sticky 형태, 스크롤 시 축소/확대 애니메이션
  - 자동 저장: `onUpdate` 콜백 + debounce(3초) -> Supabase DB에 JSON 형태로 저장
  - 챕터 구조: Tiptap의 JSON 문서를 챕터 배열로 관리, 각 챕터는 `{ id, title, content (Tiptap JSON), order }` 형태

#### F4: 템플릿 시스템 & 미리보기 — P1
- **설명**: 전자책 내지 디자인 템플릿 5종을 제공하고, 실시간 미리보기로 최종 결과물을 확인할 수 있는 기능
- **사용자 스토리**: As a 이미나(B2B 마케터), I want to 비즈니스 스타일의 전문적인 템플릿을 선택하여 브랜드에 맞는 전자책을 만들고 싶다 so that 디자이너 없이도 전문적인 결과물을 만들 수 있다
- **수용 기준**:
  1. 5가지 기본 템플릿(미니멀, 비즈니스, 클래식, 모던, 크리에이티브)이 제공된다
  2. 각 템플릿의 미리보기를 클릭하면 현재 콘텐츠가 해당 템플릿에 적용된 모습을 실시간으로 볼 수 있다
  3. 기본 커스터마이징이 가능하다: 메인 컬러, 폰트 선택 (5종), 머리글/바닥글 텍스트
  4. 미리보기가 모바일에서도 정상적으로 표시된다
  5. 선택한 템플릿이 EPUB/PDF 내보내기에 정확히 반영된다
- **기술 노트**:
  - 템플릿 = CSS 스타일시트 + HTML 레이아웃 조합. 각 템플릿은 `/templates/{name}/style.css` + `/templates/{name}/layout.html`로 관리
  - 미리보기: Tiptap JSON -> HTML 변환 -> 템플릿 CSS 적용 -> iframe으로 렌더링
  - 커스터마이징: CSS 변수(`--primary-color`, `--font-family` 등)를 동적으로 변경
  - 폰트: Google Fonts에서 한글 지원 폰트 5종 선택 (Noto Sans KR, Noto Serif KR, Pretendard, Gothic A1, Nanum Myeongjo)

#### F5: AI 커버 이미지 생성 — P1
- **설명**: 전자책 제목, 장르, 키워드를 입력하면 AI가 3개의 커버 시안을 자동 생성하고, 타이포그래피를 적용하여 완성된 커버를 제공하는 기능
- **사용자 스토리**: As a 박준호(첫 전자책 출판자), I want to 전자책 제목과 장르만 입력하면 AI가 전문적인 커버를 만들어주길 원한다 so that 디자인 비용 $300-$800을 절약하고 빠르게 출판 준비를 할 수 있다
- **수용 기준**:
  1. 제목, 저자명, 장르(드롭다운), 분위기 키워드(3개까지)를 입력하면 3개의 커버 시안이 생성된다
  2. 각 시안에 제목과 저자명 타이포그래피가 자동 적용된다
  3. 생성된 커버의 텍스트 위치, 폰트 크기, 색상을 수정할 수 있다
  4. 최종 커버를 1600x2560px (KDP 권장 규격)으로 다운로드할 수 있다
  5. 커버 생성에 30초 이내가 소요된다
- **기술 노트**:
  - 이미지 생성: DALL-E 3 API ($0.04~$0.08/이미지). 장르별 최적화된 프롬프트 템플릿 사전 준비
  - 타이포그래피 합성: HTML Canvas API로 텍스트 오버레이 (서버사이드에서 `@napi-rs/canvas` 또는 클라이언트 Canvas API)
  - 생성 과정: (1) 사용자 입력 -> (2) 장르별 프롬프트 생성 (Claude Haiku) -> (3) DALL-E 3으로 배경 이미지 생성 -> (4) Canvas로 타이포그래피 합성 -> (5) 최종 이미지 반환
  - 생성된 이미지는 Supabase Storage에 저장

#### F6: EPUB/PDF 내보내기 — P0
- **설명**: 편집된 전자책을 EPUB 3.0 또는 PDF 포맷으로 내보내는 기능. 선택한 템플릿과 커버가 적용된 완성본을 생성한다.
- **사용자 스토리**: As a 김서연(콘텐츠 크리에이터), I want to 완성된 전자책을 EPUB과 PDF로 내보내서 크몽과 KDP에 바로 업로드하고 싶다 so that 추가 변환 도구 없이 여러 플랫폼에 출판할 수 있다
- **수용 기준**:
  1. "내보내기" 버튼을 클릭하면 EPUB 3.0 또는 PDF 형식을 선택할 수 있다
  2. EPUB 파일에 표지, 목차, 챕터, 이미지가 올바르게 포함된다
  3. PDF 파일에 선택한 템플릿 디자인이 정확히 반영된다
  4. 생성된 파일이 5MB 이하의 전자책 기준 60초 이내에 다운로드된다
  5. EPUB 파일이 epubcheck 유효성 검사를 통과한다 (기본 검증)
- **기술 노트**:
  - EPUB 생성: `epub-gen-memory` npm 패키지로 HTML -> EPUB 3.0 변환 (브라우저/Node.js 양쪽 지원)
  - PDF 생성: Next.js API Route에서 Puppeteer (@sparticuz/chromium-min for serverless) 또는 외부 서비스(Browserless.io)로 HTML -> PDF 변환
  - 생성 파이프라인: (1) Tiptap JSON -> HTML 변환 -> (2) 템플릿 CSS 적용 -> (3) 커버 이미지 삽입 -> (4) EPUB/PDF 생성 -> (5) Supabase Storage에 임시 저장 -> (6) 다운로드 링크 제공
  - Serverless 환경(Vercel)에서 Puppeteer의 50MB 바이너리 제한 고려: @sparticuz/chromium-min 사용 또는 별도 PDF 생성 서비스 마이크로서비스 분리

#### F7: 사용자 인증 & 프로젝트 관리 — P0
- **설명**: 이메일/소셜 로그인 기반 인증과 전자책 프로젝트 CRUD(생성, 조회, 수정, 삭제) 관리 기능
- **사용자 스토리**: As a 박준호(첫 전자책 출판자), I want to 여러 전자책 프로젝트를 만들고 관리하면서 언제 어디서든 이어서 작업하고 싶다 so that 작업 진행 상황을 잃어버리지 않고 여러 기기에서 동일한 경험을 할 수 있다
- **수용 기준**:
  1. 이메일+비밀번호 회원가입/로그인이 가능하다
  2. Google 소셜 로그인이 가능하다
  3. 대시보드에서 내 프로젝트 목록(제목, 최종 수정일, 챕터 수, 썸네일)을 볼 수 있다
  4. 새 프로젝트 생성 시 "빈 프로젝트" 또는 "콘텐츠 임포트로 시작" 중 선택할 수 있다
  5. 프로젝트 삭제 시 확인 다이얼로그가 표시되고, 삭제된 프로젝트는 30일간 휴지통에 보관된다
- **기술 노트**:
  - Supabase Auth 사용: 이메일/비밀번호 + Google OAuth2 지원 (Supabase 대시보드에서 설정)
  - JWT 기반 세션 관리, Supabase의 자동 토큰 리프레시
  - Row Level Security(RLS): 각 사용자는 자신의 프로젝트만 접근 가능
  - 프로젝트 데이터: Supabase PostgreSQL에 저장, 에디터 콘텐츠는 JSONB 컬럼

### MVP 범위 밖 (Out of Scope)

- **오프라인 모드 / Service Worker 캐싱**: MVP 이후 Phase 2에서 구현
- **실시간 협업 편집**: 1인 사용 우선, 협업은 향후 검토
- **AI 전체 전자책 자동 생성** (무에서 유 창작): AI는 기존 콘텐츠의 구조화/편집 보조에 집중
- **인쇄본(Print) 포맷 지원**: 전자책(EPUB/PDF)에만 집중
- **다국어 자동 번역**: 향후 버전
- **A/B 테스트 커버 기능**: 향후 버전
- **팀/조직 기능**: 개인 사용자 우선
- **커스텀 도메인 / 화이트라벨**: B2B 확장 시
- **Kindle/교보문고 직접 업로드 연동**: API 접근 제한으로 향후 검토
- **오디오북 변환 (TTS)**: Phase 3 이후
- **RSS 피드 자동 모니터링**: Phase 2 이후

---

## 4. 기술 스택

| 레이어 | 선택 | 이유 | 대안 |
|--------|------|------|------|
| Frontend | **Next.js 16 (App Router)** | 최신 안정 버전(v16.1.6), SSR/SSG 지원, Vercel 원클릭 배포, React Server Components로 성능 최적화, PWA manifest 네이티브 지원 | Nuxt 4, SvelteKit 2 |
| Language | **TypeScript** | 타입 안전성, 프론트/백엔드 통일, AI 코딩 도구 호환성 최고 | JavaScript |
| UI Components | **shadcn/ui + Tailwind CSS + Lucide Icons** | shadcn/ui는 2026년 2월 기준 Radix UI 통합 패키지 적용 완료, RTL 지원 추가. 복사-붙여넣기 방식이라 커스터마이징 자유도 높음. Tailwind으로 반응형 설계 용이 | Chakra UI, Mantine, Ant Design |
| Rich Text Editor | **Tiptap (React)** | ProseMirror 기반 헤드리스 에디터, 모바일 터치 지원 개선(3.x), 확장 가능한 플러그인 아키텍처, BubbleMenu/FloatingMenu 네이티브 지원 | Plate, Lexical, Quill |
| Backend/BaaS | **Supabase** | Auth + DB + Storage + Edge Functions를 하나의 서비스로 제공, Free tier(500MB DB, 50K MAU, 1GB Storage)로 MVP 무료 운영 가능, RLS로 보안 자동화 | Firebase, Neon + Clerk, PlanetScale |
| Database | **Supabase PostgreSQL** | Supabase에 포함, JSONB 컬럼으로 Tiptap 에디터 JSON 콘텐츠 저장에 적합, Full-text search 지원 | PlanetScale MySQL, Neon PostgreSQL |
| AI - 텍스트 | **Claude Sonnet 4.5 API** | $3/$15 per 1M tokens로 비용 효율적이면서 고품질, 200K 컨텍스트 윈도우로 긴 콘텐츠 처리 가능, Prompt Caching으로 반복 사용 시 90% 비용 절감 | GPT-4o mini ($0.15/$0.60 per 1M — 더 저렴하지만 품질 하위), Claude Haiku 4.5 ($1/$5 per 1M — 간단한 작업용 보조 모델로 병용) |
| AI - 이미지 | **DALL-E 3 API** | $0.04~$0.08/이미지로 합리적 가격, 텍스트 렌더링 품질 양호 (커버 디자인에 유리), 안정적인 API | GPT Image 1 (더 높은 품질, 가격 유사), Stable Diffusion API (오픈소스, 자체 호스팅 가능) |
| Hosting | **Vercel (Hobby -> Pro)** | Next.js 공식 호스팅, Hobby(무료) 플랜으로 시작 가능, 자동 배포, Edge Functions, 글로벌 CDN | Cloudflare Pages, Railway, Fly.io |
| Auth | **Supabase Auth** | 이메일/비밀번호 + Google OAuth 기본 지원, JWT 자동 관리, Next.js 미들웨어와 통합, Free tier 50K MAU | Clerk ($25/mo 1만 MAU 이상), NextAuth.js (직접 구현) |
| File Storage | **Supabase Storage** | Free tier 1GB, 이미지/파일 업로드 및 CDN 제공, RLS 정책으로 접근 제어 | AWS S3, Cloudflare R2 |
| URL Scraping | **Mozilla Readability.js** | 오픈소스, 브라우저/Node.js 양쪽 지원, Mozilla 공식 라이브러리로 신뢰성 높음, 정적 HTML 블로그에 최적 | Firecrawl API ($16/mo), Jina Reader API |
| EPUB 생성 | **epub-gen-memory** | Node.js/브라우저 양쪽 지원, HTML -> EPUB 3.0 변환, 이미지 자동 다운로드/임베딩, 간단한 API | jEpub, epub-gen |
| PDF 생성 | **Puppeteer + @sparticuz/chromium-min** | Serverless 환경 최적화 Chromium 바이너리, HTML -> PDF 변환 품질 최고 | Browserless.io (외부 서비스, $0/50 units free), React-PDF |
| 파일 파싱 | **mammoth (DOCX), pdf-parse (PDF)** | 검증된 오픈소스, Node.js 네이티브 지원 | Apache Tika (Java 기반, 과도) |
| YouTube 자막 | **youtube-transcript (npm)** | API 키 불필요, 자동 생성 자막 포함, 무료 | Supadata API (100 free req), youtube-transcript-api (Python) |
| 랜딩 페이지 효과 | **Magic UI / Aceternity UI** | 인터랙티브 애니메이션 컴포넌트, shadcn/ui와 호환, 랜딩페이지에 활용 | Framer Motion 직접 구현 |

### 백엔드 아키텍처 결정 근거

**Supabase (BaaS)를 메인 백엔드로 선택한 이유:**

이 제품의 백엔드 요구사항을 분석하면:
- **데이터 구조**: 프로젝트, 챕터, 사용자 프로필 등 관계형 CRUD가 핵심
- **인증**: 이메일 + Google 소셜 로그인 (Supabase Auth가 즉시 제공)
- **파일 저장**: 업로드된 원본 파일, 생성된 커버 이미지, 내보낸 EPUB/PDF (Supabase Storage)
- **AI 연동**: Claude API, DALL-E API 호출은 단순 HTTP 요청 수준으로, Next.js API Routes에서 처리 가능

복잡한 AI 파이프라인(모델 서빙, RAG, 벡터 DB)이 필요하지 않고, CRUD + Auth + 파일 관리 + 간단한 AI API 호출이 핵심이므로, Supabase가 최적의 선택이다. Python FastAPI를 별도로 구축할 필요가 없어 개발 속도가 크게 단축된다.

**하이브리드 전략**: PDF 생성(Puppeteer)이 Vercel Serverless Function의 메모리/시간 제한에 걸릴 수 있으므로, 이 부분만 별도 서버리스 함수(AWS Lambda) 또는 외부 서비스(Browserless.io)로 분리하는 것을 대비한다.

---

## 5. 데이터 모델

### 핵심 엔티티

#### profiles (Supabase Auth 확장)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key (auth.users 참조) |
| email | TEXT | 이메일 주소 (auth.users에서 자동) |
| full_name | TEXT | 표시 이름 |
| avatar_url | TEXT | 프로필 이미지 URL |
| plan | TEXT | 요금제 ('free' / 'pro' / 'business'), default: 'free' |
| monthly_exports | INT | 이번 달 내보내기 횟수, default: 0 |
| monthly_ai_covers | INT | 이번 달 AI 커버 생성 횟수, default: 0 |
| monthly_structures | INT | 이번 달 AI 구조화 횟수, default: 0 |
| usage_reset_at | TIMESTAMPTZ | 월간 사용량 초기화 일시 |
| created_at | TIMESTAMPTZ | 가입일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |

#### projects
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key (gen_random_uuid()) |
| user_id | UUID | FK -> profiles.id |
| title | TEXT | 전자책 제목 |
| description | TEXT | 전자책 설명 (선택) |
| cover_url | TEXT | 커버 이미지 URL (Supabase Storage) |
| template_id | TEXT | 선택된 템플릿 ID |
| template_config | JSONB | 템플릿 커스텀 설정 (컬러, 폰트 등) |
| status | TEXT | 프로젝트 상태 ('draft' / 'completed' / 'deleted') |
| metadata | JSONB | 추가 메타데이터 (장르, 키워드, 타겟 독자 등) |
| word_count | INT | 전체 단어 수 (자동 계산) |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |
| deleted_at | TIMESTAMPTZ | 소프트 삭제일 (30일 휴지통) |

#### chapters
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id (CASCADE DELETE) |
| title | TEXT | 챕터 제목 |
| content | JSONB | Tiptap 에디터 JSON 콘텐츠 |
| content_html | TEXT | HTML 변환본 (내보내기용 캐시) |
| order_index | INT | 챕터 순서 (0부터 시작) |
| word_count | INT | 단어 수 (자동 계산) |
| source_type | TEXT | 콘텐츠 출처 ('manual' / 'url' / 'file' / 'youtube') |
| source_url | TEXT | 원본 소스 URL (해당 시) |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |

#### imports
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| user_id | UUID | FK -> profiles.id |
| source_type | TEXT | 'url' / 'file' / 'youtube' / 'text' |
| source_value | TEXT | URL, 파일 경로, 또는 직접 입력 텍스트 |
| raw_content | TEXT | 추출된 원본 텍스트 |
| status | TEXT | 'pending' / 'processing' / 'completed' / 'failed' |
| error_message | TEXT | 실패 시 오류 메시지 |
| created_at | TIMESTAMPTZ | 생성일 |

#### exports
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| user_id | UUID | FK -> profiles.id |
| format | TEXT | 'epub' / 'pdf' |
| file_url | TEXT | 생성된 파일 URL (Supabase Storage) |
| file_size | INT | 파일 크기 (bytes) |
| status | TEXT | 'pending' / 'processing' / 'completed' / 'failed' |
| created_at | TIMESTAMPTZ | 생성일 |

#### cover_generations
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| user_id | UUID | FK -> profiles.id |
| prompt | TEXT | AI에 전달된 최종 프롬프트 |
| image_urls | TEXT[] | 생성된 이미지 URL 배열 (3개) |
| selected_url | TEXT | 사용자가 선택한 최종 이미지 URL |
| config | JSONB | 타이포그래피 설정 (폰트, 크기, 위치, 색상) |
| created_at | TIMESTAMPTZ | 생성일 |

### 엔티티 관계

```
profiles (1) --- (*) projects          : 한 사용자는 여러 프로젝트를 가질 수 있다
projects (1) --- (*) chapters          : 한 프로젝트는 여러 챕터를 가진다
projects (1) --- (*) imports           : 한 프로젝트에 여러 임포트가 가능하다
projects (1) --- (*) exports           : 한 프로젝트에서 여러 번 내보내기 가능
projects (1) --- (*) cover_generations : 한 프로젝트에 여러 커버 생성 기록
```

### RLS (Row Level Security) 정책

```sql
-- profiles: 본인만 조회/수정
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- projects: 본인 프로젝트만 CRUD
CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

-- chapters: 프로젝트 소유자만 접근
CREATE POLICY "Users can CRUD own chapters" ON chapters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = chapters.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- imports: 프로젝트 소유자만 접근
CREATE POLICY "Users can CRUD own imports" ON imports
  FOR ALL USING (auth.uid() = user_id);

-- exports: 프로젝트 소유자만 접근
CREATE POLICY "Users can CRUD own exports" ON exports
  FOR ALL USING (auth.uid() = user_id);

-- cover_generations: 프로젝트 소유자만 접근
CREATE POLICY "Users can CRUD own covers" ON cover_generations
  FOR ALL USING (auth.uid() = user_id);
```

### 자동 프로필 생성 트리거

```sql
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, plan)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    'free'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

---

## 6. API 설계

### 주요 엔드포인트

| Method | Endpoint | 설명 | Auth |
|--------|----------|------|------|
| POST | /api/auth/signup | 이메일 회원가입 | Public |
| POST | /api/auth/login | 이메일 로그인 | Public |
| POST | /api/auth/oauth/google | Google 소셜 로그인 | Public |
| GET | /api/projects | 내 프로젝트 목록 조회 | Required |
| POST | /api/projects | 새 프로젝트 생성 | Required |
| GET | /api/projects/[id] | 프로젝트 상세 조회 (챕터 포함) | Required |
| PATCH | /api/projects/[id] | 프로젝트 메타정보 수정 | Required |
| DELETE | /api/projects/[id] | 프로젝트 소프트 삭제 | Required |
| POST | /api/projects/[id]/import | 콘텐츠 임포트 (URL/파일/유튜브) | Required |
| GET | /api/projects/[id]/import/status | 임포트 배치 상태 조회 | Required |
| POST | /api/projects/[id]/structure | AI 자동 구조화 요청 | Required |
| POST | /api/projects/[id]/structure/apply | AI 구조화 결과 적용 (챕터 생성) | Required |
| GET | /api/projects/[id]/chapters | 챕터 목록 조회 | Required |
| POST | /api/projects/[id]/chapters | 새 챕터 추가 | Required |
| PATCH | /api/projects/[id]/chapters/[chId] | 챕터 내용/순서 수정 (자동 저장) | Required |
| DELETE | /api/projects/[id]/chapters/[chId] | 챕터 삭제 | Required |
| PATCH | /api/projects/[id]/chapters/reorder | 챕터 순서 일괄 변경 | Required |
| POST | /api/projects/[id]/ai/refine | AI 텍스트 다듬기 (선택 텍스트 개선) | Required |
| POST | /api/projects/[id]/export | EPUB/PDF 내보내기 요청 | Required |
| GET | /api/projects/[id]/export/[exportId] | 내보내기 상태/다운로드 URL 조회 | Required |
| POST | /api/projects/[id]/cover/generate | AI 커버 이미지 생성 | Required |
| POST | /api/projects/[id]/cover/select | 생성된 커버 중 하나 선택 | Required |
| POST | /api/upload | 파일 업로드 (Supabase Storage 프록시) | Required |

### 주요 API 상세

#### POST /api/projects/[id]/import

콘텐츠를 다양한 소스에서 임포트한다.

- **Request**:
```json
{
  "sources": [
    { "type": "url", "value": "https://blog.example.com/post-1" },
    { "type": "url", "value": "https://blog.example.com/post-2" },
    { "type": "youtube", "value": "https://youtube.com/watch?v=abc123" },
    { "type": "file", "value": "uploads/doc-uuid.docx" },
    { "type": "text", "value": "직접 입력한 텍스트 내용..." }
  ]
}
```
- **Response (202 Accepted)**:
```json
{
  "import_batch_id": "uuid-batch-123",
  "total": 5,
  "status": "processing",
  "imports": [
    { "id": "uuid-1", "source_type": "url", "status": "processing" },
    { "id": "uuid-2", "source_type": "url", "status": "processing" },
    { "id": "uuid-3", "source_type": "youtube", "status": "processing" },
    { "id": "uuid-4", "source_type": "file", "status": "processing" },
    { "id": "uuid-5", "source_type": "text", "status": "completed" }
  ]
}
```
- **비동기 처리**: URL 스크래핑과 파일 파싱은 시간이 걸리므로, 202를 즉시 반환하고 백그라운드에서 처리. 클라이언트는 `/api/projects/[id]/import/status`로 폴링하거나 Supabase Realtime 구독으로 상태 변경을 감지.

#### POST /api/projects/[id]/structure

AI 자동 구조화를 요청한다.

- **Request**:
```json
{
  "options": {
    "tone": "conversational",
    "generate_intro": true,
    "generate_conclusion": true,
    "remove_duplicates": true,
    "language": "ko"
  }
}
```
- **Response (200 OK)**:
```json
{
  "suggested_title": "마케팅 초보 가이드: 블로그에서 배운 실전 노하우",
  "suggested_chapters": [
    {
      "order": 0,
      "title": "서문",
      "content_preview": "이 책은 3년간의 블로그 운영 경험을 바탕으로...",
      "source_imports": [],
      "is_generated": true,
      "estimated_word_count": 800
    },
    {
      "order": 1,
      "title": "1장. 마케팅의 기본기",
      "content_preview": "마케팅이란 무엇인가? 많은 사람들이...",
      "source_imports": ["uuid-1", "uuid-3"],
      "is_generated": false,
      "estimated_word_count": 3200
    },
    {
      "order": 2,
      "title": "2장. SNS 마케팅 전략",
      "content_preview": "소셜미디어는 현대 마케팅의 핵심...",
      "source_imports": ["uuid-2"],
      "is_generated": false,
      "estimated_word_count": 2800
    }
  ],
  "duplicates_found": [
    {
      "description": "'SEO 기초' 내용이 포스트 1과 포스트 3에서 중복됩니다.",
      "recommendation": "포스트 1의 버전이 더 상세하므로 이를 유지하고 포스트 3의 내용은 삭제를 권장합니다."
    }
  ],
  "total_estimated_words": 15000,
  "estimated_pages": 45
}
```

#### POST /api/projects/[id]/cover/generate

AI 커버 이미지를 생성한다.

- **Request**:
```json
{
  "title": "마케팅 초보 가이드",
  "author": "김서연",
  "genre": "business",
  "mood_keywords": ["professional", "modern", "minimal"],
  "color_preference": "#2563eb"
}
```
- **Response (200 OK)**:
```json
{
  "generation_id": "uuid-gen-123",
  "covers": [
    {
      "id": "cover-1",
      "image_url": "https://xxx.supabase.co/storage/v1/object/public/covers/gen-123-1.png",
      "prompt_used": "Professional modern minimalist book cover background..."
    },
    {
      "id": "cover-2",
      "image_url": "https://xxx.supabase.co/storage/v1/object/public/covers/gen-123-2.png",
      "prompt_used": "Clean business style book cover background..."
    },
    {
      "id": "cover-3",
      "image_url": "https://xxx.supabase.co/storage/v1/object/public/covers/gen-123-3.png",
      "prompt_used": "Elegant minimal cover design background..."
    }
  ]
}
```

#### POST /api/projects/[id]/export

전자책 내보내기를 요청한다.

- **Request**:
```json
{
  "format": "epub",
  "include_cover": true,
  "include_toc": true
}
```
- **Response (202 Accepted)**:
```json
{
  "export_id": "uuid-export-456",
  "status": "processing",
  "estimated_seconds": 30
}
```
- **완료 후 GET /api/projects/[id]/export/uuid-export-456**:
```json
{
  "export_id": "uuid-export-456",
  "status": "completed",
  "format": "epub",
  "file_url": "https://xxx.supabase.co/storage/v1/object/sign/exports/book-456.epub?token=...",
  "file_size": 2048576,
  "expires_at": "2026-02-12T11:30:00Z",
  "created_at": "2026-02-12T10:30:00Z"
}
```

#### PATCH /api/projects/[id]/chapters/[chId]

챕터 내용을 자동 저장한다 (에디터 debounce에서 호출).

- **Request**:
```json
{
  "content": {
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 1 },
        "content": [{ "type": "text", "text": "1장. 마케팅의 기본기" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "마케팅이란..." }]
      }
    ]
  },
  "title": "1장. 마케팅의 기본기"
}
```
- **Response (200 OK)**:
```json
{
  "id": "chapter-uuid",
  "updated_at": "2026-02-12T10:30:05Z",
  "word_count": 3245
}
```

---

## 7. 페이지/화면 구조

### 라우팅 맵 (Next.js App Router)

```
/                              -> 랜딩 페이지 (비로그인)
/login                         -> 로그인 페이지
/signup                        -> 회원가입 페이지
/dashboard                     -> 대시보드 (프로젝트 목록)
/projects/new                  -> 새 프로젝트 생성 (빈 프로젝트 / 임포트 선택)
/projects/[id]                 -> 프로젝트 메인 (워크플로우 스텝 표시)
/projects/[id]/import          -> 콘텐츠 임포트 페이지
/projects/[id]/structure       -> AI 구조화 결과 & 편집
/projects/[id]/editor          -> WYSIWYG 에디터 (챕터 편집)
/projects/[id]/cover           -> AI 커버 생성 & 편집
/projects/[id]/template        -> 템플릿 선택 & 미리보기
/projects/[id]/export          -> 내보내기 (EPUB/PDF)
/projects/[id]/preview         -> 전체 미리보기
/settings                     -> 사용자 설정 (프로필, 요금제)
/pricing                      -> 요금제 안내
```

### 핵심 화면 설명

1. **랜딩 페이지 (`/`)**: 제품 소개, 3단계 워크플로우 시각화 (Import -> Edit -> Export), CTA 버튼 "무료로 시작하기", 데모 영상/GIF, 경쟁사 대비 가격 비교표, FAQ
2. **대시보드 (`/dashboard`)**: 프로젝트 카드 그리드(모바일 1열, 태블릿 2열, 데스크톱 3열), 각 카드에 제목/최종수정일/챕터수/단어수/상태 배지. "새 프로젝트" 버튼이 상단에 고정. 모바일에서는 FAB(Floating Action Button)
3. **프로젝트 메인 (`/projects/[id]`)**: 좌측 사이드바에 워크플로우 스텝(임포트->구조화->편집->커버->템플릿->내보내기) 표시, 각 스텝 완료 상태를 체크마크로 표시. 모바일에서는 상단 수평 스텝 바로 전환
4. **에디터 (`/projects/[id]/editor`)**: 풀스크린 Tiptap 에디터. 데스크톱: 좌측에 챕터 목차 사이드바, 상단에 서식 툴바. 모바일: 하단 고정 서식 툴바, 챕터 목차는 하단 시트(bottom sheet)로 접근. 자동 저장 상태 표시 ("저장됨" / "저장 중...")

---

## 8. 사용자 플로우

### 플로우 1: 블로그 콘텐츠를 전자책으로 변환 (핵심 시나리오)

1. 사용자가 `/dashboard`에서 "새 프로젝트" 클릭 ->
2. "콘텐츠 임포트로 시작" 옵션 선택 -> `/projects/[id]/import` 이동 ->
3. 블로그 URL 5개를 텍스트 영역에 한 줄에 하나씩 붙여넣기 ->
4. "임포트 시작" 버튼 클릭 -> 프로그레스 바가 각 URL의 처리 상태를 표시 ->
5. [에러 케이스] 특정 URL이 자바스크립트 렌더링 페이지라 추출 실패 시: "이 페이지는 자동 추출이 불가합니다. 텍스트를 직접 붙여넣어주세요" 메시지 표시, 수동 입력 폼 제공 ->
6. 임포트 완료 시 "AI 구조화 시작" 버튼 활성화 -> 클릭 ->
7. `/projects/[id]/structure`로 이동, AI가 제안한 챕터 구조가 카드 형태로 표시 (각 카드에 챕터 제목, 미리보기 텍스트, 예상 단어 수, 원본 소스 표시) ->
8. 사용자가 챕터 순서를 드래그 앤 드롭으로 조정, 불필요한 챕터 삭제 ->
9. "어조 통일" 드롭다운에서 "대화체" 선택 후 "적용" 클릭 ->
10. "구조 확정" 클릭 -> AI가 최종 콘텐츠를 생성하여 챕터별로 저장 ->
11. `/projects/[id]/editor`로 이동, 생성된 챕터들을 에디터에서 자유롭게 편집 ->
12. 편집 완료 후 `/projects/[id]/cover`에서 AI 커버 생성 (제목/장르/키워드 입력 -> 3개 시안 -> 선택 -> 타이포그래피 조정) ->
13. `/projects/[id]/template`에서 템플릿 선택 및 미리보기 확인 ->
14. `/projects/[id]/export`에서 EPUB/PDF 선택 -> 다운로드 -> 크몽/KDP에 업로드

### 플로우 2: 처음부터 전자책 작성 (에디터 중심)

1. 사용자가 `/dashboard`에서 "새 프로젝트" 클릭 ->
2. "빈 프로젝트" 옵션 선택 -> 프로젝트 제목 입력 ->
3. `/projects/[id]/editor`로 바로 이동 ->
4. [모바일 경험] 스마트폰에서 접근 시: 하단 고정 툴바에 텍스트 서식 버튼 표시, FloatingMenu로 새 블록(제목, 리스트, 인용) 추가 ->
5. "새 챕터" 버튼으로 챕터를 추가하고, 각 챕터에 내용을 작성 ->
6. AI 보조 기능: 에디터 내에서 텍스트를 선택하고 BubbleMenu의 "AI로 다듬기" 버튼 클릭 시, Claude API로 선택한 텍스트를 개선 (문장 다듬기, 오타 수정, 문단 확장 옵션 제공) ->
7. 자동 저장이 3초 간격으로 동작, 상태바에 "저장됨" 표시 ->
8. [에러 케이스] 네트워크 끊김 시: 로컬 스토리지에 임시 저장, 연결 복구 시 자동 동기화. 충돌 시 "서버 버전"과 "로컬 버전" 중 선택 가능 ->
9. 작성 완료 후 커버 생성 -> 템플릿 선택 -> 내보내기 (플로우 1의 12-14 단계와 동일)

### 플로우 3: 유튜브 콘텐츠를 전자책으로 변환

1. 사용자가 "콘텐츠 임포트로 시작" -> 소스 타입에서 "유튜브" 탭 선택 ->
2. 유튜브 URL 3개를 입력 ->
3. 시스템이 자막/스크립트를 자동 추출 (한국어/영어 자막 우선, 없으면 자동 생성 자막 활용) ->
4. [에러 케이스] 자막이 없는 영상: "이 영상에는 추출 가능한 자막이 없습니다. 직접 대본을 입력하거나 다른 영상을 선택해주세요" 메시지 ->
5. 추출된 스크립트가 임포트 목록에 표시 ->
6. AI 구조화 시 "구어체 -> 문어체 변환" 옵션이 기본으로 활성화됨 ->
7. 이후 플로우 1의 7~14 단계와 동일

---

## 9. 개발 로드맵

| 주차 | 목표 | 구체적 작업 |
|------|------|-------------|
| **1주차** | 프로젝트 셋업 & 인증 | - Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui 프로젝트 초기화 (`npx create-next-app@latest --typescript --tailwind`) / - shadcn/ui 컴포넌트 설치 (Button, Card, Dialog, Input, Form, Sheet, Tabs, Toast, Progress) / - Supabase 프로젝트 생성 및 DB 스키마 설정 (profiles, projects, chapters, imports, exports, cover_generations 테이블 + RLS 정책 + 트리거) / - Supabase Auth 연동 (이메일+비밀번호, Google OAuth) / - 로그인/회원가입 페이지 구현 / - Next.js 미들웨어에서 Auth 세션 검증 / - PWA manifest.ts 설정 / - 기본 레이아웃 구현 (반응형 사이드바 with Sheet for mobile, 하단 모바일 네비게이션) / - Vercel 배포 파이프라인 설정 |
| **2주차** | 대시보드 & 에디터 기본 | - 대시보드 페이지 구현 (프로젝트 카드 그리드, 반응형 1-3열, 정렬/필터) / - 새 프로젝트 생성 플로우 (빈 프로젝트 / 임포트 시작 분기) / - 프로젝트 CRUD API 구현 (Next.js API Routes + Supabase Client) / - Tiptap 에디터 셋업: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-placeholder` / - EditorContent + BubbleMenu + FloatingMenu 구현 / - 모바일 반응형 에디터 레이아웃 (하단 고정 MobileToolbar 컴포넌트) / - 챕터 관리 (추가, 삭제, 순서 변경 - 데스크톱 사이드바 + 모바일 BottomSheet) / - 자동 저장 기능 구현: `editor.on('update')` + debounce(3초) + Supabase upsert |
| **3주차** | 콘텐츠 임포트 시스템 | - URL 스크래핑 API 구현: Next.js API Route에서 `node-fetch` + `@mozilla/readability` + `jsdom`으로 본문 추출 / - 파일 업로드 API: Supabase Storage에 업로드 -> `mammoth`(DOCX->HTML), `pdf-parse`(PDF->텍스트) 파싱 / - 유튜브 자막 추출: `youtube-transcript` npm 패키지 연동 / - 직접 텍스트 입력 폼 (다중 소스 탭 UI: URL | 파일 | 유튜브 | 텍스트) / - 배치 임포트 UI (최대 20개, 프로그레스 바, 개별 상태 표시) / - 임포트 결과를 imports 테이블에 저장, 상태 폴링 API / - 에러 핸들링: URL 추출 실패 시 수동 입력 유도, 파일 포맷 오류 시 지원 포맷 안내 |
| **4주차** | AI 구조화 엔진 & AI 보조 | - Anthropic Claude Sonnet 4.5 API 연동 (`@anthropic-ai/sdk`) / - AI 구조화 프롬프트 설계 (시스템 프롬프트: "전자책 편집 전문가" 역할, JSON 구조화 응답 요청) / - 구조화 파이프라인 구현: (1) 전체 콘텐츠 분석 -> (2) 챕터 분리/목차 제안 -> (3) 중복 감지 -> (4) 어조 통일 옵션 / - 구조화 결과 UI: 챕터 카드 그리드, 드래그앤드롭 순서 변경 (`@dnd-kit/core`), 미리보기 / - "구조 확정" 시 chapters 테이블에 일괄 저장 / - 에디터 내 "AI로 다듬기" 기능: BubbleMenu에 AI 버튼 추가, 선택 텍스트를 Claude Haiku 4.5에 전송, 개선 결과로 교체 / - Prompt Caching 적용 (반복 편집 세션에서 시스템 프롬프트 캐시 활용) |
| **5주차** | AI 커버 & 템플릿 시스템 | - OpenAI DALL-E 3 API 연동 (`openai` npm 패키지) / - 장르별 프롬프트 템플릿 설계: 10가지 장르(비즈니스, 자기계발, 기술, 소설, 에세이, 요리, 여행, 건강, 교육, 아동) x 분위기 조합 / - 커버 생성 UI: 제목/저자/장르/키워드 입력 폼 -> 3개 시안 그리드 표시 -> 선택 / - Canvas API로 타이포그래피 합성: 제목+저자명 텍스트 오버레이, 위치/크기/색상/폰트 조정 UI / - 5가지 내지 템플릿 CSS 제작 (미니멀, 비즈니스, 클래식, 모던, 크리에이티브) / - 각 템플릿: `style.css` + CSS 변수 (--primary-color, --font-family, --heading-font) / - 템플릿 선택 & 미리보기 페이지: 템플릿 썸네일 그리드, 선택 시 현재 콘텐츠를 iframe으로 미리보기 / - 커스터마이징 UI: 컬러 피커, 폰트 셀렉터 (5종 한글 폰트) |
| **6주차** | 내보내기 & 런칭 | - EPUB 생성: `epub-gen-memory`로 Tiptap JSON -> HTML -> EPUB 3.0 파이프라인 구현. 커버 이미지 + 목차 + 챕터 + 이미지 임베딩 / - PDF 생성: `@sparticuz/chromium-min` + `puppeteer-core`로 HTML -> PDF. 템플릿 CSS 적용. Vercel Serverless Function에서 실행 (메모리 1024MB, 타임아웃 60초 설정). 실패 시 Browserless.io 폴백 / - 내보내기 상태 관리 (pending -> processing -> completed/failed) + 다운로드 UI / - 파일을 Supabase Storage에 저장, 서명된 URL(1시간 만료)로 다운로드 제공 / - 랜딩 페이지 제작: Magic UI 히어로 섹션, 3단계 워크플로우, 기능 소개, 가격 비교표, FAQ, CTA / - 요금제 페이지 (Free/Pro/Business 비교 테이블) / - 전체 E2E 테스트 (모바일 Chrome + Safari, 데스크톱) / - Vercel 프로덕션 배포 + 도메인 연결 / - Sentry 에러 모니터링 설정 / - 오픈 베타 런칭 |

### Phase 2 (런칭 후 +3주, 7~9주차)
- Stripe 결제 연동 (Free -> Pro 업그레이드, 월간/연간 구독)
- 오프라인 모드 (Service Worker + IndexedDB 로컬 캐시)
- 추가 템플릿 10종 제작
- RSS 피드 자동 모니터링 (새 포스트 감지 시 알림)
- 사용자 피드백 기반 UX 개선
- 워터마크 로직 구현 (Free tier 내보내기에 "Made with BookForge" 워터마크)

### Phase 3 (10~13주차)
- 팀/조직 기능 (멀티 사용자, 프로젝트 공유)
- 오디오북 변환 (TTS API 연동)
- 다국어 번역 기능 (AI 번역 + 포매팅 보존)
- B2B 커스텀 브랜딩 (로고, 컬러, 폰트 커스텀)
- A/B 테스트 커버 기능 (소셜 공유 -> 클릭률 비교)
- KDP/교보문고 규격 자동 맞춤 프리셋

---

## 10. 수익 모델 & 가격 전략

### 요금제 구성

| 구분 | Free | Pro | Business |
|------|------|-----|----------|
| **가격** | $0/월 | $9.99/월 ($99/년) | $29.99/월 ($299/년) |
| 프로젝트 수 | 3개 | 무제한 | 무제한 |
| 월 내보내기 | 2회 (워터마크 포함) | 무제한 (워터마크 없음) | 무제한 |
| AI 구조화 | 월 3회 | 무제한 | 무제한 |
| AI 커버 생성 | 월 1회 (1세트 = 3장) | 월 10회 | 무제한 |
| AI 텍스트 다듬기 | 월 10회 | 무제한 | 무제한 |
| 템플릿 | 기본 3종 | 전체 (15종+) | 전체 + 커스텀 브랜딩 |
| 임포트 소스 | URL 5개/프로젝트 | URL 20개/프로젝트 | 무제한 |
| 파일 저장 | 100MB | 5GB | 50GB |
| 지원 | 커뮤니티 | 이메일 | 우선 이메일 |

### 가격 책정 근거
- **Designrr 대비 60% 저렴**: Designrr 기본 $29/월 vs BookForge Pro $9.99/월. Designrr 풀 기능 $100/월 vs BookForge Business $29.99/월
- **Atticus 대비 낮은 진입 장벽**: Atticus $147 일회성 vs BookForge Pro $9.99/월 (12개월 = $99/년, Atticus보다 32% 저렴)
- **크몽 크리에이터 ROI**: 크몽 전자책 평균 판매 가격 15,000~30,000원. Pro 플랜 비용(~14,000원/월)을 전자책 1~2권 판매로 회수 가능

---

## 11. 비용 추정

### 월간 운영 비용 (Free 사용자 200명 + Pro 사용자 50명 기준)

| 항목 | 서비스 | 월 비용 | 산출 근거 |
|------|--------|---------|-----------|
| AI API (텍스트) | Claude Sonnet 4.5 | ~$45 | 250명 x 월 평균 3회 구조화 x ~20K input + 5K output tokens = 15M input + 3.75M output. $3x15 + $15x3.75 = $101. Prompt Caching으로 ~55% 절감 -> ~$45 |
| AI API (다듬기) | Claude Haiku 4.5 | ~$5 | 월 ~2,000회 x 2K input + 1K output = 4M input + 2M output. $1x4 + $5x2 = $14. Caching 적용 -> ~$5 |
| AI API (이미지) | DALL-E 3 | ~$36 | 250명 x 월 평균 1.2회 x 3개 시안 = ~900 이미지 x $0.04 = $36 |
| Hosting | Vercel Pro | $20 | Pro 플랜 (상업 이용, 1TB 대역폭) |
| Database | Supabase Pro | $25 | 8GB DB, 100K MAU, 100GB Storage 포함 |
| File Storage | Supabase (Pro 포함) | $0 | Pro에 100GB 포함, EPUB/PDF/이미지 저장 |
| Domain | Namecheap | ~$1 | .com 도메인 연간 $12 환산 |
| Email | Resend Free | $0 | 100 emails/day 무료 (인증, 알림) |
| Monitoring | Sentry Free | $0 | 5K events/month 무료 |
| 예비 | - | $15 | 예상치 못한 추가 비용 |
| **합계** | | **~$147/월** | **약 21만원/월** |

### 초기 단계 비용 (사용자 50명 미만, Free tier 최대 활용)

| 항목 | 서비스 | 월 비용 | 비고 |
|------|--------|---------|------|
| AI API (텍스트) | Claude Sonnet 4.5 | ~$10 | 사용량 비례 |
| AI API (이미지) | DALL-E 3 | ~$8 | 사용량 비례 |
| Hosting | Vercel Hobby | $0 | 개발/테스트 단계 (상업 이용 시 Pro 필요) |
| Database | Supabase Free | $0 | 500MB DB, 50K MAU |
| Domain | Namecheap | ~$1 | |
| **합계** | | **~$19/월** | **약 2.7만원/월** |

### 손익분기점 분석

**수익 모델**: Pro $9.99/월, Business $29.99/월

| 시나리오 | Pro 사용자 | Business 사용자 | 월 매출 | 월 비용 | 월 순이익 |
|---------|-----------|----------------|---------|---------|-----------|
| 초기 (3개월 차) | 15명 | 0명 | $149.85 | $70 | +$79.85 |
| 성장기 (6개월 차) | 60명 | 5명 | $749.35 | $147 | +$602.35 |
| 안정기 (12개월 차) | 200명 | 30명 | $2,897.70 | $400 | +$2,497.70 |

**손익분기: Pro 사용자 약 15명** (월 비용 $147 / $9.99 = 14.7명)

- Free -> Pro 전환율 업계 평균 2~5%. 무료 사용자 500명 확보 시 Pro 전환 10~25명으로 손익분기 달성 가능
- 한국 크몽 크리에이터 커뮤니티 + 글로벌 셀프퍼블리싱 작가 커뮤니티(Reddit r/selfpublish, Indie Hackers)를 동시 타겟하면 무료 사용자 500명 확보는 현실적

---

## 12. 리스크 & 대응

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| **URL 스크래핑 실패율**: 자바스크립트 렌더링 페이지, 봇 차단, 페이월 등으로 콘텐츠 추출 실패 | 높음 | Readability.js로 정적 HTML 우선 처리 (대부분의 블로그 커버 가능). 실패 시 사용자에게 "수동 복사-붙여넣기" 폼 즉시 제공. Phase 2에서 Firecrawl API($16/월)로 SPA/JavaScript 렌더링 페이지 지원 확대 |
| **AI API 비용 급증**: 사용자 폭증 시 Claude/DALL-E API 비용이 수익을 초과 | 높음 | Free tier에 엄격한 월간 사용 횟수 제한 (구조화 3회, 커버 1회, 다듬기 10회). Prompt Caching으로 반복 비용 90% 절감. 구조화 요청당 토큰 사용량 모니터링 대시보드 구축. 비용이 높은 작업(커버 생성, 어조 통일)은 Pro 이상으로 제한 |
| **Vercel Serverless 제한**: PDF 생성(Puppeteer)이 실행 시간(10초)/메모리(1024MB) 제한에 걸림 | 중간 | @sparticuz/chromium-min으로 바이너리 최소화. Vercel Pro에서 maxDuration 60초로 설정. 실패 시 Browserless.io(외부 서비스, 50 units 무료) 폴백. 장기적으로 PDF 생성만 AWS Lambda로 분리 |
| **Tiptap 모바일 호환성**: 특정 모바일 브라우저(삼성 인터넷, 저사양 기기)에서 에디터 동작 불안정 | 중간 | Tiptap 3.x의 모바일 터치 개선 활용. iOS Safari + Android Chrome에서 집중 테스트. 에디터 무거워지면 챕터별 lazy loading 적용. 심각한 버그 시 모바일에서는 간소화된 편집 모드(textarea 기반) 제공 |
| **EPUB 호환성 문제**: 생성된 EPUB이 특정 리더기(Kindle, Apple Books, 교보 Sam)에서 렌더링 오류 | 중간 | epub-gen-memory로 EPUB 3.0 표준 준수. 주요 리더기 3곳(Kindle Previewer, Apple Books, 교보 Sam)에서 테스트. 한글 폰트 임베딩 여부를 옵션으로 제공. 이미지 최적화(WebP -> PNG 변환, 최대 해상도 제한) |
| **경쟁사 대응**: Designrr이 가격 인하하거나, Canva/Notion이 전자책 변환 기능 추가 | 낮음 | "모바일 퍼스트 + AI 자동 구조화 + 한국어 최적화" 3중 차별화 유지. 빠른 피처 업데이트(2주 스프린트)로 경쟁 우위 확보. 커뮤니티 구축(Discord/카카오톡)으로 사용자 락인 |
| **한국어 AI 품질**: Claude의 한국어 구조화/편집 품질이 영어 대비 낮을 수 있음 | 중간 | 한국어 전용 프롬프트 최적화 (한국어 예시 포함). 다양한 한국어 블로그 콘텐츠로 구조화 품질 테스트 (최소 20건). Claude Sonnet 4.5의 한국어 성능이 부족하면 GPT-4o로 대체 또는 병용 |
| **Supabase Free tier 제한**: DB 7일 비활성 시 자동 일시중지, 500MB 저장 제한 | 낮음 | MVP 베타 런칭 시점에 Supabase Pro($25/월) 즉시 업그레이드. 비용 추정에 이미 반영 완료 |

---

## 부록 A: 환경 변수 목록

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_APP_URL=https://bookforge.app
NEXT_PUBLIC_APP_NAME=BookForge
```

---

## 부록 B: 프로젝트 디렉토리 구조

```
bookforge/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # 인증 그룹 (사이드바 없음)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (main)/                       # 인증 필요 그룹 (사이드바 있음)
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # 프로젝트 개요/워크플로우
│   │   │       ├── import/page.tsx
│   │   │       ├── structure/page.tsx
│   │   │       ├── editor/page.tsx
│   │   │       ├── cover/page.tsx
│   │   │       ├── template/page.tsx
│   │   │       ├── preview/page.tsx
│   │   │       └── export/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/                          # API Routes
│   │   ├── projects/
│   │   │   ├── route.ts              # GET (목록), POST (생성)
│   │   │   └── [id]/
│   │   │       ├── route.ts          # GET, PATCH, DELETE
│   │   │       ├── import/
│   │   │       │   ├── route.ts      # POST (임포트 시작)
│   │   │       │   └── status/route.ts  # GET (상태 조회)
│   │   │       ├── structure/
│   │   │       │   ├── route.ts      # POST (AI 구조화)
│   │   │       │   └── apply/route.ts   # POST (구조 확정)
│   │   │       ├── chapters/
│   │   │       │   ├── route.ts      # GET, POST
│   │   │       │   ├── [chId]/route.ts  # PATCH, DELETE
│   │   │       │   └── reorder/route.ts # PATCH
│   │   │       ├── ai/
│   │   │       │   └── refine/route.ts  # POST (텍스트 다듬기)
│   │   │       ├── cover/
│   │   │       │   ├── generate/route.ts
│   │   │       │   └── select/route.ts
│   │   │       └── export/
│   │   │           ├── route.ts      # POST (내보내기 요청)
│   │   │           └── [exportId]/route.ts  # GET (상태/다운로드)
│   │   └── upload/route.ts           # POST (파일 업로드)
│   ├── manifest.ts                   # PWA manifest
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # 랜딩 페이지
│   └── pricing/page.tsx              # 가격 페이지
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트
│   ├── editor/                       # Tiptap 에디터 관련
│   │   ├── Editor.tsx                # 메인 에디터 컴포넌트
│   │   ├── MenuBar.tsx               # 데스크톱 상단 툴바
│   │   ├── MobileToolbar.tsx         # 모바일 하단 고정 툴바
│   │   ├── ChapterSidebar.tsx        # 데스크톱 챕터 사이드바
│   │   ├── ChapterSheet.tsx          # 모바일 챕터 하단 시트
│   │   └── extensions/               # 커스텀 Tiptap 확장
│   │       └── chapter-break.ts
│   ├── import/                       # 임포트 관련
│   │   ├── ImportForm.tsx
│   │   ├── UrlInput.tsx
│   │   ├── FileUpload.tsx
│   │   ├── YoutubeInput.tsx
│   │   └── ImportProgress.tsx
│   ├── structure/                    # AI 구조화 관련
│   │   ├── StructureResult.tsx
│   │   ├── ChapterCard.tsx
│   │   └── DuplicateAlert.tsx
│   ├── cover/                        # 커버 관련
│   │   ├── CoverGenerator.tsx
│   │   ├── CoverPreview.tsx
│   │   └── TypographyEditor.tsx
│   ├── template/                     # 템플릿 관련
│   │   ├── TemplateGrid.tsx
│   │   ├── TemplatePreview.tsx
│   │   └── CustomizePanel.tsx
│   ├── export/                       # 내보내기 관련
│   │   ├── ExportDialog.tsx
│   │   └── ExportProgress.tsx
│   └── landing/                      # 랜딩 페이지 컴포넌트
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── PricingTable.tsx
│       └── FAQ.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # 브라우저 Supabase 클라이언트
│   │   ├── server.ts                 # 서버 Supabase 클라이언트
│   │   └── types.ts                  # DB 타입 정의 (supabase gen types)
│   ├── ai/
│   │   ├── claude.ts                 # Anthropic Claude API 래퍼
│   │   ├── openai.ts                 # OpenAI (DALL-E) API 래퍼
│   │   └── prompts/
│   │       ├── structure.ts          # 구조화 프롬프트 (시스템 + 사용자)
│   │       ├── tone.ts              # 어조 통일 프롬프트
│   │       ├── refine.ts            # 텍스트 다듬기 프롬프트
│   │       └── cover.ts            # 커버 이미지 프롬프트 (장르별)
│   ├── import/
│   │   ├── url-scraper.ts            # Readability.js + jsdom 래퍼
│   │   ├── file-parser.ts            # mammoth + pdf-parse 래퍼
│   │   └── youtube.ts               # youtube-transcript 래퍼
│   ├── export/
│   │   ├── epub-generator.ts         # epub-gen-memory 래퍼
│   │   ├── pdf-generator.ts          # Puppeteer 래퍼
│   │   └── tiptap-to-html.ts        # Tiptap JSON -> HTML 변환
│   ├── templates/                    # 템플릿 정의
│   │   ├── index.ts                  # 템플릿 레지스트리
│   │   ├── minimal.css
│   │   ├── business.css
│   │   ├── classic.css
│   │   ├── modern.css
│   │   └── creative.css
│   └── utils/
│       ├── constants.ts              # 상수 정의 (장르, 폰트 목록 등)
│       ├── word-count.ts            # 단어 수 계산
│       └── plan-limits.ts           # 요금제별 사용 제한 체크
├── hooks/
│   ├── use-auto-save.ts              # 자동 저장 훅
│   ├── use-editor.ts                 # Tiptap 에디터 초기화 훅
│   └── use-plan-check.ts            # 요금제 제한 체크 훅
├── types/
│   └── index.ts                      # 공유 타입 정의
├── public/
│   ├── icon-192x192.png              # PWA 아이콘
│   ├── icon-512x512.png
│   └── og-image.png                  # OG 이미지
├── middleware.ts                     # Supabase Auth 세션 검증
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 부록 C: 참고 리서치 출처

### 시장 규모 & 트렌드
- Fortune Business Insights: 글로벌 전자책 시장 $50.61B(2025) -> $207.81B(2034), CAGR 16.99%
- 한국 전자책 시장 1조 3천억 원 규모, 전년 대비 14% 성장

### 경쟁사 가격 데이터 (2026년 2월 확인)
| 서비스 | 가격 | 모델 | 핵심 기능 |
|--------|------|------|-----------|
| Designrr | $29~$100+/월 | 구독 | 콘텐츠 재활용 특화, 100+ 템플릿 |
| Vellum | $199.99~$249.99 | 일회성 | Mac 전용, 업계 최고 품질 템플릿 |
| Atticus | $147 | 일회성 | 크로스 플랫폼, 기능 확장 중 |
| Canva | 무료~$120/년 | Freemium | 범용 디자인, 30페이지 제한 |
| Reedsy Studio | 무료 | Freemium | 웹 기반 포매팅 |

### API 가격 (2026년 2월 확인)
| API | 가격 | 비고 |
|-----|------|------|
| Claude Sonnet 4.5 | $3/$15 per 1M tokens (input/output) | Prompt Caching 시 90% 절감 |
| Claude Haiku 4.5 | $1/$5 per 1M tokens | 간단한 작업용 |
| DALL-E 3 | $0.04 (standard)~$0.08 (HD) per image | 1024x1024 기본 |
| GPT-4o mini | $0.15/$0.60 per 1M tokens | 가장 저렴한 대안 |

### 인프라 가격 (2026년 2월 확인)
| 서비스 | Free Tier | Pro |
|--------|-----------|-----|
| Supabase | 500MB DB, 50K MAU, 1GB Storage | $25/월 (8GB DB, 100K MAU, 100GB Storage) |
| Vercel | Hobby: 무료 (비상업) | Pro: $20/월 (상업 이용) |

### 기술 스택 검증 출처
- Next.js 16.1.6 (최신 안정 버전): https://github.com/vercel/next.js/releases
- shadcn/ui: 2026.02 Radix UI 통합 패키지 + RTL 지원: https://ui.shadcn.com/docs/changelog
- Tiptap 3.x: 모바일 터치 이벤트 개선: https://tiptap.dev/blog/release-notes
- epub-gen-memory: Node.js/브라우저 EPUB 생성: https://github.com/cpiber/epub-gen-memory
- youtube-transcript: API 키 불필요 자막 추출: https://www.npmjs.com/package/youtube-transcript
- Mozilla Readability.js: 블로그 본문 추출: https://github.com/mozilla/readability
