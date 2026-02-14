/**
 * API 라우트 공통 헬퍼 함수
 * 인증 확인, 플랜 체크, 에러 응답, 감사 로그 등
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PlanType } from "@/types/database";
import { PLAN_LIMITS } from "@/types/database";

/** API 에러 응답 생성 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** API 성공 응답 생성 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/** 인증된 사용자 정보 가져오기 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: "인증이 필요합니다" };
  }

  return { user, supabase, error: null };
}

/** 사용자 플랜 정보 가져오기 */
export async function getUserPlan(
  userId: string
): Promise<{ plan: PlanType; isExpired: boolean }> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("plan, plan_expires_at")
    .eq("id", userId)
    .single();

  if (!data) {
    return { plan: "free", isExpired: false };
  }

  const plan = (data.plan as PlanType) || "free";
  const isExpired =
    data.plan_expires_at && new Date(data.plan_expires_at) < new Date();

  return {
    plan: isExpired ? "free" : plan,
    isExpired: !!isExpired,
  };
}

/** 플랜 기반 접근 제어 */
export async function checkPlanAccess(
  userId: string,
  feature: keyof (typeof PLAN_LIMITS)["free"]
): Promise<{ allowed: boolean; plan: PlanType; message?: string }> {
  const { plan } = await getUserPlan(userId);
  const limits = PLAN_LIMITS[plan];

  if (!limits[feature]) {
    return {
      allowed: false,
      plan,
      message: `이 기능은 Pro 플랜 이상에서 사용 가능합니다. 현재 플랜: ${plan}`,
    };
  }

  return { allowed: true, plan };
}

/** 감사 로그 기록 */
export async function createAuditLog(params: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: params.userId,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId || null,
      metadata: params.metadata || {},
    });
  } catch (error) {
    // 감사 로그 실패는 비즈니스 로직에 영향을 주지 않음
    console.error("감사 로그 기록 실패:", error);
  }
}
