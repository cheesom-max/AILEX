# 취소 플로우 (Cancellation Flow)

> 작성일: 2026-02-14 | 기반: AILEX MVP 기획서, 가격 전략
> 목표: 자발적 이탈(Voluntary Churn) 25~30% 방지 및 고객 피드백 수집

---

## 1. 취소 플로우 개요

### 1.1 자발적 이탈의 임팩트

```
문제 규모:
- B2B SaaS 전체 이탈의 60~80%가 자발적 이탈 (고객 주도 취소)
- AILEX 월 이탈율 5.5% 중 약 60~70% = 월 3.3~3.85% 자발적 이탈
- 12개월 차 MRR 8,500만원 기준 → 월 280~327만원 손실 (연간 3,360~3,924만원)
- 취소 플로우 25% 방지 시 → **연간 840~981만원 매출 보호 가능**
```

**자발적 이탈 주요 원인** (업계 평균):
1. "사용하지 않음" (30~40%)
2. "너무 비싸다" (20~30%)
3. "필요한 기능 없음" (15~20%)
4. "다른 서비스로 전환" (10~15%)
5. "일시적으로 필요 없음" (5~10%)
6. "서비스 품질 불만" (5~10%)

### 1.2 취소 플로우 목표

| 목표 | 기준선 (플로우 없음) | 목표 (플로우 구현) | 개선폭 |
|------|-------------------|------------------|--------|
| 취소 시도 → 유지 전환율 | 0~5% | 25~30% | +20~25%p |
| 취소 이유 수집률 | 0% | 80% 이상 | - |
| 다운그레이드 전환율 | 0% | 10~15% | - |
| 구독 일시정지 전환율 | 0% | 5~10% | - |
| 피드백 수집 건수 | 0건 | 월 10~20건 | - |

---

## 2. 취소 플로우 UX 설계

### 2.1 플로우 전체 구조

```
[설정] → [구독 관리] → [취소하기] 버튼 클릭
    ↓
┌─────────────────────────────────────────────┐
│ Step 1: 취소 이유 설문 (필수)                 │
│  - 5가지 선택지 + 기타 (텍스트 입력 가능)       │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ Step 2: 이유별 맞춤 대안 제시                  │
│  - "너무 비싸요" → 할인 제안/다운그레이드       │
│  - "잘 안 써요" → 활용 가이드 + 1:1 온보딩      │
│  - "필요 기능 없음" → 로드맵 공유 + 기능 요청   │
│  - "다른 서비스 사용" → 차별점 어필 + 비교표     │
│  - "일시적 불필요" → 구독 일시정지 옵션         │
│  - "품질 불만" → 1:1 피드백 + 즉시 개선 약속    │
└─────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────┐
│ Step 3: 최종 확인 (되돌리기 쉬운 구조)          │
│  - "유지하기" (대안 수락)                      │
│  - "그래도 취소" (최종 취소 진행)               │
└─────────────────────────────────────────────┘
    ↓ (취소 진행 시)
┌─────────────────────────────────────────────┐
│ Step 4: 취소 완료 안내                        │
│  - 다음 결제일까지 서비스 유지 안내             │
│  - 데이터 다운로드 링크 제공 (30일 보관)        │
│  - Win-back 이메일 시퀀스 시작                 │
└─────────────────────────────────────────────┘
```

### 2.2 핵심 UX 원칙

1. **고객 통제권 존중**: "숨기기" 없음. 취소 버튼을 찾기 쉽게 배치 (설정 → 구독 관리 → 1클릭)
2. **1단계 설문 필수**: 취소 이유 없이는 진행 불가 (데이터 수집 필수)
3. **개인화된 대안**: 이유에 따라 다른 해결책 제시
4. **No Dark Pattern**: 협박조 문구, 복잡한 프로세스, 숨겨진 요금 금지
5. **되돌리기 쉬움**: 취소 후에도 "다시 구독하기" 원클릭 제공

---

## 3. Step 1: 취소 이유 설문

### 3.1 설문 UI

```
┌─────────────────────────────────────────────┐
│  정말로 AILEX를 떠나시나요?                    │
│                                             │
│  어떤 이유로 취소를 고려하고 계신지            │
│  알려주시면 개선할 수 있도록 노력하겠습니다.    │
│                                             │
│  [취소 이유를 선택해주세요] (필수)             │
│                                             │
│  ○ 사용 빈도가 낮아서                        │
│  ○ 가격이 비싸서                            │
│  ○ 필요한 기능이 없어서                      │
│  ○ 다른 서비스로 전환해서                    │
│  ○ 일시적으로 필요 없어서                    │
│  ○ 서비스 품질에 불만이 있어서                │
│  ○ 기타 (직접 입력)                         │
│     [____________________________]          │
│                                             │
│  [계속하기]                                 │
└─────────────────────────────────────────────┘
```

**구현 가이드** (React 컴포넌트):

```tsx
// /app/dashboard/settings/cancel/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CANCEL_REASONS = [
  { id: 'low_usage', label: '사용 빈도가 낮아서' },
  { id: 'too_expensive', label: '가격이 비싸서' },
  { id: 'missing_features', label: '필요한 기능이 없어서' },
  { id: 'switching', label: '다른 서비스로 전환해서' },
  { id: 'temporary', label: '일시적으로 필요 없어서' },
  { id: 'quality', label: '서비스 품질에 불만이 있어서' },
  { id: 'other', label: '기타 (직접 입력)' },
];

export default function CancelPage() {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert('취소 이유를 선택해주세요.');
      return;
    }

    // 취소 이유 저장
    await fetch('/api/subscription/cancel-reason', {
      method: 'POST',
      body: JSON.stringify({
        reason: selectedReason,
        details: selectedReason === 'other' ? otherReason : null,
      }),
    });

    // Step 2로 이동 (이유별 대안 제시)
    router.push(`/dashboard/settings/cancel/offer?reason=${selectedReason}`);
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">정말로 AILEX를 떠나시나요?</h1>
      <p className="text-gray-600 mb-6">
        어떤 이유로 취소를 고려하고 계신지 알려주시면 개선할 수 있도록 노력하겠습니다.
      </p>

      <div className="space-y-3 mb-6">
        {CANCEL_REASONS.map((reason) => (
          <label key={reason.id} className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="reason"
              value={reason.id}
              checked={selectedReason === reason.id}
              onChange={(e) => setSelectedReason(e.target.value)}
            />
            <span>{reason.label}</span>
          </label>
        ))}

        {selectedReason === 'other' && (
          <textarea
            className="w-full p-3 border rounded"
            placeholder="자세히 알려주세요..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            rows={3}
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        disabled={!selectedReason}
      >
        계속하기
      </button>

      <button
        onClick={() => router.back()}
        className="w-full mt-3 text-gray-600 py-3 border rounded hover:bg-gray-50"
      >
        취소하지 않기
      </button>
    </div>
  );
}
```

---

## 4. Step 2: 이유별 맞춤 대안 제시

### 4.1 이유별 대응 전략

---

#### 이유 1: "사용 빈도가 낮아서"

**근본 원인**: 온보딩 부족, 제품 가치 미전달, 사용 습관 미형성

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  사용 빈도가 낮으시군요.                       │
│  AILEX의 핵심 가치를 놓치고 계실 수 있습니다.   │
│                                             │
│  💡 이런 기능들을 시도해보셨나요?              │
│                                             │
│  ✅ AI 시스템 3개 등록 → 5분 만에 영향평가서 완성│
│  ✅ 컴플라이언스 대시보드 → 법 준수 상태 한눈에  │
│  ✅ 자동 문서 생성 → 과태료 3,000만원 방지      │
│                                             │
│  🎯 1:1 온보딩 세션 제공 (무료)               │
│                                             │
│  {{고객명}}님의 AI 시스템에 맞춤형으로          │
│  AILEX 활용법을 30분 동안 안내해드립니다.       │
│                                             │
│  [무료 온보딩 신청하기] → 이메일로 일정 조율    │
│  [활용 가이드 보기] → 동영상 튜토리얼 3개       │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [유지하고 온보딩 받기] [그래도 취소]          │
└─────────────────────────────────────────────┘
```

**백엔드 로직**:
- 1:1 온보딩 신청 시 → Calendly 링크 또는 이메일로 일정 조율
- 활용 가이드 → Loom 동영상 3개 (5분짜리)

**기대 전환율**: 30~40% (온보딩 제안이 강력한 유인)

---

#### 이유 2: "가격이 비싸서"

**근본 원인**: 가치 대비 가격 불균형, 예산 부족, ROI 미인지

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  가격 부담이 크시군요.                        │
│  {{고객명}}님께 특별 혜택을 제안드립니다.       │
│                                             │
│  🎁 옵션 1: 한시적 할인 (3개월)               │
│                                             │
│  Pro 플랜 30만원 → 20만원 (33% 할인)          │
│  3개월 동안 적용, 이후 정상가 자동 복귀         │
│                                             │
│  [3개월 할인 받기]                           │
│                                             │
│  📉 옵션 2: Free 플랜으로 다운그레이드         │
│                                             │
│  무료로 계속 사용 가능한 기능:                 │
│  ✅ 고영향 AI 자가진단 (월 1회)               │
│  ✅ 투명성 고지 문구 생성기 (무제한)            │
│  ✅ AI 기본법 체크리스트 열람                 │
│                                             │
│  [Free 플랜으로 변경]                        │
│                                             │
│  💰 ROI 계산해보셨나요?                      │
│                                             │
│  법무법인 컨설팅: 500~2,000만원/건            │
│  AILEX Pro: 연 360만원 (월 30만원 × 12)      │
│  → 1번만 사용해도 본전, 무제한 사용 가능        │
│                                             │
│  과태료 리스크: 최대 3,000만원                │
│  AILEX로 예방: 연 360만원                    │
│  → ROI: 8배                                 │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [할인 받고 유지하기] [Free로 다운그레이드]     │
│  [그래도 취소]                               │
└─────────────────────────────────────────────┘
```

**할인 정책**:
- 3개월 33% 할인 (Pro 30만원 → 20만원)
- 최대 1회만 제공 (재취소 시 재할인 불가)
- 할인 코드: Stripe Coupon으로 자동 적용

**구현 코드** (Stripe Coupon):

```typescript
// /app/api/subscription/apply-retention-discount/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { customerId } = await req.json();

  // 3개월 33% 할인 쿠폰 생성
  const coupon = await stripe.coupons.create({
    percent_off: 33,
    duration: 'repeating',
    duration_in_months: 3,
    name: 'Retention Offer - 3 Months',
  });

  // 구독에 쿠폰 적용
  const subscription = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  if (subscription.data.length > 0) {
    await stripe.subscriptions.update(subscription.data[0].id, {
      coupon: coupon.id,
    });
  }

  return Response.json({ success: true, discount: '33% for 3 months' });
}
```

**기대 전환율**: 40~50% (할인은 강력한 유인)

---

#### 이유 3: "필요한 기능이 없어서"

**근본 원인**: 제품-시장 핏 불일치, 기대 불충족

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  필요한 기능이 없으시군요.                     │
│  어떤 기능이 필요하신지 알려주시면             │
│  로드맵에 반영하겠습니다.                      │
│                                             │
│  🗺️ AILEX 로드맵 (공개)                      │
│                                             │
│  Q2 2026 (3개월 내):                         │
│  ✅ 감사 대응 모듈 (기관 질의응답 자동 생성)     │
│  ✅ 팀 기능 (멀티유저, 권한 관리)              │
│  ✅ 전문가 연결 서비스 (변호사 1:1 상담)        │
│                                             │
│  Q3 2026 (6개월 내):                         │
│  🔲 AI 리스크 모니터링 (실시간 알림)           │
│  🔲 규제 변경 알림 (법 개정 자동 추적)          │
│  🔲 다국어 지원 (영문 문서 자동 생성)           │
│                                             │
│  💬 원하시는 기능을 요청하세요                 │
│                                             │
│  [____________________________]             │
│  예: "GDPR 연동", "API 제공" 등               │
│                                             │
│  [기능 요청 제출]                            │
│                                             │
│  🎁 기능 요청 제출 시 특별 혜택                │
│                                             │
│  - 해당 기능 출시 시 1개월 무료 제공            │
│  - 베타 테스터 우선 초대                       │
│  - 로드맵 투표권 1표 부여                      │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [기능 요청하고 유지하기] [그래도 취소]         │
└─────────────────────────────────────────────┘
```

**백엔드 처리**:
- 기능 요청 → Notion Database 또는 Linear에 자동 등록
- 요청자 이메일 → "로드맵 우선순위" 태그 추가
- 해당 기능 출시 시 자동 알림

**기대 전환율**: 20~30% (로드맵 투명성 + 참여 기회)

---

#### 이유 4: "다른 서비스로 전환해서"

**근본 원인**: 경쟁사 우위 인지, AILEX 차별점 미인지

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  다른 서비스로 전환하시나요?                   │
│  어떤 서비스를 고려 중이신지 여쭤봐도 될까요?    │
│                                             │
│  [____________________________]             │
│  예: "Credo AI", "OneTrust" 등                │
│                                             │
│  🔍 AILEX vs 경쟁사 비교표                    │
│                                             │
│  | 기능 | AILEX | Credo AI | OneTrust |      │
│  |------|-------|----------|----------|      │
│  | 한국 AI 기본법 특화 | ✅ | ❌ | ❌ |       │
│  | 고영향 AI 자가진단 | ✅ | 일부 | 일부 |    │
│  | 의무 문서 자동 생성 | ✅ | ❌ | ❌ |       │
│  | 월 가격 | 30만원 | $4,000+ | $1,000+ |   │
│  | 1인 운영 가능 | ✅ | ❌ | ❌ |            │
│                                             │
│  💡 AILEX만의 차별점                         │
│                                             │
│  1. 한국 AI 기본법 100% 대응                 │
│     - 글로벌 도구는 EU AI Act/NIST 중심       │
│     - AILEX는 한국 법 조문 직접 반영          │
│                                             │
│  2. 1/20 가격                               │
│     - 글로벌 도구: 연 $50K~$500K            │
│     - AILEX: 연 360만원 (Pro)               │
│                                             │
│  3. 즉시 사용 가능                           │
│     - 타 도구: 컨설턴트 필요 (수개월)          │
│     - AILEX: 5분 만에 문서 생성              │
│                                             │
│  📞 혹시 경쟁사와 비교 중이시라면              │
│     직접 통화로 상세히 설명해드릴게요.          │
│                                             │
│  [비교 상담 신청] (30분, 무료)                │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [AILEX 유지하기] [그래도 취소]               │
└─────────────────────────────────────────────┘
```

**백엔드 처리**:
- 경쟁사 입력 → Notion에 "경쟁 분석" 데이터로 저장
- 비교 상담 신청 시 → 이메일로 Calendly 링크 발송

**기대 전환율**: 25~35% (차별점 명확화 + 직접 상담)

---

#### 이유 5: "일시적으로 필요 없어서"

**근본 원인**: 계절성, 프로젝트 종료, 일시 휴업

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  일시적으로 필요 없으시군요.                   │
│  구독을 취소하는 대신 일시정지하시겠어요?       │
│                                             │
│  ⏸️ 구독 일시정지 옵션                        │
│                                             │
│  - 최대 6개월까지 일시정지 가능                │
│  - 일시정지 기간 동안 요금 청구 없음            │
│  - 모든 데이터 그대로 보관                     │
│  - 언제든 원클릭으로 재개 가능                 │
│                                             │
│  일시정지 기간 선택:                          │
│  ○ 1개월                                    │
│  ○ 3개월                                    │
│  ○ 6개월                                    │
│                                             │
│  [구독 일시정지하기]                          │
│                                             │
│  💡 일시정지 vs 취소 비교                     │
│                                             │
│  | 항목 | 일시정지 | 취소 |                   │
│  |------|---------|------|                   │
│  | 요금 | 0원 | 0원 |                        │
│  | 데이터 보관 | 영구 | 30일만 |              │
│  | 재가입 | 원클릭 | 다시 설정 필요 |          │
│  | 파운더 혜택 유지 | ✅ | ❌ |               │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [일시정지하기] [그래도 취소]                  │
└─────────────────────────────────────────────┘
```

**구현 가이드** (Stripe 구독 일시정지):

```typescript
// /app/api/subscription/pause/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { customerId, pauseMonths } = await req.json();

  const subscription = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  if (subscription.data.length > 0) {
    await stripe.subscriptions.update(subscription.data[0].id, {
      pause_collection: {
        behavior: 'void', // 요금 청구 중지
        resumes_at: Math.floor(Date.now() / 1000) + pauseMonths * 30 * 24 * 60 * 60,
      },
    });
  }

  return Response.json({ success: true, paused_until: new Date(Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000) });
}
```

**기대 전환율**: 60~70% (일시정지는 Win-Win)

---

#### 이유 6: "서비스 품질에 불만이 있어서"

**근본 원인**: 버그, 성능 문제, 지원 부족

**대안 제시**:

```
┌─────────────────────────────────────────────┐
│  서비스 품질에 불만이 있으시군요.              │
│  정말 죄송합니다. 즉시 개선하겠습니다.          │
│                                             │
│  어떤 부분이 불편하셨나요?                     │
│                                             │
│  ☐ 문서 생성 품질이 낮음                      │
│  ☐ 속도가 느림                               │
│  ☐ 버그/오류 발생                            │
│  ☐ 고객 지원 응답 느림                        │
│  ☐ UI/UX 불편                               │
│  ☐ 기타: [__________________]               │
│                                             │
│  [피드백 제출]                               │
│                                             │
│  🚀 즉시 대응 약속                           │
│                                             │
│  피드백 제출 시:                             │
│  - 24시간 내 {{담당자_이름}}이 직접 연락        │
│  - 버그는 48시간 내 수정 (또는 일정 공유)       │
│  - 개선 완료 시 1개월 무료 제공                │
│                                             │
│  📞 지금 바로 통화하시겠어요?                  │
│                                             │
│  [즉시 통화 신청] → 10분 내 전화 드림           │
│                                             │
│  그래도 취소하시겠습니까?                      │
│  [피드백 제출하고 개선 대기] [그래도 취소]      │
└─────────────────────────────────────────────┘
```

**백엔드 처리**:
- 피드백 제출 → Slack 알림 + Linear 이슈 자동 생성
- 즉시 통화 신청 → SMS 알림 + 10분 내 전화

**기대 전환율**: 50~60% (즉시 대응 약속이 핵심)

---

### 4.2 대안 제시 UI 구현

```tsx
// /app/dashboard/settings/cancel/offer/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function CancelOfferPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const offers = {
    low_usage: <LowUsageOffer />,
    too_expensive: <PriceOffer />,
    missing_features: <FeaturesOffer />,
    switching: <CompetitorOffer />,
    temporary: <PauseOffer />,
    quality: <QualityOffer />,
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      {offers[reason as keyof typeof offers] || <DefaultOffer />}
    </div>
  );
}

function PriceOffer() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">가격 부담이 크시군요.</h1>
      <p className="text-gray-600 mb-6">특별 혜택을 제안드립니다.</p>

      <div className="space-y-4">
        {/* 옵션 1: 할인 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">🎁 옵션 1: 한시적 할인 (3개월)</h3>
          <p className="text-sm text-gray-600 mt-2">Pro 플랜 30만원 → 20만원 (33% 할인)</p>
          <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">
            3개월 할인 받기
          </button>
        </div>

        {/* 옵션 2: 다운그레이드 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold">📉 옵션 2: Free 플랜으로 다운그레이드</h3>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>✅ 고영향 AI 자가진단 (월 1회)</li>
            <li>✅ 투명성 고지 문구 생성기 (무제한)</li>
            <li>✅ AI 기본법 체크리스트 열람</li>
          </ul>
          <button className="mt-3 border px-4 py-2 rounded">
            Free 플랜으로 변경
          </button>
        </div>

        {/* ROI 계산 */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-bold">💰 ROI 계산해보셨나요?</h3>
          <table className="text-sm mt-2 w-full">
            <tbody>
              <tr>
                <td>법무법인 컨설팅</td>
                <td className="text-right">500~2,000만원/건</td>
              </tr>
              <tr>
                <td>AILEX Pro</td>
                <td className="text-right">연 360만원</td>
              </tr>
              <tr className="font-bold">
                <td>→ ROI</td>
                <td className="text-right">8배</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button className="flex-1 bg-green-600 text-white py-3 rounded">
          할인 받고 유지하기
        </button>
        <button className="flex-1 border py-3 rounded">
          그래도 취소
        </button>
      </div>
    </div>
  );
}

// 나머지 Offer 컴포넌트도 동일한 패턴으로 구현
```

---

## 5. Step 3: 최종 확인

```
┌─────────────────────────────────────────────┐
│  정말 취소하시겠습니까?                        │
│                                             │
│  취소하시면 잃게 되는 것들:                    │
│                                             │
│  ❌ 등록된 AI 시스템 {{시스템_수}}개 데이터     │
│  ❌ 저장된 영향평가서 {{문서_수}}개             │
│  ❌ 컴플라이언스 대시보드 접근                 │
│  ❌ 파운더 멤버 혜택 (영구 소실)               │
│                                             │
│  유지하시면 계속 누릴 수 있는 것들:             │
│                                             │
│  ✅ AI 기본법 컴플라이언스 자동화              │
│  ✅ 과태료 3,000만원 리스크 예방               │
│  ✅ 5분 만에 의무 문서 생성                   │
│  ✅ 향후 모든 신규 기능 무료 이용              │
│                                             │
│  [유지하기] [최종 취소]                       │
└─────────────────────────────────────────────┘
```

**손실 회피 바이어스** (Loss Aversion) 활용: 취소 시 잃는 것을 명확히 나열.

---

## 6. Step 4: 취소 완료 안내

```
┌─────────────────────────────────────────────┐
│  ✅ 취소가 완료되었습니다.                     │
│                                             │
│  {{고객명}}님, 그동안 AILEX를 이용해주셔서     │
│  진심으로 감사드립니다.                        │
│                                             │
│  📅 다음 결제일까지 서비스 유지                │
│                                             │
│  - {{다음_결제일}}까지 모든 기능 정상 이용      │
│  - 이후 자동으로 Free 플랜 전환                │
│                                             │
│  💾 데이터 다운로드 (30일간 보관)              │
│                                             │
│  필요한 문서를 다운로드하세요:                 │
│  👉 [모든 문서 다운로드] (ZIP)                 │
│                                             │
│  30일 후 ({{데이터_삭제일}})에 영구 삭제됩니다. │
│                                             │
│  🔄 언제든 돌아오세요                         │
│                                             │
│  마음이 바뀌시면 언제든 다시 구독할 수 있습니다.│
│  👉 [다시 구독하기]                           │
│                                             │
│  📧 피드백 부탁드립니다                        │
│                                             │
│  어떤 점이 아쉬우셨나요?                       │
│  [__________________________________]        │
│                                             │
│  [피드백 제출] (1분)                          │
│                                             │
│  제출 시 다음 구독 시 20% 할인 쿠폰 제공        │
└─────────────────────────────────────────────┘
```

**Win-back 준비**:
- 취소 완료 시점에 `cancellation_date` 기록
- 7일 후 Win-back 이메일 1차 발송 (자동)

---

## 7. 이탈 방지 성과 측정

### 7.1 핵심 지표

| 지표 | 계산식 | 목표 | 측정 주기 |
|------|-------|------|----------|
| **취소 시도 → 유지 전환율** | (대안 수락 고객 / 취소 시도 고객) × 100 | 25~30% | 월간 |
| **이유별 전환율** | 각 이유별 유지 전환율 | - | 월간 |
| **할인 제안 수락률** | (할인 수락 / 가격 이유 고객) × 100 | 40~50% | 월간 |
| **일시정지 전환율** | (일시정지 선택 / 일시적 불필요 고객) × 100 | 60~70% | 월간 |
| **취소 이유 수집률** | (이유 입력 고객 / 전체 취소 시도) × 100 | 80% 이상 | 월간 |

### 7.2 대시보드 (Notion)

```
취소 플로우 성과 (월간)
┌─────────────────────────────────────────┐
│ 총 취소 시도: 20건                        │
│ 유지 전환: 6건 (30%)                      │
│ 최종 취소: 14건 (70%)                     │
│ ───────────────────────────────────────  │
│ 보호 매출: 180만원 (Pro 6명 유지)          │
└─────────────────────────────────────────┘

이유별 전환율:
- 사용 빈도 낮음: 5건 시도 → 2건 유지 (40%)
- 가격 부담: 7건 시도 → 3건 유지 (43%)
- 기능 부족: 3건 시도 → 0건 유지 (0%)
- 경쟁사 전환: 2건 시도 → 1건 유지 (50%)
- 일시적 불필요: 2건 시도 → 2건 일시정지 (100%)
- 품질 불만: 1건 시도 → 0건 유지 (0%)

대안별 선택률:
- 할인 (3개월 33%): 3건
- Free 다운그레이드: 0건
- 일시정지: 2건
- 1:1 온보딩: 1건
```

---

## 8. A/B 테스트 계획

| 테스트 항목 | A안 | B안 | 측정 지표 |
|-----------|-----|-----|----------|
| 할인율 | 33% (3개월) | 50% (1개월) | 수락률 |
| 일시정지 최대 기간 | 6개월 | 3개월 | 선택률 |
| 최종 확인 문구 | "정말 취소하시겠습니까?" | "{{고객명}}님을 떠나보내기 아쉽습니다" | 유지율 |
| ROI 계산 표시 | 표시 | 미표시 | "가격 부담" 전환율 |

**최소 표본**: 각 그룹 20건 이상

---

## 9. 도구 추천

| 도구 | 가격 | 특징 | 추천도 |
|------|------|------|--------|
| **자체 구현** (Next.js) | 무료 | 완전한 커스터마이징 가능 | ⭐⭐⭐⭐⭐ (1순위) |
| **ProsperStack** | $199/월~ | 취소 플로우 + 던닝 통합, A/B 테스트 자동화 | ⭐⭐⭐ (성장 후) |
| **Churnkey** | $99/월~ | 취소 플로우 전문, Stripe 연동 | ⭐⭐⭐ (성장 후) |
| **Paddle Retain** | 무료 (Paddle 사용 시) | Paddle 기본 제공 | ⭐⭐ (Paddle 사용 시만) |

**초기 단계 권장**: 자체 구현 (위 코드 활용). MRR 5,000만원 이상 시 ProsperStack 검토.

---

## 10. 실행 체크리스트

### 10.1 MVP 단계 (런칭 전 필수)

- [ ] 취소 이유 설문 UI 구현
- [ ] 이유별 대안 제시 페이지 6종 구현
- [ ] 할인 쿠폰 자동 적용 API (Stripe)
- [ ] 일시정지 API (Stripe pause_collection)
- [ ] Free 플랜 다운그레이드 로직
- [ ] 최종 확인 페이지 ("손실" 명확화)
- [ ] 취소 완료 페이지 (데이터 다운로드 링크)
- [ ] 취소 이유 Notion/Linear 자동 저장

### 10.2 런칭 후 1개월 (최적화)

- [ ] 전환율 측정 (목표: 25% 이상)
- [ ] 이유별 전환율 분석
- [ ] 할인 제안 ROI 분석 (3개월 할인 vs LTV)
- [ ] A/B 테스트 1회 실행

### 10.3 런칭 후 3개월 (고도화)

- [ ] 대안 제시 문구 최적화
- [ ] 1:1 온보딩/상담 효과 분석
- [ ] ProsperStack 도입 검토 (MRR 5,000만원 이상 시)

---

**다음 문서**: `winback_sequences.md` (이탈 후 복귀 유도)
