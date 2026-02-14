/**
 * POST /api/v1/tools/notice-generator
 * 투명성 고지 문구 생성기 (F5)
 * GPT-4o-mini로 비용 효율적 생성
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";
import { noticeGeneratorSchema } from "@/lib/validators";
import { getOpenAIClient, MODELS, getOpenAIErrorMessage } from "@/lib/openai/client";
import {
  NOTICE_GENERATOR_SYSTEM_PROMPT,
  NOTICE_RESPONSE_SCHEMA,
} from "@/lib/prompts/documents";
import { checkRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // Rate Limit 체크
    const rateCheck = checkRateLimit(
      user.id,
      "noticeGenerator",
      RATE_LIMIT_CONFIGS.noticeGenerator
    );
    if (!rateCheck.allowed) {
      return errorResponse(
        "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
        429
      );
    }

    const body = await request.json();
    const parsed = noticeGeneratorSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const {
      service_type,
      ai_usage_type,
      service_name,
      ai_description,
      uses_generative_ai,
    } = parsed.data;

    const serviceTypeLabels = {
      website: "웹사이트",
      mobile_app: "모바일 앱",
      api_service: "API 서비스",
    };

    const openai = getOpenAIClient();

    try {
      const completion = await openai.chat.completions.create({
        model: MODELS.GPT4O_MINI,
        messages: [
          { role: "system", content: NOTICE_GENERATOR_SYSTEM_PROMPT },
          {
            role: "user",
            content: `다음 서비스에 대한 AI 사용 고지 문구를 생성해 주세요:

- 서비스명: ${service_name}
- 서비스 유형: ${serviceTypeLabels[service_type]}
- AI 활용 방식: ${ai_usage_type}
- AI 기능 설명: ${ai_description}
- 생성형 AI 사용 여부: ${uses_generative_ai ? "예" : "아니오"}

3가지 형태의 고지 문구를 JSON 형식으로 생성해 주세요.`,
          },
        ],
        response_format: NOTICE_RESPONSE_SCHEMA,
        temperature: 0.4,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("AI 응답이 비어있습니다");
      }

      const result = JSON.parse(content);
      return successResponse(result);
    } catch (aiError) {
      console.error("고지 문구 생성 실패:", aiError);
      const userMessage = getOpenAIErrorMessage(aiError);
      return errorResponse(userMessage, 503);
    }
  } catch (error) {
    console.error("고지 문구 생성 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
