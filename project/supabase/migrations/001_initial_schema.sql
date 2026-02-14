-- =============================================
-- AILEX - AI Law EXpert
-- 초기 데이터베이스 스키마
-- AI 기본법 컴플라이언스 자동화 플랫폼
-- =============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. users 테이블 (Supabase Auth 확장)
-- =============================================
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  company_name TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- users RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자 본인만 조회 가능
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 사용자 본인만 수정 가능
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 새 사용자 등록 시 INSERT 허용
CREATE POLICY "users_insert_own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 새 사용자 가입 시 자동으로 users 레코드 생성하는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. ai_systems 테이블 (등록된 AI 시스템)
-- =============================================
CREATE TABLE public.ai_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  domain TEXT NOT NULL,
  ai_type TEXT NOT NULL CHECK (ai_type IN ('generative', 'predictive', 'classification', 'recommendation', 'detection', 'other')),
  data_types TEXT[] NOT NULL DEFAULT '{}',
  user_count INTEGER,
  decision_impact TEXT NOT NULL CHECK (decision_impact IN ('information', 'recommendation', 'automated_decision')),
  status TEXT NOT NULL DEFAULT 'development' CHECK (status IN ('development', 'production', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ai_systems RLS
ALTER TABLE public.ai_systems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_systems_select_own" ON public.ai_systems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ai_systems_insert_own" ON public.ai_systems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_systems_update_own" ON public.ai_systems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ai_systems_delete_own" ON public.ai_systems
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 3. assessments 테이블 (고영향 AI 판정 결과)
-- =============================================
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ai_system_id UUID NOT NULL REFERENCES public.ai_systems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('high_impact', 'not_high_impact', 'uncertain')),
  confidence FLOAT NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  matched_domains TEXT[] NOT NULL DEFAULT '{}',
  legal_basis JSONB NOT NULL DEFAULT '[]',
  reasoning TEXT NOT NULL,
  user_inputs JSONB NOT NULL DEFAULT '{}',
  obligations JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- assessments RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessments_select_own" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "assessments_insert_own" ON public.assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. compliance_items 테이블 (체크리스트 항목)
-- =============================================
CREATE TABLE public.compliance_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  ai_system_id UUID NOT NULL REFERENCES public.ai_systems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  obligation_type TEXT NOT NULL CHECK (obligation_type IN ('transparency', 'risk_management', 'impact_assessment', 'documentation', 'user_protection')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  legal_reference TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- compliance_items RLS
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "compliance_items_select_own" ON public.compliance_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "compliance_items_insert_own" ON public.compliance_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "compliance_items_update_own" ON public.compliance_items
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 5. documents 테이블 (생성된 의무 문서)
-- =============================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ai_system_id UUID NOT NULL REFERENCES public.ai_systems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  compliance_item_id UUID REFERENCES public.compliance_items(id) ON DELETE SET NULL,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('impact_assessment', 'transparency_report', 'user_notice', 'risk_management_plan')),
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  version INTEGER NOT NULL DEFAULT 1,
  file_url TEXT,
  file_format TEXT CHECK (file_format IN ('pdf', 'docx') OR file_format IS NULL),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'final')),
  ai_model TEXT NOT NULL DEFAULT 'gpt-4o',
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- documents RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_own" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "documents_insert_own" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "documents_update_own" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- 6. audit_logs 테이블 (감사 로그)
-- =============================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT '',
  resource_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- audit_logs RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_select_own" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "audit_logs_insert_own" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 인덱스
-- =============================================
CREATE INDEX idx_ai_systems_user_id ON public.ai_systems(user_id);
CREATE INDEX idx_assessments_ai_system_id ON public.assessments(ai_system_id);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_compliance_items_assessment_id ON public.compliance_items(assessment_id);
CREATE INDEX idx_compliance_items_ai_system_id ON public.compliance_items(ai_system_id);
CREATE INDEX idx_compliance_items_user_id ON public.compliance_items(user_id);
CREATE INDEX idx_documents_ai_system_id ON public.documents(ai_system_id);
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =============================================
-- updated_at 자동 갱신 트리거
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_systems_updated_at
  BEFORE UPDATE ON public.ai_systems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_items_updated_at
  BEFORE UPDATE ON public.compliance_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Supabase Storage 버킷 (문서 파일 저장용)
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 문서 스토리지 접근 정책
CREATE POLICY "documents_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "documents_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
