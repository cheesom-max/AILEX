/**
 * 고영향 AI 판정 설문 페이지 (F1 핵심)
 * 10~15개 질문 스텝 폼 + GPT-4o 판정 실행
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Progress } from "@/components/ui/progress";
import { DOMAIN_LABELS, DATA_TYPE_LABELS } from "@/types/database";
import { toast } from "sonner";
import Link from "next/link";

/** 설문 질문 정의 */
const QUESTIONS = [
  {
    id: "service_domain",
    title: "AI가 활용되는 영역을 선택해 주세요",
    description: "AI 기본법 제27조에서 규정한 11개 고영향 AI 영역입니다. 해당하는 모든 영역을 선택하세요.",
    type: "multi_select" as const,
  },
  {
    id: "ai_functionality",
    title: "AI의 주요 기능은 무엇인가요?",
    description: "AI 시스템이 수행하는 핵심 기능을 구체적으로 설명해 주세요.",
    type: "textarea" as const,
    placeholder: "예: 이력서를 분석하여 직무 적합도를 점수화하고, 1차 스크리닝에서 하위 30%를 자동 탈락 처리",
  },
  {
    id: "decision_type",
    title: "AI의 의사결정 유형은 무엇인가요?",
    description: "AI가 최종 결정을 직접 내리는지, 추천/보조 역할인지 선택하세요.",
    type: "select" as const,
  },
  {
    id: "data_types",
    title: "처리하는 데이터에 어떤 유형이 포함되나요?",
    description: "AI 시스템이 수집/처리하는 데이터 유형을 모두 선택하세요.",
    type: "data_select" as const,
  },
  {
    id: "affected_user_count",
    title: "AI 서비스의 영향을 받는 이용자 수는?",
    description: "대략적인 이용자 수를 입력하세요.",
    type: "number" as const,
    placeholder: "예: 50000",
  },
  {
    id: "impact_on_rights",
    title: "이용자의 기본권에 어떤 영향을 미치나요?",
    description: "AI의 결정이 이용자의 권리(직업, 교육, 건강, 금융 등)에 미치는 영향을 설명하세요.",
    type: "textarea" as const,
    placeholder: "예: 채용 합격/불합격에 직접 영향을 미침",
  },
  {
    id: "human_oversight",
    title: "인간 감독 체계가 있나요?",
    description: "AI 결정을 사람이 검토하거나 최종 승인하는 절차가 있는지 설명하세요.",
    type: "textarea" as const,
    placeholder: "예: 최종 결정은 인사담당자가 검토",
  },
  {
    id: "risk_mitigation",
    title: "위험 완화 조치가 있나요?",
    description: "편향 방지, 오류 감지, 보안 조치 등 현재 적용 중인 안전 조치를 설명하세요.",
    type: "textarea" as const,
    placeholder: "예: 편향 감지 알고리즘 적용, 정기적 정확도 모니터링",
  },
  {
    id: "service_description",
    title: "AI 서비스에 대해 상세히 설명해 주세요",
    description: "서비스 전체 흐름, 이용자와의 상호작용 방식 등을 구체적으로 작성하세요.",
    type: "textarea" as const,
    placeholder: "예: AI가 이력서를 분석하여 직무 적합도를 점수화하고...",
  },
  {
    id: "additional_context",
    title: "추가로 알려주실 내용이 있나요?",
    description: "판정에 참고할 추가 정보가 있다면 자유롭게 입력하세요.",
    type: "textarea" as const,
    placeholder: "예: 연간 채용 공고 200건, 지원자 5만명 처리",
  },
];

function AssessmentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const systemId = searchParams.get("system_id");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_domain: [] as string[],
    ai_functionality: "",
    decision_type: "",
    data_types: [] as string[],
    affected_user_count: "",
    impact_on_rights: "",
    human_oversight: "",
    risk_mitigation: "",
    service_description: "",
    deployment_status: "production",
    additional_context: "",
  });

  useEffect(() => {
    if (!systemId) {
      toast.error("AI 시스템을 먼저 선택해 주세요");
      router.push("/ai-systems");
    }
  }, [systemId, router]);

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const handleDomainToggle = (domain: string) => {
    setFormData((prev) => ({
      ...prev,
      service_domain: prev.service_domain.includes(domain)
        ? prev.service_domain.filter((d) => d !== domain)
        : [...prev.service_domain, domain],
    }));
  };

  const handleDataTypeToggle = (dt: string) => {
    setFormData((prev) => ({
      ...prev,
      data_types: prev.data_types.includes(dt)
        ? prev.data_types.filter((d) => d !== dt)
        : [...prev.data_types, dt],
    }));
  };

  // 판정 실행
  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/v1/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_system_id: systemId,
          questionnaire: {
            ...formData,
            affected_user_count: parseInt(formData.affected_user_count) || 0,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "판정에 실패했습니다");
        return;
      }

      toast.success("판정이 완료되었습니다");
      router.push(`/assessments/${data.id}`);
    } catch {
      toast.error("판정 실행 중 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 판정 실행 중 로딩 화면
  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <Shield className="h-16 w-16 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI가 판정 중입니다...</h2>
            <p className="text-muted-foreground text-center mb-6">
              AI 기본법 제27조 및 시행령 제24조의 기준에 따라
              <br />
              고영향 AI 해당 여부를 분석하고 있습니다
            </p>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-4">
              약 15~30초 소요됩니다
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <Link href="/ai-systems">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">고영향 AI 판정</h1>
          <p className="text-muted-foreground">
            아래 질문에 답변하면 AI 기본법 기준으로 판정합니다
          </p>
        </div>
      </div>

      {/* 진행 바 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {step + 1} / {QUESTIONS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 질문 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 영역 다중 선택 */}
          {currentQuestion.type === "multi_select" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(DOMAIN_LABELS).filter(([k]) => k !== "other").map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`domain-${key}`}
                    checked={formData.service_domain.includes(key)}
                    onCheckedChange={() => handleDomainToggle(key)}
                  />
                  <label htmlFor={`domain-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="domain-other"
                  checked={formData.service_domain.includes("other")}
                  onCheckedChange={() => handleDomainToggle("other")}
                />
                <label htmlFor="domain-other" className="text-sm cursor-pointer">
                  기타
                </label>
              </div>
            </div>
          )}

          {/* 데이터 유형 선택 */}
          {currentQuestion.type === "data_select" && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(DATA_TYPE_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`data-${key}`}
                    checked={formData.data_types.includes(key)}
                    onCheckedChange={() => handleDataTypeToggle(key)}
                  />
                  <label htmlFor={`data-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* 드롭다운 선택 */}
          {currentQuestion.type === "select" && (
            <Select
              value={formData.decision_type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, decision_type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="information">
                  정보 제공 (참고 자료로 제공)
                </SelectItem>
                <SelectItem value="recommendation">
                  추천 (사용자에게 추천/제안)
                </SelectItem>
                <SelectItem value="automated_decision">
                  자동 결정 (AI가 직접 결정)
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* 텍스트 입력 */}
          {currentQuestion.type === "textarea" && (
            <Textarea
              value={formData[currentQuestion.id as keyof typeof formData] as string}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [currentQuestion.id]: e.target.value,
                }))
              }
              placeholder={currentQuestion.placeholder}
              rows={4}
            />
          )}

          {/* 숫자 입력 */}
          {currentQuestion.type === "number" && (
            <Input
              type="number"
              value={formData.affected_user_count}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  affected_user_count: e.target.value,
                }))
              }
              placeholder={currentQuestion.placeholder}
              min={0}
            />
          )}
        </CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          이전
        </Button>

        {step < QUESTIONS.length - 1 ? (
          <Button onClick={handleNext}>
            다음
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={loading}>
            <CheckCircle className="h-4 w-4 mr-2" />
            판정 실행
          </Button>
        )}
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AssessmentFormContent />
    </Suspense>
  );
}
