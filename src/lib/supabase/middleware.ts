/**
 * 미들웨어용 Supabase 클라이언트
 * 세션 갱신 및 인증 상태 확인에 사용
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. " +
      "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 확인하세요."
    );
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (중요: getUser()를 호출해야 쿠키가 갱신됨)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 경로 목록
  const protectedPaths = ["/dashboard", "/ai-systems", "/assessments", "/documents", "/checklist", "/tools", "/pricing"];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 공개 경로 목록
  const publicOnlyPaths = ["/login", "/signup", "/reset-password"];
  const isPublicOnlyRoute = publicOnlyPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 인증되지 않은 사용자가 보호된 경로 접근 시 로그인으로 리다이렉트
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 인증된 사용자가 로그인/회원가입 페이지 접근 시 대시보드로 리다이렉트
  if (isPublicOnlyRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
