/**
 * 인증 관련 클라이언트 훅
 * Supabase Auth 상태 관리
 */

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types/database";

export function useAuth() {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Supabase 클라이언트를 메모이제이션하여 매 렌더마다 새 인스턴스 생성 방지
  const supabase = useMemo(() => createClient(), []);

  // 프로필 조회
  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data as User);
  }, [supabase]);

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setAuthUser(user);
      if (user) {
        await fetchProfile(user.id);
      }
      setLoading(false);
    };

    getSession();

    // Auth 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  // 로그아웃
  const signOut = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setProfile(null);
  };

  return {
    user: authUser,
    profile,
    loading,
    signOut,
    isAuthenticated: !!authUser,
    isPro: profile?.plan === "pro" || profile?.plan === "enterprise",
    isEnterprise: profile?.plan === "enterprise",
  };
}
