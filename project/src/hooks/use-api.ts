/**
 * API 호출 유틸리티 훅
 * 공통 fetch 래퍼 + 에러 핸들링
 */

"use client";

import { useState, useCallback } from "react";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** 범용 API 호출 훅 */
export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      setState({ data: null, error: null, loading: true });

      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options?.headers,
          },
          ...options,
        });

        const json = await response.json();

        if (!response.ok) {
          const errorMessage = json.error || "요청에 실패했습니다";
          setState({ data: null, error: errorMessage, loading: false });
          return null;
        }

        setState({ data: json, error: null, loading: false });
        return json;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "네트워크 오류가 발생했습니다";
        setState({ data: null, error: message, loading: false });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return { ...state, execute, reset };
}

/** GET 요청 전용 훅 */
export function useFetch<T>(url: string) {
  const { data, error, loading, execute } = useApi<T>();

  const fetch = useCallback(async () => {
    return execute(url);
  }, [url, execute]);

  return { data, error, loading, fetch };
}

/** POST 요청 전용 훅 */
export function usePost<T, B = Record<string, unknown>>() {
  const { data, error, loading, execute, reset } = useApi<T>();

  const post = useCallback(
    async (url: string, body: B) => {
      return execute(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    [execute]
  );

  return { data, error, loading, post, reset };
}
