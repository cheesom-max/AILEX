/**
 * 유틸리티 함수 단위 테스트
 */

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (클래스명 병합 유틸)", () => {
  it("단일 클래스명을 반환한다", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("여러 클래스명을 병합한다", () => {
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("text-sm");
  });

  it("Tailwind 충돌 클래스를 올바르게 병합한다", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("조건부 클래스를 지원한다", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toContain("active-class");
  });

  it("falsy 값을 무시한다", () => {
    const result = cn("base", false, null, undefined, "end");
    expect(result).toBe("base end");
  });

  it("빈 인자로 호출하면 빈 문자열을 반환한다", () => {
    expect(cn()).toBe("");
  });
});
