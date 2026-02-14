/**
 * 판정 결과 상세 페이지 (F1 결과 표시)
 * 판정 결과 배지, 법 조문 근거 카드, 상세 분석 근거
 */

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Scale,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import type { Assessment, ComplianceItem, Obligation } from "@/types/database";
import { toast } from "sonner";

interface AssessmentWithDetails extends Assessment {
  compliance_items: ComplianceItem[];
  ai_system: {
    name: string;
    domain: string;
    ai_type: string;
    status: string;
  } | null;
}

const resultConfig = {
  high_impact: {
    label: "고영향 AI 해당",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  not_high_impact: {
    label: "고영향 AI 비해당",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  uncertain: {
    label: "추가 확인 필요",
    icon: HelpCircle,
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    badge: "bg-yellow-100 text-yellow-700",
  },
};

export default function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<AssessmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReasoning, setShowReasoning] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/v1/assessments/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAssessment(data);
        } else {
          toast.error("판정 결과를 불러올 수 없습니다");
        }
      } catch (error) {
        console.error("판정 결과 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">판정 결과를 찾을 수 없습니다</p>
      </div>
    );
  }

  const config = resultConfig[assessment.result];
  const ResultIcon = config.icon;
  const obligations = assessment.obligations as Obligation[];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/ai-systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">판정 결과</h1>
          <p className="text-muted-foreground">
            {assessment.ai_system?.name || "AI 시스템"}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={`/api/v1/assessments/${id}/pdf`} target="_blank">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </a>
        </Button>
      </div>

      {/* 판정 결과 배지 */}
      <Card className={`border-2 ${config.bg}`}>
        <CardContent className="flex items-center gap-4 py-8">
          <ResultIcon className={`h-12 w-12 ${config.color}`} />
          <div>
            <Badge className={`text-lg px-4 py-1 ${config.badge}`}>
              {config.label}
            </Badge>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                확신도: {Math.round(assessment.confidence * 100)}%
              </span>
              <Progress
                value={assessment.confidence * 100}
                className="w-24 h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 면책 고지 */}
      <div className="bg-muted/50 rounded-lg px-4 py-3 text-xs text-muted-foreground">
        <Scale className="h-3.5 w-3.5 inline mr-1" />
        본 판정은 AI 기반 참고용 분석이며, 법적 효력이 없습니다. 최종 확인은
        과기정통부 또는 법률 전문가에게 문의하세요.
      </div>

      {/* 해당 영역 */}
      {assessment.matched_domains && assessment.matched_domains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">해당 고영향 AI 영역</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {assessment.matched_domains.map((domain, i) => (
              <Badge key={i} variant="secondary" className="text-sm">
                {domain}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 법 조문 근거 */}
      {assessment.legal_basis && assessment.legal_basis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">관련 법 조문 근거</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assessment.legal_basis.map((basis, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="font-medium">{basis.article}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {basis.description}
                </p>
                <p className="text-sm mt-1">{basis.relevance}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 상세 분석 근거 (접기/펼치기) */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => setShowReasoning(!showReasoning)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">AI 분석 근거</CardTitle>
            <Button variant="ghost" size="sm">
              {showReasoning ? "접기" : "펼치기"}
            </Button>
          </div>
        </CardHeader>
        {showReasoning && (
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {assessment.reasoning}
            </p>
          </CardContent>
        )}
      </Card>

      {/* 의무사항 (고영향 AI인 경우) */}
      {assessment.result === "high_impact" && obligations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              이행해야 할 의무사항
            </CardTitle>
            <CardDescription>
              고영향 AI로 판정되어 다음 의무를 이행해야 합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {obligations.map((obligation, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">
                    {obligation.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {obligation.priority}
                  </Badge>
                </div>
                <p className="text-xs text-primary mb-1">
                  {obligation.article}
                </p>
                <p className="text-sm text-muted-foreground">
                  {obligation.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* CTA 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {assessment.result === "high_impact" && (
          <Link href={`/documents/new?system_id=${assessment.ai_system_id}&assessment_id=${id}`} className="flex-1">
            <Button className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              의무 문서 생성하기
            </Button>
          </Link>
        )}
        {assessment.result === "not_high_impact" && (
          <Link href="/tools/notice-generator" className="flex-1">
            <Button className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              투명성 고지 문구 생성하기
            </Button>
          </Link>
        )}
        <Link href="/ai-systems" className="flex-1">
          <Button variant="outline" className="w-full">
            AI 시스템 목록으로
          </Button>
        </Link>
      </div>
    </div>
  );
}
