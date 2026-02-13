/**
 * 인메모리 Rate Limiter
 * OpenAI API 호출 엔드포인트의 비용 급증 방지
 * 프로덕션 환경에서는 Upstash Redis 기반으로 교체 권장
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 사용자별 요청 카운트 저장
const rateLimitStore = new Map<string, RateLimitEntry>();

// 만료된 항목 주기적 정리 (메모리 누수 방지)
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** 윈도우당 최대 허용 요청 수 */
  maxRequests: number;
  /** 윈도우 크기 (밀리초) */
  windowMs: number;
}

/** Rate Limit 기본 설정 */
export const RATE_LIMIT_CONFIGS = {
  /** 판정 API: 분당 5회 */
  assessment: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** 문서 생성 API: 분당 5회 */
  documentGenerate: { maxRequests: 5, windowMs: 60_000 } as RateLimitConfig,
  /** 문서 수정 API: 분당 10회 */
  documentEdit: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
  /** 고지 문구 생성: 분당 10회 */
  noticeGenerator: { maxRequests: 10, windowMs: 60_000 } as RateLimitConfig,
} as const;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Rate Limit 체크
 * @param identifier - 사용자 식별자 (userId 또는 IP)
 * @param endpoint - 엔드포인트 식별자 (설정 키 구분용)
 * @param config - Rate Limit 설정
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanupExpiredEntries();

  const key = `${endpoint}:${identifier}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // 기존 항목이 없거나 윈도우가 만료된 경우
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // 제한 초과
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // 카운트 증가
  entry.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}
