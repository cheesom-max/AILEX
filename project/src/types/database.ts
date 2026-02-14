/**
 * Supabase 데이터베이스 타입 정의
 * mvp_spec.md 섹션 5 데이터 모델 기반
 */

// ============================================
// 기본 타입
// ============================================

/** 구독 플랜 유형 */
export type PlanType = "free" | "pro" | "enterprise";

/** AI 시스템 운영 상태 */
export type SystemStatus = "development" | "production" | "suspended";

/** 고영향 AI 판정 결과 */
export type AssessmentResult = "high_impact" | "not_high_impact" | "uncertain";

/** AI 의사결정 유형 */
export type DecisionType =
  | "information"
  | "recommendation"
  | "automated_decision";

/** 컴플라이언스 의무 유형 */
export type ObligationType =
  | "transparency"
  | "risk_management"
  | "impact_assessment"
  | "documentation"
  | "user_protection";

/** 체크리스트 항목 이행 상태 */
export type ComplianceStatus = "not_started" | "in_progress" | "completed";

/** 문서 유형 */
export type DocumentType =
  | "impact_assessment"
  | "transparency_report"
  | "user_notice"
  | "risk_management_plan";

/** 문서 상태 */
export type DocumentStatus = "draft" | "review" | "final";

/** 파일 형식 */
export type FileFormat = "pdf" | "docx";

/** 감사 로그 동작 유형 */
export type AuditAction =
  | "assessment_created"
  | "document_generated"
  | "checklist_updated"
  | "ai_system_created"
  | "ai_system_updated"
  | "ai_system_deleted"
  | "document_downloaded"
  | "user_login"
  | "user_signup";

// ============================================
// 고영향 AI 11개 영역 (제27조)
// ============================================

/** 고영향 AI 사용 영역 */
export type HighImpactDomain =
  | "energy"
  | "water"
  | "healthcare"
  | "nuclear"
  | "transportation"
  | "finance"
  | "education"
  | "employment"
  | "public_safety"
  | "immigration"
  | "social_insurance"
  | "other";

/** 고영향 AI 영역 한국어 매핑 */
export const DOMAIN_LABELS: Record<HighImpactDomain, string> = {
  energy: "에너지 공급",
  water: "먹는 물 생산/공급",
  healthcare: "보건의료",
  nuclear: "원자력 안전",
  transportation: "철도/도로/항공/해운 교통",
  finance: "금융 (신용평가, 대출 심사)",
  education: "교육 (입학/채용 평가)",
  employment: "고용 (채용 심사, 인사 평가)",
  public_safety: "공공 안전 (범죄 예방, 수사)",
  immigration: "출입국 관리",
  social_insurance: "사회 보험 및 복지",
  other: "기타",
};

/** 데이터 유형 */
export type DataType =
  | "personal_info"
  | "medical_info"
  | "financial_info"
  | "employment_history"
  | "education"
  | "biometric"
  | "location"
  | "behavioral"
  | "other";

export const DATA_TYPE_LABELS: Record<DataType, string> = {
  personal_info: "개인정보",
  medical_info: "의료정보",
  financial_info: "금융정보",
  employment_history: "고용이력",
  education: "학력정보",
  biometric: "생체정보",
  location: "위치정보",
  behavioral: "행동데이터",
  other: "기타",
};

/** AI 유형 */
export type AIType =
  | "generative"
  | "predictive"
  | "classification"
  | "recommendation"
  | "detection"
  | "other";

export const AI_TYPE_LABELS: Record<AIType, string> = {
  generative: "생성형 AI",
  predictive: "예측형 AI",
  classification: "분류형 AI",
  recommendation: "추천형 AI",
  detection: "탐지형 AI",
  other: "기타",
};

// ============================================
// 데이터베이스 테이블 타입
// ============================================

/** users 테이블 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  plan: PlanType;
  plan_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

/** ai_systems 테이블 */
export interface AISystem {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  domain: string; // 쉼표 구분 또는 단일 값
  ai_type: AIType;
  data_types: string[];
  user_count: number | null;
  decision_impact: DecisionType;
  status: SystemStatus;
  created_at: string;
  updated_at: string;
}

/** assessments 테이블 */
export interface Assessment {
  id: string;
  ai_system_id: string;
  user_id: string;
  result: AssessmentResult;
  confidence: number;
  matched_domains: string[];
  legal_basis: LegalBasis[];
  reasoning: string;
  user_inputs: QuestionnaireInputs;
  obligations: Obligation[];
  created_at: string;
}

/** 법적 근거 */
export interface LegalBasis {
  article: string;
  description: string;
  relevance: string;
}

/** 의무 사항 */
export interface Obligation {
  type: ObligationType;
  title: string;
  article: string;
  description: string;
  priority: "P0" | "P1" | "P2";
}

/** 설문 입력 데이터 */
export interface QuestionnaireInputs {
  service_domain: string[];
  ai_functionality: string;
  decision_type: DecisionType;
  data_types: string[];
  affected_user_count: number;
  impact_on_rights: string;
  human_oversight: string;
  risk_mitigation: string;
  service_description: string;
  deployment_status: string;
  additional_context: string;
}

/** compliance_items 테이블 */
export interface ComplianceItem {
  id: string;
  assessment_id: string;
  ai_system_id: string;
  user_id: string;
  obligation_type: ObligationType;
  title: string;
  description: string;
  legal_reference: string;
  status: ComplianceStatus;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** documents 테이블 */
export interface Document {
  id: string;
  ai_system_id: string;
  user_id: string;
  compliance_item_id: string | null;
  doc_type: DocumentType;
  title: string;
  content: string;
  version: number;
  file_url: string | null;
  file_format: FileFormat | null;
  status: DocumentStatus;
  ai_model: string;
  prompt_tokens: number;
  completion_tokens: number;
  created_at: string;
  updated_at: string;
}

/** audit_logs 테이블 */
export interface AuditLog {
  id: string;
  user_id: string;
  action: AuditAction;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ============================================
// API 요청/응답 타입
// ============================================

/** AI 시스템 생성 요청 */
export interface CreateAISystemRequest {
  name: string;
  description?: string;
  domain: string;
  ai_type: AIType;
  data_types: string[];
  user_count?: number;
  decision_impact: DecisionType;
  status: SystemStatus;
}

/** 고영향 AI 판정 요청 */
export interface CreateAssessmentRequest {
  ai_system_id: string;
  questionnaire: QuestionnaireInputs;
}

/** 문서 생성 요청 */
export interface GenerateDocumentRequest {
  ai_system_id: string;
  assessment_id: string;
  doc_type: DocumentType;
  additional_inputs?: Record<string, string>;
}

/** 투명성 고지 문구 생성 요청 */
export interface NoticeGeneratorRequest {
  service_type: "website" | "mobile_app" | "api_service";
  ai_usage_type: string;
  service_name: string;
  ai_description: string;
  uses_generative_ai: boolean;
}

/** 투명성 고지 문구 응답 */
export interface NoticeGeneratorResponse {
  terms_notice: string;
  popup_notice: string;
  api_header_notice: string;
  watermark_guide?: string;
}

/** 대시보드 요약 데이터 */
export interface DashboardSummary {
  total_systems: number;
  total_assessments: number;
  high_impact_count: number;
  not_high_impact_count: number;
  uncertain_count: number;
  compliance_rate: number;
  items_by_status: {
    not_started: number;
    in_progress: number;
    completed: number;
  };
  recent_activities: AuditLog[];
}

/** 플랜 제한 사항 */
export const PLAN_LIMITS: Record<
  PlanType,
  {
    max_systems: number;
    max_assessments_per_month: number;
    can_generate_documents: boolean;
    can_view_dashboard: boolean;
    can_download_files: boolean;
  }
> = {
  free: {
    max_systems: 1,
    max_assessments_per_month: 1,
    can_generate_documents: false,
    can_view_dashboard: false,
    can_download_files: false,
  },
  pro: {
    max_systems: 3,
    max_assessments_per_month: 20,
    can_generate_documents: true,
    can_view_dashboard: true,
    can_download_files: true,
  },
  enterprise: {
    max_systems: 999,
    max_assessments_per_month: 999,
    can_generate_documents: true,
    can_view_dashboard: true,
    can_download_files: true,
  },
};

/** 문서 유형 한국어 라벨 */
export const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  impact_assessment: "AI 영향평가서",
  transparency_report: "투명성 보고서",
  user_notice: "이용자 고지 문구",
  risk_management_plan: "위험관리계획서",
};
