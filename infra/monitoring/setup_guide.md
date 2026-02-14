# AILEX 모니터링 설정 가이드

> 1인 운영자가 서비스 상태를 효율적으로 파악하기 위한 모니터링 스택 설정 가이드입니다.
> 모든 도구는 무료 티어 또는 최소 비용으로 운영할 수 있습니다.

---

## 모니터링 스택 개요

| 영역 | 도구 | 비용 | 용도 |
|------|------|------|------|
| 업타임 모니터링 | UptimeRobot | 무료 (50개 모니터) | 서비스 가용성 확인 |
| 에러 추적 | Sentry | 무료 (5K 이벤트/월) | 런타임 에러 추적 |
| 성능 모니터링 | Vercel Analytics | 무료 (Hobby) | Core Web Vitals |
| 로그 관리 | Vercel Logs + Axiom | 무료 | 서버 로그 조회 |
| 알림 | Slack + 이메일 | 무료 | 장애 알림 수신 |

---

## 1. UptimeRobot 업타임 모니터링

### 계정 생성 및 모니터 설정

1. [UptimeRobot](https://uptimerobot.com) 회원가입 (무료)
2. Dashboard > Add New Monitor

### 필수 모니터 목록

| 모니터 이름 | URL | 타입 | 간격 |
|------------|-----|------|------|
| AILEX - 메인 페이지 | `https://ailex.app` | HTTP(s) | 5분 |
| AILEX - 로그인 페이지 | `https://ailex.app/login` | HTTP(s) | 5분 |
| AILEX - 대시보드 | `https://ailex.app/dashboard` | HTTP(s) | 5분 |
| AILEX - API 헬스 | `https://ailex.app/api/v1/dashboard/summary` | HTTP(s) | 5분 |
| Supabase API | Supabase 프로젝트 URL + `/rest/v1/` | HTTP(s) | 5분 |

### 모니터 상세 설정
- **Monitoring Interval**: 5분 (무료 티어 최소)
- **Alert Contacts**: 이메일 + Slack (아래 참조)
- **HTTP Method**: GET
- **Expected Status**: 200
- **Timeout**: 30초

### 알림 채널 설정

**이메일 알림:**
1. My Settings > Alert Contacts > Add Alert Contact
2. Type: Email, 본인 이메일 입력

**Slack 알림:**
1. My Settings > Alert Contacts > Add Alert Contact
2. Type: Slack
3. Slack Workspace 연동 후 채널 선택 (#alerts 권장)

**Telegram 알림 (선택):**
1. BotFather에서 봇 생성: `/newbot`
2. 봇 토큰 받기
3. UptimeRobot > Alert Contacts > Telegram 추가

### 상태 페이지 (선택)

무료 상태 페이지를 제공할 수 있습니다:
1. UptimeRobot Dashboard > Status Pages
2. Add Status Page
3. 모니터 선택 후 URL 공개 (예: `https://stats.uptimerobot.com/ailex`)

---

## 2. Vercel Analytics 성능 모니터링

### 활성화 방법

1. Vercel 대시보드 > 프로젝트 선택
2. Analytics 탭 클릭
3. "Enable" 버튼 클릭

### Web Vitals 모니터링 항목

| 메트릭 | 목표 | 설명 |
|--------|------|------|
| LCP (Largest Contentful Paint) | < 2.5초 | 최대 콘텐츠 렌더링 시간 |
| FID (First Input Delay) | < 100ms | 첫 입력 반응 시간 |
| CLS (Cumulative Layout Shift) | < 0.1 | 레이아웃 이동 정도 |
| TTFB (Time to First Byte) | < 800ms | 서버 응답 시간 |

### Vercel Speed Insights (선택)

프로젝트에 Speed Insights 패키지를 추가하면 더 상세한 성능 데이터를 수집할 수 있습니다:

```bash
cd project/
npm install @vercel/speed-insights
```

`src/app/layout.tsx`에 추가:
```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## 3. Axiom 로그 관리 (선택)

Vercel의 기본 로그는 실시간만 지원합니다. 장기 보관이 필요하면 Axiom을 연동합니다.

### Axiom 설정

1. [Axiom](https://axiom.co) 회원가입 (무료: 500MB/일)
2. Settings > API Tokens > 새 토큰 생성
3. Vercel 대시보드 > Integrations > Axiom 설치
4. Axiom 토큰과 Dataset 연결

### 구조화된 로깅 패턴

프로젝트에 아래 로거 유틸리티를 추가하면 일관된 형식으로 로그를 남길 수 있습니다:

```typescript
// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('info', message, context);
    console.log(JSON.stringify(entry));
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('warn', message, context);
    console.warn(JSON.stringify(entry));
  },

  error(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry('error', message, context);
    console.error(JSON.stringify(entry));
  },
};
```

### 사용 예시

```typescript
import { logger } from '@/lib/logger';

// API 라우트에서
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // ... 비즈니스 로직
    logger.info('AI 평가 완료', {
      aiSystemId: system.id,
      result: assessment.result,
      durationMs: Date.now() - startTime,
    });

    return Response.json(assessment);
  } catch (error) {
    logger.error('AI 평가 실패', {
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - startTime,
    });

    return Response.json({ error: '평가 처리 중 오류' }, { status: 500 });
  }
}
```

---

## 4. 알림 통합 요약

### Slack 채널 구성 (권장)

| 채널 | 용도 | 연결 |
|------|------|------|
| #ailex-alerts | 장애/에러 알림 | UptimeRobot + Sentry |
| #ailex-deploys | 배포 알림 | GitHub Actions |

### 알림 규칙

| 조건 | 알림 채널 | 긴급도 |
|------|----------|--------|
| 서비스 다운 (5분 이상) | Slack + 이메일 | 긴급 |
| API 응답 지연 (10초 이상) | Slack | 보통 |
| 에러 rate 급증 (1시간 50건 이상) | Slack + 이메일 | 긴급 |
| 새 에러 유형 발견 | Slack | 보통 |
| 보안 취약점 발견 | 이메일 | 보통 |
| 배포 실패 | Slack | 긴급 |

---

## 5. 주간 체크리스트

매주 월요일 아침, 아래 항목을 확인합니다 (10분 소요):

- [ ] UptimeRobot 대시보드에서 지난 7일 업타임 확인
- [ ] Sentry에서 미처리 에러 확인 및 분류
- [ ] Vercel Analytics에서 Web Vitals 추이 확인
- [ ] Supabase 대시보드에서 DB 사용량 확인
- [ ] GitHub Actions 주간 보안 스캔 결과 확인
