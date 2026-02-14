/**
 * AI 프롬프트 모듈 단위 테스트
 */

import { describe, it, expect } from "vitest";
import {
  ASSESSMENT_SYSTEM_PROMPT,
  buildAssessmentUserPrompt,
  ASSESSMENT_RESPONSE_SCHEMA,
} from "@/lib/prompts/assessment";
import {
  DOCUMENT_SYSTEM_PROMPTS,
  buildDocumentUserPrompt,
  NOTICE_GENERATOR_SYSTEM_PROMPT,
  NOTICE_RESPONSE_SCHEMA,
} from "@/lib/prompts/documents";

describe("ASSESSMENT_SYSTEM_PROMPT", () => {
  it("AI 기본법 핵심 조문을 포함한다", () => {
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("제27조");
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("제31조");
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("제34조");
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("제35조");
  });

  it("면책 고지를 포함한다", () => {
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("법적 효력이 없습니다");
  });

  it("11개 고영향 AI 영역을 모두 포함한다", () => {
    const domains = [
      "에너지",
      "먹는 물",
      "보건의료",
      "원자력",
      "교통",
      "금융",
      "교육",
      "고용",
      "공공 안전",
      "출입국",
      "사회 보험",
    ];
    for (const domain of domains) {
      expect(ASSESSMENT_SYSTEM_PROMPT).toContain(domain);
    }
  });

  it("confidence 산정 기준을 포함한다", () => {
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("0.9~1.0");
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("0.7~0.89");
    expect(ASSESSMENT_SYSTEM_PROMPT).toContain("0.5~0.69");
  });
});

describe("buildAssessmentUserPrompt", () => {
  it("사용자 입력을 포함한 프롬프트를 생성한다", () => {
    const inputs = {
      service_domain: ["finance", "employment"],
      ai_functionality: "신용평가 자동화",
      decision_type: "automated_decision",
      data_types: ["personal_info", "financial_info"],
      affected_user_count: 100000,
      impact_on_rights: "대출 심사에 영향",
      human_oversight: "인간 검토 있음",
      risk_mitigation: "편향 감지 적용",
      service_description: "금융 서비스 AI",
      deployment_status: "production",
      additional_context: "추가 정보 없음",
    };

    const prompt = buildAssessmentUserPrompt(inputs);

    expect(prompt).toContain("finance, employment");
    expect(prompt).toContain("신용평가 자동화");
    expect(prompt).toContain("100,000");
    expect(prompt).toContain("personal_info, financial_info");
  });

  it("이용자 수가 0이어도 정상 동작한다", () => {
    const inputs = {
      service_domain: ["other"],
      ai_functionality: "테스트 기능 설명입니다",
      decision_type: "information",
      data_types: ["other"],
      affected_user_count: 0,
      impact_on_rights: "미미한 영향",
      human_oversight: "없음",
      risk_mitigation: "",
      service_description: "테스트 서비스",
      deployment_status: "development",
      additional_context: "",
    };

    const prompt = buildAssessmentUserPrompt(inputs);
    expect(prompt).toContain("0");
  });
});

describe("ASSESSMENT_RESPONSE_SCHEMA", () => {
  it("JSON Schema 형식이다", () => {
    expect(ASSESSMENT_RESPONSE_SCHEMA.type).toBe("json_schema");
    expect(ASSESSMENT_RESPONSE_SCHEMA.json_schema.name).toBe("assessment_result");
    expect(ASSESSMENT_RESPONSE_SCHEMA.json_schema.strict).toBe(true);
  });

  it("필수 필드가 모두 정의되어 있다", () => {
    const required = ASSESSMENT_RESPONSE_SCHEMA.json_schema.schema.required;
    expect(required).toContain("result");
    expect(required).toContain("confidence");
    expect(required).toContain("matched_domains");
    expect(required).toContain("legal_basis");
    expect(required).toContain("reasoning");
    expect(required).toContain("obligations");
  });

  it("result 필드에 올바른 enum 값이 정의되어 있다", () => {
    const resultProp = ASSESSMENT_RESPONSE_SCHEMA.json_schema.schema.properties.result;
    expect(resultProp.enum).toEqual(["high_impact", "not_high_impact", "uncertain"]);
  });
});

describe("DOCUMENT_SYSTEM_PROMPTS", () => {
  it("4가지 문서 유형에 대한 프롬프트가 존재한다", () => {
    expect(DOCUMENT_SYSTEM_PROMPTS).toHaveProperty("impact_assessment");
    expect(DOCUMENT_SYSTEM_PROMPTS).toHaveProperty("transparency_report");
    expect(DOCUMENT_SYSTEM_PROMPTS).toHaveProperty("user_notice");
    expect(DOCUMENT_SYSTEM_PROMPTS).toHaveProperty("risk_management_plan");
  });

  it("영향평가서 프롬프트에 제35조 참조가 포함된다", () => {
    expect(DOCUMENT_SYSTEM_PROMPTS.impact_assessment).toContain("제35조");
  });

  it("투명성 보고서 프롬프트에 제31조 참조가 포함된다", () => {
    expect(DOCUMENT_SYSTEM_PROMPTS.transparency_report).toContain("제31조");
  });

  it("위험관리계획서 프롬프트에 제34조 참조가 포함된다", () => {
    expect(DOCUMENT_SYSTEM_PROMPTS.risk_management_plan).toContain("제34조");
  });

  it("모든 프롬프트가 Markdown 형식 출력을 지시한다", () => {
    for (const prompt of Object.values(DOCUMENT_SYSTEM_PROMPTS)) {
      expect(prompt).toContain("Markdown");
    }
  });
});

describe("buildDocumentUserPrompt", () => {
  it("모든 파라미터를 포함한 프롬프트를 생성한다", () => {
    const prompt = buildDocumentUserPrompt({
      doc_type: "impact_assessment",
      system_name: "채용 AI",
      system_description: "이력서 분석",
      domain: "employment",
      ai_type: "classification",
      assessment_result: "high_impact",
      matched_domains: ["고용", "교육"],
      obligations: "[P0] 투명성 고지",
      additional_inputs: { target_users: "20-30대 구직자" },
    });

    expect(prompt).toContain("채용 AI");
    expect(prompt).toContain("이력서 분석");
    expect(prompt).toContain("employment");
    expect(prompt).toContain("고용, 교육");
    expect(prompt).toContain("20-30대 구직자");
    expect(prompt).toContain("면책 고지");
  });

  it("additional_inputs가 없으면 '없음'으로 표시한다", () => {
    const prompt = buildDocumentUserPrompt({
      doc_type: "transparency_report",
      system_name: "테스트",
      system_description: "설명",
      domain: "other",
      ai_type: "other",
      assessment_result: "not_high_impact",
      matched_domains: [],
      obligations: "",
    });

    expect(prompt).toContain("없음");
  });
});

describe("NOTICE_GENERATOR_SYSTEM_PROMPT", () => {
  it("3가지 고지 문구 유형을 설명한다", () => {
    expect(NOTICE_GENERATOR_SYSTEM_PROMPT).toContain("terms_notice");
    expect(NOTICE_GENERATOR_SYSTEM_PROMPT).toContain("popup_notice");
    expect(NOTICE_GENERATOR_SYSTEM_PROMPT).toContain("api_header_notice");
  });

  it("제31조를 참조한다", () => {
    expect(NOTICE_GENERATOR_SYSTEM_PROMPT).toContain("제31조");
  });
});

describe("NOTICE_RESPONSE_SCHEMA", () => {
  it("올바른 JSON Schema 구조를 가진다", () => {
    expect(NOTICE_RESPONSE_SCHEMA.type).toBe("json_schema");
    expect(NOTICE_RESPONSE_SCHEMA.json_schema.name).toBe("notice_result");
    expect(NOTICE_RESPONSE_SCHEMA.json_schema.strict).toBe(true);
  });

  it("4개 필드가 필수이다", () => {
    const required = NOTICE_RESPONSE_SCHEMA.json_schema.schema.required;
    expect(required).toContain("terms_notice");
    expect(required).toContain("popup_notice");
    expect(required).toContain("api_header_notice");
    expect(required).toContain("watermark_guide");
  });
});
