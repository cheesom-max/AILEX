/**
 * 문서 생성 페이지 (F3)
 * 문서 유형 선택 + 추가 정보 입력 + AI 문서 생성
 */

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DOC_TYPE_LABELS, type DocumentType } from "@/types/database";
import { toast } from "sonner";
import Link from "next/link";

function DocumentGenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const systemId = searchParams.get("system_id") || "";
  const assessmentId = searchParams.get("assessment_id") || "";

  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<DocumentType | "">("");
  const [additionalInputs, setAdditionalInputs] = useState({
    target_users: "",
    data_retention_period: "",
    bias_mitigation_measures: "",
    human_review_process: "",
    additional_info: "",
  });

  const handleGenerate = async () => {
    if (!docType) {
      toast.error("문서 유형을 선택해 주세요");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_system_id: systemId,
          assessment_id: assessmentId,
          doc_type: docType,
          additional_inputs: Object.fromEntries(
            Object.entries(additionalInputs).filter(([, v]) => v.trim())
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "문서 생성에 실패했습니다");
        return;
      }

      toast.success("문서가 생성되었습니다");
      router.push(`/documents/${data.id}`);
    } catch {
      toast.error("문서 생성 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Shield className="h-16 w-16 text-primary animate-pulse mb-6" />
            <h2 className="text-xl font-bold mb-2">
              AI가 문서를 작성하고 있습니다...
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {docType && DOC_TYPE_LABELS[docType]}를 AI 기본법에 맞게 작성
              중입니다
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-4">
              약 30~60초 소요됩니다
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ai-systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">의무 문서 생성</h1>
          <p className="text-muted-foreground">
            AI가 법적 의무 문서를 자동으로 작성합니다
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문서 유형 선택</CardTitle>
          <CardDescription>
            생성할 문서의 유형을 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>
              문서 유형 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={docType}
              onValueChange={(value) =>
                setDocType(value as DocumentType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="문서 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DOC_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {docType && (
            <>
              <div className="space-y-2">
                <Label>대상 이용자 그룹</Label>
                <Input
                  placeholder="예: 20~30대 구직자"
                  value={additionalInputs.target_users}
                  onChange={(e) =>
                    setAdditionalInputs((prev) => ({
                      ...prev,
                      target_users: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>데이터 보관 기간</Label>
                <Input
                  placeholder="예: 채용 완료 후 180일"
                  value={additionalInputs.data_retention_period}
                  onChange={(e) =>
                    setAdditionalInputs((prev) => ({
                      ...prev,
                      data_retention_period: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>편향 방지 조치</Label>
                <Textarea
                  placeholder="예: 성별/연령/학교명 블라인드 처리"
                  value={additionalInputs.bias_mitigation_measures}
                  onChange={(e) =>
                    setAdditionalInputs((prev) => ({
                      ...prev,
                      bias_mitigation_measures: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>인간 검토 프로세스</Label>
                <Textarea
                  placeholder="예: AI 스크리닝 결과를 인사담당자가 전수 검토 후 최종 결정"
                  value={additionalInputs.human_review_process}
                  onChange={(e) =>
                    setAdditionalInputs((prev) => ({
                      ...prev,
                      human_review_process: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>추가 정보</Label>
                <Textarea
                  placeholder="문서 품질 향상을 위한 추가 정보"
                  value={additionalInputs.additional_info}
                  onChange={(e) =>
                    setAdditionalInputs((prev) => ({
                      ...prev,
                      additional_info: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={loading}
              >
                <FileText className="h-4 w-4 mr-2" />
                문서 생성 시작
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DocumentGenerateContent />
    </Suspense>
  );
}
