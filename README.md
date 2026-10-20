# CreatorBid Deployment & Production Integration Guide

## 1. Overview
CreatorBid is a competitive content creation & reward marketplace connecting organizations (brands, colleges, startups) with content creators via verified content challenges with guaranteed escrowed prize pools (50% / 30% / 20%).

---

## 2. Local Development

Run the development server:
```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Production Build & Deployment

### Build Command:
```bash
npm run build
```

### Start Server:
```bash
npm run start
```

### Deploying to Vercel:
1. Connect your GitHub repository to Vercel.
2. Select Framework Preset: `Next.js`.
3. Set the build command to `npm run build` and output directory `.next`.
4. Configure Environment Variables in the Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (or Stripe equivalent)
   - `OPENAI_API_KEY` (Whisper audio transcription)

---

## 4. Supabase Database Setup & Migrations

The relational schema with Row Level Security (RLS) policies is located at:
`supabase/migrations/20261020_init_creatorbid.sql`

To apply with Supabase CLI:
```bash
npx supabase db push
```

Tables included:
- `users`, `organizations`, `creator_profiles`
- `campaigns`, `campaign_requirements`, `enrollments`
- `submissions`, `verification_results`, `metric_snapshots`
- `leaderboard_entries`, `payouts`, `disputes`, `audit_logs`

---

## 5. Automated Verification & Social Media Integration

- **Deterministic Checks**: Video stream headers verify duration bounds and 9:16 vertical aspect ratios. Post metadata captions deterministically verify `#Hashtags` and `@mentions`.
- **Speech-to-Text**: Whisper model parses speech audio to verify spoken hooks (e.g. required brand slogans within the first 10 seconds).
- **Computer Vision**: Detects required logo/product placement and checks confidence scores.
- **Fraud Risk Engine**: Compares view, like, comment snapshots over time to classify risk (`Low Risk`, `Moderate Risk`, `High Risk`) and prevents artificial metric manipulation before prize lock.
