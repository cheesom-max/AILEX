/**
 * GET /api/v1/documents/:id/download
 * 문서 파일 다운로드 (PDF/DOCX)
 * 서버에서 Markdown을 DOCX로 변환하여 반환
 */

import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  errorResponse,
  checkPlanAccess,
  createAuditLog,
} from "@/lib/api-helpers";
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

type RouteParams = { params: Promise<{ id: string }> };

/** Markdown을 DOCX 파라그래프로 변환하는 간단한 파서 */
function markdownToDocxParagraphs(markdown: string): Paragraph[] {
  const lines = markdown.split("\n");
  const paragraphs: Paragraph[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      paragraphs.push(new Paragraph({ text: "" }));
      continue;
    }

    // 헤딩 레벨 감지
    if (trimmed.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^# /, ""),
              bold: true,
              size: 32,
              font: "맑은 고딕",
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
        })
      );
    } else if (trimmed.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^## /, ""),
              bold: true,
              size: 28,
              font: "맑은 고딕",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (trimmed.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed.replace(/^### /, ""),
              bold: true,
              size: 24,
              font: "맑은 고딕",
            }),
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 },
        })
      );
    } else if (trimmed.startsWith("- ")) {
      // 리스트 아이템
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `  \u2022  ${trimmed.replace(/^- /, "")}`,
              size: 22,
              font: "맑은 고딕",
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
      );
    } else if (/^\d+\./.test(trimmed)) {
      // 숫자 리스트
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `  ${trimmed}`,
              size: 22,
              font: "맑은 고딕",
            }),
          ],
          spacing: { before: 40, after: 40 },
        })
      );
    } else {
      // 일반 텍스트
      // **볼드** 텍스트 처리
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
      const runs = parts.map((part) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return new TextRun({
            text: part.slice(2, -2),
            bold: true,
            size: 22,
            font: "맑은 고딕",
          });
        }
        return new TextRun({
          text: part,
          size: 22,
          font: "맑은 고딕",
        });
      });

      paragraphs.push(
        new Paragraph({
          children: runs,
          spacing: { before: 60, after: 60 },
        })
      );
    }
  }

  return paragraphs;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { user, supabase, error } = await getAuthenticatedUser();
    if (!user) return errorResponse(error!, 401);

    const access = await checkPlanAccess(user.id, "can_download_files");
    if (!access.allowed) {
      return errorResponse(access.message!, 403);
    }

    // 문서 조회
    const { data: document, error: dbError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (dbError || !document) {
      return errorResponse("문서를 찾을 수 없습니다", 404);
    }

    const format = request.nextUrl.searchParams.get("format") || "docx";

    if (format === "docx") {
      // DOCX 생성
      const docxParagraphs = markdownToDocxParagraphs(document.content);

      // 면책 고지 추가
      docxParagraphs.push(
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: "---",
              size: 20,
              font: "맑은 고딕",
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "면책 고지: 본 문서는 AI에 의해 자동 생성된 초안이며, 법적 효력을 보장하지 않습니다. 최종 문서는 법률 전문가의 검토를 받으시기 바랍니다.",
              italics: true,
              size: 18,
              font: "맑은 고딕",
              color: "666666",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `생성일: ${new Date(document.created_at).toLocaleDateString("ko-KR")} | AILEX (AI Law EXpert) | 버전 ${document.version}`,
              size: 16,
              font: "맑은 고딕",
              color: "999999",
            }),
          ],
          spacing: { before: 80 },
        })
      );

      const doc = new DocxDocument({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440,
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: docxParagraphs,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      // 감사 로그
      await createAuditLog({
        userId: user.id,
        action: "document_downloaded",
        resourceType: "document",
        resourceId: id,
        metadata: { format: "docx" },
      });

      const fileName = `${document.title.replace(/[^a-zA-Z0-9가-힣]/g, "_")}_v${document.version}.docx`;

      // Buffer를 Uint8Array로 변환하여 Response에 전달
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        },
      });
    }

    // PDF는 클라이언트 사이드에서 생성 (Markdown 데이터 반환)
    return new Response(JSON.stringify({ content: document.content, title: document.title }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("문서 다운로드 에러:", error);
    return errorResponse("서버 오류가 발생했습니다", 500);
  }
}
