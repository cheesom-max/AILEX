/**
 * 문서 관리 목록 페이지 (F3)
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { DOC_TYPE_LABELS, type DocumentType } from "@/types/database";

interface DocumentListItem {
  id: string;
  doc_type: string;
  title: string;
  status: string;
  version: number;
  created_at: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("id, doc_type, title, status, version, created_at")
        .order("created_at", { ascending: false });

      if (data) setDocuments(data);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const statusLabels = { draft: "초안", review: "검토중", final: "최종본" };
  const statusColors = {
    draft: "bg-yellow-100 text-yellow-700",
    review: "bg-blue-100 text-blue-700",
    final: "bg-green-100 text-green-700",
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
      <div>
        <h1 className="text-2xl font-bold">문서 관리</h1>
        <p className="text-muted-foreground">
          AI가 생성한 의무 문서를 관리합니다
        </p>
      </div>

      {documents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              생성된 문서가 없습니다
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              고영향 AI 판정 후 의무 문서를 생성할 수 있습니다
            </p>
            <Link href="/ai-systems">
              <Button>AI 시스템 관리로 이동</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Link key={doc.id} href={`/documents/${doc.id}`}>
              <Card className="hover:border-primary/20 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 py-4">
                  <FileText className="h-5 w-5 shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {DOC_TYPE_LABELS[doc.doc_type as DocumentType] || doc.doc_type}
                      {" | "}v{doc.version}
                      {" | "}
                      {new Date(doc.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={statusColors[doc.status as keyof typeof statusColors]}
                  >
                    {statusLabels[doc.status as keyof typeof statusLabels]}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
