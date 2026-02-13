/**
 * 투명성 고지 문구 생성기 페이지 (F5)
 * GPT-4o-mini로 3종 고지 문구 즉시 생성
 */

"use client";

import { useState } from "react";
import {
  MessageSquareText,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { NoticeGeneratorResponse } from "@/types/database";
import { toast } from "sonner";

export default function NoticeGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NoticeGeneratorResponse | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    service_type: "" as string,
    ai_usage_type: "",
    service_name: "",
    ai_description: "",
    uses_generative_ai: false,
  });

  const handleGenerate = async () => {
    if (!formData.service_type || !formData.service_name) {
      toast.error("서비스 유형과 서비스명을 입력해 주세요");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/tools/notice-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "문구 생성에 실패했습니다");
        return;
      }

      setResult(data);
      toast.success("고지 문구가 생성되었습니다");
    } catch {
      toast.error("생성 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success("클립보드에 복사되었습니다");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">투명성 고지 문구 생성기</h1>
        <p className="text-muted-foreground">
          AI 기본법 제31조에 따라 서비스에 삽입할 고지 문구를 자동으로
          생성합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">서비스 정보 입력</CardTitle>
          <CardDescription>
            서비스 정보를 입력하면 3가지 형태의 고지 문구를 즉시 생성합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>
              서비스 유형 <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.service_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, service_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="서비스 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">웹사이트</SelectItem>
                <SelectItem value="mobile_app">모바일 앱</SelectItem>
                <SelectItem value="api_service">API 서비스</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              서비스명 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="예: AI 채용 분석 서비스"
              value={formData.service_name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  service_name: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>AI 활용 방식</Label>
            <Input
              placeholder="예: 추천, 분류, 생성, 분석"
              value={formData.ai_usage_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ai_usage_type: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>AI 기능 설명</Label>
            <Textarea
              placeholder="예: 사용자의 이력서를 분석하여 직무 적합도를 점수화합니다"
              value={formData.ai_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ai_description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="generative"
              checked={formData.uses_generative_ai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  uses_generative_ai: !!checked,
                }))
              }
            />
            <label htmlFor="generative" className="text-sm cursor-pointer">
              생성형 AI를 사용합니다 (텍스트/이미지/코드 생성 등)
            </label>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <MessageSquareText className="h-4 w-4 mr-2" />
            )}
            고지 문구 생성하기
          </Button>
        </CardContent>
      </Card>

      {/* 생성 결과 */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">생성된 고지 문구</CardTitle>
            <CardDescription>
              각 문구를 복사하여 서비스에 삽입하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="terms">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="terms">이용약관용</TabsTrigger>
                <TabsTrigger value="popup">팝업/배너용</TabsTrigger>
                <TabsTrigger value="api">API 헤더용</TabsTrigger>
              </TabsList>

              <TabsContent value="terms" className="space-y-4">
                <div className="relative">
                  <div className="bg-muted rounded-lg p-4 text-sm leading-relaxed">
                    {result.terms_notice}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleCopy(result.terms_notice, "terms")
                    }
                  >
                    {copied === "terms" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <Badge variant="secondary" className="text-xs">
                  이용약관 또는 개인정보처리방침에 삽입
                </Badge>
              </TabsContent>

              <TabsContent value="popup" className="space-y-4">
                <div className="relative">
                  <div className="bg-muted rounded-lg p-4 text-sm leading-relaxed">
                    {result.popup_notice}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleCopy(result.popup_notice, "popup")
                    }
                  >
                    {copied === "popup" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <Badge variant="secondary" className="text-xs">
                  UI 팝업 또는 배너에 표시
                </Badge>
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <div className="relative">
                  <div className="bg-muted rounded-lg p-4 text-sm font-mono leading-relaxed">
                    X-AI-Disclosure: {result.api_header_notice}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleCopy(
                        `X-AI-Disclosure: ${result.api_header_notice}`,
                        "api"
                      )
                    }
                  >
                    {copied === "api" ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
                <Badge variant="secondary" className="text-xs">
                  API 응답 헤더에 포함
                </Badge>
              </TabsContent>
            </Tabs>

            {/* 워터마크 안내 (생성형 AI 사용 시) */}
            {result.watermark_guide && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      워터마크 표시 의무 안내
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {result.watermark_guide}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
