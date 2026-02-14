/**
 * 네비게이션 상수 테스트
 */

import { describe, it, expect } from "vitest";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/constants/navigation";

describe("NAV_ITEMS", () => {
  it("5개의 메인 네비게이션 항목이 있다", () => {
    expect(NAV_ITEMS).toHaveLength(5);
  });

  it("모든 항목에 필수 필드가 있다", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
      expect(item.icon).toBeTruthy();
    }
  });

  it("대시보드가 첫 번째 항목이다", () => {
    expect(NAV_ITEMS[0].label).toBe("대시보드");
    expect(NAV_ITEMS[0].href).toBe("/dashboard");
  });

  it("문서 관리에 pro 플래그가 설정되어 있다", () => {
    const docItem = NAV_ITEMS.find((item) => item.href === "/documents");
    expect(docItem?.pro).toBe(true);
  });
});

describe("BOTTOM_NAV_ITEMS", () => {
  it("1개의 하단 네비게이션 항목이 있다", () => {
    expect(BOTTOM_NAV_ITEMS).toHaveLength(1);
  });

  it("플랜 관리 항목이 있다", () => {
    expect(BOTTOM_NAV_ITEMS[0].label).toBe("플랜 관리");
    expect(BOTTOM_NAV_ITEMS[0].href).toBe("/pricing");
  });
});
