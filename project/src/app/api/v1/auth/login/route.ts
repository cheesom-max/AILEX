/**
 * POST /api/v1/auth/login
 * 이메일/비밀번호 로그인
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse("이메일과 비밀번호를 입력해 주세요", 400);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse("이메일 또는 비밀번호가 올바르지 않습니다", 401);
    }

    // 세션은 쿠키로 관리되므로 응답 본문에 access_token을 포함하지 않음
    return successResponse({
      message: "로그인 성공",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("로그인 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
