/**
 * Zod 유효성 검증 스키마 단위 테스트
 */

import { describe, it, expect } from "vitest";
import {
  aiSystemSchema,
  questionnaireSchema,
  createAssessmentSchema,
  generateDocumentSchema,
  updateChecklistSchema,
  noticeGeneratorSchema,
  updateProfileSchema,
} from "@/lib/validators";

describe("aiSystemSchema", () => {
  const validData = {
    name: "채용 AI 시스템",
    description: "이력서 분석 AI",
    domain: "employment",
    ai_type: "classification" as const,
    data_types: ["personal_info", "employment_history"],
    user_count: 5000,
    decision_impact: "automated_decision" as const,
    status: "production" as const,
  };

  it("유효한 데이터를 통과시킨다", () => {
    const result = aiSystemSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("이름이 2자 미만이면 실패한다", () => {
    const result = aiSystemSchema.safeParse({ ...validData, name: "A" });
    expect(result.success).toBe(false);
  });

  it("이름이 100자를 초과하면 실패한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      name: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("domain이 빈 문자열이면 실패한다", () => {
    const result = aiSystemSchema.safeParse({ ...validData, domain: "" });
    expect(result.success).toBe(false);
  });

  it("유효하지 않은 ai_type이면 실패한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      ai_type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("data_types가 비어있으면 실패한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      data_types: [],
    });
    expect(result.success).toBe(false);
  });

  it("description이 없으면 기본값 빈 문자열로 설정된다", () => {
    const { description, ...rest } = validData;
    const result = aiSystemSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe("");
    }
  });

  it("user_count가 null이면 허용한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      user_count: null,
    });
    expect(result.success).toBe(true);
  });

  it("유효하지 않은 decision_impact이면 실패한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      decision_impact: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("유효하지 않은 status이면 실패한다", () => {
    const result = aiSystemSchema.safeParse({
      ...validData,
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });
});

describe("questionnaireSchema", () => {
  const validData = {
    service_domain: ["employment", "education"],
    ai_functionality: "이력서를 분석하여 직무 적합도를 점수화합니다",
    decision_type: "automated_decision" as const,
    data_types: ["personal_info"],
    affected_user_count: 50000,
    impact_on_rights: "채용 합격/불합격에 직접 영향을 미침",
    human_oversight: "최종 결정은 인사담당자가 검토",
    risk_mitigation: "",
    service_description: "AI가 이력서를 분석하여 직무 적합도를 점수화하는 서비스입니다",
    deployment_status: "production",
    additional_context: "",
  };

  it("유효한 데이터를 통과시킨다", () => {
    const result = questionnaireSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("service_domain이 비어있으면 실패한다", () => {
    const result = questionnaireSchema.safeParse({
      ...validData,
      service_domain: [],
    });
    expect(result.success).toBe(false);
  });

  it("ai_functionality가 10자 미만이면 실패한다", () => {
    const result = questionnaireSchema.safeParse({
      ...validData,
      ai_functionality: "짧은설명",
    });
    expect(result.success).toBe(false);
  });

  it("service_description이 20자 미만이면 실패한다", () => {
    const result = questionnaireSchema.safeParse({
      ...validData,
      service_description: "짧은 설명입니다",
    });
    expect(result.success).toBe(false);
  });

  it("affected_user_count가 음수이면 실패한다", () => {
    const result = questionnaireSchema.safeParse({
      ...validData,
      affected_user_count: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("createAssessmentSchema", () => {
  it("유효한 UUID 형식의 ai_system_id를 통과시킨다", () => {
    const result = createAssessmentSchema.safeParse({
      ai_system_id: "550e8400-e29b-41d4-a716-446655440000",
      questionnaire: {
        service_domain: ["finance"],
        ai_functionality: "신용평가 자동화 시스템입니다",
        decision_type: "automated_decision",
        data_types: ["financial_info"],
        affected_user_count: 100000,
        impact_on_rights: "대출 심사에 직접적 영향",
        human_oversight: "인간 감독 있음",
        risk_mitigation: "",
        service_description: "금융 서비스의 신용평가를 자동화하는 AI 시스템입니다",
        deployment_status: "production",
        additional_context: "",
      },
    });
    expect(result.success).toBe(true);
  });

  it("UUID 형식이 아닌 ai_system_id는 실패한다", () => {
    const result = createAssessmentSchema.safeParse({
      ai_system_id: "not-a-uuid",
      questionnaire: {
        service_domain: ["finance"],
        ai_functionality: "신용평가 자동화 시스템입니다",
        decision_type: "automated_decision",
        data_types: ["financial_info"],
        affected_user_count: 100000,
        impact_on_rights: "대출 심사에 직접적 영향",
        human_oversight: "인간 감독 있음",
        risk_mitigation: "",
        service_description: "금융 서비스의 신용평가를 자동화하는 AI 시스템입니다",
        deployment_status: "production",
        additional_context: "",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("generateDocumentSchema", () => {
  it("유효한 문서 유형을 통과시킨다", () => {
    const result = generateDocumentSchema.safeParse({
      ai_system_id: "550e8400-e29b-41d4-a716-446655440000",
      assessment_id: "660e8400-e29b-41d4-a716-446655440000",
      doc_type: "impact_assessment",
    });
    expect(result.success).toBe(true);
  });

  it("유효하지 않은 문서 유형은 실패한다", () => {
    const result = generateDocumentSchema.safeParse({
      ai_system_id: "550e8400-e29b-41d4-a716-446655440000",
      assessment_id: "660e8400-e29b-41d4-a716-446655440000",
      doc_type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("모든 4가지 문서 유형을 허용한다", () => {
    const docTypes = [
      "impact_assessment",
      "transparency_report",
      "user_notice",
      "risk_management_plan",
    ];
    for (const docType of docTypes) {
      const result = generateDocumentSchema.safeParse({
        ai_system_id: "550e8400-e29b-41d4-a716-446655440000",
        assessment_id: "660e8400-e29b-41d4-a716-446655440000",
        doc_type: docType,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("updateChecklistSchema", () => {
  it("유효한 상태값을 통과시킨다", () => {
    const statuses = ["not_started", "in_progress", "completed"];
    for (const status of statuses) {
      const result = updateChecklistSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("유효하지 않은 상태값은 실패한다", () => {
    const result = updateChecklistSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });
});

describe("noticeGeneratorSchema", () => {
  it("유효한 데이터를 통과시킨다", () => {
    const result = noticeGeneratorSchema.safeParse({
      service_type: "website",
      ai_usage_type: "추천 시스템",
      service_name: "AI 추천 서비스",
      ai_description: "사용자 행동 데이터를 기반으로 콘텐츠를 추천하는 AI 시스템입니다",
      uses_generative_ai: false,
    });
    expect(result.success).toBe(true);
  });

  it("유효하지 않은 service_type은 실패한다", () => {
    const result = noticeGeneratorSchema.safeParse({
      service_type: "desktop_app",
      ai_usage_type: "추천",
      service_name: "서비스",
      ai_description: "AI 기능 설명이 들어가는 곳입니다",
      uses_generative_ai: false,
    });
    expect(result.success).toBe(false);
  });

  it("ai_description이 10자 미만이면 실패한다", () => {
    const result = noticeGeneratorSchema.safeParse({
      service_type: "website",
      ai_usage_type: "추천",
      service_name: "서비스",
      ai_description: "짧은설명",
      uses_generative_ai: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateProfileSchema", () => {
  it("이름만 수정할 수 있다", () => {
    const result = updateProfileSchema.safeParse({ name: "홍길동" });
    expect(result.success).toBe(true);
  });

  it("회사명만 수정할 수 있다", () => {
    const result = updateProfileSchema.safeParse({ company_name: "AI테크" });
    expect(result.success).toBe(true);
  });

  it("빈 객체도 통과한다", () => {
    const result = updateProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("이름이 50자를 초과하면 실패한다", () => {
    const result = updateProfileSchema.safeParse({ name: "가".repeat(51) });
    expect(result.success).toBe(false);
  });

  it("회사명이 100자를 초과하면 실패한다", () => {
    const result = updateProfileSchema.safeParse({
      company_name: "가".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});
