/**
 * AI 시스템 목록 페이지 (F6)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bot,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  ClipboardCheck,
  Loader2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AISystem } from "@/types/database";
import { AI_TYPE_LABELS, DOMAIN_LABELS, type HighImpactDomain } from "@/types/database";
import { toast } from "sonner";

export default function AISystemsPage() {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSystems = async () => {
    try {
      const response = await fetch("/api/v1/ai-systems");
      if (response.ok) {
        const data = await response.json();
        setSystems(data);
      }
    } catch (error) {
      console.error("AI 시스템 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 AI 시스템을 삭제하시겠습니까? 관련 판정 결과와 문서도 모두 삭제됩니다.")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/ai-systems/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("AI 시스템이 삭제되었습니다");
        setSystems((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error("삭제에 실패했습니다");
      }
    } catch {
      toast.error("삭제 중 오류가 발생했습니다");
    }
  };

  const statusLabels = {
    development: "개발중",
    production: "운영중",
    suspended: "중단",
  };

  const statusColors = {
    development: "bg-blue-100 text-blue-700",
    production: "bg-green-100 text-green-700",
    suspended: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI 시스템 관리</h1>
          <p className="text-muted-foreground">
            등록된 AI 시스템의 목록과 상태를 관리합니다
          </p>
        </div>
        <Link href="/ai-systems/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            AI 시스템 등록
          </Button>
        </Link>
      </div>

      {systems.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              등록된 AI 시스템이 없습니다
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              AI 시스템을 등록하면 고영향 AI 판정을 받을 수 있습니다
            </p>
            <Link href="/ai-systems/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 AI 시스템 등록하기
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systems.map((system) => (
            <Card key={system.id} className="hover:border-primary/20 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">
                      {system.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {system.description || "설명 없음"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/ai-systems/${system.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(system.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={statusColors[system.status as keyof typeof statusColors]}>
                    {statusLabels[system.status as keyof typeof statusLabels]}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {AI_TYPE_LABELS[system.ai_type as keyof typeof AI_TYPE_LABELS] || system.ai_type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  영역: {DOMAIN_LABELS[system.domain as HighImpactDomain] || system.domain}
                </p>
                <div className="flex gap-2 pt-2">
                  <Link href={`/assessments/new?system_id=${system.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <ClipboardCheck className="h-3.5 w-3.5 mr-1.5" />
                      판정하기
                    </Button>
                  </Link>
                  <Link href={`/ai-systems/${system.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full">
                      상세보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
