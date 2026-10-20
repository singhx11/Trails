"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import {
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Video,
  Clock,
  TrendingUp,
  Percent,
  Play,
  Award,
} from "lucide-react";

export default function HomePage() {
  const { campaigns } = useApp();
  const activeCampaigns = campaigns.filter(c => c.status === "active").slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold tracking-wide border border-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Next-Gen Competitive Content Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Your Content. Your Competition. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800">
                Your Reward.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover brand campaigns, create content that matters, and compete for transparent prize pools. Or launch a campaign and let passionate creators bring your vision to life.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/marketplace"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Explore Active Campaigns</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/organizer/create"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center space-x-2"
              >
                <span>Launch a Campaign Bid</span>
              </Link>
            </div>

            {/* Platform Highlights */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Default Split</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">50% / 30% / 20%</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Top 3 Creators Win</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Submissions</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">Automated Checks</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">AI Whisper + Vision</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Leaderboard</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">Real-Time Scoring</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Verified Engagement</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Escrow & Payout</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">Pre-Funded Bids</p>
                <p className="text-[10px] text-blue-600 mt-0.5">Guaranteed Rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Active Campaigns */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Trophy className="h-3.5 w-3.5" />
                <span>Featured Competitions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Active Brand Campaigns Ready for Submissions
              </h2>
            </div>
            <Link
              href="/marketplace"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
            >
              <span>View all campaigns</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCampaigns.map(camp => (
              <div
                key={camp.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6">
                  {/* Top tags */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700 capitalize">
                      {camp.category}
                    </span>
                    <span className="flex items-center space-x-1 text-slate-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Active</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>

                  {/* Prize breakdown card */}
                  <div className="mt-5 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/80">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-600 font-medium">Prize Pool</span>
                      <span className="text-lg font-black text-indigo-700">
                        {formatCurrency(camp.prizePool)}
                      </span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>1st: {formatCurrency(camp.firstPrize)}</span>
                      <span>2nd: {formatCurrency(camp.secondPrize)}</span>
                      <span>3rd: {formatCurrency(camp.thirdPrize)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Video className="h-3.5 w-3.5 text-slate-400" />
                      <span>{camp.contentFormat} ({camp.socialPlatform})</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{camp.enrolledCreatorIds.length} Enrolled</span>
                    </span>
                  </div>
                </div>

                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Funded & Verified</span>
                  </span>
                  <Link
                    href={`/campaign/${camp.id}`}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                  >
                    <span>View Campaign</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Lifecycle */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How CreatorBid Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A transparent, performance-based marketplace replacing traditional manual freelance contracts with measurable creative challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 mb-4 text-base">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Organizations Fund Bids</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Companies, universities, and brands post campaigns with specific briefs, hashtags, keywords, and pre-fund the prize pool (e.g. ₹10,000).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 mb-4 text-base">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Creators Produce & Compete</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Creators enroll, shoot engaging Reels or Shorts adhering to the requirements, publish on their channels, and submit their link.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 mb-4 text-base">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Automated Checks & Payouts</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our engine verifies speech hooks, visuals, and hashtags, tracks public metrics, locks the leaderboard, and distributes 50/30/20 rewards directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-14 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to monetize your creative reach?</h2>
          <p className="text-indigo-100 text-sm max-w-xl mx-auto">
            Join hundreds of creators participating in open brand challenges and get paid for your authentic performance.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link
              href="/marketplace"
              className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-md"
            >
              Browse Open Bids
            </Link>
            <Link
              href="/organizer/create"
              className="px-6 py-3 rounded-xl bg-indigo-700 text-white font-bold text-sm hover:bg-indigo-800 transition-colors border border-indigo-500"
            >
              Host a Competition
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
