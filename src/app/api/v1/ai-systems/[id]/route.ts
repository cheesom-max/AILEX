/**
 * GET /api/v1/ai-systems/:id - AI 시스템 상세 조회
 * PUT /api/v1/ai-systems/:id - AI 시스템 수정
 * DELETE /api/v1/ai-systems/:id - AI 시스템 삭제
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  createAuditLog,
} from "@/lib/api-helpers";
import { aiSystemSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

/** AI 시스템 상세 조회 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const { data: system, error: dbError } = await supabase
      .from("ai_systems")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError || !system) {
      return errorResponse("AI 시스템을 찾을 수 없습니다", 404);
    }

    // 관련 판정 결과도 함께 조회
    const { data: assessments } = await supabase
      .from("assessments")
      .select("*")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false });

    // 관련 문서 목록도 조회
    const { data: documents } = await supabase
      .from("documents")
      .select("id, doc_type, title, status, version, created_at")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false });

    return successResponse({
      ...system,
      assessments: assessments || [],
      documents: documents || [],
    });
  } catch (error) {
    console.error("AI 시스템 상세 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** AI 시스템 수정 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const body = await request.json();
    const parsed = aiSystemSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { data: system, error: dbError } = await supabase
      .from("ai_systems")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (dbError || !system) {
      return errorResponse("AI 시스템 수정에 실패했습니다", 500);
    }

    await createAuditLog({
      userId: user.id,
      action: "ai_system_updated",
      resourceType: "ai_system",
      resourceId: id,
    });

    return successResponse(system);
  } catch (error) {
    console.error("AI 시스템 수정 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** AI 시스템 삭제 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const { error: dbError } = await supabase
      .from("ai_systems")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) {
      return errorResponse("AI 시스템 삭제에 실패했습니다", 500);
    }

    await createAuditLog({
      userId: user.id,
      action: "ai_system_deleted",
      resourceType: "ai_system",
      resourceId: id,
    });

    return successResponse({ message: "AI 시스템이 삭제되었습니다" });
  } catch (error) {
    console.error("AI 시스템 삭제 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
