/**
 * 비밀번호 재설정 페이지
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });

      if (error) {
        toast.error("비밀번호 재설정 이메일 발송에 실패했습니다");
        return;
      }

      setSent(true);
      toast.success("비밀번호 재설정 이메일이 발송되었습니다");
    } catch {
      toast.error("오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AILEX</span>
          </Link>
          <CardTitle className="text-xl">비밀번호 재설정</CardTitle>
          <CardDescription>
            가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>{email}</strong>로 비밀번호 재설정 이메일이
                발송되었습니다. 이메일을 확인해 주세요.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  로그인으로 돌아가기
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                재설정 이메일 발송
              </Button>
              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  로그인으로 돌아가기
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
