-- CreatorBid: Database Schema & Migration Definition
-- PostgreSQL + Supabase DDL with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('organizer', 'creator', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    category TEXT NOT NULL,
    website TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    total_funded NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CREATOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    bio TEXT,
    categories TEXT[] DEFAULT '{}',
    total_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    rankings_won INT NOT NULL DEFAULT 0,
    connected_instagram TEXT,
    connected_youtube TEXT,
    verified_identity BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    product_promoted TEXT,
    target_audience TEXT,
    target_location TEXT,
    content_format TEXT NOT NULL CHECK (content_format IN ('Reel', 'Short', 'Long-form Video')),
    social_platform TEXT NOT NULL CHECK (social_platform IN ('Instagram', 'YouTube')),
    min_duration_sec INT NOT NULL DEFAULT 15,
    max_duration_sec INT NOT NULL DEFAULT 60,
    aspect_ratio TEXT NOT NULL DEFAULT '9:16',
    prize_pool NUMERIC(12, 2) NOT NULL CHECK (prize_pool >= 5000),
    first_prize NUMERIC(12, 2) NOT NULL,
    second_prize NUMERIC(12, 2) NOT NULL,
    third_prize NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(12, 2) NOT NULL,
    total_funded NUMERIC(12, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'funded', 'refunded')),
    payment_reference TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'active', 'submission_closed', 'evaluating', 'completed')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    submission_deadline TIMESTAMPTZ NOT NULL,
    review_period_days INT NOT NULL DEFAULT 3,
    max_submissions_per_creator INT NOT NULL DEFAULT 1,
    scoring_formula TEXT NOT NULL DEFAULT 'weighted_engagement' CHECK (scoring_formula IN ('views_only', 'weighted_engagement')),
    brand_guidelines TEXT,
    reference_links TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. CAMPAIGN REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.campaign_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('hashtag', 'keyword', 'spoken_phrase', 'visual_element', 'duration', 'aspect_ratio')),
    title TEXT NOT NULL,
    description TEXT,
    mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    rule_value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(campaign_id, creator_id)
);

-- 8. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_url TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'YouTube')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'verification_in_progress', 'approved', 'rejected', 'requires_correction', 'disqualified', 'finalized')),
    rejection_reason TEXT,
    calculated_score INT NOT NULL DEFAULT 0,
    fraud_risk TEXT NOT NULL DEFAULT 'Low Risk' CHECK (fraud_risk IN ('Low Risk', 'Moderate Risk', 'High Risk', 'Requires Manual Investigation')),
    fraud_analysis_notes TEXT,
    manual_reviewed_by UUID REFERENCES public.users(id),
    CONSTRAINT unique_campaign_content_url UNIQUE(campaign_id, content_url)
);

-- 9. VERIFICATION RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.verification_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES public.campaign_requirements(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('Passed', 'Failed', 'Inconclusive', 'Requires Manual Review')),
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    evidence TEXT,
    deterministic BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. METRIC SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS public.metric_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    views INT NOT NULL DEFAULT 0,
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    engagement_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    source TEXT NOT NULL DEFAULT 'official_api' CHECK (source IN ('official_api', 'creator_submission')),
    captured_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. LEADERBOARD ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    rank INT NOT NULL,
    performance_score INT NOT NULL,
    is_eligible_winner BOOLEAN NOT NULL DEFAULT TRUE,
    allocated_prize NUMERIC(12, 2),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(campaign_id, submission_id)
);

-- 12. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    creator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    rank INT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Awaiting Verification' CHECK (status IN ('Awaiting Results', 'Awaiting Verification', 'Approved', 'Processing', 'Paid', 'Failed')),
    transaction_ref TEXT,
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

-- 13. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
    raised_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Resolved', 'Dismissed')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    performed_by UUID NOT NULL REFERENCES public.users(id),
    role TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Campaigns read policy: public can read active campaigns; organizers read their own
CREATE POLICY "Public read active campaigns" ON public.campaigns
    FOR SELECT USING (status IN ('active', 'completed') OR auth.uid() IN (SELECT user_id FROM public.organizations WHERE id = organizer_id));

-- Submissions policy: Creators can view/insert their own; organizers and admins can view
CREATE POLICY "Creators manage own submissions" ON public.submissions
    FOR ALL USING (creator_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

-- Payouts policy: Creators view their payouts, admins manage
CREATE POLICY "Creators view own payouts" ON public.payouts
    FOR SELECT USING (creator_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin');
