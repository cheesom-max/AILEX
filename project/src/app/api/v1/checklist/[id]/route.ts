/**
 * PUT /api/v1/checklist/:id
 * 체크리스트 항목 상태 업데이트 (F2)
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  createAuditLog,
} from "@/lib/api-helpers";
import { updateChecklistSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const body = await request.json();
    const parsed = updateChecklistSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const updateData: Record<string, unknown> = {
      status: parsed.data.status,
    };

    // 완료 상태로 변경 시 완료일 기록
    if (parsed.data.status === "completed") {
      updateData.completed_at = new Date().toISOString();
    } else {
      updateData.completed_at = null;
    }

    const { data: item, error: dbError } = await supabase
      .from("compliance_items")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (dbError || !item) {
      return errorResponse("체크리스트 항목을 찾을 수 없습니다", 404);
    }

    // 감사 로그
    await createAuditLog({
      userId: user.id,
      action: "checklist_updated",
      resourceType: "compliance_item",
      resourceId: id,
      metadata: { new_status: parsed.data.status },
    });

    return successResponse(item);
  } catch (error) {
    console.error("체크리스트 업데이트 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** 체크리스트 항목 조회 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // id를 ai_system_id로 사용하여 해당 시스템의 체크리스트 조회
    const { data: items, error: dbError } = await supabase
      .from("compliance_items")
      .select("*")
      .eq("ai_system_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (dbError) {
      return errorResponse("체크리스트를 불러올 수 없습니다", 500);
    }

    // 달성률 계산
    const total = items?.length || 0;
    const completed =
      items?.filter((item) => item.status === "completed").length || 0;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return successResponse({
      items: items || [],
      summary: {
        total,
        completed,
        in_progress:
          items?.filter((item) => item.status === "in_progress").length || 0,
        not_started:
          items?.filter((item) => item.status === "not_started").length || 0,
        compliance_rate: rate,
      },
    });
  } catch (error) {
    console.error("체크리스트 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
