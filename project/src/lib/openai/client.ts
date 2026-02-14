/**
 * OpenAI API 클라이언트 설정
 * GPT-4o (판정/문서 생성)와 GPT-4o-mini (고지 문구) 사용
 */

import OpenAI from "openai";

// 싱글톤 OpenAI 클라이언트 인스턴스
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY 환경변수가 설정되지 않았습니다. .env.local 파일을 확인하세요."
      );
    }
    openaiClient = new OpenAI({
      apiKey,
      timeout: API_TIMEOUT,
      maxRetries: MAX_RETRIES,
    });
  }
  return openaiClient;
}

/** 사용 모델 상수 */
export const MODELS = {
  /** 판정 및 문서 생성용 (고성능) */
  GPT4O: "gpt-4o" as const,
  /** 고지 문구 등 경량 작업용 (비용 절감) */
  GPT4O_MINI: "gpt-4o-mini" as const,
};

/** API 호출 타임아웃 (밀리초) */
export const API_TIMEOUT = 60_000;

/** 최대 재시도 횟수 */
export const MAX_RETRIES = 2;

/**
 * OpenAI API 에러를 사용자 친화적 한국어 메시지로 변환
 */
export function getOpenAIErrorMessage(error: unknown): string {
  if (error instanceof OpenAI.APIError) {
    switch (error.status) {
      case 401:
        return "AI 서비스 인증에 실패했습니다. 관리자에게 문의하세요.";
      case 429:
        return "AI 서비스 요청이 일시적으로 제한되었습니다. 잠시 후 다시 시도해 주세요.";
      case 500:
      case 502:
      case 503:
        return "AI 서비스가 일시적으로 불안정합니다. 잠시 후 다시 시도해 주세요.";
      default:
        return "AI 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    }
  }

  if (error instanceof OpenAI.APIConnectionError) {
    return "AI 서비스에 연결할 수 없습니다. 네트워크 상태를 확인하고 잠시 후 다시 시도해 주세요.";
  }

  if (error instanceof OpenAI.RateLimitError) {
    return "AI 서비스 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.";
  }

  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return "AI 서비스 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
  }

  // 토큰 초과 등의 에러 메시지 감지
  if (error instanceof Error) {
    if (error.message.includes("maximum context length")) {
      return "입력 데이터가 AI 처리 한도를 초과했습니다. 내용을 줄여서 다시 시도해 주세요.";
    }
    if (error.message.includes("timeout")) {
      return "AI 서비스 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.";
    }
  }

  return "AI 처리 중 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
}
