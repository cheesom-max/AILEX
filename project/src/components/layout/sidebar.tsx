/**
 * 대시보드 사이드바 네비게이션
 * 모든 보호된 페이지에서 공통 사용
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Shield, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/constants/navigation";

const planLabels: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
};

const planColors: Record<string, string> = {
  free: "bg-gray-100 text-gray-700",
  pro: "bg-blue-100 text-blue-700",
  enterprise: "bg-purple-100 text-purple-700",
};

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border lg:bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Shield className="h-7 w-7 text-primary" />
        <span className="text-xl font-bold">AILEX</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.pro && profile?.plan === "free" && (
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs px-1.5 py-0"
                >
                  Pro
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="px-3 py-4 space-y-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <Separator />

      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {profile?.name || profile?.email || "사용자"}
            </p>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-1.5 py-0",
                planColors[profile?.plan || "free"]
              )}
            >
              {planLabels[profile?.plan || "free"]}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </aside>
  );
}
