-- ============================================================
-- Sensorial Text & Tech Minimal Blog — Supabase 스키마 (PRD 섹션 4)
-- 2단계(CMS/실시간 검색) 연동 시 Supabase SQL Editor에서 실행한다.
-- ============================================================

-- 1. 카테고리 정의 테이블
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 블로그 포스트 메인 테이블
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    summary TEXT,
    content_json JSONB NOT NULL, -- 에디터 블록 구조 저장용
    content_txt TEXT NOT NULL,   -- 검색 성능 향상용 순수 텍스트 추출본
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT '{}',    -- 다중 태그 매칭용 어레이
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    reading_time INTEGER,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- 검색 벡터 생성 (PostgreSQL Full-Text Search)
    fts_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('pg_catalog.simple', coalesce(title, '')) ||
        to_tsvector('pg_catalog.simple', coalesce(summary, '')) ||
        to_tsvector('pg_catalog.simple', coalesce(content_txt, ''))
    ) STORED
);

-- 가속을 위한 GIN 인덱스 생성
CREATE INDEX posts_fts_idx ON posts USING gin(fts_vector);
CREATE INDEX posts_tags_idx ON posts USING gin(tags);

-- 다차원 복합 검색 쿼리 예시 (PRD 3.3):
-- SELECT * FROM posts
-- WHERE status = 'published'
--   AND category_id = :selected_category_id
--   AND tags @> :selected_tags_array          -- Array Containment
--   AND fts_vector @@ plainto_tsquery('simple', :search_keyword);

-- RLS: 공개 읽기는 published만, 쓰기는 인증된 작성자만
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Authenticated write posts" ON posts
    FOR ALL USING (auth.role() = 'authenticated');
