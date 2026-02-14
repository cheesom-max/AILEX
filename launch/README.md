# AILEX 멀티 플랫폼 런칭 패키지

> 제품: AILEX (AI Law EXpert) - AI 기본법 컴플라이언스 자동화
> 생성일: 2026-02-13
> 런칭 목표: D-Day 가입 200명, 판정 100건, Pro 문의 10건

---

## 목차

1. [패키지 개요](#패키지-개요)
2. [플랫폼별 런칭 자료](#플랫폼별-런칭-자료)
3. [실행 순서](#실행-순서)
4. [빠른 시작 가이드](#빠른-시작-가이드)
5. [측정 지표](#측정-지표)

---

## 패키지 개요

이 런칭 패키지는 AILEX의 멀티 플랫폼 동시 런칭을 위해 설계되었습니다.
6개 플랫폼(한국 3개 + 글로벌 3개)에 최적화된 **복사-실행 가능한** 콘텐츠를 제공합니다.

### 포함된 플랫폼

| 플랫폼 | 타겟 | 우선순위 | 예상 효과 |
|--------|------|----------|-----------|
| **디스콰이엇** (Disquiet) | 한국 IT 메이커 | P0 | 300~500 방문, 50~100 가입 |
| **GeekNews** (긱뉴스) | 한국 개발자 | P0 | 1,000~3,000 조회, 100~200 클릭 |
| **LinkedIn** | B2B 의사결정자 | P0 | 500~1,000 임프레션, 10~20 문의 |
| **Twitter/X** | 글로벌 테크 | P0 | 500~2,000 임프레션, 바이럴 가능 |
| **Product Hunt** | 글로벌 얼리어답터 | P1 | 500~1,500 방문, 글로벌 인지도 |
| **Hacker News** | 글로벌 해커 | P2 | 200~500 방문, 기술 신뢰도 |

### 패키지 구성

```
launch/
├── README.md                    # 이 파일 (패키지 개요)
├── disquiet.md                  # 디스콰이엇 런칭 패키지 (한국어)
├── geeknews.md                  # GeekNews 런칭 패키지 (한국어)
├── product_hunt.md              # Product Hunt 런칭 패키지 (영문)
├── hacker_news.md               # Hacker News 런칭 패키지 (영문)
├── linkedin.md                  # LinkedIn 런칭 패키지 (한국어)
├── twitter_x.md                 # Twitter/X 런칭 패키지 (한국어+영문)
├── launch_checklist.md          # 실행 체크리스트 (D-28 ~ D+7)
├── launch_day_timeline.md       # D-Day 분 단위 타임라인
└── post_launch_review.md        # 런칭 결과 분석 템플릿
```

---

## 플랫폼별 런칭 자료

### 1. 디스콰이엇 (disquiet.md)

**내용**:
- 프로덕트 등록 정보 (제품명, 태그라인, 설명, 스크린샷)
- 메이커 로그 4편 (Building in Public 전략)
- 런칭 당일 포스트 & 댓글 응답 스크립트
- 예상 질문 10개 + 답변

**언어**: 한국어
**예상 소요 시간**: 준비 5시간, 런칭일 3시간

**핵심 전략**:
- 런칭 4주 전부터 메이커로그로 커뮤니티 engagement 구축
- "적극적, 꾸준한, 자세한" 메이커로그가 성공의 핵심
- 베타 테스터 10~20명 확보하여 런칭일 초기 반응 확보

---

### 2. GeekNews (geeknews.md)

**내용**:
- Show GN 포스트 3가지 버전 (기술/문제/여정 중심)
- 첫 댓글(backstory) 초안
- 예상 질문 20개 + 기술적 답변
- 댓글 응답 전략 (회의적 질문 포함)

**언어**: 한국어
**예상 소요 시간**: 준비 3시간, 런칭일 2시간

**핵심 전략**:
- 마케팅 언어 금지, 사실적이고 기술적인 언어만 사용
- GPT-4o 프롬프트 설계, Prompt Caching 등 기술 세부사항 공유
- 한계점 솔직히 인정 (95% 정확도, 복잡한 케이스는 변호사 필요 등)

---

### 3. Product Hunt (product_hunt.md)

**내용**:
- 제품 정보 (영문 태그라인 3가지, 설명 2가지, Topics)
- 갤러리 이미지 5장 구성 제안
- Maker's Comment 영문 200단어
- 예상 질문 10개 + 영문 답변
- 업보트 요청 메시지 3가지 버전

**언어**: 영문
**예상 소요 시간**: 준비 10시간, 런칭일 4시간

**핵심 전략**:
- 화요일 또는 목요일 00:01 AM PST 런칭 (한국 시간 오후 5시)
- 첫 6시간이 알고리즘 결정적 → 지인 30명에게 업보트 요청
- B2B SaaS는 "Product of the Day"보다 **타겟 고객 피드백** 우선

---

### 4. Hacker News (hacker_news.md)

**내용**:
- Show HN 포스트 3가지 버전 (기술/문제/여정 중심)
- 첫 댓글(backstory) 영문 초안
- 예상 질문 20개 + 영문 답변 (회의적 질문 포함)
- HN 가이드라인 체크리스트

**언어**: 영문
**예상 소요 시간**: 준비 4시간, 런칭일 3시간

**핵심 전략**:
- 제목: "Show HN: AILEX - Automated Korea AI Act compliance with GPT-4o"
- URL 필드에만 링크 (텍스트 필드 비움)
- 마케팅 냄새 제거, 기술적 깊이 + 겸손한 태도
- 화~목, 08:00~11:00 AM EST 게시 (미국 아침 시간대)

---

### 5. LinkedIn (linkedin.md)

**내용**:
- 런칭 포스트 5가지 버전 (텍스트, 카루셀, 개인 스토리, 데이터, 비디오)
- 카루셀 5~7슬라이드 구성 제안
- 예상 댓글 응답 10개
- 프로필 최적화 가이드

**언어**: 한국어 (타겟이 한국 B2B 시장)
**예상 소요 시간**: 준비 6시간, 런칭일 3시간

**핵심 전략**:
- **카루셀 포맷 추천** (6.60% engagement, 최고 성과)
- 80/20 룰: 80% 가치 제공, 20% 프로모션
- 화~목, 오전 8:00~10:00 KST 게시 (출근 직후 황금시간대)
- 개인 계정 우선 (회사 페이지는 알고리즘 불리)

---

### 6. Twitter/X (twitter_x.md)

**내용**:
- 런칭 쓰레드 10트윗 (스토리/데이터/밈 3가지 버전)
- 티저 트윗, 카운트다운 트윗, 앵커 트윗
- 개별 트윗 전략 (피드백, 후기, Poll)
- Engagement 극대화 전략 (Reply Guy, 멘션, Poll)

**언어**: 한국어 + 영문 혼합
**예상 소요 시간**: 준비 5시간, 런칭일 3시간

**핵심 전략**:
- 8~12 트윗 쓰레드 (47% 높은 engagement)
- Hook First: 첫 트윗이 스크롤을 멈추게
- 화~목, 오전 10:00 또는 오후 8:00 KST
- 첫 30분 engagement 속도가 알고리즘 결정적

---

## 실행 순서

### Phase 1: Pre-Launch (D-28 ~ D-7)

**D-28 (런칭 4주 전)**
- [ ] 제품 최종 테스트 & 웹사이트 배포
- [ ] 분석 도구 설정 (Google Analytics, Vercel Analytics, UTM)
- [ ] 디스콰이엇 메이커로그 #1 게시
- [ ] LinkedIn 프로필 최적화

**D-21 (런칭 3주 전)**
- [ ] 모든 플랫폼 런칭 자료 작성 완료
- [ ] 시각 자료 제작 (스크린샷 5장, 카루셀, 썸네일)
- [ ] 디스콰이엇 메이커로그 #2 게시
- [ ] LinkedIn 가치 제공 포스트 #1

**D-14 (런칭 2주 전)**
- [ ] 베타 테스터 10~20명 모집 & 테스트 시작
- [ ] 피드백 수집 & 제품 개선
- [ ] 디스콰이엇 메이커로그 #3 게시
- [ ] Twitter 티저 트윗 작성 (D-3 게시 예약)

**D-7 (런칭 1주 전)**
- [ ] 베타 피드백 반영 완료
- [ ] 트래픽 스트레스 테스트
- [ ] 업보트/공유 요청 리스트 30~50명 작성
- [ ] 디스콰이엇 메이커로그 #4 게시
- [ ] Product Hunt Hunter 섭외 (선택)

---

### Phase 2: Launch Day (D-Day, 화요일 권장)

**타임라인 요약** (자세한 내용은 `launch_day_timeline.md` 참고)

| 시간 (KST) | 액션 |
|------------|------|
| 06:00 | Product Hunt 런칭 (PST 00:01, 전날 저녁) |
| 08:00 | 사전등록자 이메일 발송 |
| 09:30 | LinkedIn 런칭 포스트 |
| 10:00 | 디스콰이엇 프로덕트 게시 |
| 10:15 | Twitter 런칭 쓰레드 |
| 10:30 | GeekNews Show GN 게시 |
| 11:00 | 콜드 이메일 1차 발송 (50통) |
| 12:00~22:00 | 모든 플랫폼 댓글 응답 & 모니터링 |

**D-Day 목표**:
- 웹사이트 방문자: 300+
- 가입자 수: 200+
- 무료 판정 실행: 100+
- Pro 문의: 10+

---

### Phase 3: Post-Launch (D+1 ~ D+7)

**D+1 (수요일)**
- [ ] 밤새 댓글 응답
- [ ] 런칭 24시간 결산 작성
- [ ] Hacker News Show HN 게시 (선택, PH 피드백 반영 후)
- [ ] 온보딩 이메일 #1 발송

**D+3 (금요일)**
- [ ] 온보딩 이메일 #3 발송 (파운더 플랜 안내)
- [ ] 주간 결산 작성
- [ ] LinkedIn "런칭 첫 주 회고" 포스트

**D+7 (다음 화요일)**
- [ ] 1주 전체 결산 작성 (`post_launch_review.md` 사용)
- [ ] 블로그: "AILEX 런칭 1주 회고"
- [ ] 다음 2주 로드맵 수립

---

## 빠른 시작 가이드

### 최소 실행 경로 (시간 부족 시)

1인 창업자가 시간이 부족할 경우, 다음 3개 플랫폼만 집중:

1. **디스콰이엇** (한국 핵심)
2. **LinkedIn** (B2B 핵심)
3. **Twitter/X** (바이럴 가능성)

Product Hunt, Hacker News, GeekNews는 선택적으로 진행.

### 당일 준비 체크리스트 (최소)

**전날 밤 (23:00~24:00)**
- [ ] 모든 포스트 최종 검토 (오타, 링크)
- [ ] 이미지 파일 PC에 저장
- [ ] 제품 End-to-End 테스트
- [ ] 알람 설정 (06:00, 09:30, 10:00)

**D-Day 필수 액션**
- [ ] 09:30: LinkedIn 런칭 포스트
- [ ] 10:00: 디스콰이엇 프로덕트 게시
- [ ] 10:15: Twitter 런칭 쓰레드
- [ ] 10:00~22:00: 댓글 응답 (1시간 이내 응답 목표)

---

## 측정 지표

### 런칭 성공 지표 (D+7 기준)

| 지표 | 목표 | 측정 도구 |
|------|------|-----------|
| 웹사이트 방문자 | 1,500+ | Vercel Analytics, Google Analytics |
| 가입자 수 | 700+ | Supabase DB (users 테이블) |
| 무료 판정 실행 | 500+ | Supabase DB (assessments 테이블) |
| Pro 문의 | 30+ | 이메일, LinkedIn DM |
| Pro 전환 | 10+ | Supabase DB (plan='pro') |
| MRR | 300만원+ | 수동 계산 |

### 플랫폼별 지표

| 플랫폼 | 주요 지표 | 목표 |
|--------|-----------|------|
| Product Hunt | 업보트 수 | 100+ |
| 디스콰이엇 | 조회 수 | 300+ |
| GeekNews | 조회 수 | 1,000+ |
| LinkedIn | Engagement | 50+ |
| Twitter | Engagement | 100+ |
| Hacker News | Points | 50+ |

---

## 주의사항

### 플랫폼별 금기

**Product Hunt**
- ❌ 업보트 강요 ("Please upvote!" 금지)
- ❌ 자동화 봇 사용
- ❌ 가짜 계정 업보트

**Hacker News**
- ❌ 마케팅 언어 ("revolutionary", "game-changing")
- ❌ 회사명 계정 사용 (개인 계정만)
- ❌ 텍스트 필드 사용 (URL 필드만)

**LinkedIn**
- ❌ Engagement Bait ("댓글에 YES")
- ❌ 해시태그 과다 (3~5개 권장)
- ❌ 100% 프로모션 콘텐츠 (80/20 룰)

**Twitter/X**
- ❌ 해시태그 과다 (3~5개)
- ❌ 스팸성 멘션
- ❌ 자동화 봇

### 법적 주의사항

- **면책 고지 필수**: 모든 플랫폼에서 "AILEX는 참고용 도구이며, 최종 법률 확인은 전문가에게" 명시
- **정확도 과장 금지**: "95%+ 정확도"는 베타 테스트 30건 기준임을 명시
- **비교 광고 주의**: "법무법인 2,000만원 vs AILEX 30만원"은 사실 기반이지만, 법무법인을 직접 비방하지 않기

---

## 긴급 연락처

**기술 이슈**
- Vercel Support: [링크]
- Supabase Support: [링크]
- OpenAI Support: [링크]

**법률 자문 (필요 시)**
- [변호사 연락처]

**베타 테스터 긴급 연락**
- [Slack 채널 링크]

---

## 추가 리소스

### 각 플랫폼 가이드라인

- [Product Hunt Launch Guide](https://www.producthunt.com/launch)
- [Hacker News Show HN Guidelines](https://news.ycombinator.com/showhn.html)
- [디스콰이엇 프로덕트 런칭 가이드](https://www.disquiet.tech/post/how-to-launch-on-disquiet)
- [GeekNews Show 소개](https://news.hada.io/show)
- [LinkedIn Algorithm 2026 Guide](https://www.digitalapplied.com/blog/linkedin-algorithm-2026-engagement-strategy-guide)
- [Twitter/X Growth Guide 2026](https://socialrails.com/blog/how-to-grow-on-twitter-x-complete-guide)

### 참고 자료

- GTM Strategy: `/docs/gtm_strategy.md`
- MVP Spec: `/docs/mvp_spec.md`
- Landing Page: `/landing/`

---

## FAQ

**Q: 혼자서 6개 플랫폼 모두 실행 가능한가요?**
A: 가능하지만, 런칭일은 12시간 이상 댓글 응답에 집중해야 합니다. 시간 부족 시 디스콰이엇 + LinkedIn + Twitter 3개만 집중 추천.

**Q: 영어가 부족한데 Product Hunt/Hacker News 가능한가요?**
A: 이 패키지의 영문 포스트는 복사-실행 가능하도록 작성되었습니다. 댓글 응답은 ChatGPT/Claude로 초안 작성 후 검토하면 됩니다.

**Q: Product Hunt Hunter를 꼭 섭외해야 하나요?**
A: 아니요. 1인 창업자는 셀프 런칭이 일반적입니다. Hunter가 있으면 좋지만, 없어도 성공 가능합니다.

**Q: 런칭일을 꼭 화요일로 해야 하나요?**
A: 화요일 또는 목요일이 Product Hunt/Twitter 트래픽 최적화 시간입니다. 하지만 본인 일정에 맞춰 조정 가능합니다.

**Q: 런칭 후 무엇을 해야 하나요?**
A: `post_launch_review.md`로 결과 분석 후, 피드백 기반 제품 개선 + 콘텐츠 마케팅 지속이 핵심입니다.

---

## 연락처

질문/피드백: [이메일 또는 GitHub Issue]

---

**런칭 성공을 기원합니다! 🚀**

*이 패키지는 launch-executor 에이전트가 생성했습니다.*
*생성일: 2026-02-13*
