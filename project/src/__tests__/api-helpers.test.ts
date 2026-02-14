/**
 * API 헬퍼 함수 단위 테스트
 */

import { describe, it, expect } from "vitest";
import { errorResponse, successResponse } from "@/lib/api-helpers";

describe("errorResponse", () => {
  it("에러 메시지와 400 상태 코드를 반환한다", async () => {
    const response = errorResponse("잘못된 요청입니다");
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("잘못된 요청입니다");
  });

  it("커스텀 상태 코드를 지원한다", async () => {
    const response = errorResponse("인증 실패", 401);
    expect(response.status).toBe(401);

    const body = await response.json();
    expect(body.error).toBe("인증 실패");
  });

  it("500 서버 에러를 반환할 수 있다", async () => {
    const response = errorResponse("서버 오류", 500);
    expect(response.status).toBe(500);
  });

  it("403 권한 에러를 반환할 수 있다", async () => {
    const response = errorResponse("접근 권한이 없습니다", 403);
    expect(response.status).toBe(403);
  });
});

describe("successResponse", () => {
  it("데이터와 200 상태 코드를 반환한다", async () => {
    const data = { message: "성공", id: "test-id" };
    const response = successResponse(data);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.message).toBe("성공");
    expect(body.id).toBe("test-id");
  });

  it("커스텀 상태 코드를 지원한다", async () => {
    const response = successResponse({ id: "new-id" }, 201);
    expect(response.status).toBe(201);
  });

  it("배열 데이터를 반환할 수 있다", async () => {
    const data = [{ id: "1" }, { id: "2" }];
    const response = successResponse(data);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveLength(2);
  });

  it("빈 객체를 반환할 수 있다", async () => {
    const response = successResponse({});
    expect(response.status).toBe(200);
  });
});
