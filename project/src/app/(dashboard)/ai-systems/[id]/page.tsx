/**
 * AI 시스템 상세 페이지 (F6)
 * 시스템 정보 + 판정 이력 + 문서 목록
 */

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Loader2,
  Bot,
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
import type { AISystem, Assessment } from "@/types/database";
import { AI_TYPE_LABELS, DOMAIN_LABELS, type HighImpactDomain, type AIType } from "@/types/database";

interface AISystemDetail extends AISystem {
  assessments: Assessment[];
  documents: { id: string; doc_type: string; title: string; status: string; version: number; created_at: string }[];
}

export default function AISystemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [system, setSystem] = useState<AISystemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const response = await fetch(`/api/v1/ai-systems/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSystem(data);
        }
      } catch (error) {
        console.error("AI 시스템 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!system) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">AI 시스템을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ai-systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{system.name}</h1>
          <p className="text-muted-foreground">
            {system.description || "설명 없음"}
          </p>
        </div>
        <Link href={`/assessments/new?system_id=${id}`}>
          <Button>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            판정하기
          </Button>
        </Link>
      </div>

      {/* 시스템 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-4 w-4" />
            시스템 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">사용 영역:</span>{" "}
              {DOMAIN_LABELS[system.domain as HighImpactDomain] || system.domain}
            </div>
            <div>
              <span className="text-muted-foreground">AI 유형:</span>{" "}
              {AI_TYPE_LABELS[system.ai_type as AIType] || system.ai_type}
            </div>
            <div>
              <span className="text-muted-foreground">이용자 수:</span>{" "}
              {system.user_count?.toLocaleString() || "미입력"}
            </div>
            <div>
              <span className="text-muted-foreground">의사결정 수준:</span>{" "}
              {system.decision_impact === "automated_decision"
                ? "자동 결정"
                : system.decision_impact === "recommendation"
                  ? "추천"
                  : "정보 제공"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 판정 이력 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">판정 이력</CardTitle>
          <CardDescription>
            {system.assessments.length}건의 판정 결과
          </CardDescription>
        </CardHeader>
        <CardContent>
          {system.assessments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              아직 판정을 실행하지 않았습니다
            </p>
          ) : (
            <div className="space-y-2">
              {system.assessments.map((assessment) => (
                <Link key={assessment.id} href={`/assessments/${assessment.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Badge
                      variant="secondary"
                      className={
                        assessment.result === "high_impact"
                          ? "bg-red-100 text-red-700"
                          : assessment.result === "not_high_impact"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {assessment.result === "high_impact"
                        ? "해당"
                        : assessment.result === "not_high_impact"
                          ? "비해당"
                          : "확인필요"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      확신도 {Math.round(assessment.confidence * 100)}%
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {new Date(assessment.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* 문서 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            생성된 문서
          </CardTitle>
        </CardHeader>
        <CardContent>
          {system.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              생성된 문서가 없습니다
            </p>
          ) : (
            <div className="space-y-2">
              {system.documents.map((doc) => (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm flex-1 truncate">{doc.title}</span>
                    <Badge variant="outline" className="text-xs">
                      v{doc.version}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
