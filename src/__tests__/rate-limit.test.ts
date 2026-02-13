/**
 * Rate Limiter 단위 테스트
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  RATE_LIMIT_CONFIGS,
  type RateLimitConfig,
} from "@/lib/rate-limit";

// 테스트용 설정: 윈도우당 3회 허용
const testConfig: RateLimitConfig = {
  maxRequests: 3,
  windowMs: 60_000,
};

describe("checkRateLimit", () => {
  // 각 테스트에서 고유 식별자 사용하여 격리
  let uniqueId: string;

  beforeEach(() => {
    uniqueId = `test-user-${Date.now()}-${Math.random()}`;
  });

  it("첫 번째 요청은 허용된다", () => {
    const result = checkRateLimit(uniqueId, "test-endpoint", testConfig);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it("제한 내 요청은 모두 허용된다", () => {
    checkRateLimit(uniqueId, "test-endpoint-2", testConfig);
    checkRateLimit(uniqueId, "test-endpoint-2", testConfig);
    const result = checkRateLimit(uniqueId, "test-endpoint-2", testConfig);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("제한 초과 시 요청이 거부된다", () => {
    checkRateLimit(uniqueId, "test-endpoint-3", testConfig);
    checkRateLimit(uniqueId, "test-endpoint-3", testConfig);
    checkRateLimit(uniqueId, "test-endpoint-3", testConfig);
    const result = checkRateLimit(uniqueId, "test-endpoint-3", testConfig);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("다른 사용자는 별도로 제한된다", () => {
    const user1 = `user1-${Date.now()}`;
    const user2 = `user2-${Date.now()}`;

    checkRateLimit(user1, "test-endpoint-4", testConfig);
    checkRateLimit(user1, "test-endpoint-4", testConfig);
    checkRateLimit(user1, "test-endpoint-4", testConfig);

    // user1 제한 초과
    const result1 = checkRateLimit(user1, "test-endpoint-4", testConfig);
    expect(result1.allowed).toBe(false);

    // user2는 아직 여유 있음
    const result2 = checkRateLimit(user2, "test-endpoint-4", testConfig);
    expect(result2.allowed).toBe(true);
  });

  it("다른 엔드포인트는 별도로 제한된다", () => {
    checkRateLimit(uniqueId, "endpoint-a", testConfig);
    checkRateLimit(uniqueId, "endpoint-a", testConfig);
    checkRateLimit(uniqueId, "endpoint-a", testConfig);

    // endpoint-a 제한 초과
    const resultA = checkRateLimit(uniqueId, "endpoint-a", testConfig);
    expect(resultA.allowed).toBe(false);

    // endpoint-b는 아직 여유 있음
    const resultB = checkRateLimit(uniqueId, "endpoint-b", testConfig);
    expect(resultB.allowed).toBe(true);
  });

  it("resetAt이 미래 시간을 반환한다", () => {
    const result = checkRateLimit(uniqueId, "test-reset", testConfig);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });
});

describe("RATE_LIMIT_CONFIGS", () => {
  it("assessment 설정이 정의되어 있다", () => {
    expect(RATE_LIMIT_CONFIGS.assessment.maxRequests).toBe(5);
    expect(RATE_LIMIT_CONFIGS.assessment.windowMs).toBe(60_000);
  });

  it("documentGenerate 설정이 정의되어 있다", () => {
    expect(RATE_LIMIT_CONFIGS.documentGenerate.maxRequests).toBe(5);
    expect(RATE_LIMIT_CONFIGS.documentGenerate.windowMs).toBe(60_000);
  });

  it("noticeGenerator 설정이 정의되어 있다", () => {
    expect(RATE_LIMIT_CONFIGS.noticeGenerator.maxRequests).toBe(10);
    expect(RATE_LIMIT_CONFIGS.noticeGenerator.windowMs).toBe(60_000);
  });

  it("documentEdit 설정이 정의되어 있다", () => {
    expect(RATE_LIMIT_CONFIGS.documentEdit.maxRequests).toBe(10);
    expect(RATE_LIMIT_CONFIGS.documentEdit.windowMs).toBe(60_000);
  });
});
