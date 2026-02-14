# Vercel 환경변수 및 배포 설정 가이드

> AILEX 프로젝트의 Vercel 배포에 필요한 설정을 단계별로 안내합니다.

---

## 1. Vercel 프로젝트 연결

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리에서 Vercel 연결
cd project/
vercel link
```

연결 시 아래 정보가 필요합니다:
- **Vercel Org ID**: Vercel 대시보드 > Settings > General에서 확인
- **Vercel Project ID**: 프로젝트 Settings > General에서 확인

---

## 2. 환경변수 설정

### Vercel 대시보드에서 설정
Vercel 대시보드 > Project > Settings > Environment Variables에서 아래 변수를 추가합니다.

| 변수명 | 환경 | 필수 | 설명 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | 필수 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Production, Preview | 필수 | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | 필수 | Supabase 서비스 역할 키 (서버사이드 전용) |
| `OPENAI_API_KEY` | Production, Preview | 필수 | OpenAI API 키 |
| `NEXT_PUBLIC_APP_URL` | Production | 필수 | 프로덕션 도메인 (예: https://ailex.app) |
| `NEXT_PUBLIC_APP_NAME` | Production, Preview | 필수 | `AILEX` |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | 선택 | Sentry DSN (모니터링 설정 후 추가) |
| `SENTRY_AUTH_TOKEN` | Production | 선택 | Sentry Auth Token |

### CLI로 설정하는 방법

```bash
# 프로덕션 환경변수 추가
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# (프롬프트에서 값 입력)

# 환경변수 확인
vercel env ls
```

---

## 3. GitHub Actions 시크릿 설정

GitHub 리포지토리 > Settings > Secrets and variables > Actions에서 아래 시크릿을 추가합니다.

| 시크릿 이름 | 용도 | 확인 위치 |
|------------|------|----------|
| `VERCEL_TOKEN` | Vercel API 인증 | Vercel > Settings > Tokens > 새 토큰 생성 |
| `VERCEL_ORG_ID` | Vercel 조직 식별 | Vercel > Settings > General > Org ID |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 식별 | 프로젝트 Settings > General > Project ID |
| `NEXT_PUBLIC_SUPABASE_URL` | 빌드 시 환경변수 | Supabase 대시보드 > Settings > API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 빌드 시 환경변수 | Supabase 대시보드 > Settings > API |
| `SLACK_WEBHOOK_URL` | 배포 알림 (선택) | Slack App > Incoming Webhooks |

---

## 4. Vercel 프로젝트 설정

### vercel.json (이미 프로젝트에 포함됨)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["icn1"],
  "functions": {
    "src/app/api/v1/assessments/route.ts": { "maxDuration": 60 },
    "src/app/api/v1/documents/generate/route.ts": { "maxDuration": 60 },
    "src/app/api/v1/tools/notice-generator/route.ts": { "maxDuration": 30 }
  }
}
```

### 권장 Vercel 설정
- **Framework Preset**: Next.js
- **Root Directory**: `project` (모노레포 구조이므로)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm ci` (기본값)
- **Node.js Version**: 22.x

---

## 5. 커스텀 도메인 설정

```bash
# 도메인 추가
vercel domains add ailex.app

# DNS 설정 확인
vercel domains inspect ailex.app
```

### DNS 레코드 설정
| 타입 | 호스트 | 값 |
|------|--------|-----|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

---

## 6. 배포 플로우

```
로컬 개발 -> feature 브랜치 push
  -> PR 생성 -> pr-check.yml (린트 + 타입체크 + 테스트)
    -> PR에 Preview URL 코멘트
  -> PR merge -> main 브랜치 push
    -> deploy.yml (검증 -> 빌드 -> 프로덕션 배포 -> 헬스체크)
      -> Slack 알림
```

### 수동 배포 (긴급 시)
```bash
# 프로젝트 디렉토리에서
cd project/

# 프리뷰 배포
vercel

# 프로덕션 배포
vercel --prod
```
