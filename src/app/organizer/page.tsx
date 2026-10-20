"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  PlusCircle,
  Users,
  Video,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  FileCheck,
} from "lucide-react";

export default function OrganizerDashboard() {
  const { campaigns, submissions, currentUser, fundCampaign, finalizeCampaignResults } = useApp();

  // Filter campaigns created by current organizer or show all org campaigns
  const orgCampaigns = campaigns;
  const totalCampaigns = orgCampaigns.length;
  const activeCampaigns = orgCampaigns.filter(c => c.status === "active").length;
  const totalBudget = orgCampaigns.reduce((acc, c) => acc + c.prizePool, 0);
  const totalSubmissions = submissions.length;
  const totalEnrolled = orgCampaigns.reduce((acc, c) => acc + c.enrolledCreatorIds.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <span>Organizer Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Organization Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your funded content campaigns, evaluate live creator submissions, and monitor leaderboards.
          </p>
        </div>

        <Link
          href="/organizer/create"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Launch New Bid</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Campaign Budget</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalBudget)}</p>
          <p className="text-[11px] text-emerald-600 mt-1 flex items-center space-x-1">
            <span>100% Escrow Funded</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Active Bids Running</p>
          <p className="text-2xl font-black text-indigo-600 mt-1">{activeCampaigns}</p>
          <p className="text-[11px] text-slate-400 mt-1">{totalCampaigns} Total Bids Created</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Creators Enrolled</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalEnrolled}</p>
          <p className="text-[11px] text-indigo-600 mt-1">Across all campaigns</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Submissions Received</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalSubmissions}</p>
          <p className="text-[11px] text-emerald-600 mt-1">AI Verified & Scored</p>
        </div>
      </div>

      {/* Campaigns Table & Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Campaigns</h2>
            <p className="text-xs text-slate-500">Real-time status, submissions, and payout triggers</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{orgCampaigns.length} campaigns</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5 font-bold">Campaign</th>
                <th className="px-6 py-3.5 font-bold">Format & Platform</th>
                <th className="px-6 py-3.5 font-bold">Prize Pool</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Submissions</th>
                <th className="px-6 py-3.5 font-bold">Deadline</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orgCampaigns.map(camp => {
                const campSubs = submissions.filter(s => s.campaignId === camp.id);
                return (
                  <tr key={camp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{camp.title}</div>
                      <div className="text-[11px] text-slate-400 capitalize">{camp.category} • {camp.productPromoted}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{camp.contentFormat}</span>
                      <span className="block text-[11px] text-slate-400">{camp.socialPlatform}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-700 text-sm">
                        {formatCurrency(camp.prizePool)}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        1st: {formatCurrency(camp.firstPrize)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          camp.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : camp.status === "completed"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {camp.status.replace("_", " ")}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {camp.paymentStatus === "funded" ? "✓ Pre-funded" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {campSubs.length} entries
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {camp.enrolledCreatorIds.length} enrolled
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(camp.submissionDeadline)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {camp.paymentStatus !== "funded" ? (
                        <button
                          onClick={() => fundCampaign(camp.id, "Mock UPI")}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]"
                        >
                          Fund Now
                        </button>
                      ) : camp.status === "active" ? (
                        <button
                          onClick={() => finalizeCampaignResults(camp.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px]"
                        >
                          Finalize Results
                        </button>
                      ) : null}
                      <Link
                        href={`/campaign/${camp.id}`}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[11px]"
                      >
                        Leaderboard
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
