/**
 * 문서 상세/미리보기 페이지 (F3)
 * Markdown 렌더링 + 다운로드 + 수정 요청
 */

"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Pencil,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Document } from "@/types/database";
import { DOC_TYPE_LABELS, type DocumentType } from "@/types/database";
import { toast } from "sonner";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [editSection, setEditSection] = useState("");
  const [editInstruction, setEditInstruction] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/v1/documents/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        toast.error("문서를 불러올 수 없습니다");
      }
    } catch (error) {
      console.error("문서 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 수정 요청
  const handleEdit = async () => {
    if (!editSection || !editInstruction) {
      toast.error("수정할 섹션과 지시사항을 모두 입력해 주세요");
      return;
    }

    setEditing(true);

    try {
      const response = await fetch(`/api/v1/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: editSection,
          instruction: editInstruction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "수정에 실패했습니다");
        return;
      }

      setDocument(data);
      setEditSection("");
      setEditInstruction("");
      toast.success("문서가 수정되었습니다");
    } catch {
      toast.error("수정 중 오류가 발생했습니다");
    } finally {
      setEditing(false);
    }
  };

  // 최종본 저장
  const handleFinalize = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/v1/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "final" }),
      });

      if (response.ok) {
        const data = await response.json();
        setDocument(data);
        toast.success("최종본으로 저장되었습니다");
      }
    } catch {
      toast.error("저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  // DOCX 다운로드
  const handleDownload = async () => {
    try {
      const response = await fetch(
        `/api/v1/documents/${id}/download?format=docx`
      );
      if (!response.ok) {
        toast.error("다운로드에 실패했습니다");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document?.title || "문서"}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      toast.success("다운로드가 시작되었습니다");
    } catch {
      toast.error("다운로드 중 오류가 발생했습니다");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">문서를 찾을 수 없습니다</p>
      </div>
    );
  }

  const statusLabels = { draft: "초안", review: "검토중", final: "최종본" };
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    review: "bg-blue-100 text-blue-700",
    final: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/ai-systems">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">{document.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="secondary"
                className={
                  statusColors[document.status as keyof typeof statusColors]
                }
              >
                {statusLabels[document.status as keyof typeof statusLabels]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                v{document.version} |{" "}
                {DOC_TYPE_LABELS[document.doc_type as DocumentType]}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* 수정 요청 다이얼로그 */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                수정 요청
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>문서 수정 요청</DialogTitle>
                <DialogDescription>
                  수정할 섹션과 수정 지시사항을 입력하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>수정할 섹션</Label>
                  <Input
                    placeholder="예: 3.1 기본권 영향 분석"
                    value={editSection}
                    onChange={(e) => setEditSection(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>수정 지시</Label>
                  <Textarea
                    placeholder="예: 개인정보 영향에 대해 더 구체적으로 작성해 주세요"
                    value={editInstruction}
                    onChange={(e) => setEditInstruction(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleEdit}
                  disabled={editing}
                  className="w-full"
                >
                  {editing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Pencil className="h-4 w-4 mr-2" />
                  )}
                  수정 요청 보내기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            DOCX
          </Button>

          {document.status !== "final" && (
            <Button size="sm" onClick={handleFinalize} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              최종본 저장
            </Button>
          )}
        </div>
      </div>

      {/* 문서 본문 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">문서 내용</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {document.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* 메타 정보 */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>모델: {document.ai_model}</span>
            <span>
              토큰: {document.prompt_tokens.toLocaleString()} +{" "}
              {document.completion_tokens.toLocaleString()}
            </span>
            <span>
              생성일:{" "}
              {new Date(document.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
