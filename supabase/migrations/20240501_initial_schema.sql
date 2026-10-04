
-- Create tables for CMPDI Intelligence Copilot

CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    document_type TEXT NOT NULL,
    organization TEXT,
    project TEXT,
    mine TEXT,
    year INTEGER,
    file_type TEXT DEFAULT 'PDF',
    page_count INTEGER,
    status TEXT DEFAULT 'UPLOADED',
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    department TEXT,
    status TEXT DEFAULT 'ACTIVE',
    document_count INTEGER DEFAULT 0,
    last_synced TIMESTAMPTZ,
    description TEXT
);

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    report_type TEXT NOT NULL,
    project TEXT,
    period TEXT,
    status TEXT DEFAULT 'DRAFT',
    created_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    summary JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL,
    priority TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'PENDING',
    assigned_to TEXT,
    related_document UUID REFERENCES public.documents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ
);

CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    category TEXT,
    document_count INTEGER DEFAULT 0,
    importance TEXT DEFAULT 'Medium',
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS setup
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Allow read access to all for demo purposes
CREATE POLICY "Enable read access for all users" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.data_sources FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.topics FOR SELECT USING (true);
