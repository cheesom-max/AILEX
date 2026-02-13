/**
 * 랜딩 페이지
 * AI 기본법 컴플라이언스 자동화 플랫폼 소개
 */

import Link from "next/link";
import {
  Shield,
  Zap,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Scale,
  Bot,
  AlertTriangle,
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold">AILEX</span>
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">무료로 시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 px-4 py-1.5" variant="secondary">
              <Scale className="h-3.5 w-3.5 mr-1.5" />
              AI 기본법 2026.1.22 시행
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              AI 기본법 컴플라이언스,
              <br />
              <span className="text-primary">5분이면 충분합니다</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              고영향 AI 자가진단부터 영향평가서 자동 생성까지. 법무법인 컨설팅
              비용의 1/67로 AI 기본법을 대응하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  무료로 AI 기본법 해당 여부 확인하기
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-8"
                >
                  기능 살펴보기
                </Button>
              </Link>
            </div>

            {/* 위험 경고 배너 */}
            <div className="mt-10 bg-destructive/5 border border-destructive/20 rounded-lg px-6 py-4 max-w-xl mx-auto">
              <div className="flex items-start gap-3 text-left">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">
                    AI 기본법 위반 시 과태료 최대 3,000만원
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    투명성 고지 미이행 500만원~1,500만원 | 시정명령 불이행 최대
                    3,000만원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">
              AI 기본법 대응, 이렇게 자동화됩니다
            </h2>
            <p className="text-muted-foreground text-lg">
              법률 지식 없이도 3단계로 컴플라이언스를 완료하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  1단계: 고영향 AI 자동 판정
                </CardTitle>
                <CardDescription>
                  10~15개 질문에 답하면 AI가 법 조문과 대조하여 판정
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    11개 고영향 AI 영역 자동 분석
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    법 조문 근거와 함께 결과 제공
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    PDF 다운로드 (과기정통부 제출용)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    무료 1회 판정 제공
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  2단계: 의무 문서 AI 자동 생성
                </CardTitle>
                <CardDescription>
                  영향평가서, 투명성 보고서 등 4종 문서를 AI가 작성
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI 영향평가서 자동 생성
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    투명성 보고서 / 위험관리계획서
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    DOCX/PDF 다운로드
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    섹션별 수정 요청 가능
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">
                  3단계: 컴플라이언스 대시보드
                </CardTitle>
                <CardDescription>
                  이행 현황을 한눈에 확인하고 체계적으로 관리
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    시스템별 이행률 시각화
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    의무 체크리스트 추적
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    문서 이력 관리
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    경영진 보고용 리포트
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 비교 섹션 */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">왜 AILEX인가?</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg">
              <caption className="sr-only">
                AILEX와 법무법인, 글로벌 솔루션의 비용, 소요 시간, 지원 범위 비교
              </caption>
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium"></th>
                  <th className="text-center p-4 font-medium">법무법인</th>
                  <th className="text-center p-4 font-medium">글로벌 솔루션</th>
                  <th className="text-center p-4 font-bold text-primary">
                    AILEX
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">비용</td>
                  <td className="text-center p-4">건당 2,000만원+</td>
                  <td className="text-center p-4">연간 수천만원+</td>
                  <td className="text-center p-4 font-bold text-primary">
                    월 30만원
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">소요 시간</td>
                  <td className="text-center p-4">2~4주</td>
                  <td className="text-center p-4">수주~수개월</td>
                  <td className="text-center p-4 font-bold text-primary">
                    5분~30분
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">한국 AI 기본법</td>
                  <td className="text-center p-4">O (수동)</td>
                  <td className="text-center p-4">X</td>
                  <td className="text-center p-4 font-bold text-primary">
                    O (자동)
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">타깃</td>
                  <td className="text-center p-4">대기업</td>
                  <td className="text-center p-4">대기업</td>
                  <td className="text-center p-4 font-bold text-primary">
                    스타트업/중소기업
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 가격 섹션 */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-4">심플한 요금제</h2>
            <p className="text-muted-foreground">
              무료로 시작하고, 필요할 때 업그레이드하세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>AI 기본법 해당 여부 확인</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">무료</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    고영향 AI 판정 1회
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI 시스템 1개 등록
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    투명성 고지 문구 생성
                  </li>
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button variant="outline" className="w-full">
                    무료로 시작
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                추천
              </Badge>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>
                  문서 생성 + 체크리스트 + 대시보드
                </CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">월 30만원</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    고영향 AI 판정 무제한
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    AI 시스템 3개 등록
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    의무 문서 4종 자동 생성
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    컴플라이언스 체크리스트
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    대시보드 + DOCX/PDF 다운로드
                  </li>
                </ul>
                <Link href="/signup" className="block mt-6">
                  <Button className="w-full">Pro 시작하기</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>대규모 AI 시스템 관리</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">문의</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    무제한 AI 시스템
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Pro 플랜의 모든 기능
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    전담 지원
                  </li>
                  <li className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    감사 대응 모드 (예정)
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  문의하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 AI 기본법 대응을 시작하세요
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            계도 기간이 끝나기 전에 준비를 완료하세요. 무료 자가진단으로 5분이면
            됩니다.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base px-10">
              무료로 시작하기
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">AILEX</span>
              <span className="text-sm text-muted-foreground">
                AI Law EXpert
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              본 서비스는 AI 기반 참고용 분석을 제공하며, 법적 자문을 대체하지
              않습니다.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
