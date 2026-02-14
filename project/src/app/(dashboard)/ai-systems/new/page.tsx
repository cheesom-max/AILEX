/**
 * AI 시스템 등록 페이지 (F6)
 * 서비스명, 설명, 사용 영역, AI 유형 등 입력
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DOMAIN_LABELS,
  AI_TYPE_LABELS,
  DATA_TYPE_LABELS,
  type AIType,
} from "@/types/database";
import { toast } from "sonner";
import Link from "next/link";

export default function NewAISystemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    domain: "",
    ai_type: "" as AIType | "",
    data_types: [] as string[],
    user_count: "",
    decision_impact: "" as string,
    status: "development" as string,
  });

  const handleDataTypeToggle = (dataType: string) => {
    setFormData((prev) => ({
      ...prev,
      data_types: prev.data_types.includes(dataType)
        ? prev.data_types.filter((d) => d !== dataType)
        : [...prev.data_types, dataType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/v1/ai-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_count: formData.user_count
            ? parseInt(formData.user_count)
            : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "등록에 실패했습니다");
        return;
      }

      toast.success("AI 시스템이 등록되었습니다");
      router.push(`/assessments/new?system_id=${data.id}`);
    } catch {
      toast.error("등록 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ai-systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">AI 시스템 등록</h1>
          <p className="text-muted-foreground">
            AI 서비스 정보를 입력하고 고영향 AI 판정을 받으세요
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>
            등록할 AI 시스템의 기본 정보를 입력해 주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 시스템명 */}
            <div className="space-y-2">
              <Label htmlFor="name">
                AI 시스템 이름 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="예: 채용 AI 면접 분석 시스템"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">서비스 설명</Label>
              <Textarea
                id="description"
                placeholder="AI 시스템이 하는 일을 간단히 설명해 주세요"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>

            {/* 사용 영역 */}
            <div className="space-y-2">
              <Label>
                사용 영역 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, domain: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="AI가 활용되는 영역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOMAIN_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* AI 유형 */}
            <div className="space-y-2">
              <Label>
                AI 유형 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.ai_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    ai_type: value as AIType,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="AI 시스템 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AI_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 데이터 유형 */}
            <div className="space-y-3">
              <Label>
                처리하는 데이터 유형{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(DATA_TYPE_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dt-${key}`}
                      checked={formData.data_types.includes(key)}
                      onCheckedChange={() => handleDataTypeToggle(key)}
                    />
                    <label
                      htmlFor={`dt-${key}`}
                      className="text-sm cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 이용자 수 */}
            <div className="space-y-2">
              <Label htmlFor="user_count">서비스 이용자 수 (대략적)</Label>
              <Input
                id="user_count"
                type="number"
                placeholder="예: 50000"
                value={formData.user_count}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    user_count: e.target.value,
                  }))
                }
                min={0}
              />
            </div>

            {/* 의사결정 영향도 */}
            <div className="space-y-2">
              <Label>
                의사결정 영향도 <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.decision_impact}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    decision_impact: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="AI의 의사결정 수준을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="information">
                    정보 제공 (참고 자료 제공)
                  </SelectItem>
                  <SelectItem value="recommendation">
                    추천 (사용자에게 추천/제안)
                  </SelectItem>
                  <SelectItem value="automated_decision">
                    자동 결정 (AI가 직접 결정)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 운영 상태 */}
            <div className="space-y-2">
              <Label>운영 상태</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">개발중</SelectItem>
                  <SelectItem value="production">운영중</SelectItem>
                  <SelectItem value="suspended">중단</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                등록하고 판정 시작하기
              </Button>
              <Link href="/ai-systems">
                <Button type="button" variant="outline">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
