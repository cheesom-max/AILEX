/**
 * 대시보드 네비게이션 항목 정의
 * header.tsx와 sidebar.tsx에서 공통 사용
 */

import {
  LayoutDashboard,
  Bot,
  ClipboardCheck,
  FileText,
  MessageSquareText,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Pro 플랜 이상에서만 사용 가능한 기능 표시 */
  pro?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "대시보드", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI 시스템 관리", href: "/ai-systems", icon: Bot },
  { label: "판정 결과", href: "/assessments", icon: ClipboardCheck },
  { label: "문서 관리", href: "/documents", icon: FileText, pro: true },
  { label: "고지 문구 생성기", href: "/tools/notice-generator", icon: MessageSquareText },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "플랜 관리", href: "/pricing", icon: CreditCard },
];
