#!/bin/bash
# =============================================
# AILEX - 원커맨드 배포 스크립트
# 사용법: ./deploy.sh [production|preview|rollback]
# =============================================

set -euo pipefail

# ---- 색상 정의 ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 색상 초기화

# ---- 프로젝트 루트 디렉토리 ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../../project" && pwd)"

# ---- 로그 함수 ----
log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ---- 사전 조건 확인 ----
check_prerequisites() {
  log_info "사전 조건을 확인합니다..."

  # Vercel CLI 확인
  if ! command -v vercel &> /dev/null; then
    log_error "Vercel CLI가 설치되어 있지 않습니다."
    log_info "설치: npm install -g vercel"
    exit 1
  fi

  # Node.js 확인
  if ! command -v node &> /dev/null; then
    log_error "Node.js가 설치되어 있지 않습니다."
    exit 1
  fi

  # 프로젝트 디렉토리 확인
  if [ ! -f "$PROJECT_DIR/package.json" ]; then
    log_error "프로젝트 디렉토리를 찾을 수 없습니다: $PROJECT_DIR"
    exit 1
  fi

  log_ok "사전 조건 확인 완료"
}

# ---- 코드 검증 ----
validate_code() {
  log_info "코드 검증을 시작합니다..."
  cd "$PROJECT_DIR"

  # 의존성 설치
  log_info "의존성 설치 중..."
  npm ci --silent

  # 린트
  log_info "린트 검사 중..."
  npx eslint . || {
    log_error "린트 검사 실패"
    exit 1
  }
  log_ok "린트 통과"

  # 타입 체크
  log_info "타입 검사 중..."
  npx tsc --noEmit || {
    log_error "타입 검사 실패"
    exit 1
  }
  log_ok "타입 체크 통과"

  # 테스트
  log_info "테스트 실행 중..."
  npx vitest run || {
    log_error "테스트 실패"
    exit 1
  }
  log_ok "모든 테스트 통과"
}

# ---- 프로덕션 배포 ----
deploy_production() {
  log_info "=== 프로덕션 배포를 시작합니다 ==="

  check_prerequisites
  validate_code

  cd "$PROJECT_DIR"

  # Git 상태 확인
  if [ -n "$(git status --porcelain)" ]; then
    log_warn "커밋되지 않은 변경사항이 있습니다."
    read -p "계속 배포하시겠습니까? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
      log_info "배포를 취소합니다."
      exit 0
    fi
  fi

  # 현재 배포 URL 저장 (롤백용)
  CURRENT_URL=$(vercel ls --json 2>/dev/null | head -1 || echo "")
  if [ -n "$CURRENT_URL" ]; then
    echo "$CURRENT_URL" > "$SCRIPT_DIR/.last-deployment"
    log_info "현재 배포 정보를 저장했습니다 (롤백용)"
  fi

  # Vercel 프로덕션 배포
  log_info "Vercel 프로덕션 배포 중..."
  DEPLOYMENT_URL=$(vercel --prod --yes 2>&1 | tail -1)

  log_ok "배포 완료: $DEPLOYMENT_URL"

  # 헬스 체크
  log_info "헬스 체크 중..."
  sleep 10
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL" || echo "000")
  if [ "$STATUS" = "200" ]; then
    log_ok "헬스 체크 통과 (HTTP $STATUS)"
  else
    log_error "헬스 체크 실패 (HTTP $STATUS)"
    log_warn "롤백이 필요할 수 있습니다: ./deploy.sh rollback"
    exit 1
  fi

  echo ""
  log_ok "=== 프로덕션 배포 완료 ==="
  log_info "URL: $DEPLOYMENT_URL"
}

# ---- 프리뷰 배포 ----
deploy_preview() {
  log_info "=== 프리뷰 배포를 시작합니다 ==="

  check_prerequisites

  cd "$PROJECT_DIR"

  # 빌드 확인만 (린트/테스트 생략)
  log_info "빌드 검증 중..."
  npm ci --silent

  # Vercel 프리뷰 배포
  log_info "Vercel 프리뷰 배포 중..."
  PREVIEW_URL=$(vercel --yes 2>&1 | tail -1)

  log_ok "프리뷰 배포 완료: $PREVIEW_URL"
}

# ---- 롤백 ----
rollback() {
  log_info "=== 롤백을 시작합니다 ==="

  check_prerequisites

  cd "$PROJECT_DIR"

  # 최근 배포 목록 조회
  log_info "최근 배포 목록을 조회합니다..."
  vercel ls

  echo ""
  log_warn "Vercel 대시보드에서 이전 배포를 프로모트하여 롤백할 수 있습니다."
  log_info "방법 1: Vercel 대시보드 > Deployments > 이전 배포 선택 > Promote to Production"
  log_info "방법 2: vercel promote <deployment-url>"
  echo ""

  read -p "롤백할 배포 URL을 입력하세요 (없으면 Enter): " rollback_url
  if [ -n "$rollback_url" ]; then
    log_info "롤백 중: $rollback_url"
    vercel promote "$rollback_url" --yes
    log_ok "롤백 완료"
  else
    log_info "롤백을 취소합니다."
  fi
}

# ---- 사용법 출력 ----
usage() {
  echo "AILEX 배포 스크립트"
  echo ""
  echo "사용법: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  production  프로덕션 배포 (검증 -> 빌드 -> 배포 -> 헬스체크)"
  echo "  preview     프리뷰 배포 (빌드 -> 배포)"
  echo "  rollback    이전 배포로 롤백"
  echo "  validate    코드 검증만 실행 (린트 + 타입체크 + 테스트)"
  echo ""
  echo "예시:"
  echo "  $0 production     # 프로덕션 배포"
  echo "  $0 preview        # 프리뷰 배포"
  echo "  $0 rollback       # 롤백"
  echo "  $0 validate       # 검증만"
}

# ---- 메인 ----
case "${1:-}" in
  production|prod)
    deploy_production
    ;;
  preview|prev)
    deploy_preview
    ;;
  rollback|rb)
    rollback
    ;;
  validate|check)
    check_prerequisites
    validate_code
    log_ok "코드 검증 완료"
    ;;
  *)
    usage
    ;;
esac
