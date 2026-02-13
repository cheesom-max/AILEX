/**
 * 모바일 헤더 (사이드바가 숨겨질 때 표시)
 */

"use client";

import Link from "next/link";
import { Shield, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, BOTTOM_NAV_ITEMS } from "@/lib/constants/navigation";

export function Header() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const allItems = [...NAV_ITEMS, ...BOTTOM_NAV_ITEMS];

  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">AILEX</span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">내비게이션 메뉴</SheetTitle>
          <div className="flex items-center gap-2 px-6 py-5 border-b">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">AILEX</span>
          </div>
          <nav className="px-3 py-4 space-y-1">
            {allItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              {profile?.email || ""}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
