# AILEX 데이터베이스 복원 가이드

> Supabase PostgreSQL 백업 파일을 사용한 데이터베이스 복원 절차입니다.
> 복원은 데이터 유실 위험이 있으므로 반드시 절차를 따라 진행하세요.

---

## 복원 전 주의사항

1. **복원 작업은 기존 데이터를 덮어씁니다.** 현재 DB 상태를 먼저 백업하세요.
2. **프로덕션 복원 전 반드시 테스트 환경에서 검증하세요.**
3. **서비스 점검 공지를 먼저 올리세요.** (복원 중 데이터 불일치 가능)

---

## 1. 백업 파일 확인

```bash
# 백업 목록 확인
./backup.sh list

# 백업 파일 내용 미리보기 (압축 해제 후 상위 50줄)
gunzip -c ~/ailex-backups/daily/ailex_daily_20260213_030000.sql.gz | head -50
```

---

## 2. 복원 절차

### 방법 A: Supabase SQL Editor (소규모 데이터)

테이블 단위로 복원하는 가장 안전한 방법:

1. 백업 파일 압축 해제:
   ```bash
   gunzip -k ~/ailex-backups/daily/ailex_daily_YYYYMMDD_HHMMSS.sql.gz
   ```

2. Supabase 대시보드 > SQL Editor 열기

3. 필요한 테이블의 SQL만 선택하여 실행

### 방법 B: psql 직접 복원 (전체 복원)

```bash
# 1. 현재 상태 백업 (안전장치)
./backup.sh manual

# 2. 백업 파일 압축 해제
gunzip -k ~/ailex-backups/daily/ailex_daily_YYYYMMDD_HHMMSS.sql.gz

# 3. 복원 실행
# 주의: --clean 옵션으로 생성된 백업이므로 기존 데이터가 삭제됩니다
psql "$SUPABASE_DB_URL" < ~/ailex-backups/daily/ailex_daily_YYYYMMDD_HHMMSS.sql

# 4. 복원 결과 확인
psql "$SUPABASE_DB_URL" -c "
SELECT
  'users' as table_name, COUNT(*) as row_count FROM public.users
UNION ALL SELECT
  'ai_systems', COUNT(*) FROM public.ai_systems
UNION ALL SELECT
  'assessments', COUNT(*) FROM public.assessments
UNION ALL SELECT
  'compliance_items', COUNT(*) FROM public.compliance_items
UNION ALL SELECT
  'documents', COUNT(*) FROM public.documents
UNION ALL SELECT
  'audit_logs', COUNT(*) FROM public.audit_logs;
"
```

### 방법 C: R2에서 다운로드 후 복원

```bash
# R2에서 백업 파일 다운로드
aws s3 cp s3://$R2_BUCKET/ailex-backups/daily/ailex_daily_YYYYMMDD_HHMMSS.sql.gz \
  ~/ailex-restore/ \
  --endpoint-url "$R2_ENDPOINT"

# 이후 방법 B와 동일
```

---

## 3. 특정 테이블만 복원

특정 테이블의 데이터만 복원해야 하는 경우:

```bash
# 1. 백업 파일에서 특정 테이블 데이터 추출
gunzip -c ~/ailex-backups/daily/ailex_daily_YYYYMMDD_HHMMSS.sql.gz | \
  grep -A 999999 'COPY public.assessments' | \
  grep -B 999999 '^\.$' | head -n -0 > assessments_data.sql

# 2. 또는 pg_dump로 특정 테이블만 새로 백업
pg_dump "$SUPABASE_DB_URL" \
  --table=public.assessments \
  --data-only \
  --no-owner > assessments_only.sql

# 3. 복원
psql "$SUPABASE_DB_URL" < assessments_only.sql
```

---

## 4. 복원 후 검증 체크리스트

- [ ] 모든 테이블의 행 수가 예상과 일치하는가
- [ ] RLS 정책이 정상 작동하는가 (로그인 후 본인 데이터만 조회)
- [ ] 트리거가 정상 작동하는가 (updated_at 자동 갱신)
- [ ] Supabase Auth 사용자와 users 테이블이 동기화되어 있는가
- [ ] Storage 버킷의 파일이 documents 테이블과 일치하는가
- [ ] 인덱스가 존재하는가 (`\di` 명령으로 확인)
- [ ] 서비스에 로그인하여 주요 기능이 정상 작동하는가

---

## 5. 복원 테스트 절차 (월 1회 권장)

데이터 복원이 실제로 작동하는지 정기적으로 테스트합니다:

```bash
# 1. 테스트용 Supabase 프로젝트 생성 (무료)
#    - Supabase 대시보드에서 새 프로젝트 생성
#    - 연결 문자열 확보

# 2. 최신 백업을 테스트 DB에 복원
export TEST_DB_URL="postgresql://postgres:[PASSWORD]@db.[TEST-REF].supabase.co:5432/postgres"

# 스키마 먼저 적용
psql "$TEST_DB_URL" < project/supabase/migrations/001_initial_schema.sql

# 데이터 복원
gunzip -c ~/ailex-backups/daily/ailex_daily_LATEST.sql.gz | psql "$TEST_DB_URL"

# 3. 데이터 정합성 확인
psql "$TEST_DB_URL" -c "SELECT COUNT(*) FROM public.users;"

# 4. 테스트 프로젝트 삭제 (비용 절약)
```

---

## 6. Supabase 자체 백업 (참고)

Supabase Pro 플랜($25/월) 이상에서 제공하는 기능:

- **일일 자동 백업**: 7일간 보관
- **PITR (Point-in-Time Recovery)**: Pro 플랜에서 7일, Team 플랜에서 14일

Supabase 대시보드 > Database > Backups에서 확인 가능합니다.

> 무료 플랜에서는 자체 백업이 제공되지 않으므로, 이 스크립트를 사용한 수동 백업이 필수입니다.
