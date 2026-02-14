# 유지보수 리포트: AILEX (AI Law EXpert)

> 작업일: 2026-02-13
> 모드: A: 리뷰 기반 수정
> 입력: code_review_report.md + 사용자 직접 요청 사항

---

## 작업 요약
| 항목 | 건수 |
|------|------|
| 수정된 파일 | 12개 |
| 보안 수정 | 1건 (WARNING-S1 Rate Limiting) |
| 버그 수정 | 0건 |
| 성능 수정 | 1건 (WARNING-P2 쿼리 병렬화) |
| 코드 품질 개선 | 6건 |
| 추가된 테스트 | 21개 (3개 파일) |

---

## 상세 변경 로그

### 1. Rate Limiting 구현 (WARNING-S1)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/lib/rate-limit.ts` (신규)
- **유형**: 보안
- **변경 내용**: 인메모리 슬라이딩 윈도우 Rate Limiter 구현. OpenAI API를 호출하는 4개 엔드포인트(assessments POST, documents/generate POST, documents/:id PUT, tools/notice-generator POST)에 적용. 만료된 항목 자동 정리 메커니즘 포함.
- **관련 테스트**: `src/__tests__/rate-limit.test.ts` (10개 테스트)
- **적용된 엔드포인트**: assessments(분당 5회), documents/generate(분당 5회), documents/:id PUT(분당 10회), notice-generator(분당 10회)

### 2. 대시보드 쿼리 병렬화 (WARNING-P2)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/api/v1/dashboard/summary/route.ts`
- **유형**: 성능
- **변경 내용**: 4개의 순차 Supabase 쿼리(systems, assessments, compliance_items, audit_logs)를 `Promise.all()`로 병렬 실행하도록 변경
- **이전**: 순차 `await` 4회
- **이후**: `Promise.all()` 1회로 동시 실행

### 3. OpenAI 에러 핸들링 개선
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/lib/openai/client.ts`
- **유형**: 코드 품질 / 에러 핸들링
- **변경 내용**: `getOpenAIErrorMessage()` 함수 추가. OpenAI SDK의 구체적 에러 타입(APIError, RateLimitError, APIConnectionError, APIConnectionTimeoutError)을 감지하여 사용자 친화적 한국어 메시지로 변환. 클라이언트 생성 시 `timeout`과 `maxRetries` 옵션 적용. assessments/route.ts의 수동 재시도 로직을 OpenAI SDK 내장 재시도로 대체.
- **관련 테스트**: `src/__tests__/openai-client.test.ts` (기존 4개 -> 9개)
- **적용 파일**: assessments/route.ts, documents/generate/route.ts, documents/[id]/route.ts, tools/notice-generator/route.ts

### 4. 타입 캐스팅 개선 (WARNING-Q2)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/(dashboard)/assessments/page.tsx`
- **유형**: 코드 품질
- **변경 내용**: `data as unknown as AssessmentListItem[]` 더블 캐스팅 제거. `data.map()`으로 각 필드를 명시적으로 매핑하는 방식으로 변경. 관계 쿼리 결과(`ai_systems`)만 단일 캐스팅으로 처리.
- **이전**: `setAssessments(data as unknown as AssessmentListItem[])`
- **이후**: 필드별 명시적 변환 `data.map((row) => ({ id: row.id, ... }))`

### 5. 네비게이션 항목 중복 제거 (INFO-Q3)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/lib/constants/navigation.ts` (신규), `header.tsx`, `sidebar.tsx`
- **유형**: 리팩토링
- **변경 내용**: header.tsx와 sidebar.tsx에 중복 정의된 네비게이션 항목 배열을 `navigation.ts` 공통 상수 파일로 추출. `NavItem` 인터페이스 정의. 두 컴포넌트 모두 공통 상수를 import하도록 변경.
- **관련 테스트**: `src/__tests__/navigation.test.ts` (6개 테스트)

### 6. 대시보드 에러 상태 UI 추가 (INFO-Q1)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/(dashboard)/dashboard/page.tsx`
- **유형**: 코드 품질 / UX
- **변경 내용**: API 호출 실패 시 `error` 상태를 추가하여 사용자 친화적 한국어 에러 메시지와 "다시 시도" 버튼을 표시. 기존에는 console.error만 출력하고 빈 화면이 표시됨.

### 7. 판정 목록 에러 상태 UI 추가
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/(dashboard)/assessments/page.tsx`
- **유형**: 코드 품질 / UX
- **변경 내용**: Supabase 쿼리 실패 시 에러 상태 UI 추가. try-catch 적용으로 에러 핸들링 강화. `resultConfig` 객체로 아이콘/라벨/색상 매핑 통합 (기존 3개 별도 Record -> 1개 통합 Record).

### 8. 비교 테이블 접근성 개선 (INFO-Q5)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/src/app/page.tsx`
- **유형**: 접근성
- **변경 내용**: 랜딩 페이지 비교 테이블에 `<caption className="sr-only">` 추가. 스크린 리더 사용자가 테이블의 용도를 파악할 수 있도록 함.
- **이전**: `<table>` (caption 없음)
- **이후**: `<caption className="sr-only">AILEX와 법무법인, 글로벌 솔루션의 비용, 소요 시간, 지원 범위 비교</caption>`

### 9. 미사용 패키지 제거 (INFO)
- **파일**: `/Users/cheesom/Desktop/Projects/AILEX/project/package.json`
- **유형**: 코드 품질
- **변경 내용**: 코드에서 사용되지 않는 `zustand` 패키지 제거. 번들 사이즈 절감.

---

## 빌드 & 테스트 결과
| 항목 | 결과 | 비고 |
|------|------|------|
| 빌드 | PASS | `npm run build` (Next.js 16.1.6 Turbopack) |
| 테스트 | 102/102 통과 (100%) | `npx vitest run` (8개 파일, 726ms) |
| 타입 체크 | PASS | `npx tsc --noEmit` |

---

## 수정된 파일 목록

| 파일 | 변경 유형 |
|------|-----------|
| `src/lib/rate-limit.ts` | 신규 생성 |
| `src/lib/constants/navigation.ts` | 신규 생성 |
| `src/lib/openai/client.ts` | 수정 |
| `src/app/api/v1/assessments/route.ts` | 수정 |
| `src/app/api/v1/documents/generate/route.ts` | 수정 |
| `src/app/api/v1/documents/[id]/route.ts` | 수정 |
| `src/app/api/v1/tools/notice-generator/route.ts` | 수정 |
| `src/app/api/v1/dashboard/summary/route.ts` | 수정 |
| `src/app/(dashboard)/assessments/page.tsx` | 수정 |
| `src/app/(dashboard)/dashboard/page.tsx` | 수정 |
| `src/components/layout/header.tsx` | 수정 |
| `src/components/layout/sidebar.tsx` | 수정 |
| `src/app/page.tsx` | 수정 |
| `src/__tests__/rate-limit.test.ts` | 신규 생성 |
| `src/__tests__/openai-client.test.ts` | 수정 |
| `src/__tests__/navigation.test.ts` | 신규 생성 |
| `package.json` | 수정 (zustand 제거) |

---

## 미처리 항목
| 항목 | 이유 | 권장 시기 |
|------|------|-----------|
| Rate Limiting Redis 기반 전환 | 인메모리 방식은 서버 재시작 시 초기화됨. 프로덕션에서는 Upstash Redis 기반으로 전환 권장 | 프로덕션 배포 전 |
| 클라이언트 직접 DB 쿼리를 API Route로 통일 (INFO-P3) | assessments/page.tsx, documents/page.tsx에서 직접 Supabase 클라이언트 사용. RLS로 보안 이슈는 없으나 일관성 측면에서 개선 필요 | 2주 내 |
| 판정 설문 클라이언트 사이드 검증 (INFO-Q4) | 서버 Zod 검증은 있으나 UX 개선용 클라이언트 검증 누락 | 2주 내 |
| 월간 리포트 기능 구현 (P1 TODO) | dashboard/report API가 placeholder 상태 | 기능 로드맵에 따라 |
| E2E 테스트 추가 | 현재 단위 테스트만 존재. Playwright 기반 스모크 테스트 권장 | 1개월 내 |

---

## 다음 유지보수 권장 사항
1. **Rate Limiting 프로덕션 전환**: 현재 인메모리 Rate Limiter를 Upstash Redis 기반(`@upstash/ratelimit`)으로 교체하여 서버리스 환경 및 다중 인스턴스에서도 동작하도록 개선
2. **클라이언트 직접 쿼리 통일**: assessments/page.tsx, documents/page.tsx의 Supabase 직접 쿼리를 API Route 호출로 변경하여 에러 핸들링 일관성 확보
3. devops-deployer(#8) 재배포 필요 여부: **재배포 필요** (보안 패치 - Rate Limiting 추가, OpenAI 에러 핸들링 강화, 성능 개선 - 대시보드 쿼리 병렬화)
