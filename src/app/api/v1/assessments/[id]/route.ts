/**
 * GET /api/v1/assessments/:id
 * 판정 결과 상세 조회
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

    const { data: assessment, error: dbError } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError || !assessment) {
      return errorResponse("판정 결과를 찾을 수 없습니다", 404);
    }

    // 관련 체크리스트 항목도 조회
    const { data: checklistItems } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("assessment_id", id)
      .order("created_at", { ascending: true });

    // 관련 AI 시스템 정보 조회
    const { data: aiSystem } = await supabase
      .from("ai_systems")
      .select("name, domain, ai_type, status")
      .eq("id", assessment.ai_system_id)
      .single();

    return successResponse({
      ...assessment,
      compliance_items: checklistItems || [],
      ai_system: aiSystem,
    });
  } catch (error) {
    console.error("판정 결과 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
