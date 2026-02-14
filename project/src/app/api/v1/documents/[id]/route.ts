/**
 * GET /api/v1/documents/:id - 문서 조회
 * PUT /api/v1/documents/:id - 문서 수정 요청 (AI 재생성)
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  checkPlanAccess,
} from "@/lib/api-helpers";
import { getOpenAIClient, MODELS, getOpenAIErrorMessage } from "@/lib/openai/client";
import { DOCUMENT_SYSTEM_PROMPTS } from "@/lib/prompts/documents";
import type { DocumentType } from "@/types/database";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

type RouteParams = { params: Promise<{ id: string }> };

/** 문서 조회 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const access = await checkPlanAccess(user.id, "can_generate_documents");
    if (!access.allowed) {
      return errorResponse(access.message!, 403);
    }

    const { data: document, error: dbError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError || !document) {
      return errorResponse("문서를 찾을 수 없습니다", 404);
    }

    return successResponse(document);
  } catch (error) {
    console.error("문서 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** 문서 수정 요청 (특정 섹션 AI 재생성) */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const access = await checkPlanAccess(user.id, "can_generate_documents");
    if (!access.allowed) {
      return errorResponse(access.message!, 403);
    }

    const body = await request.json();
    const { section, instruction, status } = body;

    // 문서 상태만 변경하는 경우
    if (status && !section) {
      const { data: updated, error: updateError } = await supabase
        .from("documents")
        .update({ status })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError || !updated) {
        return errorResponse("문서 상태 변경에 실패했습니다", 500);
      }

      return successResponse(updated);
    }

    // 섹션 수정 요청
    if (!section || !instruction) {
      return errorResponse("수정할 섹션과 지시사항을 입력해 주세요", 400);
    }

    // Rate Limit 체크 (AI 호출이 필요한 수정 요청에만 적용)
    const rateCheck = checkRateLimit(
      user.id,
      "documentEdit",
      RATE_LIMIT_CONFIGS.documentEdit
    );
    if (!rateCheck.allowed) {
      return errorResponse(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        429
      );
    }

    // 기존 문서 조회
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      return errorResponse("문서를 찾을 수 없습니다", 404);
    }

    // AI로 해당 섹션 재생성
    const openai = getOpenAIClient();
    const docType = document.doc_type as DocumentType;
    const systemPrompt = DOCUMENT_SYSTEM_PROMPTS[docType];

    try {
      const completion = await openai.chat.completions.create({
        model: MODELS.GPT4O,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `기존 문서의 다음 섹션을 수정해 주세요.

## 기존 문서 전체
${document.content}

## 수정 요청
- 수정할 섹션: ${section}
- 수정 지시: ${instruction}

기존 문서의 전체 구조를 유지하면서, 요청된 섹션만 수정하여 전체 문서를 다시 출력해 주세요.
Markdown 형식을 유지하세요.`,
          },
        ],
        temperature: 0.3,
        max_tokens: 8000,
      });

      const newContent = completion.choices[0]?.message?.content;
      if (!newContent) {
        throw new Error("AI 응답이 비어있습니다");
      }

      // 수정된 문서 저장 (버전 증가)
      const { data: updated, error: updateError } = await supabase
        .from("documents")
        .update({
          content: newContent,
          version: document.version + 1,
          prompt_tokens:
            document.prompt_tokens +
            (completion.usage?.prompt_tokens || 0),
          completion_tokens:
            document.completion_tokens +
            (completion.usage?.completion_tokens || 0),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError || !updated) {
        return errorResponse("문서 업데이트에 실패했습니다", 500);
      }

      return successResponse(updated);
    } catch (aiError) {
      console.error("문서 수정 AI 호출 실패:", aiError);
      const userMessage = getOpenAIErrorMessage(aiError);
      return errorResponse(userMessage, 503);
    }
  } catch (error) {
    console.error("문서 수정 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
