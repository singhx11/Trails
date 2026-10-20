"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  Award,
  Crown,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function LeaderboardPanelPage() {
  const { campaigns, submissions, getCampaignLeaderboard } = useApp();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    campaigns[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "winners_only">("all");

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
  const leaderboard = selectedCampaign ? getCampaignLeaderboard(selectedCampaign.id) : [];

  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesSearch =
      entry.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.contentUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      tierFilter === "all" ||
      (tierFilter === "winners_only" && entry.rank <= (selectedCampaign?.winnerCount || 3));
    return matchesSearch && matchesTier;
  });

  const topPodium = leaderboard.slice(0, 3);
  const winnerCount = selectedCampaign?.winnerCount || 3;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Trophy className="h-4 w-4" />
            <span>Official Leaderboard Panel</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Creator Competitions Standings
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time performance metrics, multi-tier prize pools (Top 3, Top 5, Top 10), and verified creator rankings.
          </p>
        </div>

        {/* Campaign Selector Pill */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 pl-2">Campaign:</span>
          <select
            value={selectedCampaignId}
            onChange={e => setSelectedCampaignId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500"
          >
            {campaigns.map(c => (
              <option key={c.id} value={c.id}>
                {c.title} ({formatCurrency(c.prizePool)} • Top {c.winnerCount || 3})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCampaign && (
        <>
          {/* Campaign Overview Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold border border-white/10">
                    {selectedCampaign.category.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Escrow Funded</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    Top {winnerCount} Winners
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {selectedCampaign.title}
                </h2>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {selectedCampaign.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                  <span>Organizer: <strong className="text-white">{selectedCampaign.organizerName}</strong></span>
                  <span>•</span>
                  <span>Format: <strong className="text-white">{selectedCampaign.contentFormat} ({selectedCampaign.socialPlatform})</strong></span>
                  <span>•</span>
                  <span>Deadline: <strong className="text-amber-300">{formatDate(selectedCampaign.submissionDeadline)}</strong></span>
                </div>
              </div>

              {/* Total Prize Pool Big Badge */}
              <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center lg:min-w-60">
                <span className="text-[11px] font-semibold text-indigo-200 block">Total Campaign Prize</span>
                <span className="text-3xl font-black text-amber-300 block mt-1">
                  {formatCurrency(selectedCampaign.prizePool)}
                </span>
                <span className="text-[10px] text-slate-300 block mt-1">
                  Distributed across Top {winnerCount} Winners
                </span>
              </div>
            </div>

            {/* Tier Breakdown Ribbon */}
            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
              {(selectedCampaign.prizeTiers || []).map(tier => (
                <div
                  key={tier.rank}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    tier.rank === 1
                      ? "bg-amber-400/20 border-amber-400/40 text-amber-200"
                      : tier.rank === 2
                      ? "bg-slate-200/20 border-slate-200/40 text-slate-200"
                      : tier.rank === 3
                      ? "bg-amber-700/20 border-amber-700/40 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase opacity-80">
                    {tier.label}
                  </span>
                  <span className="block text-xs font-black text-white mt-0.5">
                    {formatCurrency(tier.amount)}
                  </span>
                  <span className="block text-[9px] text-indigo-200">{tier.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          {topPodium.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 2nd Place */}
              {topPodium[1] && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between order-2 md:order-1 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 font-black text-slate-700 flex items-center justify-center text-sm border border-slate-200">
                      2
                    </span>
                    <span className="text-xs font-black text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {topPodium[1].allocatedPrize ? formatCurrency(topPodium[1].allocatedPrize) : "Prize Tier"}
                    </span>
                  </div>
                  <div className="my-4 flex items-center space-x-3">
                    <img
                      src={topPodium[1].creatorAvatar}
                      alt={topPodium[1].creatorName}
                      className="h-12 w-12 rounded-full object-cover border-2 border-slate-200"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{topPodium[1].creatorName}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{topPodium[1].performanceScore.toLocaleString()} Score</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{topPodium[1].views.toLocaleString()} Views</span>
                    <span>{topPodium[1].likes.toLocaleString()} Likes</span>
                  </div>
                </div>
              )}

              {/* 1st Place (Center Crown) */}
              {topPodium[0] && (
                <div className="bg-gradient-to-b from-amber-50/80 via-white to-amber-50/30 rounded-2xl border-2 border-amber-300 p-6 shadow-md flex flex-col justify-between order-1 md:order-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-amber-400 font-black text-slate-900 flex items-center justify-center text-base shadow-sm">
                      <Crown className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black text-amber-900 bg-amber-100/80 px-3 py-1 rounded-lg border border-amber-200">
                      {topPodium[0].allocatedPrize ? formatCurrency(topPodium[0].allocatedPrize) : "1st Prize"}
                    </span>
                  </div>
                  <div className="my-4 flex items-center space-x-3.5">
                    <img
                      src={topPodium[0].creatorAvatar}
                      alt={topPodium[0].creatorName}
                      className="h-14 w-14 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                          Leader
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base mt-0.5">{topPodium[0].creatorName}</h3>
                      <p className="text-xs text-indigo-700 font-bold">{topPodium[0].performanceScore.toLocaleString()} Performance Score</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{topPodium[0].views.toLocaleString()} Views</span>
                    <span>{topPodium[0].likes.toLocaleString()} Likes</span>
                    <span>{topPodium[0].comments.toLocaleString()} Comments</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topPodium[2] && (
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between order-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-amber-900/10 font-black text-amber-800 flex items-center justify-center text-sm border border-amber-900/20">
                      3
                    </span>
                    <span className="text-xs font-black text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                      {topPodium[2].allocatedPrize ? formatCurrency(topPodium[2].allocatedPrize) : "Prize Tier"}
                    </span>
                  </div>
                  <div className="my-4 flex items-center space-x-3">
                    <img
                      src={topPodium[2].creatorAvatar}
                      alt={topPodium[2].creatorName}
                      className="h-12 w-12 rounded-full object-cover border-2 border-amber-700/30"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{topPodium[2].creatorName}</h3>
                      <p className="text-xs text-indigo-600 font-semibold">{topPodium[2].performanceScore.toLocaleString()} Score</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{topPodium[2].views.toLocaleString()} Views</span>
                    <span>{topPodium[2].likes.toLocaleString()} Likes</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard Table and Filter Strip */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search creators by name or post URL..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400 font-medium">Filter:</span>
                <button
                  onClick={() => setTierFilter("all")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    tierFilter === "all" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  All Entries ({leaderboard.length})
                </button>
                <button
                  onClick={() => setTierFilter("winners_only")}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    tierFilter === "winners_only" ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Winners Only (Top {winnerCount})
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-bold">Rank</th>
                    <th className="px-6 py-3 font-bold">Creator</th>
                    <th className="px-6 py-3 font-bold">Views</th>
                    <th className="px-6 py-3 font-bold">Engagement</th>
                    <th className="px-6 py-3 font-bold">Score</th>
                    <th className="px-6 py-3 font-bold">Compliance</th>
                    <th className="px-6 py-3 font-bold">Prize Allocated</th>
                    <th className="px-6 py-3 font-bold text-right">Submission Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                        No submissions found matching this criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLeaderboard.map(entry => {
                      const isWinner = entry.rank <= winnerCount;
                      return (
                        <tr
                          key={entry.submissionId}
                          className={`hover:bg-slate-50/60 transition-colors ${
                            isWinner ? "bg-indigo-50/20" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                entry.rank === 1
                                  ? "bg-amber-400 text-slate-900 shadow-xs"
                                  : entry.rank === 2
                                  ? "bg-slate-300 text-slate-900"
                                  : entry.rank === 3
                                  ? "bg-amber-700 text-white"
                                  : isWinner
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {entry.rank}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={entry.creatorAvatar}
                                alt={entry.creatorName}
                                className="h-9 w-9 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block">{entry.creatorName}</span>
                                {isWinner && (
                                  <span className="text-[10px] font-bold text-emerald-600">
                                    ✓ Prize Eligible (Rank #{entry.rank})
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 font-bold text-slate-800">
                            {entry.views.toLocaleString()}
                          </td>

                          <td className="px-6 py-4">
                            <span className="text-slate-800 font-medium">
                              {entry.likes.toLocaleString()} likes
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {entry.comments.toLocaleString()} comments
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-black text-indigo-700 text-sm">
                              {entry.performanceScore.toLocaleString()}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                entry.compliancePassed
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>{entry.compliancePassed ? "Passed" : "Violated"}</span>
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            {entry.allocatedPrize ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                {formatCurrency(entry.allocatedPrize)}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <a
                              href={entry.contentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-[11px] font-semibold"
                            >
                              <span>Watch Reel/Short</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
