/**
 * 데이터베이스 타입 및 상수 단위 테스트
 */

import { describe, it, expect } from "vitest";
import {
  PLAN_LIMITS,
  DOC_TYPE_LABELS,
  DOMAIN_LABELS,
  AI_TYPE_LABELS,
  DATA_TYPE_LABELS,
} from "@/types/database";

describe("PLAN_LIMITS", () => {
  it("free 플랜에 올바른 제한이 설정되어 있다", () => {
    expect(PLAN_LIMITS.free).toEqual({
      max_systems: 1,
      max_assessments_per_month: 1,
      can_generate_documents: false,
      can_view_dashboard: false,
      can_download_files: false,
    });
  });

  it("pro 플랜에 올바른 제한이 설정되어 있다", () => {
    expect(PLAN_LIMITS.pro).toEqual({
      max_systems: 3,
      max_assessments_per_month: 20,
      can_generate_documents: true,
      can_view_dashboard: true,
      can_download_files: true,
    });
  });

  it("enterprise 플랜에 올바른 제한이 설정되어 있다", () => {
    expect(PLAN_LIMITS.enterprise.max_systems).toBe(999);
    expect(PLAN_LIMITS.enterprise.can_generate_documents).toBe(true);
    expect(PLAN_LIMITS.enterprise.can_view_dashboard).toBe(true);
    expect(PLAN_LIMITS.enterprise.can_download_files).toBe(true);
  });

  it("free 플랜은 문서 생성이 불가능하다", () => {
    expect(PLAN_LIMITS.free.can_generate_documents).toBe(false);
  });

  it("pro 이상 플랜은 문서 생성이 가능하다", () => {
    expect(PLAN_LIMITS.pro.can_generate_documents).toBe(true);
    expect(PLAN_LIMITS.enterprise.can_generate_documents).toBe(true);
  });
});

describe("DOC_TYPE_LABELS", () => {
  it("4가지 문서 유형 라벨이 모두 존재한다", () => {
    expect(Object.keys(DOC_TYPE_LABELS)).toHaveLength(4);
    expect(DOC_TYPE_LABELS.impact_assessment).toBe("AI 영향평가서");
    expect(DOC_TYPE_LABELS.transparency_report).toBe("투명성 보고서");
    expect(DOC_TYPE_LABELS.user_notice).toBe("이용자 고지 문구");
    expect(DOC_TYPE_LABELS.risk_management_plan).toBe("위험관리계획서");
  });

  it("모든 라벨이 한국어이다", () => {
    for (const label of Object.values(DOC_TYPE_LABELS)) {
      expect(label).toMatch(/[가-힣]/);
    }
  });
});

describe("DOMAIN_LABELS", () => {
  it("12개 영역이 모두 정의되어 있다 (11개 + 기타)", () => {
    expect(Object.keys(DOMAIN_LABELS)).toHaveLength(12);
  });

  it("고영향 AI 11개 영역이 모두 포함되어 있다", () => {
    const requiredDomains = [
      "energy",
      "water",
      "healthcare",
      "nuclear",
      "transportation",
      "finance",
      "education",
      "employment",
      "public_safety",
      "immigration",
      "social_insurance",
    ];
    for (const domain of requiredDomains) {
      expect(DOMAIN_LABELS).toHaveProperty(domain);
    }
  });
});

describe("AI_TYPE_LABELS", () => {
  it("6가지 AI 유형이 정의되어 있다", () => {
    expect(Object.keys(AI_TYPE_LABELS)).toHaveLength(6);
  });

  it("모든 라벨이 한국어이다", () => {
    for (const label of Object.values(AI_TYPE_LABELS)) {
      expect(label).toMatch(/[가-힣]/);
    }
  });
});

describe("DATA_TYPE_LABELS", () => {
  it("9가지 데이터 유형이 정의되어 있다", () => {
    expect(Object.keys(DATA_TYPE_LABELS)).toHaveLength(9);
  });

  it("개인정보와 생체정보가 포함되어 있다", () => {
    expect(DATA_TYPE_LABELS.personal_info).toBe("개인정보");
    expect(DATA_TYPE_LABELS.biometric).toBe("생체정보");
  });
});
