# AILEX 장애 대응 런북

> AI 기본법 컴플라이언스 자동화 SaaS의 장애 대응 절차입니다.
> B2B 고객의 업무에 직접 영향을 미치므로 신속한 대응이 중요합니다.

---

## 긴급 연락처

| 서비스 | 연락처 | 용도 |
|--------|--------|------|
| Vercel | https://vercel.com/support | 배포/호스팅 장애 |
| Supabase | https://supabase.com/support | DB/Auth/Storage 장애 |
| OpenAI | https://help.openai.com | API 장애, 과금 문제 |
| Sentry | https://sentry.io/support | 모니터링 도구 장애 |
| 도메인 등록 | 도메인 업체 고객센터 | DNS 문제 |
| Cloudflare R2 | https://dash.cloudflare.com | 백업 스토리지 장애 |

### 서비스 상태 페이지
- Vercel: https://www.vercel-status.com
- Supabase: https://status.supabase.com
- OpenAI: https://status.openai.com

---

## 상황 1: 서비스 완전 다운 (사이트 접속 불가)

### 증상
- 사이트에 접속이 안 됨 (5xx 에러 또는 타임아웃)
- UptimeRobot에서 다운 알림 수신

### 진단 절차
```bash
# 1. HTTP 상태 확인
curl -I https://ailex.app

# 2. DNS 확인
nslookup ailex.app
dig ailex.app

# 3. Vercel 배포 상태 확인
vercel ls

# 4. Vercel 상태 페이지 확인
# https://www.vercel-status.com

# 5. 최근 배포 로그 확인
# Vercel 대시보드 > Deployments > 최신 배포 > Functions 탭
```

### 즉시 조치

**경우 A: 최근 배포 이후 발생한 경우**
```bash
# 이전 배포로 롤백
cd /path/to/AILEX/project
vercel ls  # 이전 성공한 배포 URL 확인
vercel promote <이전-배포-url> --yes
```

**경우 B: Vercel 인프라 장애인 경우**
1. Vercel 상태 페이지 확인
2. 고객에게 장애 공지 (이메일/상태 페이지)
3. Vercel 지원 티켓 제출
4. 장애 복구 대기

**경우 C: DNS 문제인 경우**
1. 도메인 레지스트라 대시보드에서 DNS 레코드 확인
2. Vercel DNS 설정 재확인
3. DNS 전파 대기 (최대 48시간, 보통 몇 분)

### 사후 분석
- 장애 시작/종료 시간 기록
- 영향 범위 (사용자 수) 파악
- 원인 분석 및 재발 방지 대책 수립
- 고객에게 사후 보고서 발송 (B2B 필수)

---

## 상황 2: 데이터베이스 연결 실패

### 증상
- API 요청 시 500 에러
- Sentry에 "Connection refused" 또는 "timeout" 에러
- 로그인/대시보드 로딩 실패

### 진단 절차
```bash
# 1. Supabase 상태 확인
# https://status.supabase.com

# 2. DB 연결 테스트
psql "$SUPABASE_DB_URL" -c "SELECT 1;"

# 3. Supabase 대시보드에서 확인
# - Database > Connection Pooling 상태
# - Reports > Database Health

# 4. Vercel 함수 로그 확인
# Vercel 대시보드 > Deployments > Runtime Logs
```

### 즉시 조치

**경우 A: Supabase 장애 (상태 페이지에 표시)**
1. 고객에게 장애 공지
2. Supabase 상태 페이지 모니터링
3. 복구 후 데이터 정합성 확인

**경우 B: 연결 수 초과**
1. Supabase 대시보드 > Database > Connections 확인
2. 불필요한 연결 종료:
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE datname = 'postgres'
   AND state = 'idle'
   AND state_change < NOW() - INTERVAL '10 minutes';
   ```
3. Connection Pooler(Supavisor) 사용 확인

**경우 C: DB 용량 초과 (무료 플랜 500MB)**
1. Supabase 대시보드 > Database > Database Size 확인
2. 불필요한 데이터 정리:
   ```sql
   -- 90일 이상 된 감사 로그 삭제
   DELETE FROM public.audit_logs
   WHERE created_at < NOW() - INTERVAL '90 days';

   -- 테이블 크기 확인
   SELECT
     relname as table_name,
     pg_size_pretty(pg_total_relation_size(relid)) as total_size
   FROM pg_catalog.pg_statio_user_tables
   ORDER BY pg_total_relation_size(relid) DESC;
   ```
3. 필요시 Pro 플랜 업그레이드

### 근본 해결
- Connection Pooler 설정 최적화
- DB 사용량 모니터링 알림 추가
- 정기적 데이터 정리 자동화

---

## 상황 3: OpenAI API 장애 또는 과금 문제

### 증상
- AI 평가(Assessment) 생성 실패
- 문서 생성 실패
- Sentry에 OpenAI API 관련 에러
- OpenAI에서 과금 알림 메일 수신

### 진단 절차
```bash
# 1. OpenAI 상태 확인
# https://status.openai.com

# 2. API 키 유효성 확인
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" | head -5

# 3. 사용량 확인
# https://platform.openai.com/usage

# 4. Rate Limit 확인
# OpenAI 대시보드 > Usage > Rate Limits
```

### 즉시 조치

**경우 A: OpenAI 서비스 장애**
1. AI 기능에 의존하는 페이지에 "일시적으로 AI 기능을 사용할 수 없습니다" 안내 표시
2. 이미 생성된 평가/문서는 정상 조회 가능하므로 기존 데이터 서비스는 유지
3. OpenAI 상태 복구 모니터링

**경우 B: API 키 만료 또는 잔액 부족**
1. OpenAI 대시보드에서 잔액 확인 및 충전
2. 필요시 API 키 재생성
3. Vercel 환경변수 업데이트:
   ```bash
   vercel env rm OPENAI_API_KEY production
   vercel env add OPENAI_API_KEY production
   # (새 키 입력)
   vercel --prod  # 재배포
   ```

**경우 C: 비용 폭증 (비정상적 사용)**
1. OpenAI 대시보드에서 Hard Limit 즉시 낮춤
2. API 호출 로그 분석 (어떤 사용자/엔드포인트가 과다 사용)
3. 해당 사용자 rate limit 강화 또는 계정 일시 정지
4. Rate Limit 로직 강화 배포

### 근본 해결
- OpenAI Usage Limit 설정 (Soft/Hard)
- 사용자별 월간 AI 사용 한도 기능 구현
- 폴백(Fallback) 모델 설정 (예: GPT-4o -> GPT-4o-mini)

---

## 상황 4: 인증 시스템 장애 (로그인 불가)

### 증상
- 로그인/회원가입 실패
- "Invalid JWT" 또는 "Auth session missing" 에러
- Google OAuth 리다이렉트 실패

### 진단 절차
```bash
# 1. Supabase Auth 상태 확인
# Supabase 대시보드 > Authentication > Users

# 2. Auth API 직접 테스트
curl -X POST "https://[PROJECT_REF].supabase.co/auth/v1/signup" \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "password": "testpassword123"}'

# 3. JWT 토큰 디코딩 (만료 확인)
# https://jwt.io 에서 토큰 검증

# 4. Google OAuth 설정 확인
# Supabase 대시보드 > Authentication > Providers > Google
```

### 즉시 조치

**경우 A: Supabase Auth 장애**
1. Supabase 상태 페이지 확인
2. 이미 로그인된 사용자는 세션 만료까지 서비스 이용 가능
3. 새 로그인 시도에 대해 안내 메시지 표시

**경우 B: Google OAuth 설정 문제**
1. Google Cloud Console에서 OAuth 설정 확인
2. Redirect URI가 올바른지 확인 (프로덕션 도메인 포함)
3. Supabase 대시보드에서 Google Provider 설정 재확인

**경우 C: JWT 시크릿 문제**
1. Supabase 대시보드 > Settings > API에서 JWT Secret 확인
2. 필요시 `SUPABASE_SERVICE_ROLE_KEY` 재생성
3. Vercel 환경변수 업데이트 후 재배포

---

## 상황 5: 성능 저하 (느린 응답)

### 증상
- 페이지 로딩이 5초 이상 걸림
- Vercel Analytics에서 TTFB 급증
- 사용자 불만 접수

### 진단 절차
```bash
# 1. 서버 응답 시간 측정
curl -o /dev/null -s -w "TTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://ailex.app

# 2. API 엔드포인트별 응답 시간
curl -o /dev/null -s -w "%{time_total}s" https://ailex.app/api/v1/dashboard/summary

# 3. Vercel Functions 실행 시간 확인
# Vercel 대시보드 > Analytics > Functions

# 4. Supabase DB 쿼리 성능 확인
# Supabase 대시보드 > Database > Query Performance
```

### 즉시 조치
1. Vercel Functions 실행 시간이 긴 함수 식별
2. Supabase에서 느린 쿼리 확인:
   ```sql
   -- 실행 시간 긴 쿼리 확인
   SELECT
     query,
     calls,
     mean_exec_time,
     total_exec_time
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC
   LIMIT 10;
   ```
3. 필요시 인덱스 추가
4. OpenAI API 호출이 병목인 경우 타임아웃 조정

### 근본 해결
- 느린 쿼리에 인덱스 추가
- API 응답 캐싱 적용 (Vercel Edge Cache)
- 대용량 데이터 페이지네이션 확인
- OpenAI API 스트리밍 응답 적용

---

## 상황 6: 배포 실패

### 증상
- GitHub Actions deploy.yml 실패
- Vercel 빌드 에러
- Slack에 배포 실패 알림

### 진단 절차
1. GitHub Actions 실행 로그 확인
   - https://github.com/cheesom-max/AILEX/actions
2. 실패 단계 식별 (린트/타입체크/테스트/빌드/배포)
3. Vercel 빌드 로그 확인 (Vercel 대시보드)

### 즉시 조치

**린트/타입체크 실패:**
```bash
cd project/
npx eslint .      # 린트 에러 확인
npx tsc --noEmit  # 타입 에러 확인
# 수정 후 다시 push
```

**테스트 실패:**
```bash
cd project/
npx vitest run --reporter=verbose  # 실패한 테스트 확인
# 수정 후 다시 push
```

**빌드 실패:**
```bash
cd project/
npm run build  # 로컬에서 빌드 재현
# 환경변수 누락 확인
```

**Vercel 배포 실패:**
- 환경변수 누락 확인
- Vercel 빌드 로그에서 에러 메시지 확인
- 수동 배포 시도: `vercel --prod`

### 긴급 배포 (CI/CD 우회)
```bash
# GitHub Actions를 건너뛰고 직접 배포 (긴급 시에만)
cd project/
vercel --prod --yes
```

---

## 상황 7: 데이터 유실 또는 손상

### 증상
- 사용자가 데이터가 사라졌다고 보고
- DB 테이블의 행 수가 비정상적으로 감소
- 잘못된 마이그레이션 실행

### 즉시 조치
1. **서비스 일시 중지** (추가 데이터 손상 방지)
   - Vercel 대시보드에서 프로덕션 배포 일시 중지
   - 또는 점검 페이지로 리다이렉트

2. **현재 상태 백업**
   ```bash
   ./backup.sh manual
   ```

3. **최신 백업에서 복원**
   ```bash
   # 복원 가이드 참조: infra/backup/restore_guide.md
   ```

4. **서비스 재개 및 데이터 검증**

### 근본 해결
- 백업 주기 단축 검토
- DB 마이그레이션 프로세스 강화 (스테이징 먼저 적용)
- Supabase PITR(Point-in-Time Recovery) 활성화 검토 (Pro 플랜)

---

## 장애 대응 공통 절차

### 1. 장애 인지 (0~5분)
- 알림 확인 (Slack/이메일/UptimeRobot)
- 영향 범위 1차 파악
- 장애 시작 시간 기록

### 2. 초기 대응 (5~15분)
- 위 상황별 진단 절차 수행
- 즉시 조치 실행
- 필요시 고객 공지

### 3. 복구 확인 (15~30분)
- 서비스 정상 작동 확인
- 주요 기능 테스트
- 모니터링 지표 정상화 확인

### 4. 사후 분석 (24시간 이내)
- 장애 타임라인 정리
- 원인 분석 (Root Cause Analysis)
- 재발 방지 대책 수립
- B2B 고객에게 사후 보고서 발송

### 장애 기록 템플릿
```markdown
## 장애 보고서

- 발생일시: YYYY-MM-DD HH:MM KST
- 복구일시: YYYY-MM-DD HH:MM KST
- 영향 시간: X시간 Y분
- 영향 범위: (사용자 수, 기능)
- 심각도: P1(전체 다운) / P2(일부 기능 장애) / P3(성능 저하)

### 타임라인
- HH:MM - 장애 인지
- HH:MM - 진단 시작
- HH:MM - 원인 파악
- HH:MM - 조치 실행
- HH:MM - 복구 확인

### 원인
(장애의 근본 원인)

### 조치 내용
(수행한 복구 조치)

### 재발 방지 대책
1. (단기)
2. (중장기)
```
