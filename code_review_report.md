# 코드 리뷰 리포트: AILEX (AI Law EXpert)
> 리뷰일: 2026-02-13 | 대상: project/ | 기준: 프로젝트 코드 직접 분석 (mvp_spec.md는 다른 제품용으로 확인됨)

---

## Executive Summary
- **등급: B** (CRITICAL 0건, WARNING 3건 잔존 + 4건 수정 완료, 테스트 81건 전체 통과)
- CRITICAL **0**건 / WARNING **7**건 (수정완료 4건, 잔존 3건) / INFO **9**건
- 테스트: Unit **81** + Integration **0** + E2E **0** = **100%** 통과율

전반적으로 잘 구축된 MVP입니다. Next.js 16.1 App Router, Supabase, OpenAI API를 적절히 활용하고 있으며, Zod 유효성 검증, RLS 기반 데이터 격리, 감사 로그 등 보안 기반이 탄탄합니다.

### 수정 완료 항목 (본 리뷰 중 직접 수정)
- [x] **WARNING-S2**: Security Headers 추가 (`next.config.ts`)
- [x] **WARNING-S3**: 환경변수 non-null assertion 제거, 명시적 null 체크 추가 (`supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] **WARNING-S4**: 로그인 API 응답에서 access_token 제거 (`auth/login/route.ts`)
- [x] **WARNING-P1**: useAuth 훅 무한 렌더링 방지, useMemo 적용 (`hooks/use-auth.ts`)

### 잔존 WARNING 항목
- WARNING-S1: Rate Limiting 미구현 (외부 의존성 필요)
- WARNING-P2: 대시보드 요약 API 순차 쿼리 (MVP 규모에서는 수용 가능)
- WARNING-Q2: `as unknown as` 타입 캐스팅 (Supabase 타입 추론 한계)

---

## 1. 아키텍처 정합성

### 기술 스택 확인

| 레이어 | 명세 | 실제 구현 | 일치 |
|--------|------|-----------|------|
| Frontend | Next.js 16 (App Router) | Next.js 16.1.6 + React 19.2.3 | O |
| UI | shadcn/ui + Tailwind CSS 4 | shadcn + Tailwind CSS 4 + tw-animate-css | O |
| Backend | Next.js API Routes | `/api/v1/` 14개 엔드포인트 | O |
| Auth | Supabase Auth | 이메일+비밀번호, Google OAuth | O |
| Database | Supabase PostgreSQL + RLS | 6개 테이블, RLS 정책 적용 | O |
| AI | OpenAI GPT-4o / GPT-4o-mini | openai npm 6.21.0 | O |
| 상태관리 | zustand | package.json에 설치됨 (사용처 미발견) | INFO |
| 문서 변환 | docx | DOCX 생성 구현 완료 | O |

### 핵심 기능 구현 상태

| 기능 | 설명 | 구현 |
|------|------|------|
| F1 | 고영향 AI 자동 판정 (GPT-4o Structured Output) | O |
| F2 | 의무 체크리스트 자동 생성 | O |
| F3 | 의무 문서 AI 자동 생성 (4종) | O |
| F4 | 컴플라이언스 대시보드 | O |
| F5 | 투명성 고지 문구 생성기 | O |
| F6 | AI 시스템 CRUD + 인증 | O |
| P1 월간 리포트 | 대시보드 report API | TODO (올바르게 표시) |

### 데이터 모델

SQL 스키마(`001_initial_schema.sql`)와 TypeScript 타입(`database.ts`)이 일치합니다. 6개 테이블(users, ai_systems, assessments, compliance_items, documents, audit_logs) 모두 RLS 정책이 적용되어 있습니다.

### 발견 사항

- **[INFO]** `package.json:36` -- `zustand` 패키지가 설치되어 있으나 실제 코드에서 사용되지 않음. 번들 사이즈 절감을 위해 제거 권장

---

## 2. 보안 감사 (OWASP Top 10)

| 항목 | 상태 | 심각도 | 설명 |
|------|------|--------|------|
| A01 Injection | **PASS** | - | Supabase ORM 사용, Zod 입력 검증 적용. Raw SQL 없음 |
| A02 Broken Auth | **PASS** | - | Supabase Auth + JWT + 미들웨어 세션 갱신. `getUser()` 사용 (보안 권장) |
| A03 Data Exposure | **PASS** (수정됨) | - | `.env.local`에 플레이스홀더만 포함, 환경변수 null 체크 추가 완료 |
| A04 XXE | **N/A** | - | XML 파싱 미사용 |
| A05 Access Control | **PASS** | - | RLS + API 레벨 `user_id` 필터링 이중 보호 |
| A06 Misconfig | **PASS** (수정됨) | - | Security Headers 추가 완료 (X-Frame-Options, HSTS 등) |
| A07 XSS | **PASS** | - | React 기본 이스케이프, `dangerouslySetInnerHTML` 미사용 |
| A08 Deserialization | **PASS** | - | Zod 기반 입력 검증, Structured Output JSON 파싱 |
| A09 Known Vulns | **PASS** | - | 최신 패키지 버전 (Next 16.1.6, React 19.2.3) |
| A10 Logging | **PASS** | - | 감사 로그 구현, 민감 정보 미포함 |

### 추가 보안 체크

| 항목 | 상태 | 심각도 |
|------|------|--------|
| Rate Limiting | **WARNING** | 중 |
| CORS | **PASS** | - |
| Input Validation | **PASS** | - |

### 상세 발견 사항

#### WARNING-S1: Rate Limiting 미구현 (잔존)
- **파일**: 모든 API 라우트
- **설명**: OpenAI API를 호출하는 판정(`/api/v1/assessments`) 및 문서 생성(`/api/v1/documents/generate`) 엔드포인트에 Rate Limiting이 없어, 악의적 사용자가 대량 요청으로 OpenAI API 비용을 급증시킬 수 있음
- **권장**: `next.config.ts`에서 Vercel Edge Config 기반 Rate Limiting 또는 Upstash Redis Rate Limiter 적용
- **수정 방법**:
```typescript
// src/lib/rate-limit.ts 생성
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 60초에 5회
});
```

#### WARNING-S2: Security Headers 미설정 -- 수정 완료
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/next.config.ts`
- **수정 내용**: X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, HSTS, X-DNS-Prefetch-Control, Permissions-Policy 헤더 추가

#### WARNING-S3: 환경변수 Non-null Assertion -- 수정 완료
- **파일**: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- **수정 내용**: non-null assertion(!) 제거, 명시적 null 체크 + 한국어 에러 메시지 추가. `server.ts`에는 `getSupabaseEnv()` 헬퍼 함수를 생성하여 중복 제거

#### WARNING-S4: 로그인 API 응답에 access_token 노출 -- 수정 완료
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/api/v1/auth/login/route.ts`
- **수정 내용**: 응답에서 `session.access_token` 필드 제거. 쿠키 기반 세션 관리이므로 토큰을 응답 바디에 포함할 필요 없음

---

## 3. 성능 리뷰

### 발견 사항

#### WARNING-P1: useAuth 훅 무한 렌더링 가능성 -- 수정 완료
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/hooks/use-auth.ts`
- **수정 내용**: `createClient()` 호출을 `useMemo(() => createClient(), [])`로 감싸서 인스턴스 재생성 방지. `useCallback`과 `useEffect`의 의존성 안정화

#### WARNING-P2: 대시보드 요약 API의 다중 쿼리 (잔존)
- **파일**: `src/app/api/v1/dashboard/summary/route.ts:19-60`
- **설명**: 한 번의 API 호출에서 4개의 별도 Supabase 쿼리를 순차 실행 (systems, assessments, compliance_items, audit_logs). 현재 MVP 규모에서는 문제없지만, 데이터가 늘어나면 응답 시간 증가
- **심각도**: WARNING (MVP 규모에서는 수용 가능)
- **권장**: `Promise.all()`로 병렬 실행

#### INFO-P3: 클라이언트에서 직접 DB 쿼리
- **파일**: `src/app/(dashboard)/assessments/page.tsx:58-62`, `src/app/(dashboard)/documents/page.tsx:33-39`
- **설명**: 판정 목록과 문서 목록 페이지에서 API Route 대신 클라이언트에서 직접 Supabase 쿼리를 실행함. RLS가 적용되어 보안 이슈는 없지만, 일관성 측면에서 API Route를 통하는 것이 권장됨. 또한 이 패턴은 에러 핸들링이 덜 체계적임
- **심각도**: INFO

---

## 4. 코드 품질

### 카테고리별 요약

| 카테고리 | 건수 | 심각도 |
|----------|------|--------|
| 네이밍 | 0 | - |
| 에러 핸들링 | 1 | INFO |
| 타입 안전성 | 2 | WARNING/INFO |
| 코드 중복 | 1 | INFO |
| 한국어 UI | 0 | - |
| 반응형 | 0 | - |
| 접근성 | 1 | INFO |

### 상세 발견 사항

#### INFO-Q1: 에러 핸들링 일관성
- **파일**: `src/app/(dashboard)/dashboard/page.tsx:45-47`, 다수 페이지
- **설명**: 페이지 컴포넌트에서 API 호출 실패 시 console.error만 하고 사용자에게 에러 상태를 표시하지 않음. 로딩은 끝나지만 빈 화면으로 표시됨
- **권장**: 에러 상태를 추가하여 사용자 친화적 메시지 표시

#### WARNING-Q2: `as unknown as` 타입 캐스팅 (잔존)
- **파일**: `src/app/(dashboard)/assessments/page.tsx:65`
- **설명**: `data as unknown as AssessmentListItem[]` 더블 캐스팅 사용. Supabase 관계 쿼리의 타입 추론이 정확하지 않아 발생하는 문제이지만, 타입 안전성이 보장되지 않음
- **권장**: Supabase 제네릭 타입을 활용하거나, API Route를 통해 타입이 보장되는 응답을 받는 방식으로 변경

#### INFO-Q3: 네비게이션 항목 중복 정의
- **파일**: `src/components/layout/header.tsx:28-35`, `src/components/layout/sidebar.tsx:27-53`
- **설명**: 동일한 네비게이션 항목 배열이 header.tsx와 sidebar.tsx에 중복 정의되어 있음
- **권장**: 공통 상수 파일로 추출

#### INFO-Q4: 판정 설문의 클라이언트 사이드 검증 부재
- **파일**: `src/app/(dashboard)/assessments/new/page.tsx:142-148`
- **설명**: 스텝 폼에서 각 단계 이동 시 현재 필드의 유효성 검증 없이 다음 단계로 이동 가능. 서버 사이드 Zod 검증은 있지만, 사용자 경험 측면에서 클라이언트 사이드 검증이 필요
- **권장**: `handleNext()` 함수에 현재 스텝의 필수 입력 검증 로직 추가

#### INFO-Q5: 접근성 - 비교 테이블 caption 누락
- **파일**: `src/app/page.tsx:235-283`
- **설명**: 랜딩 페이지의 비교 테이블에 `<caption>` 요소가 없어 스크린 리더 사용자가 테이블의 용도를 파악하기 어려움
- **권장**: `<table>` 내에 `<caption className="sr-only">AILEX와 대안 비교</caption>` 추가

---

## 5. 테스트 현황

### 생성된 테스트 파일

| 파일 | 테스트 수 | 유형 |
|------|-----------|------|
| `src/__tests__/validators.test.ts` | 30 | Unit |
| `src/__tests__/database-types.test.ts` | 13 | Unit |
| `src/__tests__/prompts.test.ts` | 20 | Unit |
| `src/__tests__/api-helpers.test.ts` | 8 | Unit |
| `src/__tests__/openai-client.test.ts` | 4 | Unit |
| `src/__tests__/utils.test.ts` | 6 | Unit |

### 실행 결과

```
명령어: npx vitest run
결과: 6 파일 / 81 테스트 전체 통과
시간: 552ms (transform 136ms, setup 243ms, import 260ms, tests 33ms)
```

### 테스트 커버리지 요약

| 영역 | 커버리지 |
|------|----------|
| Zod 검증 스키마 (7개) | 모든 유효/무효 케이스 |
| 데이터베이스 상수/라벨 | PLAN_LIMITS, 도메인, AI 유형 등 |
| AI 프롬프트 (판정 + 문서 4종 + 고지문구) | 구조, 법 조문 참조, 필수 필드 |
| API 헬퍼 (errorResponse, successResponse) | 상태 코드, 응답 형식 |
| OpenAI 클라이언트 상수 | 모델명, 타임아웃, 재시도 |
| 유틸리티 (cn) | 클래스 병합, 충돌 해결, 조건부 |

**참고**: API Route 통합 테스트는 Supabase 및 OpenAI 외부 의존성으로 인해 모킹이 필요합니다. MVP 단계에서는 현재 수준의 단위 테스트가 적절하며, E2E 테스트는 Playwright 기반 스모크 테스트를 추후 추가 권장합니다.

---

## 6. 랜딩페이지 리뷰

별도 `landing/` 디렉토리는 없으나, `src/app/page.tsx`에 랜딩 페이지가 구현되어 있습니다.

| 항목 | 상태 | 비고 |
|------|------|------|
| Semantic HTML | PASS | nav, section, footer 사용 |
| 반응형 | PASS | sm/md/lg breakpoints 적용 |
| SEO 메타 태그 | PASS | title, description, keywords, openGraph |
| 한국어 텍스트 | PASS | 모든 UI 텍스트 한국어 |
| 접근성 | INFO | 비교 테이블 caption 누락 (Q5 참조) |
| 성능 | PASS | 외부 의존성 최소화, SSR 렌더링 |
| CTA | PASS | 명확한 행동 유도 버튼 |
| 면책 고지 | PASS | 푸터에 법적 면책 고지 포함 |

---

## 7. 수정 우선순위 (code-maintainer 용)

### P0 (즉시 수정 권장)

해당 없음 (CRITICAL 발견 없음)

### P1 (1주 내) -- 4건 수정 완료, 1건 잔존

1. ~~**[WARNING-S2] Security Headers 설정**~~ -- 수정 완료
   - 파일: `/Users/cheesom/Desktop/Projects/AILEX/project/next.config.ts`

2. ~~**[WARNING-S3] 환경변수 안전 처리**~~ -- 수정 완료
   - 파일: `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`

3. ~~**[WARNING-P1] useAuth 훅 안정화**~~ -- 수정 완료
   - 파일: `/Users/cheesom/Desktop/Projects/AILEX/project/src/hooks/use-auth.ts`

4. ~~**[WARNING-S4] 로그인 API 응답에서 access_token 제거**~~ -- 수정 완료
   - 파일: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/api/v1/auth/login/route.ts`

5. **[WARNING-S1] Rate Limiting 추가** -- 잔존 (외부 의존성 필요)
   - 파일: 모든 OpenAI 호출 API 라우트
   - 설명: 악의적 대량 요청으로 OpenAI API 비용 급증 방지
   - 수정: Upstash Rate Limiter 또는 간단한 in-memory Rate Limiter 적용

### P2 (백로그)

1. **[WARNING-P2] 대시보드 쿼리 병렬화** -- `src/app/api/v1/dashboard/summary/route.ts`
2. **[WARNING-Q2] 타입 캐스팅 개선** -- `src/app/(dashboard)/assessments/page.tsx`
3. **[INFO-Q3] 네비게이션 항목 중복 제거** -- `src/components/layout/header.tsx`, `sidebar.tsx`
4. **[INFO-P3] 클라이언트 직접 DB 쿼리를 API Route로 통일** -- `assessments/page.tsx`, `documents/page.tsx`
5. **[INFO-Q4] 판정 설문 클라이언트 사이드 검증 추가** -- `assessments/new/page.tsx`
6. **[INFO] zustand 패키지 미사용 제거** -- `package.json`
7. **[INFO-Q1] 에러 상태 UI 추가** -- dashboard, ai-systems 등 목록 페이지
8. **[INFO-Q5] 비교 테이블 caption 추가** -- `src/app/page.tsx`

---

## 8. 리서치 로그

| 검색 쿼리 | 목적 | 주요 발견 |
|-----------|------|-----------|
| `Next.js 16 API routes security best practices OWASP 2025 2026` | 보안 감사 기준 확인 | Data Access Layer 패턴 권장, 미들웨어만으로는 불충분, Security Headers 필수 |

### 참고 자료
- [Complete Next.js Security Guide 2025](https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices)
- [OWASP Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Next.js Security Checklist - Arcjet](https://blog.arcjet.com/next-js-security-checklist/)
- [Next.js 16 Security & Authentication Best Practices](https://medium.com/@sureshdotariya/robust-security-authentication-best-practices-in-next-js-16-6265d2d41b13)

---

> 본 리포트는 AI 기반 코드 리뷰 도구에 의해 생성되었습니다. 모든 발견 사항은 실제 소스 코드 분석에 기반합니다.
