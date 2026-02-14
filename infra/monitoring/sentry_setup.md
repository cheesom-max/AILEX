# Sentry 에러 추적 설정 가이드

> AILEX 프로젝트 (Next.js 16 + Vercel)에 맞춘 Sentry 설정 가이드입니다.

---

## 1. Sentry 계정 및 프로젝트 생성

1. [Sentry](https://sentry.io) 회원가입 (무료: 5,000 이벤트/월)
2. Create Project > Next.js 선택
3. **DSN** 값을 복사 (환경변수에 사용)

---

## 2. 패키지 설치

```bash
cd project/

# Sentry Next.js SDK 설치
npx @sentry/wizard@latest -i nextjs
```

wizard가 자동으로 아래 작업을 수행합니다:
- `@sentry/nextjs` 패키지 설치
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` 생성
- `next.config.ts`에 `withSentryConfig` 래핑
- `instrumentation.ts` 생성

---

## 3. 수동 설정 (wizard 실행이 어려운 경우)

### 패키지 설치
```bash
npm install @sentry/nextjs
```

### sentry.client.config.ts (프로젝트 루트)
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // 프로덕션에서만 활성화
  enabled: process.env.NODE_ENV === "production",

  // 에러 샘플링 비율 (100% - 무료 티어에서 5K 이벤트 이내)
  tracesSampleRate: 0.1,

  // 세션 리플레이 (디버깅용, 에러 발생 시에만)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,      // B2B SaaS이므로 민감 정보 마스킹
      blockAllMedia: true,
    }),
  ],

  // 민감 정보 필터링
  beforeSend(event) {
    // 사용자 이메일 등 개인정보 제거
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    return event;
  },
});
```

### sentry.server.config.ts (프로젝트 루트)
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,

  // 서버사이드에서 민감 정보 필터링
  beforeSend(event) {
    // 환경변수 값이 에러에 포함되지 않도록 필터링
    if (event.extra) {
      const sensitiveKeys = ['SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY'];
      for (const key of sensitiveKeys) {
        if (event.extra[key]) {
          event.extra[key] = '[FILTERED]';
        }
      }
    }
    return event;
  },
});
```

### sentry.edge.config.ts (프로젝트 루트)
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
});
```

### instrumentation.ts (프로젝트 루트)
```typescript
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}
```

### next.config.ts 수정
```typescript
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... 기존 설정 유지
};

export default withSentryConfig(nextConfig, {
  // 소스맵 업로드 (에러 위치 정확히 추적)
  org: "your-sentry-org",
  project: "ailex",

  // 소스맵을 Sentry에만 업로드하고 클라이언트에 노출하지 않음
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // 빌드 시 자동 릴리즈 생성
  release: {
    name: process.env.VERCEL_GIT_COMMIT_SHA,
  },

  // 빌드 경고 무시
  silent: true,
});
```

---

## 4. 환경변수 설정

### Vercel 대시보드에서 추가
| 변수 | 환경 | 값 |
|------|------|-----|
| `NEXT_PUBLIC_SENTRY_DSN` | Production, Preview | Sentry DSN URL |
| `SENTRY_AUTH_TOKEN` | Production | Sentry > Settings > Auth Tokens에서 생성 |
| `SENTRY_ORG` | Production | Sentry 조직 slug |
| `SENTRY_PROJECT` | Production | `ailex` (Sentry 프로젝트명) |

---

## 5. 알림 규칙 설정

### Sentry 대시보드에서 설정
Sentry > Alerts > Create Alert Rule

#### 규칙 1: 새 에러 발생
- **Condition**: A new issue is created
- **Action**: Slack 채널 (#ailex-alerts)에 알림 + 이메일
- **Frequency**: 즉시

#### 규칙 2: 에러 급증
- **Condition**: Number of events > 50 in 1 hour
- **Action**: Slack + 이메일
- **Frequency**: 1시간에 1회

#### 규칙 3: 미처리 에러 경고
- **Condition**: Issue is unresolved for 24 hours and has > 10 events
- **Action**: 이메일
- **Frequency**: 24시간에 1회

### Slack 연동
1. Sentry > Settings > Integrations > Slack
2. Slack Workspace 연결
3. Alert 규칙에서 Slack 채널 지정

---

## 6. API 라우트에서 수동 에러 캡처

주요 API 라우트에서 비즈니스 로직 에러를 직접 캡처하려면:

```typescript
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  try {
    // ... 비즈니스 로직
  } catch (error) {
    // Sentry에 에러 전송 (추가 컨텍스트 포함)
    Sentry.captureException(error, {
      tags: {
        api_route: "/api/v1/assessments",
        action: "create_assessment",
      },
      extra: {
        // 민감하지 않은 디버깅 정보만 포함
        ai_system_id: systemId,
      },
    });

    return Response.json(
      { error: "내부 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
```

---

## 7. 비용 관리

무료 티어(5,000 이벤트/월)를 초과하지 않기 위한 설정:

1. **tracesSampleRate**: `0.1` (10%만 성능 추적)
2. **replaysSessionSampleRate**: `0` (세션 리플레이는 에러 발생 시에만)
3. **Spike Protection**: Sentry > Settings > Spike Protection 활성화
4. **Rate Limiting**: Sentry > Settings > Client Keys > Rate Limit 설정

### 월간 이벤트 예상치
- 일반 에러: ~100개/월 (초기 단계)
- 성능 트랜잭션: DAU 100명 기준 ~3,000개/월 (10% 샘플링)
- 합계: ~3,100개/월 (무료 티어 범위 내)
