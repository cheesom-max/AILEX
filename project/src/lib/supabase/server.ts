/**
 * 서버 컴포넌트/API 라우트용 Supabase 클라이언트
 * 쿠키 기반 세션 관리로 SSR 환경에서 인증 유지
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. " +
      "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 확인하세요."
    );
  }

  return { supabaseUrl, supabaseKey };
}

export async function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 호출 시 무시 (미들웨어에서 세션 갱신)
          }
        },
      },
    }
  );
}

/**
 * 서비스 역할 키를 사용하는 관리자 클라이언트
 * RLS를 우회해야 하는 서버 사이드 작업에만 사용
 */
export async function createAdminClient() {
  const { supabaseUrl } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서 호출 시 무시
          }
        },
      },
    }
  );
}
