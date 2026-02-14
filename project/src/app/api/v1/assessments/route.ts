/**
 * POST /api/v1/assessments
 * 고영향 AI 판정 실행 (F1 핵심 기능)
 * GPT-4o Structured Output으로 법 조문 기반 판정
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  createAuditLog,
} from "@/lib/api-helpers";
import { createAssessmentSchema } from "@/lib/validators";
import { getOpenAIClient, MODELS, getOpenAIErrorMessage } from "@/lib/openai/client";
import {
  ASSESSMENT_SYSTEM_PROMPT,
  buildAssessmentUserPrompt,
  ASSESSMENT_RESPONSE_SCHEMA,
} from "@/lib/prompts/assessment";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // Rate Limit 체크
    const rateCheck = checkRateLimit(
      user.id,
      "assessment",
      RATE_LIMIT_CONFIGS.assessment
    );
    if (!rateCheck.allowed) {
      return errorResponse(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        429
      );
    }

    const body = await request.json();
    const parsed = createAssessmentSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { ai_system_id, questionnaire } = parsed.data;

    // AI 시스템이 존재하고 본인 소유인지 확인
    const { data: aiSystem, error: systemError } = await supabase
      .from("ai_systems")
      .select("*")
      .eq("id", ai_system_id)
      .eq("user_id", user.id)
      .single();

    if (systemError || !aiSystem) {
      return errorResponse("AI 시스템을 찾을 수 없습니다", 404);
    }

    // OpenAI GPT-4o API 호출 (Structured Output)
    const openai = getOpenAIClient();

    let assessmentResult;
    try {
      const completion = await openai.chat.completions.create({
        model: MODELS.GPT4O,
        messages: [
          { role: "system", content: ASSESSMENT_SYSTEM_PROMPT },
          { role: "user", content: buildAssessmentUserPrompt(questionnaire) },
        ],
        response_format: ASSESSMENT_RESPONSE_SCHEMA,
        temperature: 0.2,
        max_tokens: 4000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI 응답이 비어있습니다");
      }

      assessmentResult = JSON.parse(content);
    } catch (aiError) {
      console.error("OpenAI API 호출 실패:", aiError);
      const userMessage = getOpenAIErrorMessage(aiError);
      return errorResponse(userMessage, 503);
    }

    // 판정 결과 DB 저장
    const { data: assessment, error: insertError } = await supabase
      .from("assessments")
      .insert({
        ai_system_id,
        user_id: user.id,
        result: assessmentResult.result,
        confidence: assessmentResult.confidence,
        matched_domains: assessmentResult.matched_domains,
        legal_basis: assessmentResult.legal_basis,
        reasoning: assessmentResult.reasoning,
        user_inputs: questionnaire,
        obligations: assessmentResult.obligations,
      })
      .select()
      .single();

    if (insertError || !assessment) {
      console.error("판정 결과 저장 실패:", insertError);
      return errorResponse("판정 결과 저장에 실패했습니다", 500);
    }

    // 고영향 AI인 경우 자동으로 체크리스트 항목 생성 (F2)
    if (
      assessmentResult.result === "high_impact" &&
      assessmentResult.obligations?.length > 0
    ) {
      const checklistItems = assessmentResult.obligations.map(
        (obligation: {
          type: string;
          title: string;
          description: string;
          article: string;
        }) => ({
          assessment_id: assessment.id,
          ai_system_id,
          user_id: user.id,
          obligation_type: obligation.type,
          title: obligation.title,
          description: obligation.description,
          legal_reference: obligation.article,
          status: "not_started",
        })
      );

      const { error: checklistError } = await supabase
        .from("compliance_items")
        .insert(checklistItems);

      if (checklistError) {
        console.error("체크리스트 생성 실패:", checklistError);
      }
    }

    // 감사 로그
    await createAuditLog({
      userId: user.id,
      action: "assessment_created",
      resourceType: "assessment",
      resourceId: assessment.id,
      metadata: {
        ai_system_id,
        result: assessmentResult.result,
        confidence: assessmentResult.confidence,
      },
    });

    return successResponse(assessment, 201);
  } catch (error) {
    console.error("판정 실행 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
