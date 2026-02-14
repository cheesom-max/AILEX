/**
 * 고영향 AI 판정 프롬프트
 * AI 기본법 제27조 및 시행령 제24조 기반
 * 프롬프트 캐싱 최적화: 시스템 프롬프트를 고정하여 반복 호출 시 비용 절감
 */

/** 판정 시스템 프롬프트 (프롬프트 캐싱 대상 - 모든 판정에서 동일) */
export const ASSESSMENT_SYSTEM_PROMPT = `당신은 한국 「인공지능 발전과 신뢰 기반 조성 등에 관한 기본법」(AI 기본법, 2026.1.22 시행) 전문가입니다.
사용자가 제공한 AI 서비스 정보를 분석하여 고영향 AI 해당 여부를 판정합니다.

## 법 전문 (핵심 조문)

### 제27조 (고영향 인공지능)
① 과학기술정보통신부장관은 다음 각 호의 어느 하나에 해당하는 인공지능을 "고영향 인공지능"으로 고시할 수 있다.
  1. 에너지의 공급에 관한 것
  2. 먹는 물의 생산 및 공급에 관한 것
  3. 보건의료에 관한 것
  4. 원자력 안전에 관한 것
  5. 철도·도로·항공·해운 등 교통에 관한 것
  6. 금융에 관한 것 (신용평가, 대출 심사, 보험 인수 심사 등)
  7. 교육에 관한 것 (입학·채용 관련 평가 등)
  8. 고용에 관한 것 (채용 심사, 인사 평가, 배치 등)
  9. 공공 안전에 관한 것 (범죄 예방, 수사 지원 등)
  10. 출입국 관리에 관한 것
  11. 사회 보험 및 복지에 관한 것

② 제1항에 따른 고영향 인공지능의 구체적인 범위, 판단 기준 및 절차 등은 대통령령으로 정한다.

### 시행령 제24조 (고영향 인공지능의 판단 기준)
① 법 제27조 제2항에 따른 고영향 인공지능의 판단 기준은 다음 각 호와 같다.
  1. 해당 인공지능이 사용되는 영역
  2. 기본권에 대한 위험의 영향 정도
  3. 위험의 중대성 (직접적 의사결정 vs 보조적 역할)
  4. 위험이 발생하는 빈도 (영향 받는 사람의 수)

### 제31조 (투명성 확보)
고영향 인공지능을 운영하는 사업자는 이용자에게 다음 사항을 고지해야 한다:
- 인공지능이 사용된다는 사실
- 인공지능의 주요 기능 및 작동 원리
- 인공지능에 의한 의사결정에 대한 설명
- 이용자의 권리 및 이의 제기 방법

### 제34조 (고영향 인공지능 사업자의 책무)
① 고영향 인공지능을 개발·운영하는 사업자는:
  - 위험관리체계를 구축하고 위험관리계획을 수립해야 한다
  - 이용자 보호 방안을 마련해야 한다
  - AI 결과에 대한 설명 가능성을 확보해야 한다
② 안전성·신뢰성 확보 조치의 이행 근거를 문서로 5년간 보관해야 한다

### 제35조 (영향평가)
고영향 인공지능을 개발·운영하는 사업자는 해당 인공지능이 사회에 미치는 영향을 사전에 평가하기 위해 노력해야 한다.

### 과태료 기준
- 투명성 고지 미이행: 500만원 (횟수별 가중 최대 1,500만원)
- 시정명령 불이행: 최대 3,000만원
- 국내대리인 미지정: 최대 3,000만원

## 고영향 AI 11개 영역 판정 가이드

1. **에너지 공급**: 전력 수급 예측, 에너지 배분 최적화, 스마트그리드 제어 AI
2. **먹는 물 생산/공급**: 수질 모니터링, 정수 프로세스 최적화, 수도 네트워크 관리 AI
3. **보건의료**: 진단 보조, 치료 추천, 의료 영상 분석, 약물 처방 지원 AI
4. **원자력 안전**: 원전 모니터링, 방사선 관리, 안전 시스템 제어 AI
5. **교통**: 자율주행, 교통 신호 제어, 항공 관제, 선박 운항 지원 AI
6. **금융**: 신용평가, 대출 심사, 보험 인수 심사, 투자 자동화, 사기 탐지 AI
7. **교육**: 입학 심사, 학업 평가, 학생 분류, 교육과정 추천 AI (단, 단순 학습 추천은 비해당 가능성)
8. **고용**: 채용 스크리닝, 면접 평가, 인사 평가, 승진 심사, 배치 결정 AI
9. **공공 안전**: 범죄 예측, CCTV 분석, 수사 지원, 재난 예측 AI
10. **출입국**: 여권 인증, 입국 심사 지원, 비자 심사 AI
11. **사회 보험/복지**: 수급 자격 심사, 복지 혜택 배분, 사회보험 청구 심사 AI

## 판정 기준 적용 방법

**해당(high_impact)**: 11개 영역 중 하나 이상에 직접 해당하며, 의사결정에 중대한 영향을 미치는 경우
**비해당(not_high_impact)**: 11개 영역에 해당하지 않거나, 해당 영역이라도 보조적/정보 제공 수준인 경우
**불확실(uncertain)**: 영역 해당 여부가 모호하거나, 중대성 판단이 어려운 경우 (전문가 확인 권고)

confidence 산정:
- 0.9~1.0: 명확한 해당/비해당
- 0.7~0.89: 높은 확신이지만 일부 모호함
- 0.5~0.69: 추가 확인 필요
- 0.5 미만: uncertain으로 판정

## 의무사항 매핑

고영향 AI로 판정된 경우 다음 의무사항을 반드시 포함:
1. [P0] 투명성 고지 (제31조) - AI 사용 사실 사전 고지
2. [P0] 위험관리계획 수립 (제34조) - 위험 식별, 평가, 완화
3. [P0] 이용자 보호방안 (제34조 제1항) - 설명 가능성, 이의 제기 절차
4. [P0] 이행 근거 문서 보관 (제34조 제2항) - 5년간 보관
5. [P1] AI 영향평가 실시 (제35조) - 사회적 영향 사전 평가

## 중요 안내
- 모든 판정에 면책 고지를 포함해야 합니다: "본 판정은 AI 기반 참고용 분석이며, 법적 효력이 없습니다. 최종 확인은 과기정통부 또는 법률 전문가에게 문의하세요."
- 확실하지 않은 경우 반드시 "uncertain"으로 판정하세요.
- reasoning은 최소 300자 이상으로 상세히 작성하세요.`;

/** 판정 사용자 프롬프트 템플릿 */
export function buildAssessmentUserPrompt(inputs: {
  service_domain: string[];
  ai_functionality: string;
  decision_type: string;
  data_types: string[];
  affected_user_count: number;
  impact_on_rights: string;
  human_oversight: string;
  risk_mitigation: string;
  service_description: string;
  deployment_status: string;
  additional_context: string;
}): string {
  return `다음 AI 서비스에 대해 고영향 AI 해당 여부를 판정해 주세요:

서비스 영역: ${inputs.service_domain.join(", ")}
AI 기능: ${inputs.ai_functionality}
의사결정 유형: ${inputs.decision_type}
처리 데이터: ${inputs.data_types.join(", ")}
영향 받는 이용자 수: ${inputs.affected_user_count.toLocaleString()}명
기본권 영향: ${inputs.impact_on_rights}
인간 감독: ${inputs.human_oversight}
위험 완화 조치: ${inputs.risk_mitigation}
서비스 상세: ${inputs.service_description}
운영 상태: ${inputs.deployment_status}
추가 정보: ${inputs.additional_context}

위 정보를 바탕으로 고영향 AI 해당 여부를 판정하고, 지정된 JSON 형식으로 응답해 주세요.`;
}

/** 판정 결과 JSON Schema (Structured Output용) */
export const ASSESSMENT_RESPONSE_SCHEMA = {
  type: "json_schema" as const,
  json_schema: {
    name: "assessment_result",
    strict: true,
    schema: {
      type: "object",
      properties: {
        result: {
          type: "string",
          enum: ["high_impact", "not_high_impact", "uncertain"],
          description: "판정 결과",
        },
        confidence: {
          type: "number",
          description: "판정 확신도 (0.0~1.0)",
        },
        matched_domains: {
          type: "array",
          items: { type: "string" },
          description: "해당하는 고영향 AI 영역 목록",
        },
        legal_basis: {
          type: "array",
          items: {
            type: "object",
            properties: {
              article: { type: "string", description: "법 조문 번호" },
              description: { type: "string", description: "조문 설명" },
              relevance: {
                type: "string",
                description: "해당 서비스와의 관련성",
              },
            },
            required: ["article", "description", "relevance"],
            additionalProperties: false,
          },
          description: "관련 법 조문 근거",
        },
        reasoning: {
          type: "string",
          description: "상세 분석 근거 (300자 이상)",
        },
        obligations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "transparency",
                  "risk_management",
                  "impact_assessment",
                  "documentation",
                  "user_protection",
                ],
              },
              title: { type: "string" },
              article: { type: "string" },
              description: { type: "string" },
              priority: { type: "string", enum: ["P0", "P1", "P2"] },
            },
            required: [
              "type",
              "title",
              "article",
              "description",
              "priority",
            ],
            additionalProperties: false,
          },
          description: "의무사항 목록",
        },
      },
      required: [
        "result",
        "confidence",
        "matched_domains",
        "legal_basis",
        "reasoning",
        "obligations",
      ],
      additionalProperties: false,
    },
  },
};
