/**
 * POST /api/v1/ai-systems - AI 시스템 등록
 * GET /api/v1/ai-systems - AI 시스템 목록 조회
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  getUserPlan,
  createAuditLog,
} from "@/lib/api-helpers";
import { aiSystemSchema } from "@/lib/validators";
import { PLAN_LIMITS } from "@/types/database";

/** AI 시스템 목록 조회 */
export async function GET() {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const { data: systems, error: dbError } = await supabase
      .from("ai_systems")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (dbError) {
      return errorResponse("AI 시스템 목록을 불러올 수 없습니다", 500);
    }

    return successResponse(systems || []);
  } catch (error) {
    console.error("AI 시스템 목록 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** AI 시스템 등록 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const body = await request.json();
    const parsed = aiSystemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    // 플랜별 시스템 등록 수 제한 확인
    const { plan } = await getUserPlan(user.id);
    const limits = PLAN_LIMITS[plan];

    const { count } = await supabase
      .from("ai_systems")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count ?? 0) >= limits.max_systems) {
      return errorResponse(
        `현재 플랜(${plan})에서는 AI 시스템을 최대 ${limits.max_systems}개까지 등록할 수 있습니다. 플랜을 업그레이드해 주세요.`,
        403
      );
    }

    const { data: system, error: dbError } = await supabase
      .from("ai_systems")
      .insert({
        ...parsed.data,
        user_id: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("AI 시스템 등록 DB 에러:", dbError);
      return errorResponse("AI 시스템 등록에 실패했습니다", 500);
    }

    // 감사 로그
    await createAuditLog({
      userId: user.id,
      action: "ai_system_created",
      resourceType: "ai_system",
      resourceId: system.id,
      metadata: { name: system.name },
    });

    return successResponse(system, 201);
  } catch (error) {
    console.error("AI 시스템 등록 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
