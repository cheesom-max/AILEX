# AILEX A/B 테스트 측정 인프라

> 작성일: 2026-02-14
> 기반: kpi_framework.md, tool_setup_guide.md
> 원칙: PostHog 무료 티어로 통합, 1인 운영자가 설정부터 결과 해석까지 자력 수행
> 참고: 실험 가설 설계, ICE 우선순위화, 구체적 실험 목록은 growth-sales 에이전트가 담당

---

## 1. A/B 테스트 도구 비교

### 1.1 1인 운영에 적합한 도구 비교

| 도구 | 가격 | A/B 테스트 | Feature Flags | 분석 통합 | 학습 곡선 | 추천 |
|------|------|-----------|---------------|----------|----------|------|
| **PostHog** | 무료 (1M 이벤트/월) | O (내장) | O (내장) | 제품 분석과 통합 | 중간 | **채택** |
| GrowthBook | 무료 (오픈소스) | O | O | 외부 연동 필요 | 높음 | 대안 |
| Vercel Flags | Vercel Pro 포함 | O (Edge) | O | Vercel Analytics만 | 낮음 | 보조 |
| Optimizely | $79/월~ | O | O | 풍부 | 중간 | 비용 과다 |
| LaunchDarkly | $10/월~ | O | O | 외부 연동 필요 | 중간 | Feature Flag 전용이면 고려 |

### 1.2 PostHog 채택 근거

1. **도구 통합**: 제품 분석, 퍼널, 코호트, A/B 테스트, Feature Flags, 세션 리플레이가 한 곳에 있어 1인 운영에 최적
2. **무료 범위**: 월 1M 이벤트 + 1M Feature Flag 요청이 무료. AILEX 초기 트래픽(월 15,000 방문)에 충분
3. **통계 내장**: Bayesian 통계 기반 유의성 판단을 자동 계산
4. **Next.js 지원**: `@posthog/react` 패키지로 클라이언트 사이드 Flag 평가, `posthog-node`로 서버 사이드 Flag 평가

---

## 2. PostHog 실험 (Experiments) 설정

### 2.1 PostHog Experiments 개념

```
[Feature Flag]        [실험 목표 이벤트]
    |                       |
    v                       v
사용자 분할 ----------> 전환 측정
(control vs test)      (어느 쪽이 더 나은가?)
    |                       |
    v                       v
[통계적 유의성 판단] -> 결론 및 롤아웃
```

PostHog의 Experiment = Feature Flag + 목표(Goal) 이벤트 + 통계 엔진

### 2.2 실험 생성 단계 (PostHog 웹 콘솔)

```
1. PostHog -> Experiments -> New Experiment
2. 실험 이름 입력 (예: "pricing-page-cta-test")
3. Feature Flag 키 입력 (예: "pricing-cta-variant")
4. 변형(Variants) 설정:
   - control: 기존 버전
   - test: 새 버전
   - (필요 시 추가 변형)
5. 목표(Goal) 설정:
   - Primary: 전환 이벤트 (예: checkout_completed)
   - Secondary: 보조 지표 (예: pro_upgrade_clicked)
6. 최소 샘플 크기 / 기간 확인 (PostHog 자동 계산)
7. Launch 클릭
```

### 2.3 Feature Flag 코드 구현

**클라이언트 사이드 (React 컴포넌트)**:

```tsx
// components/PricingCTA.tsx
'use client'

import { useFeatureFlagVariantKey } from 'posthog-js/react'
import { trackEvent } from '@/lib/analytics/events'

export function PricingCTA() {
  const variant = useFeatureFlagVariantKey('pricing-cta-variant')

  const handleClick = () => {
    trackEvent('pro_upgrade_clicked', {
      variant: variant || 'control',
      trigger: 'pricing_page',
    })
  }

  // control: 기존 CTA
  if (variant === 'control' || !variant) {
    return (
      <button onClick={handleClick} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
        Pro 플랜 시작하기
      </button>
    )
  }

  // test: 새 CTA (긴급성 강조)
  if (variant === 'test') {
    return (
      <button onClick={handleClick} className="bg-red-600 text-white px-6 py-3 rounded-lg">
        지금 시작하면 파운더 플랜 50% 할인 (선착순 50명)
      </button>
    )
  }

  return null
}
```

**서버 사이드 (Next.js API Route / Server Component)**:

```typescript
// lib/posthog-server.ts
import { PostHog } from 'posthog-node'

const posthogServer = new PostHog(process.env.POSTHOG_API_KEY!, {
  host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
})

export async function getFeatureFlag(
  flagKey: string,
  distinctId: string,
  properties?: Record<string, any>
): Promise<string | boolean> {
  const flag = await posthogServer.getFeatureFlag(flagKey, distinctId, {
    personProperties: properties,
  })
  return flag ?? false
}

// 사용 예시 (Server Component에서):
// const variant = await getFeatureFlag('pricing-cta-variant', userId)
```

**서버 사이드 A/B 테스트 (랜딩페이지 예시)**:

```tsx
// app/page.tsx (Server Component)
import { getFeatureFlag } from '@/lib/posthog-server'
import { cookies } from 'next/headers'

export default async function LandingPage() {
  // 익명 사용자의 distinct_id를 쿠키에서 가져옴
  const cookieStore = await cookies()
  const distinctId = cookieStore.get('ph_distinct_id')?.value || 'anonymous'

  const heroVariant = await getFeatureFlag('landing-hero-variant', distinctId)

  return (
    <main>
      {heroVariant === 'test' ? (
        <HeroVariantB /> // "과태료 3,000만원, 준비되셨나요?"
      ) : (
        <HeroVariantA /> // "AI 기본법 컴플라이언스, 자동으로 끝내세요"
      )}
    </main>
  )
}
```

---

## 3. AILEX 핵심 A/B 테스트 영역

growth-sales 에이전트가 구체적 실험을 설계하기 전, 측정 인프라를 미리 준비해야 하는 영역을 정의한다.

### 3.1 테스트 가능 영역과 측정 이벤트 매핑

| 테스트 영역 | Feature Flag 키 | 목표 이벤트 (Primary) | 보조 이벤트 (Secondary) | 예상 효과 크기 |
|------------|----------------|----------------------|----------------------|--------------|
| 랜딩페이지 히어로 | `landing-hero-variant` | `signup_completed` | `assessment_started` | 가입 전환율 +2%p |
| 가입 폼 | `signup-form-variant` | `signup_completed` | - | 가입 전환율 +1%p |
| 온보딩 플로우 | `onboarding-variant` | `assessment_completed` | `assessment_started` | 활성화율 +5%p |
| 판정 결과 CTA | `result-cta-variant` | `pro_upgrade_clicked` | `checkout_completed` | Pro 전환율 +3%p |
| 가격 페이지 | `pricing-page-variant` | `checkout_completed` | `pro_upgrade_clicked` | 결제 전환율 +2%p |
| 가격 금액 | `pricing-amount-variant` | `checkout_completed` | `subscription_cancelled` | ARPU 변동 |
| 공유 CTA | `share-cta-variant` | `result_shared` | `referral_signup` | 공유율 +3%p |
| 이메일 제목 | `email-subject-variant` | 이메일 오픈 | `signup_completed` | 오픈율 +5%p |

### 3.2 이벤트 속성에 실험 정보 자동 포함

모든 이벤트에 현재 활성 실험 정보가 자동으로 포함되도록 설정한다.

```typescript
// lib/analytics/events.ts (수정)
import posthog from 'posthog-js'

/**
 * PostHog은 Feature Flag이 평가된 사용자의 이벤트에
 * 자동으로 $feature/flag-name 속성을 추가한다.
 * 따라서 별도 코드 없이 실험 변형 정보가 이벤트에 포함된다.
 *
 * 예: checkout_completed 이벤트에
 * "$feature/pricing-cta-variant": "test" 속성이 자동 추가됨
 */

// Feature Flag 로드 보장 (앱 초기화 시)
export function ensureFeatureFlagsLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    // PostHog이 이미 Flag을 로드했는지 확인
    posthog.onFeatureFlags(() => {
      resolve()
    })

    // 5초 타임아웃 (네트워크 문제 대비)
    setTimeout(resolve, 5000)
  })
}
```

---

## 4. 통계적 유의성 판단 가이드

### 4.1 PostHog의 통계 방법론

PostHog은 **Bayesian 통계**를 사용한다.

- **결과 표시**: 각 변형의 "승리 확률 (Probability of being best)"
- **유의성 기준**: 기본 p-value = 0.05 (95% 신뢰도)
- **자동 판정**: PostHog이 "Significant" 배지를 자동으로 표시

### 4.2 결과 해석 규칙

| PostHog 표시 | 의미 | 행동 |
|-------------|------|------|
| "Significant" + 변형 승리 확률 > 95% | 통계적으로 유의한 차이 존재 | 승리 변형을 기본으로 롤아웃 |
| "Not significant" + 샘플 크기 충분 | 차이가 없거나 너무 작음 | 실험 종료, 기존 유지 또는 더 큰 차이의 새 변형 설계 |
| "Not significant" + 샘플 크기 부족 | 아직 판단 불가 | 실험 계속 진행 |
| "Significant" + 초기 단계 (< 100명/변형) | 초기 변동성으로 인한 거짓 양성 가능 | 무시하고 최소 샘플 도달까지 대기 |

### 4.3 최소 샘플 크기 계산

AILEX의 초기 트래픽 규모에 맞는 실용적 가이드.

**공식**:

```
n = (Z_alpha/2 + Z_beta)^2 * (p1(1-p1) + p2(1-p2)) / (p2 - p1)^2

n: 각 변형당 최소 샘플 크기
Z_alpha/2: 유의 수준 (95% -> 1.96)
Z_beta: 검정력 (80% -> 0.84)
p1: 기존 전환율
p2: 목표 전환율 (기대하는 개선 후 전환율)
```

**AILEX 시나리오별 최소 샘플 크기**:

| 테스트 대상 | 현재 전환율 (p1) | 목표 개선 (p2) | 각 변형당 최소 샘플 | 예상 소요 기간 |
|------------|-----------------|---------------|-------------------|--------------|
| 랜딩 -> 가입 | 8% | 10% (+2%p) | 약 1,900명 | 주 250 방문 기준: ~15주 |
| 랜딩 -> 가입 | 8% | 12% (+4%p) | 약 550명 | 주 250 방문 기준: ~5주 |
| 가입 -> 판정 | 70% | 80% (+10%p) | 약 300명 | 주 75 가입 기준: ~8주 |
| 고영향 -> Pro | 17% | 22% (+5%p) | 약 650명 | 주 30 고영향 판정 기준: ~43주 |
| 고영향 -> Pro | 17% | 25% (+8%p) | 약 250명 | 주 30 고영향 판정 기준: ~17주 |
| 공유 클릭률 | 5% | 10% (+5%p) | 약 400명 | 주 60 결과 조회 기준: ~14주 |

### 4.4 AILEX 초기 트래픽에서의 실험 전략

**핵심 제약**: 초기 90일간 총 방문 약 15,000명, 가입 약 1,200명, 고영향 판정 약 420명.

**실용적 원칙**:

1. **퍼널 상단 테스트 우선**: 트래픽이 가장 많은 랜딩페이지/가입 단계에서 먼저 테스트
2. **큰 차이를 노려라**: 2%p 차이보다 5%p 이상 차이를 목표로 하는 과감한 변형 설계 (샘플 크기 크게 절감)
3. **순차 실행**: 동시에 여러 실험 금지 (트래픽 분산 -> 모두 유의성 미달). 한 번에 1개 실험
4. **빠른 판단**: 최소 샘플 도달 전이라도 명백한 차이(전환율 2배 이상)가 보이면 조기 종료 고려
5. **정성적 보완**: 통계적 유의성에 도달하기 어려운 퍼널 하단은 A/B 테스트 대신 사용자 인터뷰 + 세션 리플레이로 보완

**추천 초기 실험 우선순위** (측정 인프라 관점):

```
Month 1: 랜딩페이지 히어로 테스트 (트래픽 최대, Feature Flag: landing-hero-variant)
Month 2: 온보딩 플로우 테스트 (활성화율 개선, Feature Flag: onboarding-variant)
Month 3: 판정 결과 CTA 테스트 (Pro 전환율 개선, Feature Flag: result-cta-variant)
```

---

## 5. A/B 테스트 이벤트 트래킹 상세 설정

### 5.1 실험 노출 이벤트 (자동)

PostHog은 Feature Flag이 처음 평가될 때 `$feature_flag_called` 이벤트를 자동으로 전송한다.

```
이벤트: $feature_flag_called
속성:
  $feature_flag: "landing-hero-variant"
  $feature_flag_response: "test"
```

이 이벤트는 실험 참여자 수를 자동으로 추적한다. 별도 코드 불필요.

### 5.2 실험 전용 보조 이벤트

일부 실험에서는 세부 행동을 추가로 추적해야 한다.

```typescript
// lib/analytics/experiment-events.ts

import { trackEvent } from './events'

// 랜딩페이지 실험: 스크롤 깊이
export function trackLandingScrollDepth(depth: number) {
  trackEvent('landing_scroll_depth', {
    depth_percent: depth,  // 25, 50, 75, 100
  })
}

// 온보딩 실험: 각 단계 완료 시간
export function trackOnboardingStepCompleted(
  step: number,
  stepName: string,
  durationSeconds: number
) {
  trackEvent('onboarding_step_completed', {
    step,
    step_name: stepName,
    duration_seconds: durationSeconds,
  })
}

// 가격 페이지 실험: 플랜 비교 행동
export function trackPricingInteraction(action: string, plan?: string) {
  trackEvent('pricing_interaction', {
    action,  // 'plan_hover', 'feature_compare_click', 'faq_expand'
    plan,    // 'free', 'pro', 'enterprise'
  })
}
```

### 5.3 실험별 PostHog 설정 체크리스트

새 실험을 시작할 때마다 이 체크리스트를 따른다.

```
[ ] 1. 실험 가설 명확화: "[변경]하면 [지표]가 [X%] 개선될 것이다"
[ ] 2. PostHog -> Experiments -> New Experiment 생성
[ ] 3. Feature Flag 키 명명: [영역]-[대상]-variant (예: landing-hero-variant)
[ ] 4. 변형 정의: control (기존) + test (새 버전)
[ ] 5. Primary Goal 설정: 핵심 전환 이벤트
[ ] 6. Secondary Goal 설정: 보조 지표
[ ] 7. 최소 샘플 크기 확인 (PostHog 자동 계산 값)
[ ] 8. 코드 구현: useFeatureFlagVariantKey() 또는 서버 사이드 Flag 평가
[ ] 9. 스테이징 환경에서 양 변형 모두 테스트 (Flag override 활용)
[ ] 10. 프로덕션 배포 + PostHog에서 실험 Launch
[ ] 11. 첫 24시간: 이벤트 수집 정상 확인 (양 변형 노출 비율 약 50:50)
[ ] 12. 최소 샘플 도달까지 대기 (조기 판단 금지)
[ ] 13. 결과 해석 + 의사결정 + 결과 기록 (아래 템플릿)
[ ] 14. 승리 변형 롤아웃 (Feature Flag -> 100% 활성화) 또는 실험 종료
```

---

## 6. A/B 테스트 결과 기록 템플릿

모든 실험 결과는 아래 템플릿으로 기록하여 학습을 축적한다.

### 6.1 개별 실험 기록

```markdown
## 실험 #[번호]: [실험 이름]

### 기본 정보
- Feature Flag: [flag-key]
- 기간: [시작일] ~ [종료일] ([X]일)
- 트래픽: control [N]명 / test [N]명

### 가설
[변경 사항]을 적용하면 [목표 지표]가 [X%] 개선될 것이다.
왜냐하면 [근거/관찰].

### 변형 상세
- **Control**: [기존 상태 설명]
- **Test**: [변경 사항 설명]
- (스크린샷 첨부 권장)

### 결과

| 지표 | Control | Test | 차이 | 유의성 |
|------|---------|------|------|--------|
| [Primary: 전환율] | X% | Y% | +Z%p | [Significant / Not Significant] |
| [Secondary: 보조 지표] | X | Y | +Z% | [Significant / Not Significant] |

- PostHog 승리 확률: control [X%] / test [Y%]
- p-value: [값]

### 의사결정
- [ ] 승리 변형 롤아웃 (test -> 100%)
- [ ] 기존 유지 (control 유지)
- [ ] 추가 실험 필요 (새 변형 설계)

### 학습
- 무엇을 배웠는가: [1-2문장]
- 다음 실험 아이디어: [후속 실험]
- 예상과 달랐던 점: [있다면]
```

### 6.2 실험 로그 (누적 테이블)

```markdown
| # | 실험명 | 기간 | 변형 | Primary 지표 | 결과 | 효과 크기 | 유의성 | 의사결정 |
|---|--------|------|------|-------------|------|----------|--------|---------|
| 1 | 랜딩 히어로 | M1 W1~W4 | 긴급성 메시지 | 가입 전환율 | +3.2%p | 8% -> 11.2% | Sig | 롤아웃 |
| 2 | 온보딩 간소화 | M2 W1~W3 | 3단계->2단계 | 활성화율 | +4.8%p | 65% -> 69.8% | Sig | 롤아웃 |
| 3 | CTA 색상 | M2 W4~M3 W2 | 빨강->초록 | Pro 클릭률 | -0.5%p | 12% -> 11.5% | Not Sig | 기존 유지 |
```

### 6.3 월간 실험 요약

```markdown
## [월] 실험 요약

- 실행한 실험 수: [N]개
- 유의한 결과: [N]개 ([N/총]%)
- 롤아웃한 변경: [목록]
- 핵심 학습: [1-2문장]
- 다음 달 실험 우선순위: [목록]

### 누적 효과
- 가입 전환율: 런칭 시 6% -> 현재 X% (A/B 테스트로 +Y%p 기여)
- 활성화율: 런칭 시 60% -> 현재 X% (A/B 테스트로 +Y%p 기여)
- Pro 전환율: 런칭 시 12% -> 현재 X% (A/B 테스트로 +Y%p 기여)
```

---

## 7. 실험 운영 규칙

### 7.1 필수 규칙 (위반 금지)

1. **동시 실험 제한**: 같은 퍼널 단계에서 2개 이상 동시 실험 금지. 상호 간섭으로 결과 왜곡.
2. **조기 종료 금지**: 최소 샘플 크기 미달 시 결과에 따라 종료하지 않는다. 단, 명백한 부정적 영향(전환율 50% 이상 하락)은 즉시 중단.
3. **주말/공휴일 보정**: 화~목 시작, B2B 특성상 주중 트래픽이 주말보다 3-5배 많으므로 최소 1주 이상 운영.
4. **코드 변경 금지**: 실험 진행 중 해당 페이지/기능의 다른 코드 변경을 하지 않는다 (변수 오염).

### 7.2 권장 사항

1. **주 1개 실험**: 초기 트래픽 규모에서는 주 1개 실험이 현실적
2. **큰 변화 테스트**: 버튼 색상이 아닌, 메시지/레이아웃/플로우 수준의 큰 변화를 테스트하여 적은 샘플로도 유의한 결과 확보
3. **정성 데이터 병행**: PostHog 세션 리플레이로 실험 변형별 사용자 행동을 직접 관찰
4. **가설 기록 필수**: "일단 해보자"가 아닌, 명확한 가설과 근거를 기록한 후 실험 시작

### 7.3 실험하지 않아야 할 것

| 상황 | 이유 | 대안 |
|------|------|------|
| 일간 트래픽 < 50명인 페이지 | 유의한 결과까지 수개월 소요 | 사용자 인터뷰 + 세션 리플레이 |
| 법적/컴플라이언스 관련 텍스트 | 법적 리스크 | 법률 전문가 검토 후 일괄 변경 |
| 핵심 기능의 대규모 변경 | 실험 실패 시 기존 사용자 경험 손상 | Staged rollout (10% -> 30% -> 100%) |
| 가격 대폭 변경 (50% 이상) | 기존 고객 신뢰 훼손 | 신규 가입자 대상으로만 실험 |

---

## 8. 가격 A/B 테스트 특별 가이드

GTM 전략에서 3개월차 가격 A/B 테스트(월 25만원 vs 30만원 vs 35만원)를 계획하고 있으므로, 측정 인프라를 미리 설계한다.

### 8.1 가격 테스트 설정 방법

```typescript
// 가격 실험: 신규 가입자에게만 적용
// Feature Flag: pricing-amount-variant
// Variants: control (30만원), low (25만원), high (35만원)

// 서버 사이드에서 가격 결정 (보안상 서버에서만 처리)
export async function getPricingForUser(userId: string): Promise<{
  proPriceKRW: number
  variant: string
}> {
  const variant = await getFeatureFlag('pricing-amount-variant', userId)

  switch (variant) {
    case 'low':
      return { proPriceKRW: 250000, variant: 'low' }
    case 'high':
      return { proPriceKRW: 350000, variant: 'high' }
    default:
      return { proPriceKRW: 300000, variant: 'control' }
  }
}
```

### 8.2 가격 테스트 측정 지표

가격 실험은 전환율만 보면 안 된다. **단위 경제(Unit Economics)** 전체를 비교해야 한다.

| 지표 | 계산 | 25만원(low) | 30만원(control) | 35만원(high) |
|------|------|------------|----------------|-------------|
| 전환율 | checkout_completed / 고영향 판정 | ? | 17% | ? |
| ARPU | 가격 | 25만원 | 30만원 | 35만원 |
| 기대 수익/유저 | 전환율 x ARPU | ? | 5.1만원 | ? |
| 30일 Churn | 30일 내 해지율 | ? | ? | ? |
| LTV | ARPU / Churn | ? | ? | ? |

**핵심**: "전환율 x ARPU" (기대 수익/유저)가 가장 높은 가격대가 최적.

### 8.3 가격 테스트 주의사항

1. **신규 가입자에게만 적용**: `signup_completed` 이후 사용자에게만 Flag 평가. 기존 유료 고객은 기존 가격 유지.
2. **최소 30일 관찰**: 전환율 + 30일 Churn까지 확인해야 정확한 비교 가능.
3. **법적 고지**: 가격 페이지에 "가격은 변동될 수 있습니다" 고지 필수.
4. **소수 그룹 보호**: 각 변형 최소 100명 이상 확보.

---

## 9. PostHog Feature Flags 관리 규칙

### 9.1 Flag 네이밍 컨벤션

```
[영역]-[대상]-variant

예시:
landing-hero-variant          # 랜딩페이지 히어로 섹션
onboarding-flow-variant       # 온보딩 플로우
result-cta-variant            # 판정 결과 CTA
pricing-page-variant          # 가격 페이지 레이아웃
pricing-amount-variant        # 가격 금액
email-subject-variant         # 이메일 제목
share-button-variant          # 공유 버튼
```

### 9.2 Flag 생명주기

```
생성 -> 실험 진행 -> 결과 확인 -> 롤아웃 또는 제거
                                    |
                                    v
                              코드에서 Flag 분기 제거
                              (승리 변형만 남김)
```

**중요**: 실험 종료 후 30일 이내에 Feature Flag 코드를 정리한다. 방치된 Flag은 기술 부채가 된다.

### 9.3 활성 Flag 최대 수

1인 운영에서 관리 가능한 수준: **동시 활성 Flag 5개 이내**

---

## 10. 구현 체크리스트

```
[ ] 1. PostHog Experiments 기능 활성화 확인 (Settings -> Features)
[ ] 2. posthog-node 패키지 설치 (서버 사이드 Flag 평가용)
     npm install posthog-node
[ ] 3. lib/posthog-server.ts 생성 (서버 사이드 Flag 유틸리티)
[ ] 4. lib/analytics/experiment-events.ts 생성 (실험 보조 이벤트)
[ ] 5. 첫 실험 Feature Flag 생성 (landing-hero-variant)
[ ] 6. 스테이징 환경에서 Flag override 테스트
[ ] 7. 실험 결과 기록 템플릿 파일 생성 (analytics/experiment_log.md)
[ ] 8. PostHog Alert 설정: 실험 중 전환율 50% 이상 하락 시 알림
```

---

*이 문서는 A/B 테스트의 "측정 인프라"에 집중한다. 구체적인 실험 가설, ICE 우선순위화, 실험 로드맵은 growth-sales 에이전트가 담당한다.*
