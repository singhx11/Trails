"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  Wallet,
  Video,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function CreatorDashboard() {
  const { currentUser, campaigns, submissions, payouts } = useApp();

  // Filter creator-specific items
  const enrolledCampaigns = campaigns.filter(c => c.enrolledCreatorIds.includes(currentUser.id));
  const mySubmissions = submissions.filter(s => s.creatorId === currentUser.id);
  const myPayouts = payouts.filter(p => p.creatorId === currentUser.id);

  const approvedSubmissions = mySubmissions.filter(s => s.status === "approved").length;
  const pendingSubmissions = mySubmissions.filter(s => s.status === "verification_in_progress" || s.status === "submitted").length;
  const totalEarnings = myPayouts
    .filter(p => p.status === "Paid" || p.status === "Processing" || p.status === "Approved")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <span>Creator Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track your enrolled competitions, live leaderboard ranks, verification status, and prize payouts.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <Compass className="h-4 w-4" />
          <span>Explore More Bids</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Rewards Won</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(totalEarnings)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{myPayouts.length} prizes earned</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Enrolled Campaigns</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{enrolledCampaigns.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active competitions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Verified Submissions</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{approvedSubmissions}</p>
          <p className="text-[11px] text-emerald-600 mt-1">All mandatory rules passed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Pending Review</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pendingSubmissions}</p>
          <p className="text-[11px] text-slate-400 mt-1">Under verification</p>
        </div>
      </div>

      {/* Enrolled Campaigns & Action Submissions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Your Enrolled Competitions</h2>
          <span className="text-xs text-slate-500">{enrolledCampaigns.length} active</span>
        </div>

        {enrolledCampaigns.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <Compass className="h-6 w-6 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">You haven't enrolled in any campaigns yet.</p>
            <p className="text-xs text-slate-500">Browse the marketplace and enroll in creative brand briefs.</p>
            <Link
              href="/marketplace"
              className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Browse Campaigns
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enrolledCampaigns.map(camp => {
              const mySub = mySubmissions.find(s => s.campaignId === camp.id);
              return (
                <div
                  key={camp.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-indigo-600 capitalize">{camp.category}</span>
                      <span className="text-slate-400 text-[11px]">
                        Deadline: {formatDate(camp.submissionDeadline)}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{camp.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{camp.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Prize</span>
                        <span className="font-black text-indigo-700">{formatCurrency(camp.prizePool)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Format</span>
                        <span className="font-bold text-slate-800">{camp.contentFormat} ({camp.socialPlatform})</span>
                      </div>
                    </div>
                  </div>

                  {/* Submission status or CTA */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    {mySub ? (
                      <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Submitted & Verified (Score: {mySub.calculatedScore})</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-amber-600 font-semibold">
                        <Clock className="h-4 w-4" />
                        <span>Awaiting Content Link</span>
                      </div>
                    )}

                    <Link
                      href={`/campaign/${camp.id}`}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>{mySub ? "View Leaderboard" : "Submit Link"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payouts / Reward Earnings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Prize Payout History</h2>
            <p className="text-xs text-slate-500">Transparent payment disbursements with provider references</p>
          </div>
          <span className="text-xs font-bold text-emerald-600">{formatCurrency(totalEarnings)} Earned</span>
        </div>

        {myPayouts.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No payouts earned yet. Compete in campaigns to win top 3 leaderboard rewards!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3 font-bold">Campaign</th>
                  <th className="px-6 py-3 font-bold">Rank</th>
                  <th className="px-6 py-3 font-bold">Prize Amount</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold">Transaction Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myPayouts.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-3.5 font-bold text-slate-900">{p.campaignTitle}</td>
                    <td className="px-6 py-3.5 font-bold text-indigo-600">Rank #{p.rank}</td>
                    <td className="px-6 py-3.5 font-black text-slate-900 text-sm">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">
                      {p.transactionRef || "Pending Settlement"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
