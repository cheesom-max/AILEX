# AILEX 분석 도구 설정 가이드

> 작성일: 2026-02-14
> 기반: mvp_spec.md, gtm_strategy.md, kpi_framework.md
> 기술 스택: Next.js 16 (App Router) + Supabase + Vercel
> 원칙: 무료/저비용 도구 우선, 1인 운영에 최적화

---

## 1. 추천 도구 스택

| 용도 | 추천 도구 | 가격 | 설정 난이도 | 핵심 역할 |
|------|-----------|------|-------------|-----------|
| 웹 트래픽 분석 | Google Analytics 4 | 무료 | 낮음 | UTM 기반 채널별 유입, 전환 추적, 검색 콘솔 연동 |
| 제품 분석 + A/B 테스트 | PostHog | 무료 (월 1M 이벤트) | 중간 | 퍼널 분석, 코호트 리텐션, Feature Flags, 실험 |
| 웹 성능 | Vercel Analytics + Speed Insights | Vercel Pro 포함 ($20/월) | 낮음 | Core Web Vitals, 페이지별 성능 |
| 세션 리플레이 | PostHog | 무료 (월 5K 세션) | 낮음 | 사용자 행동 녹화, UX 병목 발견 |
| 에러 추적 | Sentry | 무료 (월 5K 이벤트) | 낮음 | 클라이언트/서버 에러 모니터링 |
| 매출 추적 | Stripe Dashboard + Supabase | Stripe 수수료만 | 낮음 | MRR, Churn, 결제 현황 |
| SEO 모니터링 | Google Search Console | 무료 | 낮음 | 검색 노출, CTR, 키워드 순위 |
| 이메일 성과 | Resend | 무료 (월 3,000통) | 낮음 | 이메일 오픈율, 클릭률 |

### 월간 비용 합계: 약 0원 (Vercel Pro 비용은 인프라에 포함)

---

## 2. 이벤트 트래킹 계획

AILEX의 핵심 퍼널(방문 -> 가입 -> 무료 판정 -> 고영향 판정 -> Pro 전환)에 맞춘 이벤트 목록.

### 2.1 자동 수집 이벤트 (PostHog autocapture)

PostHog의 autocapture가 자동으로 수집하는 이벤트. 별도 코드 불필요.

| 이벤트 | 설명 |
|--------|------|
| `$pageview` | 페이지 조회 |
| `$pageleave` | 페이지 이탈 |
| `$autocapture` | 클릭, 폼 제출 등 |

### 2.2 커스텀 이벤트 (수동 구현 필요)

KPI 프레임워크의 핵심 지표를 측정하기 위한 커스텀 이벤트.

#### Acquisition 이벤트

| 이벤트명 | 트리거 시점 | 속성 (properties) |
|----------|------------|-------------------|
| `signup_completed` | 회원가입 완료 | `method` (email/google), `utm_source`, `utm_medium`, `utm_campaign`, `referrer` |
| `login_completed` | 로그인 성공 | `method` (email/google) |

#### Activation 이벤트

| 이벤트명 | 트리거 시점 | 속성 |
|----------|------------|------|
| `assessment_started` | 자가진단 시작 버튼 클릭 | `source_page` |
| `assessment_info_submitted` | AI 시스템 정보 입력 완료 | `ai_category` (11개 영역 중), `company_size` |
| `assessment_completed` | 판정 결과 확인 | `result` (high_impact/not_high_impact/uncertain), `ai_category`, `duration_seconds` |
| `assessment_pdf_downloaded` | 판정 결과 PDF 다운로드 | `result` |

#### Revenue 이벤트

| 이벤트명 | 트리거 시점 | 속성 |
|----------|------------|------|
| `pro_upgrade_modal_shown` | Pro 업그레이드 모달 표시 | `trigger` (assessment_result/dashboard/pricing_page) |
| `pro_upgrade_clicked` | Pro 업그레이드 CTA 클릭 | `plan` (pro/enterprise/founder), `trigger` |
| `checkout_started` | 결제 페이지 진입 | `plan`, `price` |
| `checkout_completed` | 결제 완료 | `plan`, `price`, `payment_method` |
| `subscription_cancelled` | 구독 해지 | `plan`, `reason` (설문), `tenure_days` |

#### Product Usage 이벤트

| 이벤트명 | 트리거 시점 | 속성 |
|----------|------------|------|
| `document_generation_started` | 의무 문서 생성 시작 | `doc_type` (impact_assessment/transparency_report/risk_management), `ai_system_id` |
| `document_generation_completed` | 의무 문서 생성 완료 | `doc_type`, `ai_system_id`, `duration_seconds`, `word_count` |
| `document_downloaded` | 문서 다운로드 | `doc_type`, `format` (pdf/docx) |
| `document_edited` | 문서 편집 | `doc_type`, `edit_count` |
| `ai_system_registered` | AI 시스템 등록 | `ai_category`, `system_count` |
| `dashboard_viewed` | 컴플라이언스 대시보드 조회 | `compliance_status` |
| `checklist_item_completed` | 체크리스트 항목 완료 | `item_id`, `total_items`, `completed_items` |

#### Referral 이벤트

| 이벤트명 | 트리거 시점 | 속성 |
|----------|------------|------|
| `result_shared` | 판정 결과 공유 버튼 클릭 | `channel` (linkedin/x/kakaotalk/badge), `result` |
| `badge_embedded` | 컴플라이언스 배지 코드 복사 | `company_name` |
| `referral_signup` | 공유 링크로 가입 | `referrer_id`, `channel` |

---

## 3. Google Analytics 4 (GA4) 설정

### 3.1 GA4 계정 생성

1. https://analytics.google.com 접속
2. "측정 시작" 클릭 -> 계정명 "AILEX" 입력
3. 속성 생성: "AILEX Production", 시간대 "대한민국", 통화 "KRW"
4. 데이터 스트림: "웹" 선택, URL에 `ailex.ai` 입력
5. 측정 ID (`G-XXXXXXXXXX`) 복사

### 3.2 Next.js 16 연동 코드

**환경 변수 설정** (`.env.local`):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**GA4 스크립트 삽입** (`app/layout.tsx`):

Next.js 16의 공식 `@next/third-parties/google` 패키지를 사용한다.

```bash
npm install @next/third-parties
```

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      )}
    </html>
  )
}
```

**커스텀 전환 이벤트 전송** (`lib/analytics/ga.ts`):

```typescript
// lib/analytics/ga.ts
export function sendGAEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// 사용 예시: Pro 전환 추적
// sendGAEvent('purchase', {
//   transaction_id: 'T_12345',
//   value: 300000,
//   currency: 'KRW',
//   items: [{ item_name: 'AILEX Pro', price: 300000 }]
// })
```

**GA4 전환 이벤트 설정** (GA4 관리자 화면):

1. 관리 -> 이벤트 -> "이벤트 만들기"로 커스텀 전환 등록
2. 전환으로 표시할 이벤트: `signup_completed`, `checkout_completed`
3. 관리 -> 전환 -> 해당 이벤트를 "전환으로 표시"

### 3.3 UTM 파라미터 표준화

모든 마케팅 채널에서 일관된 UTM 규칙을 사용한다.

| 채널 | utm_source | utm_medium | utm_campaign 예시 |
|------|------------|------------|-------------------|
| LinkedIn 포스트 | `linkedin` | `social` | `ai_act_guide_w1` |
| LinkedIn DM | `linkedin` | `dm` | `cold_outreach_cto` |
| 콜드 이메일 | `email` | `cold_email` | `ai_startup_batch1` |
| 블로그 SEO | (없음 - organic) | (없음) | (없음) |
| 디스콰이엇 | `disquiet` | `community` | `launch_day` |
| GeekNews | `geeknews` | `community` | `show_post` |
| Product Hunt | `producthunt` | `referral` | `launch` |
| 세미나 QR | `seminar` | `offline` | `aiia_workshop_0301` |
| 뉴스레터 | `newsletter` | `email` | `weekly_w3` |
| 공유 링크 | `share` | `referral` | `result_share` |

**UTM 링크 생성 유틸리티** (`lib/analytics/utm.ts`):

```typescript
// lib/analytics/utm.ts
export function buildUTMLink(
  baseUrl: string,
  params: {
    source: string
    medium: string
    campaign: string
    content?: string
  }
): string {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', params.source)
  url.searchParams.set('utm_medium', params.medium)
  url.searchParams.set('utm_campaign', params.campaign)
  if (params.content) {
    url.searchParams.set('utm_content', params.content)
  }
  return url.toString()
}

// 사용 예시:
// buildUTMLink('https://ailex.ai', {
//   source: 'linkedin',
//   medium: 'social',
//   campaign: 'ai_act_guide_w1',
//   content: 'carousel_post'
// })
// => "https://ailex.ai?utm_source=linkedin&utm_medium=social&utm_campaign=ai_act_guide_w1&utm_content=carousel_post"
```

---

## 4. PostHog 설정

PostHog는 제품 분석의 핵심 도구. 퍼널, 코호트, A/B 테스트, 세션 리플레이를 하나의 도구로 처리한다.

### 4.1 PostHog 계정 및 프로젝트 생성

1. https://app.posthog.com/signup 에서 가입
2. 프로젝트 생성: "AILEX Production"
3. Project API Key 복사 (Settings -> Project -> API Key)

### 4.2 Next.js 16 연동

**패키지 설치**:

```bash
npm install posthog-js @posthog/react
```

**환경 변수** (`.env.local`):

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

**PostHog Provider 생성** (`components/providers/PostHogProvider.tsx`):

```tsx
// components/providers/PostHogProvider.tsx
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// PostHog 초기화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // 수동으로 페이지뷰 캡처 (App Router 대응)
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  })
}

// 페이지뷰 트래커 (App Router용)
function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthogClient = usePostHog()

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthogClient.capture('$pageview', { $current_url: url })
    }
  }, [pathname, searchParams, posthogClient])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  )
}
```

**루트 레이아웃에 적용** (`app/layout.tsx`):

```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
import { PostHogProvider } from '@/components/providers/PostHogProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      )}
    </html>
  )
}
```

### 4.3 사용자 식별 (Identify)

Supabase Auth 로그인 성공 후 PostHog에 사용자를 식별시킨다.

```typescript
// lib/analytics/posthog.ts
import posthog from 'posthog-js'

export function identifyUser(user: {
  id: string
  email: string
  plan: 'free' | 'pro' | 'enterprise' | 'founder'
  created_at: string
  company_name?: string
}) {
  if (typeof window === 'undefined') return

  posthog.identify(user.id, {
    email: user.email,
    plan: user.plan,
    company_name: user.company_name,
    $set_once: {
      first_signup_date: user.created_at,
    },
  })
}

export function resetUser() {
  if (typeof window === 'undefined') return
  posthog.reset()
}
```

**Supabase Auth 콜백에서 호출**:

```tsx
// app/auth/callback/route.ts (또는 로그인 성공 핸들러)
import { identifyUser } from '@/lib/analytics/posthog'

// Supabase Auth 로그인 성공 후
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

identifyUser({
  id: user.id,
  email: user.email!,
  plan: profile.plan,
  created_at: profile.created_at,
  company_name: profile.company_name,
})
```

### 4.4 커스텀 이벤트 캡처 유틸리티

```typescript
// lib/analytics/events.ts
import posthog from 'posthog-js'
import { sendGAEvent } from './ga'

/**
 * 통합 이벤트 전송: PostHog + GA4 동시 전송
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  // PostHog
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties)
  }

  // GA4 (전환 이벤트만 선택적으로 전송)
  const ga4Events = [
    'signup_completed',
    'checkout_completed',
    'assessment_completed',
  ]
  if (ga4Events.includes(eventName)) {
    sendGAEvent(eventName, properties)
  }
}

// === 사전 정의된 이벤트 함수 ===

// Acquisition
export function trackSignup(method: 'email' | 'google') {
  trackEvent('signup_completed', { method })
}

// Activation
export function trackAssessmentStarted(sourcePage: string) {
  trackEvent('assessment_started', { source_page: sourcePage })
}

export function trackAssessmentCompleted(result: string, aiCategory: string, durationSeconds: number) {
  trackEvent('assessment_completed', {
    result,
    ai_category: aiCategory,
    duration_seconds: durationSeconds,
  })
}

// Revenue
export function trackProUpgradeClicked(plan: string, trigger: string) {
  trackEvent('pro_upgrade_clicked', { plan, trigger })
}

export function trackCheckoutCompleted(plan: string, price: number) {
  trackEvent('checkout_completed', { plan, price })
}

// Product Usage
export function trackDocumentGenerated(docType: string, durationSeconds: number) {
  trackEvent('document_generation_completed', {
    doc_type: docType,
    duration_seconds: durationSeconds,
  })
}

// Referral
export function trackResultShared(channel: string, result: string) {
  trackEvent('result_shared', { channel, result })
}
```

### 4.5 PostHog 퍼널 설정 (대시보드)

PostHog 웹 콘솔에서 아래 퍼널을 생성한다.

**퍼널 1: 핵심 전환 퍼널**

```
Step 1: $pageview (URL = /landing 또는 /)
Step 2: signup_completed
Step 3: assessment_started
Step 4: assessment_completed (result = high_impact)
Step 5: pro_upgrade_clicked
Step 6: checkout_completed
```

**퍼널 2: 활성화 퍼널**

```
Step 1: signup_completed
Step 2: assessment_started
Step 3: assessment_completed
  -> 전환 기간: 7일 이내
```

**퍼널 3: 문서 생성 퍼널 (유료 사용자)**

```
Step 1: checkout_completed
Step 2: ai_system_registered
Step 3: document_generation_started
Step 4: document_generation_completed
Step 5: document_downloaded
  -> 필터: plan = pro OR enterprise
```

---

## 5. Vercel Analytics 설정

### 5.1 활성화

1. Vercel Dashboard -> AILEX 프로젝트 -> Analytics 탭 -> "Enable" 클릭
2. Speed Insights 탭 -> "Enable" 클릭

### 5.2 코드 설정

```bash
npm install @vercel/analytics @vercel/speed-insights
```

```tsx
// app/layout.tsx (최종 통합 버전)
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { PostHogProvider } from '@/components/providers/PostHogProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!} />
      )}
    </html>
  )
}
```

### 5.3 활용 범위

Vercel Analytics는 **보조 도구**로 활용한다.

| 확인 항목 | Vercel Analytics | 주 도구 |
|-----------|-----------------|---------|
| 페이지별 방문수/유니크 방문자 | O | GA4 |
| 국가/디바이스 분포 | O | GA4 |
| Core Web Vitals (LCP, CLS, FID) | Speed Insights | - |
| 실시간 트래픽 | O | - |
| 퍼널/코호트 분석 | X | PostHog |
| 채널별 유입 분석 | X | GA4 |

---

## 6. Sentry 에러 추적 설정

### 6.1 설치 및 초기화

```bash
npx @sentry/wizard@latest -i nextjs
```

위 명령어가 자동으로 다음을 수행한다:
- `@sentry/nextjs` 패키지 설치
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` 생성
- `next.config.js`에 Sentry 설정 추가
- `.env.local`에 DSN 추가

### 6.2 핵심 설정 파일

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  // 성능 모니터링: 프로덕션에서는 10% 샘플링 (비용 절약)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // 세션 리플레이: PostHog 사용하므로 비활성화 (중복 방지)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // 민감 정보 필터링
  beforeSend(event) {
    // 이메일, API 키 등 민감 정보 제거
    if (event.request?.headers) {
      delete event.request.headers['authorization']
    }
    return event
  },
})
```

### 6.3 주요 모니터링 대상

| 모니터링 항목 | 설명 | 중요도 |
|--------------|------|--------|
| AI API 호출 실패 | GPT-4o 판정/문서 생성 실패 | 긴급 |
| 결제 프로세스 에러 | Stripe 결제 실패/콜백 에러 | 긴급 |
| Supabase 연결 에러 | DB/Auth 연결 문제 | 긴급 |
| PDF 생성 실패 | 문서 내보내기 에러 | 높음 |
| 클라이언트 렌더링 에러 | React 컴포넌트 크래시 | 중간 |

### 6.4 Sentry Alert 규칙

Sentry 대시보드에서 아래 알림 규칙을 설정한다:

1. **결제 에러**: `checkout` 태그가 포함된 에러 발생 시 -> 즉시 이메일/Slack 알림
2. **AI API 에러**: `ai_api` 태그 에러 5건/10분 이상 -> 즉시 알림
3. **전체 에러율**: 시간당 에러 50건 이상 -> 경고 알림

---

## 7. Stripe 매출 추적 설정

### 7.1 Stripe 대시보드 활용

Stripe Dashboard가 자체적으로 제공하는 지표:

- **MRR**: Revenue -> Monthly recurring revenue
- **Churn**: Customers -> Churn rate
- **Active Subscriptions**: Subscriptions -> Active
- **결제 실패율**: Payments -> Failed

### 7.2 Supabase Webhook으로 이벤트 동기화

```typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      await supabase.from('subscription_events').insert({
        type: 'new',
        user_id: subscription.metadata.user_id,
        plan: subscription.metadata.plan,
        mrr_amount: subscription.items.data[0].price.unit_amount! / 100,
        created_at: new Date().toISOString(),
      })
      break

    case 'customer.subscription.deleted':
      const cancelled = event.data.object as Stripe.Subscription
      await supabase.from('subscription_events').insert({
        type: 'churned',
        user_id: cancelled.metadata.user_id,
        plan: cancelled.metadata.plan,
        mrr_amount: -(cancelled.items.data[0].price.unit_amount! / 100),
        created_at: new Date().toISOString(),
      })
      break

    case 'customer.subscription.updated':
      // Pro <-> Enterprise 변경 감지
      const updated = event.data.object as Stripe.Subscription
      const previousPlan = (event.data.previous_attributes as any)?.items?.data?.[0]?.price?.unit_amount
      if (previousPlan) {
        const currentAmount = updated.items.data[0].price.unit_amount! / 100
        const prevAmount = previousPlan / 100
        await supabase.from('subscription_events').insert({
          type: currentAmount > prevAmount ? 'expansion' : 'contraction',
          user_id: updated.metadata.user_id,
          plan: updated.metadata.plan,
          mrr_amount: currentAmount - prevAmount,
          created_at: new Date().toISOString(),
        })
      }
      break
  }

  return NextResponse.json({ received: true })
}
```

### 7.3 MRR 계산 쿼리 (Supabase SQL)

```sql
-- 현재 MRR 계산
SELECT
  SUM(CASE WHEN plan = 'pro' THEN 300000
           WHEN plan = 'enterprise' THEN 1000000
           WHEN plan = 'founder' THEN 150000
           ELSE 0 END) as current_mrr,
  COUNT(*) FILTER (WHERE plan = 'pro') as pro_count,
  COUNT(*) FILTER (WHERE plan = 'enterprise') as enterprise_count,
  COUNT(*) FILTER (WHERE plan = 'founder') as founder_count
FROM profiles
WHERE plan IN ('pro', 'enterprise', 'founder')
  AND subscription_status = 'active';

-- Net New MRR (이번 달)
SELECT
  SUM(mrr_amount) FILTER (WHERE type = 'new') as new_mrr,
  SUM(ABS(mrr_amount)) FILTER (WHERE type = 'expansion') as expansion_mrr,
  SUM(ABS(mrr_amount)) FILTER (WHERE type = 'contraction') as contraction_mrr,
  SUM(ABS(mrr_amount)) FILTER (WHERE type = 'churned') as churned_mrr
FROM subscription_events
WHERE created_at >= date_trunc('month', NOW());
```

---

## 8. Google Search Console 설정

### 8.1 사이트 등록

1. https://search.google.com/search-console 접속
2. "URL 접두어" 방식으로 `https://ailex.ai` 등록
3. Vercel에서 TXT 레코드 DNS 인증 또는 HTML 파일 인증

### 8.2 주간 확인 사항

| 항목 | 확인 주기 | 목표 |
|------|----------|------|
| "AI 기본법" 관련 키워드 노출 | 주 1회 | 상위 10위 내 |
| 클릭률 (CTR) | 주 1회 | 5% 이상 |
| 인덱싱 상태 | 주 1회 | 에러 0건 |
| Core Web Vitals 보고서 | 월 1회 | "양호" 등급 유지 |

---

## 9. 도구 간 데이터 흐름

```
[사용자 행동]
    |
    +---> PostHog (제품 분석, 퍼널, 코호트, A/B 테스트, 세션 리플레이)
    |       -> 핵심 분석 도구: 모든 커스텀 이벤트 수집
    |
    +---> GA4 (트래픽 분석, 채널 어트리뷰션)
    |       -> UTM 기반 채널 성과 분석
    |       -> Google Search Console 연동 (SEO)
    |
    +---> Vercel Analytics (웹 성능)
    |       -> Core Web Vitals 모니터링
    |
    +---> Sentry (에러 추적)
            -> 에러 발생 시 즉시 알림

[Stripe Webhook]
    |
    +---> Supabase DB (매출 이벤트 저장)
            -> MRR, Churn, LTV 계산

[주간 리포트 작성 시]
    |
    +---> PostHog 대시보드 (핵심 지표 5개)
    +---> Stripe Dashboard (MRR, Churn)
    +---> GA4 (채널별 유입)
    +---> Supabase SQL (커스텀 쿼리)
```

---

## 10. 설정 체크리스트

구현 순서대로 정리한다. 전체 초기 설정 소요 시간: 약 4시간.

```
[ ] 1. PostHog 가입 + API Key 발급 (10분)
[ ] 2. PostHog Provider 코드 구현 + 배포 (30분)
[ ] 3. 커스텀 이벤트 유틸리티 구현 (events.ts) (30분)
[ ] 4. 핵심 이벤트 9개 코드에 삽입 (60분)
    - signup_completed, assessment_started, assessment_completed
    - pro_upgrade_clicked, checkout_completed, subscription_cancelled
    - document_generation_completed, result_shared, referral_signup
[ ] 5. GA4 계정 생성 + @next/third-parties 설정 (20분)
[ ] 6. UTM 파라미터 규칙 문서화 + 링크 생성 (20분)
[ ] 7. Vercel Analytics + Speed Insights 활성화 (10분)
[ ] 8. Sentry 설치 (npx @sentry/wizard) (15분)
[ ] 9. Stripe Webhook 설정 (30분)
[ ] 10. Google Search Console 등록 (10분)
[ ] 11. PostHog 퍼널 3종 대시보드 생성 (15분)
[ ] 12. 전체 이벤트 흐름 테스트 (30분)
```

---

*이 가이드는 AILEX의 기술 스택(Next.js 16 + Supabase + Vercel)에 맞춰 작성되었으며, 모든 도구는 무료 티어로 시작 가능하다. 월 트래픽 증가에 따라 PostHog과 Sentry의 유료 전환을 검토한다.*
