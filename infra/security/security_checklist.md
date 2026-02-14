# AILEX 보안 체크리스트

> AI 기본법 컴플라이언스 자동화 B2B SaaS에 해당하는 보안 항목입니다.
> B2B 제품으로서 고객의 AI 시스템 정보를 다루므로 보안이 특히 중요합니다.

---

## 1. 인증 및 접근 제어

### Supabase Auth 설정
- [x] Row Level Security (RLS) 모든 테이블에 활성화
- [x] 사용자 본인 데이터만 접근 가능한 RLS 정책 적용
- [ ] Google OAuth 프로덕션 설정 완료 (Supabase 대시보드)
- [ ] 이메일 인증 활성화 (회원가입 시 이메일 확인)
- [ ] 비밀번호 정책 설정 (최소 8자, 복잡도 요구)

### 세션 관리
- [x] Supabase JWT 자동 토큰 리프레시 설정
- [x] Next.js 미들웨어에서 세션 갱신 처리
- [ ] 로그아웃 시 세션 완전 무효화 확인
- [ ] 동시 세션 수 제한 검토 (선택)

### API 접근 제어
- [x] 서버사이드 API Route에서 인증 확인
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트에 절대 노출되지 않는지 확인
- [ ] API 엔드포인트별 권한 검증 (본인 리소스만 수정/삭제 가능)

---

## 2. 환경변수 및 시크릿 관리

### 환경변수 분류
| 변수 | 노출 가능 | 저장 위치 |
|------|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | 가능 (공개 URL) | Vercel 환경변수 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 가능 (Anon Key) | Vercel 환경변수 |
| `SUPABASE_SERVICE_ROLE_KEY` | 절대 불가 | Vercel 환경변수 (서버 전용) |
| `OPENAI_API_KEY` | 절대 불가 | Vercel 환경변수 (서버 전용) |
| `SENTRY_AUTH_TOKEN` | 절대 불가 | Vercel 환경변수 (빌드 전용) |

### 시크릿 관리 수칙
- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] `NEXT_PUBLIC_` 접두사가 붙은 변수에 민감 정보가 없는지 확인
- [ ] Vercel 환경변수에서 `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`가 Production + Preview에만 설정

### 시크릿 로테이션 절차
1. **Supabase Service Role Key** (분기 1회 권장):
   - Supabase 대시보드 > Settings > API > Regenerate Service Role Key
   - Vercel 환경변수 업데이트
   - 재배포: `vercel --prod`

2. **OpenAI API Key** (분기 1회 또는 유출 의심 시):
   - OpenAI Platform > API Keys > 새 키 생성
   - 기존 키 비활성화
   - Vercel 환경변수 업데이트
   - 재배포

3. **Supabase Anon Key** (유출 시에만):
   - Supabase 대시보드에서 재생성
   - 클라이언트/서버 양쪽 환경변수 업데이트

---

## 3. HTTPS/SSL 및 보안 헤더

### HTTPS 확인
- [x] Vercel에서 자동 SSL 인증서 발급 (기본 제공)
- [x] HSTS 헤더 설정 (`next.config.ts`)
- [ ] 커스텀 도메인의 SSL 인증서 정상 작동 확인
- [ ] HTTP -> HTTPS 리다이렉트 확인

### 보안 헤더 (next.config.ts에서 설정 완료)
- [x] `X-Frame-Options: DENY` (클릭재킹 방지)
- [x] `X-Content-Type-Options: nosniff` (MIME 스니핑 방지)
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Strict-Transport-Security` (HSTS)
- [x] `Permissions-Policy` (불필요한 API 비활성화)
- [ ] `Content-Security-Policy` 헤더 추가 검토

### CSP (Content Security Policy) 권장 설정
```typescript
// next.config.ts의 headers()에 추가
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://*.supabase.co",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://*.sentry.io",
    "font-src 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
}
```

---

## 4. API 보안

### Rate Limiting
- [x] `src/lib/rate-limit.ts` 구현 확인
- [ ] OpenAI API 호출에 Rate Limit 적용 (비용 폭증 방지)
- [ ] 인증 엔드포인트에 강화된 Rate Limit 적용 (브루트포스 방지)

### Rate Limit 권장 설정
| 엔드포인트 | 제한 | 이유 |
|-----------|------|------|
| `/api/v1/auth/*` | 10회/분 | 브루트포스 방지 |
| `/api/v1/assessments` (POST) | 5회/분 | OpenAI API 비용 제어 |
| `/api/v1/documents/generate` (POST) | 3회/분 | OpenAI API 비용 제어 |
| `/api/v1/tools/*` (POST) | 10회/분 | OpenAI API 비용 제어 |
| 기타 GET 요청 | 60회/분 | 일반 보호 |

### 입력 검증
- [x] Zod 스키마로 API 입력값 검증 (`src/lib/validators/`)
- [ ] SQL Injection 방지 확인 (Supabase 클라이언트 사용 시 자동 방지)
- [ ] XSS 방지 확인 (React의 기본 이스케이프 + 직접 HTML 주입 없음)
- [ ] 파일 업로드 시 타입/크기 제한 확인

### CORS 설정
- [x] Next.js App Router 기본 CORS (동일 출처만 허용)
- [ ] API 라우트에서 외부 도메인 접근이 필요한 경우 명시적 CORS 헤더 설정

---

## 5. 의존성 보안

### 자동 스캔
- [ ] GitHub Actions 주간 보안 스캔 워크플로우 활성화 (`scheduled.yml`)
- [ ] GitHub Dependabot 활성화 (Settings > Code security > Dependabot alerts)

### Dependabot 설정 파일
프로젝트 루트에 `.github/dependabot.yml` 추가:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/project"
    schedule:
      interval: "weekly"
      day: "monday"
      timezone: "Asia/Seoul"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "automated"
```

### 수동 점검 (월 1회)
```bash
cd project/

# 취약점 확인
npm audit

# 자동 수정 (안전한 업데이트만)
npm audit fix

# 전체 의존성 업데이트 현황
npm outdated
```

---

## 6. 데이터 보호 (B2B 고객 데이터)

### 데이터 분류
| 데이터 | 민감도 | 보호 방법 |
|--------|--------|----------|
| 고객 이메일/비밀번호 | 높음 | Supabase Auth (bcrypt 해싱) |
| AI 시스템 정보 | 높음 | RLS + 암호화 전송 (HTTPS) |
| 컴플라이언스 평가 결과 | 높음 | RLS + 접근 로그 |
| 생성된 문서 콘텐츠 | 높음 | RLS + Supabase Storage 정책 |
| 감사 로그 | 보통 | RLS + 삭제 불가 정책 |

### 데이터 보호 수칙
- [ ] OpenAI API로 전송되는 데이터에 고객 식별 정보가 포함되지 않도록 확인
- [ ] Sentry 에러 로그에서 민감 정보 필터링 (sentry_setup.md 참조)
- [ ] 로그에 비밀번호, API 키, 개인 정보가 기록되지 않는지 확인
- [ ] 서비스 탈퇴 시 데이터 삭제 절차 마련 (GDPR/개인정보보호법 대응)
- [ ] 감사 로그(audit_logs)의 보관 기간 정책 수립

---

## 7. OpenAI API 비용 보호

AI API 오남용으로 인한 비용 폭증을 방지하기 위한 설정:

- [ ] OpenAI 대시보드에서 **월간 사용량 한도** 설정 (Usage Limits)
  - Soft Limit: $50 (알림)
  - Hard Limit: $100 (차단)
- [ ] 사용자별 월간 AI 사용 횟수 제한 (plan별 차등)
- [ ] API 호출 실패 시 재시도 횟수 제한 (최대 3회)
- [ ] 비정상적으로 긴 입력 텍스트 제한 (토큰 수 상한 설정)

---

## 8. 인프라 보안

### Vercel 설정
- [ ] Vercel 계정에 2FA (2단계 인증) 활성화
- [ ] 불필요한 팀 멤버 제거
- [ ] Deployment Protection 설정 (Preview 배포 접근 제한)

### Supabase 설정
- [ ] Supabase 계정에 2FA 활성화
- [ ] Database 비밀번호 강도 확인 (최소 16자 랜덤 문자열)
- [ ] Network Restrictions 설정 검토 (필요 시 IP 화이트리스트)
- [ ] Supabase 대시보드에서 불필요한 Auth Providers 비활성화

### GitHub 설정
- [ ] GitHub 계정에 2FA 활성화
- [ ] Branch Protection Rules 설정 (main 브랜치: PR 필수, 리뷰 필수)
- [ ] Secrets가 포크된 리포에 노출되지 않도록 설정

---

## 9. 분기별 보안 점검 일정

| 시기 | 작업 | 소요 시간 |
|------|------|----------|
| 매주 월요일 | GitHub Actions 보안 스캔 결과 확인 | 5분 |
| 매월 1일 | `npm audit` 수동 실행 및 수정 | 30분 |
| 매분기 | 시크릿 로테이션 (API 키 갱신) | 30분 |
| 매분기 | 이 체크리스트 전체 재점검 | 1시간 |
| 매년 | 전체 보안 아키텍처 리뷰 | 반나절 |
