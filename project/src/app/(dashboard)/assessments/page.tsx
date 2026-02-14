/**
 * 판정 결과 목록 페이지
 * 모든 AI 시스템의 판정 이력 조회
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

interface AssessmentListItem {
  id: string;
  result: string;
  confidence: number;
  matched_domains: string[];
  created_at: string;
  ai_systems: { name: string } | null;
}

const resultConfig: Record<string, {
  icon: typeof AlertTriangle;
  label: string;
  color: string;
}> = {
  high_impact: {
    icon: AlertTriangle,
    label: "고영향 AI 해당",
    color: "bg-red-100 text-red-700",
  },
  not_high_impact: {
    icon: CheckCircle2,
    label: "비해당",
    color: "bg-green-100 text-green-700",
  },
  uncertain: {
    icon: HelpCircle,
    label: "추가 확인 필요",
    color: "bg-yellow-100 text-yellow-700",
  },
};

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from("assessments")
          .select("id, result, confidence, matched_domains, created_at, ai_systems(name)")
          .order("created_at", { ascending: false });

        if (dbError) {
          throw new Error(dbError.message);
        }

        // Supabase 관계 쿼리 결과 타입을 명시적으로 변환
        if (data) {
          const typed: AssessmentListItem[] = data.map((row) => ({
            id: row.id,
            result: row.result,
            confidence: row.confidence,
            matched_domains: row.matched_domains,
            created_at: row.created_at,
            ai_systems: row.ai_systems as unknown as { name: string } | null,
          }));
          setAssessments(typed);
        }
      } catch (err) {
        console.error("판정 목록 로드 실패:", err);
        setError("판정 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
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
          <h1 className="text-2xl font-bold">판정 결과</h1>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">판정 결과</h1>
        <p className="text-muted-foreground">
          모든 AI 시스템의 고영향 AI 판정 이력입니다
        </p>
      </div>

      {assessments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">판정 이력이 없습니다</h3>
            <p className="text-muted-foreground text-center mb-6">
              AI 시스템을 등록하고 판정을 실행하세요
            </p>
            <Link href="/ai-systems">
              <Button>AI 시스템 관리로 이동</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {assessments.map((assessment) => {
            const config = resultConfig[assessment.result] || resultConfig.uncertain;
            const ResultIcon = config.icon;
            return (
              <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
                <Card className="hover:border-primary/20 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 py-4">
                    <ResultIcon className="h-5 w-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {assessment.ai_systems?.name || "AI 시스템"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(assessment.created_at).toLocaleDateString("ko-KR")}
                        {" | "}
                        확신도 {Math.round(assessment.confidence * 100)}%
                      </p>
                    </div>
                    <Badge variant="secondary" className={config.color}>
                      {config.label}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
