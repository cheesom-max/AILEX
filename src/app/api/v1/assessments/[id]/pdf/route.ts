/**
 * GET /api/v1/assessments/:id/pdf
 * 판정 결과 PDF 다운로드
 * 서버사이드에서 HTML을 생성하여 PDF로 변환하는 대신,
 * JSON 데이터를 반환하여 클라이언트에서 PDF 생성
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // 판정 결과 조회
    const { data: assessment, error: dbError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError || !assessment) {
      return errorResponse("판정 결과를 찾을 수 없습니다", 404);
    }

    // AI 시스템 정보 조회
    const { data: aiSystem } = await supabase
      .from("ai_systems")
      .select("name, domain, ai_type, description")
      .eq("id", assessment.ai_system_id)
      .single();

    // PDF 생성용 데이터 반환 (클라이언트에서 @react-pdf/renderer 사용)
    return successResponse({
      assessment,
      ai_system: aiSystem,
      generated_at: new Date().toISOString(),
      disclaimer:
        "본 판정은 AI 기반 참고용 분석이며, 법적 효력이 없습니다. 최종 확인은 과기정통부 또는 법률 전문가에게 문의하세요.",
    });
  } catch (error) {
    console.error("판정 PDF 데이터 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
