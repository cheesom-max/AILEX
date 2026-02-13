/**
 * POST /api/v1/auth/google
 * Google OAuth 로그인 시작
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { errorResponse, successResponse } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/api/v1/auth/callback`,
      },
    });

    if (error) {
      return errorResponse("Google 로그인을 시작할 수 없습니다", 400);
    }

    return successResponse({ url: data.url });
  } catch (error) {
    console.error("Google OAuth 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
