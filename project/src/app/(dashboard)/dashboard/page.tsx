/**
 * 메인 대시보드 페이지
 * AI 시스템 현황, 컴플라이언스 달성률, 최근 활동
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { DashboardSummary } from "@/types/database";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/v1/dashboard/summary");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        console.error("대시보드 데이터 로드 실패:", err);
        setError("대시보드 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
        </div>
        <Card className="border-destructive/20">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">오류가 발생했습니다</h3>
            <p className="text-muted-foreground text-center mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasData = summary && summary.total_systems > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">
            AI 기본법 컴플라이언스 현황을 한눈에 확인하세요
          </p>
        </div>
        <Link href="/ai-systems/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            AI 시스템 등록
          </Button>
        </Link>
      </div>

      {!hasData && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              아직 등록된 AI 시스템이 없습니다
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              AI 시스템을 등록하고 고영향 AI 해당 여부를 확인해 보세요.
              무료로 1회 판정이 가능합니다.
            </p>
            <Link href="/ai-systems/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 AI 시스템 등록하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {hasData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>등록된 AI 시스템</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {summary.total_systems}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>판정 완료</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {summary.total_assessments}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  {summary.high_impact_count > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      고영향 {summary.high_impact_count}
                    </Badge>
                  )}
                  {summary.not_high_impact_count > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      비해당 {summary.not_high_impact_count}
                    </Badge>
                  )}
                  {summary.uncertain_count > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-700"
                    >
                      확인필요 {summary.uncertain_count}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>컴플라이언스 달성률</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold">
                    {summary.compliance_rate}%
                  </span>
                </div>
                <Progress value={summary.compliance_rate} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>체크리스트 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span>완료 {summary.items_by_status.completed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-yellow-500" />
                    <span>진행중 {summary.items_by_status.in_progress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3.5 w-3.5 text-gray-400" />
                    <span>미착수 {summary.items_by_status.not_started}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ai-systems/new">
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">AI 시스템 등록</p>
                    <p className="text-sm text-muted-foreground">
                      새 AI 시스템 추가 및 판정
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/tools/notice-generator">
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">고지 문구 생성</p>
                    <p className="text-sm text-muted-foreground">
                      투명성 고지 문구 즉시 생성
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/pricing">
              <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="flex items-center gap-4 py-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">플랜 업그레이드</p>
                    <p className="text-sm text-muted-foreground">
                      문서 생성 및 대시보드 이용
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
