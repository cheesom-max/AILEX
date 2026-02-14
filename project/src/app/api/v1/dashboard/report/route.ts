/**
 * GET /api/v1/dashboard/report
 * 월간 리포트 PDF 데이터
 */

import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
  checkPlanAccess,
} from "@/lib/api-helpers";

// TODO: [P1] 월간 리포트 PDF 생성 기능 구현 -- mvp_spec.md 참조

export async function GET() {
  try {
    const { user, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const access = await checkPlanAccess(user.id, "can_view_dashboard");
    if (!access.allowed) {
      return errorResponse(access.message!, 403);
    }

    return successResponse({
      message: "월간 리포트 기능은 곧 출시 예정입니다.",
    });
  } catch (error) {
    console.error("리포트 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
