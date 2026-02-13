/**
 * GET /api/v1/dashboard/summary
 * 대시보드 요약 데이터 (F4)
 */

import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";

// TODO: [P1] 대시보드 고도화 - Recharts 차트 데이터, 월간 추이 등 -- mvp_spec.md 참조

export async function GET() {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    // 4개 쿼리를 병렬 실행하여 응답 시간 단축
    const [systemsResult, assessmentsResult, complianceResult, activitiesResult] =
      await Promise.all([
        supabase
          .from("ai_systems")
          .select("id")
          .eq("user_id", user.id),
        supabase
          .from("assessments")
          .select("result")
          .eq("user_id", user.id),
        supabase
          .from("compliance_items")
          .select("status")
          .eq("user_id", user.id),
        supabase
          .from("audit_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

    const systems = systemsResult.data;
    const assessments = assessmentsResult.data;
    const complianceItems = complianceResult.data;
    const recentActivities = activitiesResult.data;

    const highImpactCount =
      assessments?.filter((a) => a.result === "high_impact").length || 0;
    const notHighImpactCount =
      assessments?.filter((a) => a.result === "not_high_impact").length || 0;
    const uncertainCount =
      assessments?.filter((a) => a.result === "uncertain").length || 0;

    const notStarted =
      complianceItems?.filter((i) => i.status === "not_started").length || 0;
    const inProgress =
      complianceItems?.filter((i) => i.status === "in_progress").length || 0;
    const completed =
      complianceItems?.filter((i) => i.status === "completed").length || 0;
    const totalItems = complianceItems?.length || 0;
    const complianceRate =
      totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;

    return successResponse({
      total_systems: systems?.length || 0,
      total_assessments: assessments?.length || 0,
      high_impact_count: highImpactCount,
      not_high_impact_count: notHighImpactCount,
      uncertain_count: uncertainCount,
      compliance_rate: complianceRate,
      items_by_status: {
        not_started: notStarted,
        in_progress: inProgress,
        completed,
      },
      recent_activities: recentActivities || [],
    });
  } catch (error) {
    console.error("대시보드 요약 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
