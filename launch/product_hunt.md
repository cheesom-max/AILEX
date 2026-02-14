# Product Hunt 런칭 패키지: AILEX

> 플랫폼: https://www.producthunt.com
> 타겟: 글로벌 프로덕트 메이커, 투자자, 얼리어답터
> 목표: 500~1,500 방문, 50~100 가입, 글로벌 인지도 확보

---

## Product Hunt 제출 정보

### Product Name
**AILEX**

### Tagline (60자 이내, 영문 3가지 버전)

**버전 1 (간결형)**:
AI compliance automation for Korea AI Act

**버전 2 (가치 강조형)**:
Korea AI Act compliance in 5 min, $207/mo vs $20K lawyers

**버전 3 (기능 중심형)**:
Auto-assess high-impact AI + generate compliance docs with GPT-4o

**추천**: 버전 2 (가격 대비 효과가 Product Hunt에서 강력한 훅)

### Description (260자 이내, 영문 2가지 버전)

**버전 1 (문제-해결 구조)**:
Korea's AI Act went live Jan 2026, but 98% of startups can't comply. Law firm consults cost $20K+ per case. AILEX automates it: 5-min high-impact AI assessment, 30-min compliance doc generation (impact reports, transparency docs), GPT-4o powered, $207/mo. First mover for Korea AI Act.

(253자)

**버전 2 (기능 나열형)**:
Automate Korea AI Act compliance with GPT-4o: ✅ High-impact AI assessment (11 sectors) in 5 min ✅ Auto-generate impact reports, transparency docs, risk plans in 30 min ✅ Compliance dashboard ✅ $207/mo vs $20K law firms ✅ Free self-assessment. For AI startups, legal teams, HR/finance AI builders.

(260자)

**추천**: 버전 2 (기능이 명확하고 체크마크로 가독성 향상)

### Topics (최대 3개 추천)
1. **Artificial Intelligence** (핵심 도메인)
2. **Legal** (법률 컴플라이언스 도메인)
3. **Productivity** (업무 자동화 측면)

대안: Developer Tools, SaaS, Compliance

---

## 제출 자료

### Thumbnail (1270x760px)
**디자인 콘셉트**:
- 배경: 다크 그라디언트 (블루 → 보라)
- 메인 텍스트: "AI Act Compliance" (큰 폰트)
- 서브 텍스트: "Automated in 5 minutes" (작은 폰트)
- 아이콘: AI 브레인 + 법률 저울 조합
- 배지: "Korea AI Act" 플래그

### Gallery (5장 구성)

**이미지 1: Hero Shot**
- 메인 화면: "Assess your AI in 5 minutes" CTA
- 입력 폼 미리보기 (AI 시스템 정보)
- 애니메이션 GIF로 입력 → 판정 프로세스 표시

**이미지 2: Assessment Result**
- "High-Impact AI" 판정 결과 화면
- 근거 법 조문 표시 (Article 27, 34 등)
- 의무사항 요약 (투명성 고지, 영향평가 등)

**이미지 3: Document Generation**
- AI 영향평가서 자동 생성 진행 화면
- 15개 항목 체크리스트 (공정성, 투명성, 안전성 등)
- "Generating... 30 min remaining" 프로그레스 바

**이미지 4: Compliance Dashboard**
- 컴플라이언스 체크리스트 대시보드
- 과태료 리스크 시각화 (최대 $20K)
- 법 조문 자동 매핑

**이미지 5: Before vs After**
- Before: "Law firm consult $20K + 2-4 weeks"
- After: "AILEX $207/mo + 5 min + 30 min"
- 비용 절감 그래프 (1/67 cost)

### Video (Optional, 추천)
- 길이: 30~60초
- 구성:
  1. 문제 제시 (0~10초): "Korea AI Act is live. 98% of startups don't know how to comply."
  2. 솔루션 소개 (10~30초): "AILEX automates compliance with GPT-4o. 5 min assessment + 30 min docs."
  3. 데모 (30~50초): 실제 화면 녹화 (입력 → 판정 → 문서 생성)
  4. CTA (50~60초): "Start free self-assessment. ailex.ai"

---

## Maker's Comment (최초 댓글, 영문 200단어)

**초안**:

Hey Product Hunt! 👋

I'm [Your Name], maker of AILEX.

**Why I built this:**

In Jan 2026, Korea's AI Act went into effect — the world's 2nd comprehensive AI regulation after EU. But 98% of startups have no idea how to comply (per Korea Startup Alliance survey).

The problem:
- Law firms charge $20K+ per compliance case
- Manual compliance takes 2-4 weeks
- 55 articles + 11 high-impact sectors to navigate
- Max penalty: $20K fine

I'm an AI engineer (not a lawyer), and I saw my startup friends struggling. So I automated it with GPT-4o.

**What AILEX does:**
✅ 5-min high-impact AI assessment (95%+ accuracy, GPT-4o + Korea AI Act embedded)
✅ 30-min auto-generated compliance docs (impact reports, transparency docs, risk plans)
✅ Compliance dashboard + penalty risk analysis
✅ Free self-assessment (forever free)

**Tech stack:** Next.js 15, Supabase, GPT-4o API, shadcn/ui

**Current status:** Beta with 10 startups. We're first-mover for Korea AI Act compliance automation.

**Limitations:** This is for Korea AI Act only (EU AI Act coming Q3 2026). Complex cases still need lawyer review — AILEX handles 80%, lawyers handle 20%.

Try free self-assessment: [ailex.ai]

**I'd love feedback on:**
- Is legal AI trustworthy enough for compliance?
- How do you verify AI judgment accuracy?
- Would you use this for your own AI products?

Thanks for hunting! 🚀

(198 words)

---

## 예상 질문 & 답변 스크립트 (영문)

### Q1: How do you ensure 95% accuracy for legal judgment?

**A:** Great question! We use 3 layers:
1. **System Prompt**: Full Korea AI Act enforcement decree (10K tokens) embedded in GPT-4o
2. **Few-shot Learning**: 30 examples from government guidelines
3. **Uncertainty Handling**: 3-tier judgment (Certain / General / Uncertain). If uncertain, we recommend expert review.

We tested 30 cases: 28 accurate, 2 flagged as "uncertain" to avoid risk.

All judgments include legal disclaimer: "For reference only. Consult legal experts for final confirmation."

---

### Q2: Why should I trust AI over a lawyer?

**A:** You shouldn't replace lawyers — AILEX is a diagnostic tool, not a replacement.

Think of it like:
- **AILEX**: Initial triage + document drafting (80% of work)
- **Lawyers**: Complex cases + audit support + final review (20% of work)

Real user feedback: "AILEX automated 80%, we only paid lawyers for 20% review. Cost went from $20K to $3K."

---

### Q3: What if the law changes?

**A:** We monitor Korea AI Act updates and government guidelines. When the law changes:
1. Update system prompts within 48 hours
2. Notify all users via email + in-app banner
3. Re-assess all existing judgments (auto-triggered)

Law tech requires active maintenance — we're committed to it.

---

### Q4: Is this only for Korean companies?

**A:** Currently yes — AILEX is Korea AI Act specific. But we're adding:
- **Q3 2026**: EU AI Act module (many Korean companies export to EU)
- **Q4 2026**: ISO 42001 (AI management system standard)

Our vision: multi-jurisdiction AI compliance platform.

---

### Q5: How much does it cost? Seems expensive for startups.

**A:** $207/mo (Pro plan) vs $20K law firm consult = **1/67 cost**.

Free tier includes:
- Unlimited high-impact AI assessments
- Judgment results + legal article citations

Pro tier ($207/mo) adds:
- Auto-generate compliance docs (impact reports, transparency docs)
- Manage 3 AI systems
- Compliance dashboard
- 5-year document storage

If you generate even 1 compliance doc, you've already saved $19K vs lawyers.

---

### Q6: Can I see the code? Is it open source?

**A:** Core engine is proprietary, but we're open-sourcing:
- Judgment logic flow (GitHub repo)
- Korea AI Act structured data (JSON)
- Accuracy test scripts

We want community feedback to improve accuracy. Check our GitHub: [repo link]

---

### Q7: What happens if AILEX makes a wrong judgment and I get fined?

**A:** Legal liability stays with the company (not the tool). AILEX is a "reference tool" with explicit disclaimers.

To mitigate risk:
- We flag "uncertain" cases (recommend expert review)
- All judgments cite legal articles (transparency)
- Pro users get monthly compliance check reminders

Think of AILEX as a smart assistant, not a legal shield.

---

### Q8: Why not just read the law yourself?

**A:** Korea AI Act has:
- 55 articles + enforcement decree + government guidelines
- 11 high-impact sectors (employment, finance, healthcare, etc.)
- Vague language like "significant impact", "considerable scale" (no clear thresholds)

Reading it takes weeks. Interpreting it requires legal expertise.

AILEX automates interpretation with GPT-4o trained on government examples. You get results in 5 min instead of 4 weeks.

---

### Q9: Do you support other languages?

**A:** Currently Korean + English UI.

The law itself is Korean, but we provide English translations of:
- Judgment results
- Legal article summaries
- Compliance checklists

For non-Korean speakers building AI in Korea, AILEX bridges the language gap.

---

### Q10: What's your business model? Will you pivot?

**A:** Subscription SaaS:
- Free tier (lead generation)
- Pro $207/mo (target: AI startups)
- Enterprise $690+/mo (target: mid-size companies with multiple AI systems)

We're laser-focused on AI compliance automation. No pivot planned — this is a legal requirement (not a nice-to-have), so demand is guaranteed.

Goal: 100 paid users in 90 days.

---

## 업보트 요청 전략 (Upvote Campaign)

### 원칙
- **스팸 금지**: 자연스러운 공유, 가치 중심 메시지
- **타겟 선별**: AI/법률/스타트업 관련 네트워크만 요청
- **투명성**: "Product Hunt에 런칭했습니다. 피드백 부탁드립니다" (강요 아님)

### 요청 메시지 템플릿

#### 버전 1: 지인/네트워크용 (LinkedIn/이메일)

**제목**: AILEX launched on Product Hunt — your feedback would mean a lot

**본문**:
Hi [Name],

I just launched AILEX on Product Hunt today — it's an AI compliance automation tool for Korea's AI Act.

Since you're in [AI/legal/startup space], I'd love your feedback:
→ [Product Hunt link]

No pressure to upvote, but if you find it useful, I'd appreciate your support!

Quick context:
- Korea AI Act went live Jan 2026
- 98% of startups don't know how to comply
- AILEX automates high-impact AI assessment + compliance docs with GPT-4o
- $207/mo vs $20K law firms

Would love to hear your thoughts — especially on [specific question related to their expertise].

Thanks!
[Your Name]

#### 버전 2: AI 커뮤니티용 (Reddit, Slack, Discord)

**제목**: Built an AI tool to automate Korea AI Act compliance — launched on PH today

**본문**:
Hey community,

I built AILEX to automate Korea AI Act compliance (went live Jan 2026). Launched on Product Hunt today and would love your feedback:
[PH link]

**What it does:**
- 5-min high-impact AI assessment (GPT-4o powered)
- Auto-generate compliance docs in 30 min
- $207/mo vs $20K law firms

**Why I built it:**
98% of Korean AI startups don't know how to comply (per survey). Law firms are too expensive. So I automated it.

If you're building AI in Korea (or planning to), check it out. Free self-assessment available.

Honest feedback welcome — especially on legal AI trustworthiness.

[PH link]

#### 버전 3: Product Hunt 헌터용 (직접 요청)

**제목**: Hunt request: AILEX (AI compliance automation for Korea AI Act)

**본문**:
Hi [Hunter Name],

I'm launching AILEX — an AI compliance automation tool for Korea's AI Act (went live Jan 2026).

**Why it matters:**
- World's 2nd comprehensive AI regulation (after EU)
- 98% of startups can't comply
- Law firms charge $20K+ per case
- AILEX automates it: 5-min assessment + 30-min doc generation, $207/mo

**Product status:**
- Beta with 10 startups
- Built with Next.js 15 + Supabase + GPT-4o
- First-mover for Korea AI Act compliance

Would you be interested in hunting AILEX on Product Hunt?

Happy to provide:
- Product access
- Graphics/video assets
- Backstory for Maker's Comment

Let me know if you'd like to discuss!

[Your Name]
[ailex.ai]

---

## 런칭 타이밍

### 최적 요일/시간
**화요일 또는 목요일, 00:01 AM PST** (한국 시간 오후 5:01 PM)

- 화요일: 경쟁이 적고 주간 트래픽 시작
- 목요일: 주말 전 마지막 활성 요일
- 월요일/금요일 피하기 (경쟁 과다 또는 트래픽 저조)

### 24시간 타임라인 (한국 시간 기준)

| 시간 (KST) | 액션 |
|------------|------|
| 17:00 (D-Day) | Product Hunt 게시 (PST 00:01) |
| 17:05 | Maker's Comment 작성 |
| 17:10 | 지인 30명에게 업보트 요청 메시지 발송 (LinkedIn/이메일) |
| 18:00 | AI 커뮤니티 공유 (Reddit r/SaaS, r/artificial, Slack 채널) |
| 19:00 | Twitter 쓰레드 게시 + PH 링크 |
| 21:00 | 댓글 응답 (첫 4시간이 중요) |
| 23:00 | 중간 결과 확인 (업보트 수, 댓글 수) |
| 익일 09:00 | 아침 시간대 댓글 응답 |
| 익일 12:00 | 추가 업보트 요청 (2차 네트워크) |
| 익일 17:00 | 24시간 결산 (순위, 트래픽, 가입자 수) |

---

## 측정 지표

| 지표 | 목표 | 실제 |
|------|------|------|
| 업보트 수 | 100~300 | |
| 댓글 수 | 20~50 | |
| Product Hunt 순위 | Top 10 (일간) | |
| 웹사이트 방문 | 500~1,500 | |
| 가입자 수 | 50~100 | |
| 무료 판정 실행 | 30~50 | |
| Pro 문의 | 3~5 | |

---

## 리소스 & 레퍼런스

- [Product Hunt Launch Guide 2026](https://www.postdigitalist.xyz/blog/product-hunt-launch)
- [B2B SaaS PH Strategy](https://www.peaka.com/blog/product-hunt-launch-b2b-saas/)
- [Case Study: Top 5 Product 3 Days Running](https://www.mindtheproduct.com/a-case-study-product-hunt-launch-strategy-how-we-made-it-to-the-top-5-products-3-days-running/)

---

**준비 체크리스트**:
- [ ] Product Hunt 계정 생성 & 프로필 최적화
- [ ] Tagline 3가지 버전 A/B 테스트 (지인 설문)
- [ ] 갤러리 이미지 5장 제작 완료 (1270x760px)
- [ ] Video 제작 (30~60초, 선택)
- [ ] Maker's Comment 영문 200단어 작성
- [ ] 예상 질문 10개 답변 준비
- [ ] 업보트 요청 리스트 30명 준비 (AI/법률/스타트업 네트워크)
- [ ] 런칭일/시간 확정 (화/목, 00:01 AM PST)
- [ ] Hunter 섭외 (선택, 또는 셀프 런칭)
- [ ] 웹사이트 트래픽 대비 (Vercel 스케일링 확인)
- [ ] UTM 파라미터 설정 (`?utm_source=producthunt&utm_medium=launch`)
- [ ] 댓글 알림 켜기 (빠른 응답 필수)
