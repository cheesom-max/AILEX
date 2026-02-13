/**
 * POST /api/v1/documents/generate
 * AI 의무 문서 자동 생성 (F3 핵심 기능)
 * GPT-4o로 영향평가서, 투명성 보고서, 고지 문구, 위험관리계획서 생성
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  checkPlanAccess,
  createAuditLog,
} from "@/lib/api-helpers";
import { generateDocumentSchema } from "@/lib/validators";
import { getOpenAIClient, MODELS, getOpenAIErrorMessage } from "@/lib/openai/client";
import {
  DOCUMENT_SYSTEM_PROMPTS,
  buildDocumentUserPrompt,
} from "@/lib/prompts/documents";
import { DOC_TYPE_LABELS } from "@/types/database";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // Rate Limit 체크
    const rateCheck = checkRateLimit(
      user.id,
      "documentGenerate",
      RATE_LIMIT_CONFIGS.documentGenerate
    );
    if (!rateCheck.allowed) {
      return errorResponse(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        429
      );
    }

    // Pro 플랜 이상만 문서 생성 가능
    const access = await checkPlanAccess(user.id, "can_generate_documents");
    if (!access.allowed) {
      return errorResponse(access.message!, 403);
    }

    const body = await request.json();
    const parsed = generateDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { ai_system_id, assessment_id, doc_type, additional_inputs } =
      parsed.data;

    // AI 시스템 정보 조회
    const { data: aiSystem, error: systemError } = await supabase
      .from("ai_systems")
      .select("*")
      .eq("id", ai_system_id)
      .eq("user_id", user.id)
      .single();

    if (systemError || !aiSystem) {
      return errorResponse("AI 시스템을 찾을 수 없습니다", 404);
    }

    // 판정 결과 조회
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", assessment_id)
      .eq("user_id", user.id)
      .single();

    if (assessmentError || !assessment) {
      return errorResponse("판정 결과를 찾을 수 없습니다", 404);
    }

    // GPT-4o로 문서 생성
    const openai = getOpenAIClient();
    const systemPrompt = DOCUMENT_SYSTEM_PROMPTS[doc_type];
    const userPrompt = buildDocumentUserPrompt({
      doc_type,
      system_name: aiSystem.name,
      system_description: aiSystem.description || "",
      domain: aiSystem.domain,
      ai_type: aiSystem.ai_type,
      assessment_result: assessment.result,
      matched_domains: assessment.matched_domains || [],
      obligations: JSON.stringify(assessment.obligations, null, 2),
      additional_inputs,
    });

    let documentContent: string;
    let promptTokens = 0;
    let completionTokens = 0;

    try {
      const completion = await openai.chat.completions.create({
        model: MODELS.GPT4O,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 8000,
      });

      documentContent = completion.choices[0]?.message?.content || "";
      promptTokens = completion.usage?.prompt_tokens || 0;
      completionTokens = completion.usage?.completion_tokens || 0;

      if (!documentContent) {
        throw new Error("AI 응답이 비어있습니다");
      }
    } catch (aiError) {
      console.error("문서 생성 AI 호출 실패:", aiError);
      const userMessage = getOpenAIErrorMessage(aiError);
      return errorResponse(userMessage, 503);
    }

    // 문서 제목 생성
    const docTypeLabel = DOC_TYPE_LABELS[doc_type];
    const title = `${docTypeLabel} - ${aiSystem.name}`;

    // 기존 같은 유형의 문서가 있는지 확인 (버전 관리)
    const { data: existingDocs } = await supabase
      .from("documents")
      .select("version")
      .eq("ai_system_id", ai_system_id)
      .eq("doc_type", doc_type)
      .order("version", { ascending: false })
      .limit(1);

    const nextVersion = existingDocs?.[0]
      ? existingDocs[0].version + 1
      : 1;

    // 문서 DB 저장
    const { data: document, error: insertError } = await supabase
      .from("documents")
      .insert({
        ai_system_id,
        user_id: user.id,
        doc_type,
        title,
        content: documentContent,
        version: nextVersion,
        status: "draft",
        ai_model: MODELS.GPT4O,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
      })
      .select()
      .single();

    if (insertError || !document) {
      console.error("문서 저장 실패:", insertError);
      return errorResponse("문서 저장에 실패했습니다", 500);
    }

    // 감사 로그
    await createAuditLog({
      userId: user.id,
      action: "document_generated",
      resourceType: "document",
      resourceId: document.id,
      metadata: {
        doc_type,
        ai_system_id,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
      },
    });

    return successResponse(document, 201);
  } catch (error) {
    console.error("문서 생성 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
