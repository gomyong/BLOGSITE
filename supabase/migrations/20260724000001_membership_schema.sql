-- 회원(로그인) & 고객 데이터 관리 기반 스키마
-- 참고: docs/PRD-membership-crm.md 5장, docs/phase0-membership-privacy-draft.md
--
-- auth.users / auth.identities / auth.sessions는 Supabase Auth가 자동 관리하므로
-- 여기서는 앱이 직접 소유하는 테이블만 정의한다.

-- ── profiles ────────────────────────────────────────────────────────────
-- auth.users와 1:1. 회원가입 시 트리거로 자동 생성된다.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  marketing_consent boolean not null default false,
  marketing_channels text[] not null default '{}', -- "email" | "sms" | "kakao"
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ── consent_log ─────────────────────────────────────────────────────────
-- 동의/철회 이력. 법적 증빙용이므로 수정·삭제하지 않고 항상 새 행을 추가한다.
create table public.consent_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('terms', 'privacy', 'marketing', 'age_over_14')),
  granted boolean not null,
  created_at timestamptz not null default now()
);

alter table public.consent_log enable row level security;

create policy "consent_log_select_own" on public.consent_log
  for select using (auth.uid() = user_id);

-- insert는 서버(서비스 롤)에서만 수행한다 — 클라이언트가 직접 이력을 조작할 수 없도록
-- 별도의 insert 정책을 두지 않는다(서비스 롤 키는 RLS를 우회한다).

-- ── customer_links ──────────────────────────────────────────────────────
-- Stripe Customer 연결. 결제 원장은 Stripe에 있고, 여기엔 연결 ID만 보관한다.
create table public.customer_links (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

alter table public.customer_links enable row level security;

create policy "customer_links_select_own" on public.customer_links
  for select using (auth.uid() = user_id);

-- write는 서버(체크아웃 완료 웹훅)에서 서비스 롤로만 수행한다.

-- ── 신규 가입 시 profiles 자동 생성 ─────────────────────────────────────
-- 가입 폼에서 넘긴 name/phone은 auth.users.raw_user_meta_data에 담겨 전달된다.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
