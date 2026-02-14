#!/bin/bash
# =============================================
# AILEX - Supabase PostgreSQL 백업 스크립트
# 사용법: ./backup.sh [daily|weekly|monthly|manual]
# 크론탭 설정 예시는 하단 참조
# =============================================

set -euo pipefail

# ---- 설정 ----
# 환경변수로 제공하거나 아래 기본값 수정
SUPABASE_DB_URL="${SUPABASE_DB_URL:-}"                     # postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
BACKUP_BASE_DIR="${BACKUP_BASE_DIR:-$HOME/ailex-backups}"  # 백업 저장 경로
R2_BUCKET="${R2_BUCKET:-}"                                 # Cloudflare R2 버킷명 (선택)
R2_ENDPOINT="${R2_ENDPOINT:-}"                             # R2 엔드포인트 (선택)

# 보관 정책
DAILY_KEEP=7     # 일간 백업 보관 개수
WEEKLY_KEEP=4    # 주간 백업 보관 개수
MONTHLY_KEEP=3   # 월간 백업 보관 개수

# ---- 색상 ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ---- 로그 ----
log_info()  { echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') $1"; }

# ---- 사전 조건 확인 ----
check_prerequisites() {
  if [ -z "$SUPABASE_DB_URL" ]; then
    log_error "SUPABASE_DB_URL 환경변수가 설정되지 않았습니다."
    log_info "Supabase 대시보드 > Settings > Database > Connection string (URI) 에서 확인"
    log_info "형식: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
    exit 1
  fi

  if ! command -v pg_dump &> /dev/null; then
    log_error "pg_dump가 설치되어 있지 않습니다."
    log_info "macOS: brew install postgresql"
    log_info "Ubuntu: sudo apt-get install postgresql-client"
    exit 1
  fi
}

# ---- 백업 실행 ----
run_backup() {
  local backup_type="$1"
  local timestamp=$(date '+%Y%m%d_%H%M%S')
  local backup_dir="$BACKUP_BASE_DIR/$backup_type"
  local backup_file="$backup_dir/ailex_${backup_type}_${timestamp}.sql.gz"

  # 디렉토리 생성
  mkdir -p "$backup_dir"

  log_info "백업 시작: $backup_type ($timestamp)"

  # pg_dump 실행 + gzip 압축
  # --no-owner: 소유자 정보 제외 (복원 시 충돌 방지)
  # --no-privileges: 권한 정보 제외
  # --clean: 복원 시 기존 객체 삭제 후 재생성
  pg_dump "$SUPABASE_DB_URL" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --schema=public \
    --format=plain \
    2>/dev/null | gzip > "$backup_file"

  # 백업 파일 크기 확인
  local file_size=$(du -h "$backup_file" | cut -f1)
  log_ok "백업 완료: $backup_file ($file_size)"

  # R2 업로드 (설정된 경우)
  if [ -n "$R2_BUCKET" ] && [ -n "$R2_ENDPOINT" ]; then
    upload_to_r2 "$backup_file" "$backup_type"
  fi

  # 오래된 백업 정리
  cleanup_old_backups "$backup_type"
}

# ---- R2/S3 업로드 ----
upload_to_r2() {
  local file="$1"
  local backup_type="$2"
  local filename=$(basename "$file")

  if ! command -v aws &> /dev/null; then
    log_warn "AWS CLI가 설치되어 있지 않습니다. R2 업로드를 건너뜁니다."
    return
  fi

  log_info "R2에 업로드 중: $filename"
  aws s3 cp "$file" "s3://$R2_BUCKET/ailex-backups/$backup_type/$filename" \
    --endpoint-url "$R2_ENDPOINT" \
    --quiet

  log_ok "R2 업로드 완료"
}

# ---- 오래된 백업 정리 ----
cleanup_old_backups() {
  local backup_type="$1"
  local backup_dir="$BACKUP_BASE_DIR/$backup_type"
  local keep_count

  case "$backup_type" in
    daily)   keep_count=$DAILY_KEEP ;;
    weekly)  keep_count=$WEEKLY_KEEP ;;
    monthly) keep_count=$MONTHLY_KEEP ;;
    *)       keep_count=5 ;;
  esac

  # 파일 개수 확인
  local file_count=$(ls -1 "$backup_dir"/*.sql.gz 2>/dev/null | wc -l | tr -d ' ')

  if [ "$file_count" -gt "$keep_count" ]; then
    local delete_count=$((file_count - keep_count))
    log_info "오래된 백업 $delete_count 개를 삭제합니다..."

    ls -1t "$backup_dir"/*.sql.gz | tail -n "$delete_count" | while read -r old_file; do
      rm "$old_file"
      log_info "삭제: $(basename "$old_file")"
    done
  fi
}

# ---- 백업 목록 ----
list_backups() {
  log_info "=== 백업 목록 ==="

  for type in daily weekly monthly manual; do
    local dir="$BACKUP_BASE_DIR/$type"
    if [ -d "$dir" ]; then
      local count=$(ls -1 "$dir"/*.sql.gz 2>/dev/null | wc -l | tr -d ' ')
      echo ""
      echo "[$type] $count 개"
      ls -lh "$dir"/*.sql.gz 2>/dev/null | awk '{print "  " $NF " (" $5 ")"}'
    fi
  done
}

# ---- 사용법 ----
usage() {
  echo "AILEX Supabase 백업 스크립트"
  echo ""
  echo "사용법: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  daily     일간 백업 실행"
  echo "  weekly    주간 백업 실행"
  echo "  monthly   월간 백업 실행"
  echo "  manual    수동 백업 실행"
  echo "  list      백업 목록 조회"
  echo ""
  echo "환경변수:"
  echo "  SUPABASE_DB_URL   Supabase DB 연결 문자열 (필수)"
  echo "  BACKUP_BASE_DIR   백업 저장 경로 (기본: ~/ailex-backups)"
  echo "  R2_BUCKET         Cloudflare R2 버킷명 (선택)"
  echo "  R2_ENDPOINT       R2 엔드포인트 URL (선택)"
  echo ""
  echo "크론탭 설정:"
  echo "  # 매일 새벽 3시 일간 백업"
  echo "  0 3 * * * SUPABASE_DB_URL=postgresql://... /path/to/backup.sh daily"
  echo "  # 매주 일요일 새벽 4시 주간 백업"
  echo "  0 4 * * 0 SUPABASE_DB_URL=postgresql://... /path/to/backup.sh weekly"
  echo "  # 매월 1일 새벽 5시 월간 백업"
  echo "  0 5 1 * * SUPABASE_DB_URL=postgresql://... /path/to/backup.sh monthly"
}

# ---- 메인 ----
case "${1:-}" in
  daily|weekly|monthly|manual)
    check_prerequisites
    run_backup "$1"
    ;;
  list|ls)
    list_backups
    ;;
  *)
    usage
    ;;
esac
