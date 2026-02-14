/**
 * GET/PUT /api/v1/user/profile
 * 사용자 프로필 조회/수정
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  successResponse,
} from "@/lib/api-helpers";
import { updateProfileSchema } from "@/lib/validators";

/** 프로필 조회 */
export async function GET() {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const { data: profile, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (dbError || !profile) {
      return errorResponse("프로필을 찾을 수 없습니다", 404);
    }

    return successResponse(profile);
  } catch (error) {
    console.error("프로필 조회 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}

/** 프로필 수정 */
export async function PUT(request: NextRequest) {
  try {
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { data: profile, error: dbError } = await supabase
      .from("users")
      .update(parsed.data)
      .eq("id", user.id)
      .select()
      .single();

    if (dbError) {
      return errorResponse("프로필 수정에 실패했습니다", 500);
    }

    return successResponse(profile);
  } catch (error) {
    console.error("프로필 수정 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
