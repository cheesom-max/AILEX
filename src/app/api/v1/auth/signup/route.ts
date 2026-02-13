/**
 * POST /api/v1/auth/signup
 * 이메일 회원가입
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, company_name } = body;

    if (!email || !password) {
      return errorResponse("이메일과 비밀번호를 입력해 주세요", 400);
    }

    if (password.length < 8) {
      return errorResponse("비밀번호는 8자 이상이어야 합니다", 400);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || "",
          company_name: company_name || "",
        },
      },
    });

    if (error) {
      return errorResponse(error.message, 400);
    }

    return successResponse(
      {
        message: "회원가입이 완료되었습니다. 이메일 인증을 확인해 주세요.",
        user: data.user
          ? {
              id: data.user.id,
              email: data.user.email,
            }
          : null,
      },
      201
    );
  } catch (error) {
    console.error("회원가입 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
