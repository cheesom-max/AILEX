# PRD (Product Requirements Document)
# BookForge - AI 올인원 전자책 제작 웹앱

> 작성일: 2026-02-13
> 버전: v1.0
> 기반: final_ideas.md TOP 3 아이디어 통합 (1위: 블로그/SNS 변환 + 2위: 모바일 에디터 + 3위: AI 커버 디자인)
> 프레임워크: 육하원칙 (5W1H)

---

## 1. 왜 (WHY) - 왜 이 제품을 만드는가

### 1.1 문제 정의

크리에이터와 지식 노동자들은 블로그, 유튜브 대본, SNS 스레드 등에 방대한 콘텐츠를 이미 보유하고 있다. 그러나 이 콘텐츠를 전자책으로 재활용하려면 다음과 같은 장벽이 존재한다:

| 장벽 | 현황 | 근거 |
|------|------|------|
| 콘텐츠 수집/구조화에 막대한 수작업 | 블로그 10개 -> 전자책 1권 변환에 평균 20~40시간 소요 | 크리에이터 커뮤니티 조사 |
| 기존 도구의 높은 가격 + 제한적 기능 | Designrr 기본 $29/월이지만 대부분 기능은 $100/월 플랜 필요 | Reddit r/selfpublish 다수 불만 |
| 모바일 편집 불가 | Vellum은 Mac 전용($249.99), Atticus는 데스크톱 중심 | Kindlepreneur 비교 리뷰 |
| 포매팅 오류 반복 | "5개월간 포매팅 문제로 고생" (KBoards 사례). 단락 들여쓰기, 이미지 왜곡, 각주 처리 실패 빈발 | KBoards, Creativindie |
| 커버 디자인 비용 | 전문 디자이너 고용 시 $300~$800. Canva 템플릿은 동질화 문제 | BeYourCover 분석 |
| 처음부터 쓰는 사람에 대한 지원 부족 | 기존 변환 도구는 "기존 콘텐츠가 있는 사람"만 타겟. 새로 쓰는 사람은 별도 도구 필요 | 시장 조사 |

또한 Word/PDF 등 외부 자료를 업로드하여 전자책으로 변환하려는 니즈도 크다. 기존 콘텐츠(블로그, 유튜브 대본 등)를 재활용하는 것뿐 아니라, 처음부터 새로 전자책을 쓰고 싶은 사람도 동일한 플랫폼에서 작업할 수 있어야 한다.

### 1.2 시장 기회

- **전자책 시장 규모**: 글로벌 $50.61B(2025) -> $207.81B(2034), CAGR 16.99% (Fortune Business Insights)
- **셀프 퍼블리싱 급성장**: Amazon KDP에서 연간 수백만 타이틀 출판. 한국 전자책 시장 1조 3천억 원 (전년 대비 14% 성장)
- **AI 도구 수용률**: 53%의 작가가 AI를 커버 디자인 등에 이미 활용 중
- **콘텐츠 재활용 니즈**: 80%의 작가가 마케팅을 어려워하며 콘텐츠 재활용 니즈가 높음 (Whop 통계)
- **경쟁 공백**: "모바일 퍼스트 + AI 자동 구조화 + 커버 생성 + 에디터"를 통합한 올인원 도구는 전무

### 1.3 사업 기회

- **기존 도구의 불만**: Designrr의 "가격 플랜 혼란", "기본 플랜 기능 부족" 반복 불만 (Reddit, Trustpilot)
- **모바일 공백**: 기존 전자책 도구 중 모바일 편집을 제대로 지원하는 도구가 거의 없음
- **가격 파괴**: Designrr 실질 $100/월 vs BookForge Pro $9.99/월 (1/10 비용)
- **한국어 최적화**: 한국 크몽/교보문고 타겟 전자책 도구 부재. NexBook(HTML 기반), 부크크(자가출판) 등 존재하나 AI 통합 도구 없음
- **올인원 통합**: 변환 + 편집 + 디자인을 한 곳에서 해결. 3개 도구를 쓸 필요 없음

### 1.4 비즈니스 목표

| 지표 | 3개월 | 6개월 | 12개월 |
|------|-------|-------|--------|
| MRR | $500 | $3,000 | $10,000 |
| 유료 구독자 (Pro) | 50명 | 200명 | 600명 |
| 유료 구독자 (Business) | 0명 | 10명 | 50명 |
| 무료 가입자 | 500명 | 2,000명 | 8,000명 |
| 월간 전자책 생성 수 | 200권 | 1,500권 | 8,000권 |

### 1.5 손익분기점

- 월간 고정 비용: 약 $150 (Vercel + Supabase + 도메인 + 모니터링)
- 변동 비용: AI API $0.50~$2.00/전자책 생성 건
- Pro 사용자당 순수익: 약 $8.50/월 (API 비용 차감 후)
- **손익분기: Pro 사용자 약 18명** (변동 비용 포함)

---

## 2. 누가 (WHO) - 누구를 위한 제품인가

### 2.1 타겟 고객 세그먼트

| 세그먼트 | 규모 (추정) | 우선순위 | 지불 의향 |
|----------|------------|----------|-----------|
| 블로그/유튜브 크리에이터 (6개월+ 콘텐츠 보유) | 글로벌 수백만, 한국 10만+ | P0 | Pro ($9.99/월) |
| 처음 전자책을 쓰는 1인 저자 | 글로벌 수백만, 한국 5만+ | P0 | Free -> Pro |
| Word/PDF 원고를 전자책으로 변환하려는 작가 | 글로벌 수십만 | P0 | Pro ($9.99/월) |
| 크몽/교보에서 실용서 판매하려는 한국 크리에이터 | 한국 3만+ | P1 | Pro ($9.99/월) |
| 마케팅팀 리드마그넷 제작 B2B 마케터 | 글로벌 수십만 | P1 | Business ($29.99/월) |
| KDP 셀프 퍼블리싱 입문자 | 글로벌 수백만 | P2 | Free -> Pro |

### 2.2 핵심 페르소나

#### 페르소나 1: 김지원 - 블로그 크리에이터

| 항목 | 내용 |
|------|------|
| 프로필 | 32세, 개인 브랜딩 관련 블로그 2년 운영, 글 150개 보유, 프리랜서 마케터 |
| 핵심 고통점 | 블로그에 쌓인 150개 글을 전자책으로 엮어 크몽에서 팔고 싶은데, 글을 하나하나 복사/붙여넣기하고 구조를 잡는 데 너무 오래 걸림. Designrr을 시도했으나 한국어 블로그 크롤링이 불안정하고 $100/월 플랜이 필요해서 포기 |
| 목표 | 블로그 URL 10~20개를 입력하면 AI가 자동으로 챕터를 구성하고, 전문적인 전자책을 2시간 이내에 만들기 |
| 사용 시나리오 | 토요일 오전, 카페에서 노트북으로 블로그 URL 15개를 BookForge에 입력. AI가 주제별로 챕터를 구조화하고 중복을 제거. 점심 전에 목차를 검토하고, 오후에 모바일로 출퇴근하며 미세한 수정. 저녁에 AI 커버를 생성하고 EPUB으로 내보내기. 일요일에 크몽에 업로드 |

#### 페르소나 2: 박성민 - 처음 전자책을 쓰는 직장인

| 항목 | 내용 |
|------|------|
| 프로필 | 28세, IT 기업 재직 중, 자기계발 분야 전자책 집필 희망, 출퇴근 시간 활용하여 모바일로 작업 |
| 핵심 고통점 | 전자책을 처음부터 쓰고 싶은데 어디서 시작해야 할지 모름. Word로 쓰면 EPUB 변환이 깨지고, Vellum은 Mac 전용. 출퇴근길 모바일에서 틈틈이 작업하고 싶은데 기존 도구는 데스크톱 전용 |
| 목표 | 모바일에서도 편하게 글을 쓰고, AI가 포매팅/구조화를 도와주며, 전문적인 전자책을 완성하기 |
| 사용 시나리오 | 출퇴근길 지하철에서 BookForge 모바일 에디터로 30분씩 챕터를 집필. 주말에 데스크톱에서 전체 구조를 정리. AI가 챕터 순서를 추천하고 도입부를 제안. Word 원고도 업로드하여 병합. 2주 후 AI 커버를 생성하고 KDP에 출판 |

#### 페르소나 3: Sarah - B2B 마케터

| 항목 | 내용 |
|------|------|
| 프로필 | 35세, SaaS 스타트업 마케팅 매니저, 리드마그넷용 전자책을 분기별 1권 제작 |
| 핵심 고통점 | 분기마다 리드마그넷 전자책을 만들어야 하는데, 회사 블로그 글 20개를 모아서 전자책으로 엮는 데 디자이너와 협업하여 2주 소요. 디자이너 비용 $500+. 마감에 쫓기며 품질도 일관되지 않음 |
| 목표 | 회사 블로그 URL을 넣으면 브랜딩이 적용된 전문적인 리드마그넷 전자책을 하루 만에 완성 |
| 사용 시나리오 | 월요일 오전에 회사 블로그 URL 20개를 BookForge에 입력. AI가 챕터 구조화. 화요일에 팀과 내용 검토 후 수정. 수요일에 회사 브랜드 색상으로 AI 커버 생성, PDF로 내보내기. 목요일에 HubSpot 랜딩페이지에 업로드 |

### 2.3 이해관계자

| 역할 | 담당자 | 책임 |
|------|--------|------|
| 창업자 / 풀스택 개발자 | 1인 | 기획, 개발, 디자인, 마케팅, 운영 전체 |
| 베타 테스터 | 10~20명 | 전자책 변환 품질 피드백, UX 검증 |
| 콘텐츠 크리에이터 자문단 | 3~5명 | 실제 사용 시나리오 검증, 기능 우선순위 피드백 |

---

## 3. 무엇을 (WHAT) - 무엇을 만드는가

### 3.1 제품 정의

**BookForge**: 블로그, Word/PDF, 유튜브 대본 등 기존 콘텐츠를 AI로 전자책으로 변환하거나, 처음부터 새로 전자책을 쓸 수 있는 모바일 대응 올인원 전자책 제작 웹앱

**핵심 가치 제안**: 기존 콘텐츠 업로드 또는 새로 집필, AI 자동 구조화, 모바일 편집, AI 커버 생성, EPUB/PDF 내보내기까지 -- 전자책 제작의 모든 것을 한 곳에서, 누구나 할 수 있게.

### 3.2 기능 명세 (MVP Scope)

#### F1: 콘텐츠 수집 & AI 자동 구조화 엔진 [P0]

| 항목 | 내용 |
|------|------|
| 설명 | 블로그 URL, Word/DOCX 업로드, PDF 업로드, 유튜브 URL(자막 추출), 직접 텍스트 붙여넣기 등 다양한 소스에서 콘텐츠를 수집하고, AI가 자동으로 챕터 구조화, 중복 제거, 어조 통일, 목차 생성을 수행 |
| 페르소나 | 김지원 (블로그 크리에이터) |
| 사용자 스토리 | "블로그 크리에이터로서, 내 블로그 URL 10~20개를 입력하면 AI가 자동으로 전자책 챕터를 구성해 주길 원한다. 그래야 수십 시간의 수작업 없이 전자책을 빠르게 만들 수 있다." |
| 수용 기준 | (1) 블로그 URL 입력 시 Readability.js로 본문 추출 성공률 90% 이상 (2) Word/DOCX, PDF 파일 업로드 시 텍스트 + 구조(제목, 본문, 리스트) 정상 추출 (3) 유튜브 URL 입력 시 자막/트랜스크립트 자동 추출 (4) AI가 수집된 콘텐츠를 5~15개 챕터로 자동 구조화하고 목차 생성 (5) 중복 콘텐츠 자동 감지 및 제거/병합 제안 |
| AI 모델 | Claude Haiku 4.5 (콘텐츠 분석/구조화) -- 비용 효율, 빠른 응답 |
| 기술 노트 | URL 크롤링: Cheerio + @mozilla/readability. DOCX 파싱: mammoth.js. PDF 파싱: pdf-parse. YouTube 자막: youtube-transcript API. AI 구조화: Claude Haiku 4.5 API (입력 ~10K tokens, 출력 ~5K tokens/건) |

#### F2: 모바일 대응 전자책 에디터 [P0]

| 항목 | 내용 |
|------|------|
| 설명 | Tiptap 기반 리치 텍스트 에디터로, 데스크톱과 모바일 모두에서 완전히 작동. 챕터 단위 편집, AI 제안 편집(문장 다듬기, 도입부 생성, 이어쓰기), 마크다운/HTML 양방향 변환 지원. 새로 전자책을 쓰는 사용자도 이 에디터에서 처음부터 작업 가능 |
| 페르소나 | 박성민 (처음 쓰는 직장인) |
| 사용자 스토리 | "처음 전자책을 쓰는 직장인으로서, 모바일에서도 편하게 글을 쓰고 편집할 수 있길 원한다. 그래야 출퇴근길에도 틈틈이 전자책 작업을 진행할 수 있다." |
| 수용 기준 | (1) 모바일(375px+)에서 터치로 텍스트 편집, 서식 적용, 챕터 이동 가능 (2) 서식 툴바: 제목(H1~H3), 볼드, 이탤릭, 리스트, 인용, 이미지 삽입 (3) 챕터 목록에서 드래그앤드롭(데스크톱)/롱프레스 재정렬(모바일) (4) AI 어시스턴트: 선택 텍스트 다듬기, 이어쓰기, 요약, 도입부 생성 (5) 실시간 자동 저장 (Supabase) (6) 새 프로젝트 생성 시 빈 에디터에서 처음부터 집필 가능 |
| AI 모델 | Claude Haiku 4.5 (인라인 편집 제안) -- 빠른 응답, 저비용 |
| 기술 노트 | Tiptap + StarterKit + @tiptap/extension-image + custom AI extension. BubbleMenu로 선택 텍스트 AI 액션. 모바일 서식 툴바는 하단 고정 (bottom sticky toolbar). SSR에서 `immediatelyRender: false` 설정 |

#### F3: EPUB/PDF 내보내기 엔진 [P0]

| 항목 | 내용 |
|------|------|
| 설명 | 편집 완료된 전자책을 EPUB3 및 PDF 형식으로 내보내기. 템플릿 적용, 목차 자동 생성, 메타데이터(제목, 저자, ISBN 등) 삽입, KDP/크몽/교보문고 규격 자동 맞춤 |
| 페르소나 | 김지원 (크몽 출판), 박성민 (KDP 출판) |
| 사용자 스토리 | "블로그 콘텐츠로 전자책을 만든 크리에이터로서, 원클릭으로 KDP 규격에 맞는 EPUB 파일을 받고 싶다. 그래야 바로 출판할 수 있다." |
| 수용 기준 | (1) EPUB3 표준 준수 파일 생성 (epubcheck 통과) (2) PDF 내보내기 (A5, 6x9 인치, A4 옵션) (3) 3개 이상 내지 템플릿 적용 가능 (4) 자동 목차(TOC) 생성 (5) 메타데이터 입력 UI (제목, 부제, 저자명, 설명) (6) 30초 이내 생성 완료 |
| 기술 노트 | EPUB 생성: epub-gen-memory (HTML -> EPUB). PDF 생성: @react-pdf/renderer 또는 Puppeteer (HTML -> PDF). 템플릿: CSS 기반 3개 기본 스타일 (클래식, 모던, 미니멀). Vercel Serverless Function에서 처리 |

#### F4: AI 커버 이미지 생성기 [P1]

| 항목 | 내용 |
|------|------|
| 설명 | 전자책 제목, 장르, 키워드, 분위기를 입력하면 AI가 커버 이미지를 생성하고, 타이포그래피(제목/저자명)를 자동 배치. KDP/교보문고 규격 자동 맞춤 |
| 페르소나 | 김지원, 박성민 |
| 사용자 스토리 | "전자책을 완성한 크리에이터로서, 디자이너 없이도 전문적인 커버 이미지를 만들고 싶다. 그래야 비용을 절약하면서도 매력적인 표지로 판매율을 높일 수 있다." |
| 수용 기준 | (1) 제목/장르/키워드/분위기 입력 시 AI가 3개 커버 시안 생성 (2) 제목과 저자명 텍스트 자동 오버레이 (위치/크기 조정 가능) (3) KDP 커버 규격 (1600x2560px) 자동 적용 (4) 고해상도 JPG/PNG 다운로드 (5) 무료 사용자: 워터마크 포함, Pro: 워터마크 제거 |
| AI 모델 | DALL-E 3 API (HD 1024x1792, $0.12/이미지) |
| 기술 노트 | DALL-E 3 API로 배경 이미지 생성 -> Canvas API(또는 Sharp)로 타이포그래피 오버레이 -> 최종 이미지 합성. 장르별 프롬프트 템플릿 사전 구축 (비즈니스, 자기계발, 소설, 기술 등 10개 장르) |

#### F5: 템플릿 & 미리보기 시스템 [P1]

| 항목 | 내용 |
|------|------|
| 설명 | 전자책 내지 디자인 템플릿 5개 제공 + 실시간 미리보기(Kindle, iPad, 모바일 기기별). 에디터에서 작업 중 언제든 미리보기 전환 가능 |
| 페르소나 | Sarah (B2B 마케터) |
| 사용자 스토리 | "리드마그넷을 만드는 마케터로서, 전자책이 다양한 기기에서 어떻게 보이는지 미리 확인하고 싶다. 그래야 독자 경험을 최적화할 수 있다." |
| 수용 기준 | (1) 5개 내지 템플릿: 클래식, 모던, 미니멀, 비즈니스, 매거진 (2) 원클릭 템플릿 전환 (3) 실시간 미리보기: 데스크톱(PDF 뷰), 태블릿, 모바일 3가지 뷰 (4) 폰트/색상/여백 기본 커스터마이징 |
| 기술 노트 | CSS 기반 템플릿 시스템. 미리보기: iframe + 반응형 CSS로 기기별 뷰포트 시뮬레이션. 커스터마이징: CSS 변수(--font-family, --primary-color, --margin 등) |

#### F6: 사용자 인증 & 프로젝트 관리 [P0]

| 항목 | 내용 |
|------|------|
| 설명 | 이메일+비밀번호 회원가입/로그인, Google OAuth, 전자책 프로젝트 CRUD (생성/조회/수정/삭제), 구독 플랜 관리 |
| 수용 기준 | (1) 이메일+비밀번호 회원가입 + 이메일 인증 + 비밀번호 재설정 (2) Google 소셜 로그인 (3) 전자책 프로젝트 생성/목록 조회/수정/삭제 (4) Free/Pro/Business 플랜 분기 (5) 대시보드에서 내 전자책 프로젝트 목록 + 상태(초안/진행중/완성) 표시 |
| 기술 노트 | Supabase Auth + RLS. 프로젝트별 데이터 격리. Stripe 결제 연동 (MVP에서는 Stripe Checkout 링크로 간소화) |

#### F7: Word/PDF 업로드 변환 [P0]

| 항목 | 내용 |
|------|------|
| 설명 | Word(.docx) 또는 PDF 파일을 업로드하면 텍스트와 구조(제목, 본문, 리스트, 이미지)를 자동 추출하여 에디터에 로드. AI가 챕터 구조를 제안 |
| 페르소나 | 박성민 (Word 원고 보유 작가) |
| 사용자 스토리 | "Word로 작성한 원고를 가진 작가로서, 파일을 업로드하면 자동으로 전자책 형식으로 변환되길 원한다. 그래야 포매팅 작업에 시간을 낭비하지 않을 수 있다." |
| 수용 기준 | (1) .docx 파일 업로드 시 제목/본문/리스트/이미지 구조 유지 추출 (2) .pdf 파일 업로드 시 텍스트 추출 (구조 보존은 best-effort) (3) 추출된 콘텐츠가 에디터에 자동 로드 (4) AI가 챕터 분리 지점을 자동 제안 |
| 기술 노트 | DOCX: mammoth.js (DOCX -> HTML 변환, 구조 유지). PDF: pdf-parse (텍스트 추출). 업로드: Supabase Storage (Free 1GB). 파일 크기 제한: 무료 10MB, Pro 50MB |

### 3.3 기능 우선순위 매트릭스

```
           높은 사용자 가치
                |
     F1 콘텐츠수집  |  F2 에디터
     (핵심 변환)    | (핵심 편집)
                  |
낮은 구현 ────────┼──────── 높은 구현
  복잡도          |          복잡도
                  |
     F4 AI 커버   |  F5 템플릿/미리보기
     (차별화)      | (품질 완성도)
                  |
           낮은 사용자 가치
```

- **MVP Phase 1 (Week 1~4)**: F6(인증) -> F1(콘텐츠 수집) -> F7(파일 업로드) -> F2(에디터) -> F3(내보내기)
- **MVP Phase 2 (Week 5~6)**: F4(AI 커버) -> F5(템플릿/미리보기)
- **MVP Phase 3 (Week 7~8)**: 테스트, 최적화, 베타, 런칭

### 3.4 MVP 범위 밖 (Out of Scope)

| 기능 | 이유 | 예정 시기 |
|------|------|-----------|
| 실시간 협업 (멀티 사용자 동시 편집) | CRDT 구현 복잡도 극높음, 1인 실현 불가 | v2 이후 |
| 팟캐스트 오디오 -> 전자책 변환 | 음성 인식(Whisper API) 통합 필요, MVP 범위 초과 | v2 |
| AI 다국어 번역 | 별도 파이프라인 필요, 번역 품질 검증 필요 | v2 |
| 오프라인 편집 (Service Worker 캐싱) | PWA 오프라인 동기화 복잡도 높음 | v1.5 |
| 인터랙티브 전자책 (퀴즈, 비디오 임베딩) | SCORM/LTI 표준 구현 필요, 1인 실현 어려움 | v3 이후 |
| Kindle Direct Publishing 직접 연동 | KDP API 접근 제한, 수동 업로드로 충분 | v2 |
| 팀 관리 / 권한 분리 | Business 플랜 고도화 시 | v2 |
| 커스텀 폰트 업로드 | 라이선스 검증 복잡, 기본 폰트로 시작 | v1.5 |
| A/B 테스트 커버 (SNS 공유 클릭률 비교) | 추적 인프라 필요 | v2 |
| RSS 피드 자동 구독 -> 자동 전자책 생성 | 자동화 파이프라인 복잡 | v2 |

### 3.5 가격 구조

| 플랜 | 가격 | 포함 기능 | 타겟 |
|------|------|-----------|------|
| Free | $0 | 월 1권 변환, 기본 템플릿 3개, AI 커버 1회/월 (워터마크), EPUB 내보내기만, 에디터 사용 가능 | 체험/리드 생성 |
| Pro | $9.99/월 | 무제한 변환, 전체 템플릿 5개, AI 커버 5회/월 (워터마크 제거), EPUB+PDF 내보내기, AI 편집 어시스턴트, 파일 업로드 50MB | 개인 크리에이터 |
| Business | $29.99/월 | Pro 전체 + AI 커버 무제한, 커스텀 브랜딩(로고/색상), 팀 멤버 3명(v2), 우선 지원 | B2B 마케터, 다작 작가 |

**런칭 프로모션**: Early Bird 50% 할인 -- Pro $4.99/월, 선착순 100명, 6개월 약정

---

## 4. 언제 (WHEN) - 언제까지 만드는가

### 4.1 전체 타임라인

```
2026.02 ─── 2026.03 ─── 2026.04 ─── 2026.05 ─── 2026.06
  |            |            |            |            |
  ├ MVP 개발   ├ MVP 개발   ├ 베타 테스트 ├ 정식 런칭   ├ Phase 2
  | (Week 1~4) | (Week 5~8) | (2주)      | + 마케팅    | AI 커버 강화
  |            |            |            |            | 유튜브 변환
  |            |            |            |            | 추가 템플릿
```

### 4.2 8주 개발 로드맵

| 주차 | 목표 | 핵심 산출물 | 완료 기준 |
|------|------|-------------|-----------|
| **W1** | 프로젝트 셋업 + 인증 + DB | Next.js 16 프로젝트, Supabase 셋업, Auth(이메일+Google), DB 스키마, 기본 레이아웃, Vercel 배포, PWA manifest | 로그인/회원가입 동작, Vercel 배포 성공, 모바일 반응형 레이아웃 |
| **W2** | 콘텐츠 수집 엔진 | URL 크롤링(Cheerio+Readability), Word/PDF 파싱, YouTube 자막 추출, 텍스트 붙여넣기 UI | 블로그 URL 3개 입력 -> 본문 추출 성공, DOCX 업로드 -> 텍스트 추출 성공 |
| **W3** | AI 구조화 + 에디터 기본 | Claude API 연동, 챕터 자동 구조화, Tiptap 에디터 셋업, 모바일 서식 툴바, 챕터 목록 UI | URL 입력 -> AI 구조화 -> 에디터에 로드 동작. 모바일에서 편집 가능 |
| **W4** | 에디터 완성 + 내보내기 | AI 편집 어시스턴트(다듬기/이어쓰기), EPUB 생성, PDF 생성, 기본 템플릿 3개, 메타데이터 UI | EPUB 파일 생성 + epubcheck 통과, PDF 생성 성공 |
| **W5** | AI 커버 생성기 | DALL-E 3 연동, 커버 시안 3개 생성, 타이포그래피 오버레이, KDP 규격 맞춤, 다운로드 | 제목/장르 입력 -> 커버 3개 생성 -> JPG 다운로드 |
| **W6** | 템플릿/미리보기 + 결제 | 나머지 2개 템플릿, 기기별 미리보기, Stripe Checkout 연동, 플랜 분기 로직 | 5개 템플릿 전환 동작, Free/Pro 분기 동작, Stripe 결제 성공 |
| **W7** | 랜딩 + 테스트 + 최적화 | 랜딩 페이지(Magic UI), SEO, 통합 테스트, 성능 최적화(에디터 로딩, API 응답), Sentry 설정 | 핵심 플로우 E2E 통과, Lighthouse 모바일 80+ |
| **W8** | 베타 테스트 + 런칭 | 베타 사용자 10~20명 피드백, UX 개선, 프롬프트 튜닝, 이용약관, GA4 설정, Product Hunt/디스콰이엇 런칭 | 피드백 50건 수집 + 핵심 개선 반영, 런칭일 100+ 가입 |

### 4.3 런칭 후 마일스톤

| 시점 | 마일스톤 | 핵심 KPI |
|------|----------|----------|
| D+30 | Early Bird 50명 확보 + 첫 유료 전환 | MRR $250, 가입자 300명, 전자책 100권 생성 |
| D+60 | Pro 100명 + Business 5명 | MRR $1,150, 가입자 800명 |
| D+90 | Pro 200명 + Business 10명 + Product Hunt 런칭 | MRR $2,300, 가입자 2,000명 |
| D+180 | Pro 400명 + Business 30명 + Phase 2 기능 출시 | MRR $4,900 |
| D+365 | Pro 600명 + Business 50명 | MRR $7,500, ARR $90,000 |

---

## 5. 어디서 (WHERE) - 어디에서 어디로

### 5.1 타겟 시장

| 단계 | 시기 | 시장 | 전략 |
|------|------|------|------|
| Phase 1 | 2026 Q2 | 한국 크리에이터 (크몽/교보) + 영어권 KDP 작가 | 한국어+영어 동시 지원, 이중 언어 랜딩 |
| Phase 2 | 2026 Q3~Q4 | B2B 마케터 (리드마그넷), 다작 작가 | Business 플랜 강화, 팀 기능 |
| Phase 3 | 2027 | 교육 콘텐츠 제작자, 기업 교육팀 | 인터랙티브 요소 추가 |
| Phase 4 | 2027~ | 글로벌 다국어 확장 | AI 번역 통합 |

### 5.2 플랫폼 및 배포 환경

| 구분 | 선택 | 비고 |
|------|------|------|
| 웹 애플리케이션 | PWA (Progressive Web App) -- 모바일 퍼스트, 데스크톱 완전 지원 | iOS/Android 홈 화면 추가 가능 |
| 호스팅 | Vercel (Hobby -> Pro) | 글로벌 CDN, Serverless Functions, 월 $0~$20 |
| 데이터베이스 | Supabase PostgreSQL | 아시아 리전(싱가포르), Free 500MB |
| 파일 저장소 | Supabase Storage | 업로드 파일 + 생성 EPUB/PDF/커버 이미지 저장, Free 1GB |
| 도메인 | bookforge.app (또는 유사 도메인) | 연간 ~$15 |
| 결제 | Stripe Checkout | 한국 카드 + 글로벌 카드 지원. 수수료 2.9% + 30c |
| 모니터링 | Sentry (Free) + Vercel Analytics | 에러 추적 + 성능 모니터링 |
| 이메일 | Resend (Free) | 인증/알림/구독 확인, 월 3,000건 무료 |

### 5.3 고객 접점 채널

| 채널 | 유형 | 우선순위 | 전략 |
|------|------|----------|------|
| BookForge 웹사이트 (랜딩+앱) | 제품 | P0 | SEO 최적화 랜딩, 무료 체험 CTA |
| Product Hunt | 글로벌 런칭 | P0 | 런칭 데이 500+ upvote 목표 |
| 디스콰이엇 | 한국 커뮤니티 | P0 | 한국 메이커 커뮤니티 |
| Reddit (r/selfpublish, r/ebooks, r/KDP) | 커뮤니티 | P0 | Designrr 불만 사용자 타겟 |
| 자사 블로그 + SEO | 콘텐츠 마케팅 | P0 | "블로그를 전자책으로 만드는 법" 등 롱테일 키워드 |
| Twitter/X | 크리에이터 생태계 | P1 | 빌드 인 퍼블릭, 진행 과정 공유 |
| 크몽 파트너십 | 한국 마켓플레이스 | P1 | 크몽 판매자 대상 마케팅 |
| YouTube | 튜토리얼 | P2 | 제품 데모 영상 |

### 5.4 포지셔닝 맵

```
                    고가격 (월 $100+)
                         |
    Designrr             |         Vellum
    ($29~$100/월,        |         ($249 일회성,
     콘텐츠 변환 전문)    |          Mac 전용, 편집 최고)
                         |
  콘텐츠 변환 전문 ──────┼──────── 편집/포매팅 전문
                         |
    Automateed           |         Atticus
    (AI 전자책 생성,      |         ($147 일회성,
     무에서 유)           |          크로스 플랫폼)
                         |
                    저가격 (월 $10 이하)

              ★ BookForge ★
    (변환 + 편집 + 커버 올인원,
     모바일 퍼스트, $9.99/월,
     AI 자동 구조화)
```

BookForge는 "콘텐츠 변환"과 "편집/포매팅"의 중간에 위치하며, "저가격 + 올인원 + 모바일"로 차별화한다.

---

## 6. 어떻게 (HOW) - 어떻게 만드는가

### 6.1 기술 스택

| 레이어 | 선택 | 이유 | 대안 |
|--------|------|------|------|
| Frontend | Next.js 16.1 (App Router) + TypeScript | 최대 생태계, Vercel 최적화, RSC 성능, PWA 내장 지원, Turbopack 기본 번들러 | Nuxt 4, SvelteKit 2 |
| Language | TypeScript | 프론트/백엔드 통일, 타입 안전성, AI 코딩 도구 호환성 최적 | - |
| UI Components | shadcn/ui + Tailwind CSS 4 + Lucide Icons | 2026.02 최신: Unified Radix UI 패키지, RTL 지원, 복사-붙여넣기 커스터마이징 | Radix Themes, Mantine |
| 랜딩 효과 | Magic UI | 프리미엄 히어로/카드/텍스트 애니메이션, 랜딩 페이지 차별화 | Aceternity UI |
| Editor | Tiptap (StarterKit + Extensions) | 헤드리스 리치 텍스트 에디터, React 통합, 100+ 확장, 모바일 호환, ProseMirror 기반 안정성 | Plate, Lexical |
| Backend | Next.js API Routes + Server Actions + Supabase | CRUD + Auth + AI API 호출 구조에 최적. 별도 백엔드 서버 불필요 | Python FastAPI (AI 파이프라인이 더 복잡해질 경우) |
| Database | Supabase PostgreSQL + RLS | Free 500MB, 멀티테넌시 자동 격리, 실시간 구독 가능 | Neon, PlanetScale |
| AI/LLM | Claude Haiku 4.5 (구조화/편집) + DALL-E 3 (커버) | Haiku: $1/$5/1M tokens 비용 효율 + 빠른 응답. DALL-E 3: 전자책 커버 특화 프롬프트 안정성 | GPT-4o-mini ($0.15/$0.60), Stable Diffusion |
| Auth | Supabase Auth (이메일 + Google OAuth) | Free 50K MAU, JWT 기반, 이메일 인증/비밀번호 재설정 내장 | NextAuth.js, Clerk |
| Storage | Supabase Storage | 업로드 파일 + 생성물 저장, Free 1GB, CDN 지원 | AWS S3, Cloudflare R2 |
| EPUB 생성 | epub-gen-memory | HTML -> EPUB 변환, 브라우저/Node.js 양쪽 지원, TypeScript | pandoc (CLI) |
| PDF 생성 | @react-pdf/renderer | React 컴포넌트로 PDF 생성, 서버사이드 렌더링, 한글 폰트 지원 | Puppeteer (더 복잡한 레이아웃 시) |
| URL 크롤링 | Cheerio + @mozilla/readability | 정적 HTML 파싱(Cheerio) + 본문 추출(Readability.js) 조합, 가볍고 빠름 | Playwright (JS 렌더링 필요 시) |
| DOCX 파싱 | mammoth.js | DOCX -> HTML 변환, 구조(제목/리스트/이미지) 보존 | docx4js |
| PDF 파싱 | pdf-parse | PDF -> 텍스트 추출, 가벼움 | pdfjs-dist |
| YouTube 자막 | youtube-transcript (npm) / 외부 API | YouTube 자막 추출, API 키 불필요 | supadata.ai API |
| Payment | Stripe Checkout | 글로벌 + 한국 카드, 구독 관리, Webhook | Toss Payments (한국 전용) |
| Email | Resend | 인증/알림, 월 3,000건 무료, 개발자 친화 API | SendGrid |
| Hosting | Vercel | Hobby(무료) -> Pro($20/월), 글로벌 CDN, Serverless | Cloudflare Pages |
| Monitoring | Sentry + Vercel Analytics | 에러 추적(무료) + 성능 모니터링 | LogRocket |

### 6.2 백엔드 아키텍처 결정 근거

**Supabase (BaaS) + Next.js API Routes 선택** (하이브리드 아키텍처)

| 기준 | BookForge 분석 | 판단 |
|------|---------------|------|
| 데이터 구조 | 사용자, 프로젝트, 챕터, 커버 등 관계형 CRUD | Supabase 적합 |
| 인증 | 이메일 + Google OAuth, 표준 소셜 로그인 | Supabase Auth 최적 |
| AI 연동 | Claude API 호출 (구조화/편집), DALL-E 3 (커버) -- API 호출 수준 | Next.js API Routes로 충분 |
| 파일 처리 | DOCX/PDF 업로드, EPUB/PDF/이미지 생성 저장 | Supabase Storage |
| 실시간 | 자동 저장 (에디터 -> DB), 진행 상태 표시 | Supabase Realtime 가능 |

**판단**: 핵심 AI 로직이 "외부 API 호출 + 결과 가공" 수준이므로 별도 Python 백엔드 없이 Next.js API Routes + Supabase로 충분. 향후 AI 파이프라인이 복잡해지면 (팟캐스트 음성 변환, RAG 등) Python 마이크로서비스를 별도 추가하는 하이브리드 전략.

### 6.3 데이터 모델

```
users (1) ──── (*) projects ──── (*) chapters ──── (*) chapter_versions
                    |
                    ├──── (*) source_contents
                    ├──── (*) covers
                    └──── (*) exports
users (1) ──── (*) subscriptions
```

**핵심 테이블 7개**: users, projects, chapters, source_contents, covers, exports, subscriptions

#### users
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key (Supabase Auth uid) |
| email | TEXT | 이메일 |
| name | TEXT | 표시 이름 |
| avatar_url | TEXT | 프로필 이미지 URL |
| plan | ENUM | 'free', 'pro', 'business' |
| plan_expires_at | TIMESTAMPTZ | 구독 만료일 |
| stripe_customer_id | TEXT | Stripe 고객 ID |
| created_at | TIMESTAMPTZ | 가입일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |

#### projects (전자책 프로젝트)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| user_id | UUID | FK -> users.id |
| title | TEXT | 전자책 제목 |
| subtitle | TEXT | 부제 (nullable) |
| author_name | TEXT | 저자명 |
| description | TEXT | 전자책 설명 |
| language | TEXT | 'ko', 'en' 등 |
| template_id | TEXT | 적용된 템플릿 ID |
| status | ENUM | 'draft', 'in_progress', 'completed' |
| metadata | JSONB | ISBN, 카테고리, 키워드 등 추가 메타 |
| cover_image_url | TEXT | 선택된 커버 이미지 URL |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |

#### chapters (챕터)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| title | TEXT | 챕터 제목 |
| content | TEXT | HTML 콘텐츠 (Tiptap 에디터 출력) |
| order_index | INTEGER | 챕터 순서 |
| word_count | INTEGER | 단어 수 (자동 계산) |
| source_content_ids | UUID[] | 원본 소스 참조 |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 최종 수정일 |

#### source_contents (수집된 원본 콘텐츠)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| source_type | ENUM | 'url', 'docx', 'pdf', 'youtube', 'paste' |
| source_url | TEXT | 원본 URL (nullable) |
| file_url | TEXT | 업로드 파일 Storage URL (nullable) |
| raw_content | TEXT | 추출된 원본 텍스트 |
| title | TEXT | 추출된 제목 |
| extracted_at | TIMESTAMPTZ | 추출 시각 |

#### covers (AI 생성 커버 이미지)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| prompt | TEXT | DALL-E 3에 사용된 프롬프트 |
| image_url | TEXT | Storage URL |
| genre | TEXT | 장르 |
| style | TEXT | 스타일 키워드 |
| is_selected | BOOLEAN | 현재 선택된 커버 여부 |
| created_at | TIMESTAMPTZ | 생성일 |

#### exports (내보내기 기록)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| project_id | UUID | FK -> projects.id |
| format | ENUM | 'epub', 'pdf' |
| file_url | TEXT | Storage URL |
| file_size | INTEGER | 파일 크기 (bytes) |
| template_id | TEXT | 적용된 템플릿 |
| created_at | TIMESTAMPTZ | 생성일 |

#### subscriptions (구독 관리)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary key |
| user_id | UUID | FK -> users.id |
| stripe_subscription_id | TEXT | Stripe 구독 ID |
| plan | ENUM | 'pro', 'business' |
| status | ENUM | 'active', 'canceled', 'past_due' |
| current_period_start | TIMESTAMPTZ | 현재 결제 주기 시작 |
| current_period_end | TIMESTAMPTZ | 현재 결제 주기 종료 |
| created_at | TIMESTAMPTZ | 생성일 |

#### 엔티티 관계 요약
- users 1:N projects (한 사용자가 여러 전자책 프로젝트)
- projects 1:N chapters (한 프로젝트에 여러 챕터)
- projects 1:N source_contents (한 프로젝트에 여러 소스 콘텐츠)
- projects 1:N covers (한 프로젝트에 여러 AI 생성 커버)
- projects 1:N exports (한 프로젝트에서 여러 번 내보내기)
- users 1:N subscriptions (구독 이력)

### 6.4 API 설계

총 22개 엔드포인트:

| 그룹 | Method | Endpoint | 설명 | Auth |
|------|--------|----------|------|------|
| **Auth** | POST | /api/auth/signup | 이메일 회원가입 | - |
| | POST | /api/auth/login | 이메일 로그인 | - |
| | POST | /api/auth/google | Google OAuth | - |
| | POST | /api/auth/reset-password | 비밀번호 재설정 | - |
| **Projects** | GET | /api/projects | 내 프로젝트 목록 | Required |
| | POST | /api/projects | 새 프로젝트 생성 | Required |
| | GET | /api/projects/:id | 프로젝트 상세 | Required |
| | PUT | /api/projects/:id | 프로젝트 수정 (제목, 메타데이터 등) | Required |
| | DELETE | /api/projects/:id | 프로젝트 삭제 | Required |
| **Sources** | POST | /api/projects/:id/sources/url | URL 크롤링 콘텐츠 추가 | Required |
| | POST | /api/projects/:id/sources/upload | 파일 업로드 (DOCX/PDF) | Required |
| | POST | /api/projects/:id/sources/youtube | YouTube 자막 추출 | Required |
| | POST | /api/projects/:id/sources/paste | 텍스트 직접 입력 | Required |
| **AI** | POST | /api/projects/:id/ai/structure | AI 자동 챕터 구조화 | Required |
| | POST | /api/projects/:id/ai/edit | AI 편집 어시스턴트 (다듬기/이어쓰기/요약) | Required (Pro+) |
| **Chapters** | PUT | /api/chapters/:id | 챕터 내용 수정 (자동 저장) | Required |
| | PUT | /api/projects/:id/chapters/reorder | 챕터 순서 변경 | Required |
| **Covers** | POST | /api/projects/:id/covers/generate | AI 커버 생성 (3개 시안) | Required |
| | PUT | /api/projects/:id/covers/:coverId/select | 커버 선택 | Required |
| **Exports** | POST | /api/projects/:id/export/epub | EPUB 내보내기 | Required |
| | POST | /api/projects/:id/export/pdf | PDF 내보내기 | Required (Pro+) |
| **Billing** | POST | /api/billing/checkout | Stripe Checkout 세션 생성 | Required |
| | POST | /api/billing/webhook | Stripe Webhook 수신 | Stripe Sig |

### 주요 API 상세

#### POST /api/projects/:id/sources/url
```json
// Request
{
  "urls": [
    "https://blog.example.com/post-1",
    "https://blog.example.com/post-2"
  ]
}

// Response (200 OK)
{
  "sources": [
    {
      "id": "uuid",
      "source_type": "url",
      "source_url": "https://blog.example.com/post-1",
      "title": "추출된 블로그 제목",
      "raw_content": "추출된 본문 텍스트...",
      "word_count": 1500,
      "extracted_at": "2026-02-13T10:00:00Z"
    }
  ],
  "failed": [
    {
      "url": "https://blog.example.com/post-2",
      "error": "크롤링 실패: 접근 차단됨"
    }
  ]
}
```

#### POST /api/projects/:id/ai/structure
```json
// Request
{
  "source_content_ids": ["uuid1", "uuid2", "uuid3"],
  "preferences": {
    "target_chapters": 10,
    "tone": "professional",
    "language": "ko"
  }
}

// Response (200 OK)
{
  "chapters": [
    {
      "title": "1장: 개인 브랜딩의 시작",
      "content": "<h2>개인 브랜딩의 시작</h2><p>...</p>",
      "source_refs": ["uuid1"],
      "word_count": 2000
    },
    {
      "title": "2장: SNS 전략 수립",
      "content": "<h2>SNS 전략 수립</h2><p>...</p>",
      "source_refs": ["uuid1", "uuid2"],
      "word_count": 1800
    }
  ],
  "table_of_contents": "1장: 개인 브랜딩의 시작\n2장: SNS 전략 수립\n...",
  "total_word_count": 15000,
  "ai_notes": "3개 소스에서 중복 주제 2건을 병합했습니다."
}
```

#### POST /api/projects/:id/covers/generate
```json
// Request
{
  "title": "개인 브랜딩의 기술",
  "author": "김지원",
  "genre": "business",
  "keywords": ["브랜딩", "마케팅", "성장"],
  "mood": "professional",
  "color_preference": "blue"
}

// Response (200 OK)
{
  "covers": [
    {
      "id": "uuid",
      "image_url": "https://storage.supabase.co/covers/cover-1.jpg",
      "prompt_used": "Professional ebook cover about personal branding...",
      "has_watermark": false
    },
    { "id": "uuid", "image_url": "...", "prompt_used": "...", "has_watermark": false },
    { "id": "uuid", "image_url": "...", "prompt_used": "...", "has_watermark": false }
  ]
}
```

### 6.5 AI 엔진 설계

| 기능 | 모델 | 입력 | 출력 | 예상 비용/건 |
|------|------|------|------|-------------|
| 콘텐츠 구조화 (F1) | Claude Haiku 4.5 | 소스 텍스트 ~15K tokens + 시스템 프롬프트 ~2K tokens | JSON (챕터 구조, 목차) ~5K tokens | ~$0.04 |
| AI 편집 어시스턴트 (F2) | Claude Haiku 4.5 | 선택 텍스트 ~2K tokens + 컨텍스트 ~3K tokens | 수정된 텍스트 ~2K tokens | ~$0.02 |
| AI 커버 생성 (F4) | DALL-E 3 (HD 1024x1792) | 장르/키워드/분위기 프롬프트 | 이미지 3개 | ~$0.36 (3x $0.12) |

**비용 최적화 전략**:
- **모델 선택**: Claude Haiku 4.5 ($1/$5/1M tokens)는 GPT-4o ($2.50/$10/1M tokens) 대비 60% 저렴하면서 콘텐츠 구조화에 충분한 성능
- **프롬프트 캐싱**: Anthropic 프롬프트 캐싱 활용 -- 시스템 프롬프트(구조화 지침 ~2K tokens)를 캐싱하면 캐시 리드 시 기본 입력 가격의 10% (90% 절감)
- **Batch API**: 비실시간 작업(대량 URL 크롤링 후 구조화)에 Batch API 50% 할인 적용
- **커버 생성 절약**: DALL-E 3 Standard(1024x1024, $0.04)로 초안 생성 -> 사용자 확정 시에만 HD(1024x1792, $0.12)로 업스케일
- **대안 모델**: 성능/비용 비교 후 GPT-4o-mini ($0.15/$0.60/1M tokens)로 교체 가능

### 6.6 보안 및 데이터 보호

| 항목 | 구현 방법 |
|------|-----------|
| 데이터 격리 | Supabase RLS -- 사용자별 데이터 완전 격리 (모든 테이블에 user_id 기반 RLS 정책) |
| 인증 | Supabase Auth (JWT + 세션), Next.js Middleware로 보호 라우트 |
| API 보안 | 모든 API에 인증 필수, Pro+ 기능에 플랜 체크 미들웨어 |
| 파일 업로드 보안 | 파일 타입 검증 (DOCX/PDF만), 크기 제한 (Free 10MB, Pro 50MB), 바이러스 스캔은 v2 |
| HTTPS | Vercel 기본 HTTPS + HSTS |
| AI 데이터 | 사용자 콘텐츠는 AI API 호출 시에만 전송, 별도 학습 데이터로 사용되지 않음 (API TOS 확인) |

### 6.7 핵심 사용자 플로우 3개

**플로우 1: 블로그 URL -> 전자책 변환 (핵심 가치)**
```
1. 랜딩 페이지 방문 -> "무료로 시작하기" CTA 클릭
2. 회원가입 (이메일 또는 Google)
3. 대시보드 -> "새 전자책 만들기" -> "기존 콘텐츠로 만들기" 선택
4. "블로그 URL 추가" 탭 -> URL 10개 입력 (줄바꿈 구분)
5. [로딩] 각 URL에서 콘텐츠 추출 중... (진행 바 표시, URL당 ~3초)
6. 추출 결과 확인: 성공/실패 URL 목록 + 각 글의 제목/미리보기
7. "AI 구조화 시작" 버튼 클릭
8. [로딩] AI가 챕터 구조화 중... (~15초)
9. 구조화 결과: 제안된 챕터 목록 (제목, 소속 소스, 단어 수) + 목차
10. 챕터 순서 드래그 재배치, 불필요한 챕터 삭제, 제목 수정
11. "에디터로 이동" -> Tiptap 에디터에서 챕터별 세부 편집
12. 만족 시 -> "내보내기" -> 템플릿 선택 -> EPUB/PDF 다운로드
```

**플로우 2: 처음부터 새로 쓰기 (모바일)**
```
1. 모바일 브라우저에서 BookForge 접속 (또는 홈 화면 PWA)
2. 로그인 -> 대시보드 -> "새 전자책 만들기" -> "처음부터 쓰기" 선택
3. 프로젝트 제목, 저자명 입력
4. 빈 에디터 화면 + 하단 서식 툴바 (모바일 최적화)
5. 첫 챕터 제목 입력 -> 본문 작성 시작
6. 작성 중 텍스트 선택 -> 버블 메뉴에서 "AI 다듬기" -> AI가 문장 개선 제안
7. "새 챕터 추가" 버튼으로 챕터 추가
8. 자동 저장으로 언제든 중단 가능
9. 데스크톱에서 이어서 편집 (반응형)
10. 완성 후 -> 커버 생성 -> 내보내기
```

**플로우 3: Word 업로드 -> 전자책 변환**
```
1. 대시보드 -> "새 전자책 만들기" -> "파일 업로드로 만들기" 선택
2. DOCX 파일 드래그앤드롭 업로드
3. [로딩] 파일 파싱 중... (~5초)
4. 추출 결과 미리보기: 제목, 본문, 리스트, 이미지 확인
5. "AI 구조화" -> AI가 기존 제목(H1/H2)을 기반으로 챕터 자동 분리
6. 에디터에서 편집 -> 템플릿 적용 -> 내보내기
```

**에러 상태 처리**:
- URL 크롤링 실패: "이 URL에서 콘텐츠를 추출할 수 없습니다. JavaScript로 렌더링되는 페이지이거나 접근이 차단되었습니다." + 수동 텍스트 붙여넣기 안내
- AI 구조화 실패: "AI 처리 중 오류가 발생했습니다. 다시 시도해 주세요." + 3회 자동 재시도
- 파일 크기 초과: "파일 크기가 [N]MB를 초과합니다. [Free: 10MB / Pro: 50MB]" + Pro 업그레이드 안내
- EPUB 생성 실패: "전자책 생성 중 오류가 발생했습니다." + 에러 로그 자동 수집 (Sentry)
- 월간 무료 한도 초과: "이번 달 무료 변환 한도(1권)를 사용했습니다." + Pro 업그레이드 CTA

### 6.8 비용 구조

#### 월간 운영 비용 (유료 50명, 무료 200명, 월 전자책 300권 생성 기준)

| 항목 | 서비스 | 월 비용 | 비고 |
|------|--------|---------|------|
| AI API (구조화) | Claude Haiku 4.5 | ~$12 | 300건 x $0.04/건 |
| AI API (편집) | Claude Haiku 4.5 | ~$10 | 500건 x $0.02/건 |
| AI API (커버) | DALL-E 3 | ~$36 | 100건 x $0.36/건 (3 시안) |
| Hosting | Vercel Pro | $20 | 150K 요청/월 포함 |
| Database | Supabase Pro | $25 | 8GB DB, 100K MAU |
| Email | Resend Free | $0 | 월 3,000건 무료 |
| Domain | .app 도메인 | ~$1.25 | 연간 $15 환산 |
| Monitoring | Sentry Free + Vercel Analytics | $0 | 무료 티어 |
| Payment | Stripe | ~$50 | 매출의 2.9%+30c (MRR $1,700 기준) |
| **합계** | | **~$155/월** | |

#### 초기 개발 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| AI API 테스트 | ~$30 | 개발/테스트 중 API 호출 |
| 도메인 구입 | ~$15 | .app 도메인 1년 |
| Vercel 첫 2개월 | $0 | Hobby(무료)로 시작, 런칭 후 Pro 전환 |
| **합계** | **~$45** | |

#### 손익분기 상세

| 시나리오 | Pro 사용자 | Business 사용자 | MRR | 월 비용 | 순이익 |
|----------|-----------|----------------|-----|---------|--------|
| 최소 (손익분기) | 18명 | 0명 | $180 | $155 | +$25 |
| 보수적 (3개월) | 50명 | 0명 | $500 | $155 | +$345 |
| 목표 (6개월) | 200명 | 10명 | $2,300 | $250 | +$2,050 |
| 낙관적 (12개월) | 600명 | 50명 | $7,500 | $500 | +$7,000 |

---

## 부록 A: 리스크 매트릭스

| 리스크 | 확률 | 영향도 | 대응 방안 |
|--------|------|--------|-----------|
| URL 크롤링 성공률 낮음 (JS 렌더링, 접근 차단) | 높음 | 높음 | Readability.js로 정적 HTML 우선. 실패 시 "텍스트 직접 붙여넣기" 대안 제공. v2에서 Playwright(JS 렌더링) 추가 |
| AI 구조화 품질 불일치 | 중간 | 높음 | 장르/분야별 프롬프트 템플릿 사전 구축 (10개+). 베타 테스트에서 50건+ 품질 검증. 사용자가 구조 직접 수정 가능하도록 UX 설계 |
| 모바일 에디터 UX 복잡도 | 높음 | 중간 | MVP에서는 "간결한 편집"에 집중 (Vellum급 WYSIWYG가 아닌 Tiptap 기본 + 모바일 툴바). 복잡한 레이아웃 편집은 데스크톱 권장 |
| EPUB 파일 호환성 문제 | 중간 | 중간 | epubcheck로 EPUB3 표준 검증 자동화. Kindle Previewer 테스트. 사용자 피드백 기반 지속 개선 |
| Designrr 등 기존 경쟁사의 AI 기능 강화 | 중간 | 중간 | "모바일 퍼스트 + 한국어 최적화 + 올인원"으로 차별화. 가격 우위($9.99 vs $100/월) 유지. 커뮤니티 기반 고객 확보로 전환 비용 높이기 |
| AI API 비용 급등 | 낮음 | 중간 | 다중 모델 지원 (Claude <-> GPT 전환 가능). 프롬프트 캐싱 + Batch API로 최적화. 가격 변동 시 대체 모델 즉시 투입 |
| Stripe 한국 카드 결제 이슈 | 중간 | 중간 | Toss Payments를 대안으로 준비. 한국 사용자에게는 계좌이체/카카오페이 옵션 v1.5에서 추가 |
| 1인 개발자 번아웃 | 중간 | 높음 | 8주 로드맵 엄수, 스코프 크립 방지. MVP 이후 유저 피드백 기반으로만 기능 추가. 자동화 도구(CI/CD, 모니터링) 적극 활용 |

---

## 부록 B: 경쟁사 상세 비교

| 비교 항목 | BookForge (MVP) | Designrr | Atticus | Vellum | Automateed | Canva |
|-----------|----------------|----------|---------|--------|-----------|-------|
| 가격 | $9.99/월 | $29~$100/월 | $147 일회성 | $249.99 일회성 | 다양 | $0~$120/년 |
| 콘텐츠 변환 (URL/파일) | O (URL+DOCX+PDF+YouTube) | O (URL+Word) | X | X | AI 생성 (무에서 유) | X |
| AI 자동 구조화 | O (Claude) | 제한적 | X | X | O (GPT) | X |
| 모바일 편집 | O (PWA 모바일 퍼스트) | X | 제한적 | X (Mac 전용) | X | O (제한적) |
| AI 커버 생성 | O (DALL-E 3) | X | X | X | O | O (AI Magic) |
| EPUB 내보내기 | O | O | O | O | O | X (30페이지 제한) |
| 한국어 최적화 | O | X | X | X | X | 부분적 |
| 처음부터 쓰기 | O (Tiptap 에디터) | X (변환 전문) | O (에디터 전문) | O (에디터 전문) | O (AI 생성) | O (디자인 전문) |

---

## 부록 C: 성공 지표 (KPI)

### 핵심 KPI

| 범주 | 지표 | 30일 | 60일 | 90일 | 측정 도구 |
|------|------|------|------|------|-----------|
| 획득 | 웹사이트 방문 | 2,000 | 5,000 | 10,000 | GA4 + Vercel |
| 획득 | 가입자 수 | 200 | 500 | 2,000 | Supabase DB |
| 활성화 | 전자책 프로젝트 생성 수 | 150 | 500 | 1,500 | Supabase DB |
| 활성화 | 전자책 완성(내보내기) 수 | 50 | 200 | 800 | Supabase DB |
| 수익 | Pro 전환 | 30 | 100 | 200 | Stripe |
| 수익 | MRR | $300 | $1,000 | $2,300 | Stripe |
| 유지 | 월간 전자책 2권+ 생성 사용자 비율 | - | 30% | 40% | Supabase DB |
| 추천 | NPS | - | 30+ | 40+ | 인앱 설문 |

### 전환 퍼널 목표 (90일)

```
웹사이트 방문 (10,000)
    | 가입 전환율: 20%
가입자 (2,000)
    | 프로젝트 생성율: 75%
프로젝트 생성 (1,500)
    | 전자책 완성(내보내기)율: 53%
전자책 완성 (800)
    | Pro 전환율: 25%
유료 전환 (200)
    + Business (10)
    = 총 유료 210명
```

---

*본 PRD는 2026년 2월 13일 기준으로 작성되었습니다. final_ideas.md TOP 3 아이디어(1위: 블로그/SNS 변환 22/25점, 2위: 모바일 에디터 18/25점, 3위: AI 커버 디자인 18/25점)를 통합한 올인원 제품 BookForge의 MVP 설계입니다. 베타 테스트 피드백 및 시장 변화에 따라 업데이트될 수 있습니다.*
