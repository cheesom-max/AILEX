/**
 * 플랜 관리 / 가격 페이지 (F6)
 * Free/Pro/Enterprise 플랜 비교 및 업그레이드 안내
 */

"use client";

import { CheckCircle, Crown, Building2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export default function PricingPage() {
  const { profile } = useAuth();
  const currentPlan = profile?.plan || "free";

  const handleUpgrade = (plan: string) => {
    // MVP 초기에는 수동 결제 (이메일 안내)
    toast.info(
      `${plan} 플랜 업그레이드를 위해 support@ailex.ai로 문의해 주세요.`
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">플랜 관리</h1>
        <p className="text-muted-foreground mt-2">
          현재 플랜:{" "}
          <Badge variant="secondary" className="ml-1">
            {currentPlan.toUpperCase()}
          </Badge>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Free */}
        <Card className={currentPlan === "free" ? "border-2 border-primary" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Free
              {currentPlan === "free" && (
                <Badge>현재 플랜</Badge>
              )}
            </CardTitle>
            <CardDescription>AI 기본법 해당 여부 확인</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">무료</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                고영향 AI 판정 1회
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                AI 시스템 1개 등록
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                투명성 고지 문구 생성
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card
          className={
            currentPlan === "pro"
              ? "border-2 border-primary"
              : "border-2 border-primary/30"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Pro
              </div>
              {currentPlan === "pro" ? (
                <Badge>현재 플랜</Badge>
              ) : (
                <Badge variant="secondary">추천</Badge>
              )}
            </CardTitle>
            <CardDescription>
              문서 생성 + 체크리스트 + 대시보드
            </CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">월 30만원</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                고영향 AI 판정 월 20회
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                AI 시스템 3개 등록
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                의무 문서 4종 자동 생성
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                컴플라이언스 체크리스트
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                대시보드 + DOCX/PDF 다운로드
              </li>
            </ul>
            {currentPlan !== "pro" && currentPlan !== "enterprise" && (
              <Button
                className="w-full"
                onClick={() => handleUpgrade("Pro")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Pro 업그레이드 문의
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Enterprise */}
        <Card
          className={currentPlan === "enterprise" ? "border-2 border-primary" : ""}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Enterprise
              </div>
              {currentPlan === "enterprise" && (
                <Badge>현재 플랜</Badge>
              )}
            </CardTitle>
            <CardDescription>대규모 AI 시스템 관리</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">문의</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                무제한 AI 시스템
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                무제한 판정
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Pro 플랜의 모든 기능
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                전담 지원
              </li>
            </ul>
            {currentPlan !== "enterprise" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleUpgrade("Enterprise")}
              >
                <Mail className="h-4 w-4 mr-2" />
                Enterprise 문의
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          결제 문의: support@ailex.ai | MVP 기간 중 수동 결제 처리 (은행
          이체)
        </p>
      </div>
    </div>
  );
}
