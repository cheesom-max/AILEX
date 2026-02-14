/**
 * POST /api/v1/auth/reset-password
 * 비밀번호 재설정 이메일 발송
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return errorResponse("이메일을 입력해 주세요", 400);
    }

    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password/confirm`,
    });

    if (error) {
      return errorResponse("비밀번호 재설정 이메일 발송에 실패했습니다", 400);
    }

    return successResponse({
      message: "비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해 주세요.",
    });
  } catch (error) {
    console.error("비밀번호 재설정 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
