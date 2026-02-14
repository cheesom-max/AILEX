/**
 * OpenAI 클라이언트 설정 및 에러 핸들링 테스트
 */

import { describe, it, expect } from "vitest";
import { MODELS, API_TIMEOUT, MAX_RETRIES, getOpenAIErrorMessage } from "@/lib/openai/client";

describe("OpenAI 모델 상수", () => {
  it("GPT4O 모델이 정의되어 있다", () => {
    expect(MODELS.GPT4O).toBe("gpt-4o");
  });

  it("GPT4O_MINI 모델이 정의되어 있다", () => {
    expect(MODELS.GPT4O_MINI).toBe("gpt-4o-mini");
  });
});

describe("API 설정 상수", () => {
  it("타임아웃이 60초로 설정되어 있다", () => {
    expect(API_TIMEOUT).toBe(60_000);
  });

  it("최대 재시도 횟수가 2회로 설정되어 있다", () => {
    expect(MAX_RETRIES).toBe(2);
  });
});

describe("getOpenAIErrorMessage", () => {
  it("일반 Error에 대해 기본 메시지를 반환한다", () => {
    const message = getOpenAIErrorMessage(new Error("unknown error"));
    expect(message).toContain("예기치 않은 오류");
  });

  it("타임아웃 관련 Error를 감지한다", () => {
    const message = getOpenAIErrorMessage(new Error("request timeout"));
    expect(message).toContain("응답 시간이 초과");
  });

  it("토큰 초과 에러를 감지한다", () => {
    const message = getOpenAIErrorMessage(
      new Error("This model's maximum context length is 8192 tokens")
    );
    expect(message).toContain("처리 한도를 초과");
  });

  it("알 수 없는 에러 타입에도 한국어 메시지를 반환한다", () => {
    const message = getOpenAIErrorMessage("string error");
    expect(message).toContain("예기치 않은 오류");
  });

  it("null/undefined에도 안전하게 대응한다", () => {
    const message1 = getOpenAIErrorMessage(null);
    expect(message1).toContain("예기치 않은 오류");

    const message2 = getOpenAIErrorMessage(undefined);
    expect(message2).toContain("예기치 않은 오류");
  });
});
