/**
 * 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트
 * 클라이언트 사이드에서 Supabase Auth, DB 쿼리 등에 사용
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase 환경 변수가 설정되지 않았습니다. " +
      "NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 확인하세요."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
