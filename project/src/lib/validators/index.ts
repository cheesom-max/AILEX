/**
 * Zod 기반 요청 데이터 유효성 검증 스키마
 */

import { z } from "zod";

/** AI 시스템 생성/수정 스키마 */
export const aiSystemSchema = z.object({
  name: z
    .string()
    .min(2, "시스템 이름은 2자 이상이어야 합니다")
    .max(100, "시스템 이름은 100자 이하여야 합니다"),
  description: z
    .string()
    .max(2000, "설명은 2000자 이하여야 합니다")
    .optional()
    .default(""),
  domain: z.string().min(1, "사용 영역을 선택해 주세요"),
  ai_type: z.enum([
    "generative",
    "predictive",
    "classification",
    "recommendation",
    "detection",
    "other",
  ]),
  data_types: z
    .array(z.string())
    .min(1, "처리하는 데이터 유형을 하나 이상 선택해 주세요"),
  user_count: z.number().int().min(0).optional().nullable(),
  decision_impact: z.enum(["information", "recommendation", "automated_decision"]),
  status: z.enum(["development", "production", "suspended"]),
});

/** 판정 설문 스키마 */
export const questionnaireSchema = z.object({
  service_domain: z
    .array(z.string())
    .min(1, "서비스 영역을 하나 이상 선택해 주세요"),
  ai_functionality: z
    .string()
    .min(10, "AI 기능을 10자 이상으로 설명해 주세요")
    .max(1000),
  decision_type: z.enum(["information", "recommendation", "automated_decision"]),
  data_types: z
    .array(z.string())
    .min(1, "데이터 유형을 하나 이상 선택해 주세요"),
  affected_user_count: z
    .number()
    .int()
    .min(0, "이용자 수는 0 이상이어야 합니다"),
  impact_on_rights: z.string().min(5, "기본권 영향을 5자 이상 설명해 주세요"),
  human_oversight: z.string().min(5, "인간 감독 현황을 5자 이상 설명해 주세요"),
  risk_mitigation: z.string().default(""),
  service_description: z
    .string()
    .min(20, "서비스 설명을 20자 이상으로 작성해 주세요")
    .max(2000),
  deployment_status: z.string().default("production"),
  additional_context: z.string().default(""),
});

/** 판정 생성 요청 스키마 */
export const createAssessmentSchema = z.object({
  ai_system_id: z.string().uuid(),
  questionnaire: questionnaireSchema,
});

/** 문서 생성 요청 스키마 */
export const generateDocumentSchema = z.object({
  ai_system_id: z.string().uuid(),
  assessment_id: z.string().uuid(),
  doc_type: z.enum([
    "impact_assessment",
    "transparency_report",
    "user_notice",
    "risk_management_plan",
  ]),
  additional_inputs: z.record(z.string(), z.string()).optional(),
});

/** 체크리스트 상태 업데이트 스키마 */
export const updateChecklistSchema = z.object({
  status: z.enum(["not_started", "in_progress", "completed"]),
});

/** 투명성 고지 문구 생성 스키마 */
export const noticeGeneratorSchema = z.object({
  service_type: z.enum(["website", "mobile_app", "api_service"]),
  ai_usage_type: z.string().min(2, "AI 활용 방식을 입력해 주세요"),
  service_name: z.string().min(1, "서비스명을 입력해 주세요"),
  ai_description: z.string().min(10, "AI 설명을 10자 이상 입력해 주세요"),
  uses_generative_ai: z.boolean(),
});

/** 프로필 수정 스키마 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해 주세요")
    .max(50)
    .optional(),
  company_name: z.string().max(100).optional(),
});

export type AISystemFormData = z.infer<typeof aiSystemSchema>;
export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
export type CreateAssessmentFormData = z.infer<typeof createAssessmentSchema>;
export type GenerateDocumentFormData = z.infer<typeof generateDocumentSchema>;
export type NoticeGeneratorFormData = z.infer<typeof noticeGeneratorSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
