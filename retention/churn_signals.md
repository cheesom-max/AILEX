# 이탈 위험 신호 감지 (Churn Signal Detection)

> 작성일: 2026-02-14 | 기반: AILEX MVP 기획서, 가격 전략
> 목표: 이탈 전 사전 감지 및 선제적 대응으로 자발적 이탈 20~30% 예방

---

## 1. 이탈 위험 신호 개요

### 1.1 선제적 감지의 중요성

```
반응형 vs 예방형 리텐션:

반응형 (Reactive):
- 고객이 "취소" 버튼을 눌렀을 때 대응
- 성공률: 25~30%
- 시점: 이미 이탈 결정 완료

예방형 (Proactive):
- 이탈 위험 신호를 조기 감지하여 사전 대응
- 성공률: 40~60%
- 시점: 이탈 고민 단계 (아직 결정 전)

AILEX 임팩트:
- 월 이탈율 5.5% → 선제 대응으로 3.8~4.4% 감소 목표
- 연간 보호 매출: 약 1,200~1,800만원
```

**핵심 원칙**:
- 이탈은 "갑자기" 발생하지 않음. 수주~수개월의 신호가 선행됨
- 신호 감지 → 자동 알림 → 인간 개입 (1:1 접촉)
- 과도한 알림 금지 (피로도 증가 → 역효과)

### 1.2 이탈 위험 신호 목표

| 목표 | 기준선 (없음) | 목표 (시스템 구현) |
|------|--------------|------------------|
| 이탈 위험 고객 조기 감지율 | 0% | 70~80% |
| 감지 후 선제 대응률 | 0% | 90% 이상 |
| 위험 고객 → 유지 전환율 | - | 40~60% |
| False Positive (오탐지) | - | 20% 이하 |

---

## 2. 이탈 위험 신호 정의

### 2.1 신호 1: 로그인 빈도 급감

**정의**: 최근 14일 로그인 빈도가 이전 평균 대비 50% 이하로 감소

**측정 기준**:
- 기준 기간: 최근 14일
- 비교 대상: 이전 30일 평균
- 임계값: 50% 이하 감소

**예시**:
```
이전 30일 평균 로그인: 주 3회 (월 12회)
최근 14일 로그인: 1회
감소율: (1 / 6) = 16.7% → 83% 감소 → 위험 신호 발동
```

**SQL 쿼리** (Supabase):

```sql
-- 위험 고객 추출 (로그인 빈도 급감)
WITH login_stats AS (
  SELECT
    user_id,
    -- 이전 30일 평균 로그인 빈도
    COUNT(DISTINCT DATE(created_at)) FILTER (
      WHERE created_at BETWEEN NOW() - INTERVAL '44 days' AND NOW() - INTERVAL '14 days'
    ) AS prev_30d_login_days,
    -- 최근 14일 로그인 빈도
    COUNT(DISTINCT DATE(created_at)) FILTER (
      WHERE created_at >= NOW() - INTERVAL '14 days'
    ) AS recent_14d_login_days
  FROM login_events
  GROUP BY user_id
)
SELECT
  user_id,
  prev_30d_login_days,
  recent_14d_login_days,
  ROUND((recent_14d_login_days::numeric / (prev_30d_login_days / 2)) * 100, 2) AS activity_ratio
FROM login_stats
WHERE
  prev_30d_login_days > 0 AND
  (recent_14d_login_days::numeric / (prev_30d_login_days / 2)) < 0.5 -- 50% 미만
ORDER BY activity_ratio ASC;
```

**자동 대응**:
1. 인앱 알림: "오랜만입니다! AILEX에 새로운 기능이 추가되었습니다"
2. 이메일 발송: "활용도 높이기 가이드" (Day 7)
3. 1:1 접촉: 고객 성공 팀원이 직접 이메일 (Day 14)

**기대 효과**: 위험 고객의 30~40% 재활성화

---

### 2.2 신호 2: 핵심 기능 미사용

**정의**: 지난 7일간 핵심 기능(AI 시스템 판정, 문서 생성)을 1회도 사용하지 않음

**핵심 기능 목록** (AILEX):
1. AI 시스템 고영향 판정 실행
2. 의무 문서 생성 (영향평가서, 투명성 보고서 등)
3. 컴플라이언스 대시보드 조회

**측정 기준**:
- 기준 기간: 최근 7일
- 임계값: 핵심 기능 사용 0회

**예시**:
```
최근 7일 활동:
- 로그인: 2회
- AI 시스템 판정: 0회 ❌
- 문서 생성: 0회 ❌
- 대시보드 조회: 0회 ❌
→ 위험 신호 발동
```

**SQL 쿼리**:

```sql
-- 핵심 기능 미사용 고객
SELECT
  u.id AS user_id,
  u.email,
  u.name,
  COUNT(DISTINCT e.event_name) FILTER (WHERE e.event_name IN ('ai_assessment', 'document_generated', 'dashboard_viewed')) AS core_events_count
FROM users u
LEFT JOIN events e ON u.id = e.user_id AND e.created_at >= NOW() - INTERVAL '7 days'
WHERE
  u.subscription_status = 'active' AND
  u.created_at < NOW() - INTERVAL '30 days' -- 신규 고객 제외 (온보딩 기간)
GROUP BY u.id
HAVING COUNT(DISTINCT e.event_name) FILTER (WHERE e.event_name IN ('ai_assessment', 'document_generated', 'dashboard_viewed')) = 0;
```

**자동 대응**:
1. 인앱 배너: "AI 시스템 판정을 아직 안 해보셨나요? 5분이면 완료됩니다"
2. 이메일: "AILEX 핵심 기능 활용 가이드" (동영상 튜토리얼 3개)
3. 푸시 알림 (PWA): "컴플라이언스 체크가 밀려있습니다"

**기대 효과**: 위험 고객의 40~50% 재활성화

---

### 2.3 신호 3: 지원 티켓 급증 (불만 신호)

**정의**: 최근 7일간 지원 티켓이 2건 이상 발생하고, 그 중 1건 이상이 불만 관련

**불만 키워드**:
- "작동 안 함", "오류", "버그", "느림"
- "실망", "불만족", "환불", "취소"
- "다른 서비스", "경쟁사"

**측정 기준**:
- 기준 기간: 최근 7일
- 티켓 수: 2건 이상
- 불만 키워드 포함: 1건 이상

**SQL 쿼리**:

```sql
-- 지원 티켓 급증 + 불만 고객
WITH recent_tickets AS (
  SELECT
    user_id,
    COUNT(*) AS ticket_count,
    COUNT(*) FILTER (
      WHERE message ILIKE '%작동 안 함%' OR
            message ILIKE '%오류%' OR
            message ILIKE '%버그%' OR
            message ILIKE '%느림%' OR
            message ILIKE '%실망%' OR
            message ILIKE '%불만족%' OR
            message ILIKE '%환불%' OR
            message ILIKE '%취소%'
    ) AS complaint_count
  FROM support_tickets
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY user_id
)
SELECT
  u.id AS user_id,
  u.email,
  rt.ticket_count,
  rt.complaint_count
FROM users u
JOIN recent_tickets rt ON u.id = rt.user_id
WHERE
  rt.ticket_count >= 2 AND
  rt.complaint_count >= 1
ORDER BY rt.complaint_count DESC, rt.ticket_count DESC;
```

**자동 대응**:
1. 즉시 에스컬레이션: Slack 알림 → 고객 성공 팀장 직접 대응
2. 24시간 내 1:1 통화 제안
3. 문제 해결 후 1개월 무료 제공 (보상)

**기대 효과**: 위험 고객의 60~70% 유지 (즉시 대응 핵심)

---

### 2.4 신호 4: 결제 수단 만료 임박

**정의**: 카드 만료일이 30일 이내

**측정 기준**:
- 만료일 확인: Stripe `payment_method.card.exp_month`, `exp_year`
- 임계값: 만료까지 30일 이내

**자동 대응**:
1. 만료 30일 전: 이메일 알림 (1차)
2. 만료 7일 전: 이메일 + 인앱 배너 (2차, 긴급)
3. 만료 1일 전: SMS 알림 (최종)

**구현 코드** (Stripe 웹훅):

```typescript
// /app/api/cron/check-card-expiration/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const customers = await stripe.customers.list({ limit: 100 });

  for (const customer of customers.data) {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    for (const pm of paymentMethods.data) {
      const expMonth = pm.card!.exp_month;
      const expYear = pm.card!.exp_year;
      const expDate = new Date(expYear, expMonth - 1, 1);
      const today = new Date();
      const daysUntilExp = Math.floor((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExp <= 30 && daysUntilExp > 0) {
        // 30일 이내 만료 → 알림 발송
        await sendEmail({
          to: customer.email,
          subject: '[AILEX] 결제 수단 만료 30일 전 안내',
          body: `카드 번호 끝자리 ${pm.card!.last4}가 ${expMonth}/${expYear}에 만료됩니다. 지금 업데이트하세요.`,
        });
      }
    }
  }

  return Response.json({ success: true });
}
```

**Vercel Cron**: 매일 오전 9시 실행

**기대 효과**: 비자발적 이탈의 40~60% 사전 방지

---

### 2.5 신호 5: 요금제 다운그레이드 시도

**정의**: Pro/Enterprise → Free 다운그레이드 시도 또는 문의

**측정 기준**:
- 다운그레이드 버튼 클릭
- "요금제 변경" 지원 티켓
- 가격 불만 피드백

**자동 대응**:
1. 다운그레이드 전 인터셉트 모달:
   ```
   잠깐만요! 다운그레이드 전에 확인해주세요.

   Pro 플랜을 유지하시면:
   - AI 시스템 3개 무제한 관리
   - 의무 문서 자동 생성 (영향평가서 등)
   - 과태료 3,000만원 리스크 예방

   Free 플랜으로 변경 시 잃게 되는 것:
   - 등록된 AI 시스템 {{시스템_수}}개 데이터
   - 저장된 문서 {{문서_수}}개
   - 컴플라이언스 대시보드 접근

   혹시 가격 부담이 크신가요?
   [3개월 30% 할인 받기] [Free로 변경]
   ```

2. 할인 제안: 3개월 30% 할인 (Pro 30만원 → 21만원)

**기대 효과**: 다운그레이드 시도의 50~60% 유지

---

## 3. 위험 신호 통합 스코어링

### 3.1 Churn Risk Score 계산

각 신호에 가중치를 부여하여 종합 위험 점수 산출:

| 신호 | 가중치 | 점수 범위 |
|------|-------|----------|
| 로그인 빈도 급감 | 30% | 0~30 |
| 핵심 기능 미사용 | 40% | 0~40 |
| 지원 티켓 급증 | 20% | 0~20 |
| 카드 만료 임박 | 5% | 0~5 |
| 다운그레이드 시도 | 5% | 0~5 |
| **총점** | **100%** | **0~100** |

**위험 등급**:
- 0~30점: Low Risk (정상)
- 31~60점: Medium Risk (주의)
- 61~100점: High Risk (즉시 대응 필요)

**계산 예시**:

```
고객 A:
- 로그인 빈도: 80% 감소 → 30점 × 0.8 = 24점
- 핵심 기능 미사용: 7일간 0회 → 40점
- 지원 티켓: 0건 → 0점
- 카드 만료: 90일 남음 → 0점
- 다운그레이드: 없음 → 0점
총점: 24 + 40 = 64점 → High Risk

고객 B:
- 로그인 빈도: 정상 → 0점
- 핵심 기능 미사용: 주 2회 사용 → 0점
- 지원 티켓: 1건 (일반 문의) → 0점
- 카드 만료: 15일 남음 → 5점
- 다운그레이드: 없음 → 0점
총점: 5점 → Low Risk
```

### 3.2 자동 스코어링 구현

```typescript
// /lib/churn-risk-score.ts
export async function calculateChurnRiskScore(userId: string): Promise<number> {
  let score = 0;

  // 1. 로그인 빈도 급감 (30%)
  const loginRatio = await getLoginFrequencyRatio(userId);
  if (loginRatio < 0.5) {
    score += 30 * (1 - loginRatio); // 감소율에 비례
  }

  // 2. 핵심 기능 미사용 (40%)
  const coreFeatureUsage = await getCoreFeatureUsage(userId, 7);
  if (coreFeatureUsage === 0) {
    score += 40;
  }

  // 3. 지원 티켓 급증 (20%)
  const { ticketCount, complaintCount } = await getSupportTickets(userId, 7);
  if (ticketCount >= 2 && complaintCount >= 1) {
    score += 20;
  }

  // 4. 카드 만료 임박 (5%)
  const daysUntilCardExpiry = await getDaysUntilCardExpiry(userId);
  if (daysUntilCardExpiry <= 30 && daysUntilCardExpiry > 0) {
    score += 5 * (1 - daysUntilCardExpiry / 30); // 만료일 가까울수록 높은 점수
  }

  // 5. 다운그레이드 시도 (5%)
  const downgradeAttempt = await getDowngradeAttempt(userId, 7);
  if (downgradeAttempt) {
    score += 5;
  }

  return Math.round(score);
}

async function getLoginFrequencyRatio(userId: string): Promise<number> {
  // SQL 쿼리 실행 (위 2.1 참고)
  // ...
  return ratio;
}

// 나머지 함수들도 동일한 패턴
```

**매일 자동 실행** (Vercel Cron):

```typescript
// /app/api/cron/calculate-churn-risk/route.ts
export async function GET() {
  const activeCustomers = await supabase
    .from('customers')
    .select('id')
    .eq('status', 'active');

  for (const customer of activeCustomers.data || []) {
    const riskScore = await calculateChurnRiskScore(customer.id);

    await supabase
      .from('customers')
      .update({ churn_risk_score: riskScore, churn_risk_updated_at: new Date() })
      .eq('id', customer.id);

    // High Risk 고객은 Slack 알림
    if (riskScore >= 61) {
      await sendSlackAlert({
        channel: '#churn-alerts',
        text: `🚨 High Risk: ${customer.name} (Score: ${riskScore})`,
      });
    }
  }

  return Response.json({ success: true });
}
```

---

## 4. 위험 등급별 자동 대응 규칙

### 4.1 Low Risk (0~30점) - 정상

**대응**: 없음 (정기 체크만)

---

### 4.2 Medium Risk (31~60점) - 주의

**자동 대응**:

1. **인앱 알림** (재활성화 유도):
   ```
   AILEX를 최대한 활용하고 계신가요?

   아직 시도 안 하신 기능:
   - AI 시스템 판정 (5분 소요)
   - 영향평가서 자동 생성

   [지금 시작하기]
   ```

2. **이메일 발송** (활용도 높이기 가이드):
   ```
   제목: AILEX 100% 활용하는 법 (3분 가이드)

   {{고객명}}님, 안녕하세요.

   AILEX를 구독하신 지 {{구독_일수}}일이 지났습니다.

   혹시 모든 기능을 활용하고 계신가요?

   많은 고객들이 놓치는 핵심 기능 3가지:

   1. AI 시스템 판정 (5분 만에 고영향 여부 확인)
   2. 영향평가서 자동 생성 (법무법인 500만원 절약)
   3. 컴플라이언스 대시보드 (리스크 한눈에 파악)

   각 기능별 동영상 가이드:
   👉 [3분 튜토리얼 보기]

   도움이 필요하시면 언제든 회신해주세요.

   AILEX 팀
   ```

3. **7일 후 재확인**: 여전히 Medium Risk → High Risk 대응으로 에스컬레이션

**기대 효과**: Medium Risk의 50~60% Low Risk로 복귀

---

### 4.3 High Risk (61~100점) - 즉시 대응 필요

**자동 대응**:

1. **Slack 알림** (팀 내부):
   ```
   🚨 High Churn Risk Alert

   고객: {{고객명}} ({{이메일}})
   위험 점수: {{점수}}/100
   플랜: {{플랜}}

   주요 신호:
   - 로그인 빈도 80% 감소
   - 핵심 기능 7일간 미사용

   [고객 프로필 보기] [즉시 연락하기]
   ```

2. **1:1 이메일** (인간 개입, 자동화 아님):
   ```
   제목: {{고객명}}님, 혹시 불편한 점이 있으신가요?

   발신: {{담당자_이름}}@ailex.kr

   {{고객명}}님께,

   AILEX 팀의 {{담당자_이름}}입니다.

   최근 AILEX 사용 빈도가 줄어든 것 같아 걱정되어 연락드립니다.

   혹시 서비스에 불편한 점이 있으신가요?
   아니면 제품이 {{고객명}}님의 니즈에 맞지 않는 부분이 있나요?

   솔직히 말씀해주시면 즉시 개선할 수 있도록 최선을 다하겠습니다.

   통화로 직접 이야기 나누시면 더 도움이 될 것 같은데,
   15분 정도 시간 내주실 수 있으실까요?

   👉 통화 일정 잡기: {{calendly_링크}}

   또는 이 이메일에 회신하셔도 됩니다.
   언제든 도와드릴 준비가 되어 있습니다.

   감사합니다,
   {{담당자_이름}}
   AILEX 팀
   {{전화번호}}
   ```

3. **48시간 내 통화 시도**: 이메일 무응답 시 직접 전화

4. **특별 혜택 제안** (통화 중):
   - 1개월 무료 연장
   - 1:1 온보딩 세션 제공
   - 불만 해결 시 할인 제안

**기대 효과**: High Risk의 40~50% 유지

---

## 5. 대시보드 & 모니터링

### 5.1 Churn Risk Dashboard (Notion)

```
이탈 위험 고객 현황 (실시간)
┌─────────────────────────────────────────┐
│ 총 활성 고객: 250명                       │
│                                         │
│ Low Risk (0~30):   200명 (80%)          │
│ Medium Risk (31~60): 35명 (14%)         │
│ High Risk (61~100):  15명 (6%)          │
└─────────────────────────────────────────┘

High Risk 고객 목록 (즉시 대응 필요):
┌──────────────────────────────────────────────────────┐
│ 고객명      | 점수 | 주요 신호              | 담당자 |
│ ABC Corp    | 82   | 로그인 90% 감소        | 최동욱 |
│ XYZ Inc     | 75   | 핵심기능 14일 미사용    | 최동욱 |
│ DEF Startup | 68   | 지원티켓 3건 (불만 2건) | 최동욱 |
└──────────────────────────────────────────────────────┘

Medium Risk 고객 (주의):
- 35명 중 20명에게 활용 가이드 이메일 발송 완료
- 15명 추가 모니터링 중
```

### 5.2 주간 리포트 (자동 생성)

매주 월요일 오전 9시 Slack/이메일로 발송:

```
📊 주간 Churn Risk 리포트 (2026.02.10~02.16)

신규 High Risk 진입: 5명
- ABC Corp (점수 82): 로그인 빈도 급감
- XYZ Inc (점수 75): 핵심 기능 미사용
... (나머지 3명)

High Risk → Low Risk 복귀: 3명 (대응 성공 ✅)
- 123 Startup: 1:1 통화 후 재활성화
- 456 Co: 할인 제안 수락
- 789 Inc: 온보딩 세션 후 사용 재개

이번 주 액션 아이템:
- [ ] High Risk 5명 전원 1:1 통화 (최동욱)
- [ ] Medium Risk 10명 이메일 발송 (자동)
- [ ] 지원 티켓 급증 고객 3명 문제 해결 확인
```

---

## 6. 성과 측정 지표

### 6.1 핵심 KPI

| 지표 | 계산식 | 목표 | 측정 주기 |
|------|-------|------|----------|
| **위험 신호 감지율** | (감지된 이탈 고객 / 실제 이탈 고객) × 100 | 70~80% | 월간 |
| **선제 대응률** | (대응한 위험 고객 / 감지된 위험 고객) × 100 | 90% 이상 | 주간 |
| **High Risk → 유지 전환율** | (유지된 High Risk / 전체 High Risk) × 100 | 40~60% | 월간 |
| **False Positive 비율** | (오탐지 수 / 전체 감지 수) × 100 | 20% 이하 | 월간 |

### 6.2 성과 추적 (월간)

```
이탈 위험 감지 성과 (2026년 2월)
┌─────────────────────────────────────────┐
│ 총 이탈 고객: 12명                        │
│ 사전 감지: 9명 (75%)                      │
│ 미감지: 3명 (25%)                        │
│ ───────────────────────────────────────  │
│ High Risk 감지: 18명                     │
│ 선제 대응: 17명 (94%)                     │
│ 유지 성공: 9명 (50%)                      │
│ 최종 이탈: 9명 (50%)                      │
│ ───────────────────────────────────────  │
│ 예방 매출: 270만원 (Pro 9명 유지)          │
└─────────────────────────────────────────┘
```

---

## 7. 도구 추천

| 도구 | 가격 | 특징 | 추천도 |
|------|------|------|--------|
| **자체 구현** (Supabase + Vercel Cron) | 무료 | 완전한 커스터마이징 | ⭐⭐⭐⭐⭐ (1순위) |
| **Vitally** | $500/월~ | B2B SaaS 전용, 자동 Health Score | ⭐⭐⭐⭐ (성장 후) |
| **ChurnZero** | $500/월~ | 고객 성공 플랫폼, 위험 신호 자동 감지 | ⭐⭐⭐⭐ (성장 후) |
| **Mixpanel** | $89/월~ | 이벤트 추적 + 코호트 분석 | ⭐⭐⭐ (분석 도구로 활용) |
| **Amplitude** | $49/월~ | 사용자 행동 분석 | ⭐⭐⭐ (분석 도구로 활용) |

**초기 단계 권장**: 자체 구현 (Supabase + Vercel Cron). MRR 5,000만원 이상 시 Vitally 검토.

---

## 8. 실행 체크리스트

### 8.1 MVP 단계 (런칭 전 필수)

- [ ] 이탈 위험 신호 5종 정의 및 SQL 쿼리 작성
- [ ] Churn Risk Score 계산 로직 구현
- [ ] Vercel Cron으로 매일 자동 스코어링 설정
- [ ] Slack 알림 연동 (High Risk 고객)
- [ ] Notion/Google Sheets 대시보드 구성
- [ ] 1:1 이메일 템플릿 작성 (High Risk 대응)

### 8.2 런칭 후 1개월 (최적화)

- [ ] 위험 신호 감지율 측정 (목표: 70% 이상)
- [ ] False Positive 비율 확인 (목표: 20% 이하)
- [ ] High Risk → 유지 전환율 추적 (목표: 40% 이상)
- [ ] 스코어링 가중치 조정 (실제 데이터 기반)

### 8.3 런칭 후 3개월 (고도화)

- [ ] 머신러닝 모델 도입 검토 (예측 정확도 향상)
- [ ] Vitally/ChurnZero 도입 검토 (MRR 5,000만원 이상 시)
- [ ] 주간 리포트 자동화 (Slack/이메일)

---

## 9. 참고 자료

- [Full Guide to B2B SaaS Churn Rate Management in 2026](https://churnbuster.io/articles/b2b-saas-churn-rate)
- [How to Reduce Churn Rate for B2B SaaS](https://www.theclueless.company/how-to-reduce-churn-in-b2b-saas/)
- [B2B SaaS Churn Rate Benchmarks](https://www.vitally.io/post/saas-churn-benchmarks)

---

**다음 문서**: `metrics_tools.md` (리텐션 메트릭 & 도구)
