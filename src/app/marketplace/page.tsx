"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Filter,
  Trophy,
  Video,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function MarketplacePage() {
  const { campaigns } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"prize" | "deadline" | "newest">("prize");

  const filteredCampaigns = campaigns
    .filter(camp => {
      if (camp.status !== "active" && camp.status !== "completed") return false;
      const matchesSearch =
        camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        camp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || camp.category === categoryFilter;
      const matchesPlatform = platformFilter === "all" || camp.socialPlatform === platformFilter;
      return matchesSearch && matchesCategory && matchesPlatform;
    })
    .sort((a, b) => {
      if (sortBy === "prize") return b.prizePool - a.prizePool;
      if (sortBy === "deadline") return new Date(a.submissionDeadline).getTime() - new Date(b.submissionDeadline).getTime();
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Campaign Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse verified, pre-funded content competitions. Enroll, create, submit, and climb the leaderboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/organizer/create"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            + Create a Campaign
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, brand, or brief keyword..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology & AI</option>
              <option value="education">Education & STEM</option>
              <option value="food">Food & Beverage</option>
              <option value="lifestyle">Lifestyle & Fashion</option>
              <option value="gaming">Gaming</option>
            </select>
          </div>

          {/* Platform Dropdown */}
          <div>
            <select
              value={platformFilter}
              onChange={e => setPlatformFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="Instagram">Instagram Reels</option>
              <option value="YouTube">YouTube Shorts</option>
            </select>
          </div>
        </div>

        {/* Sort Pills */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <Filter className="h-3.5 w-3.5" />
            <span>Sort By:</span>
            <button
              onClick={() => setSortBy("prize")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === "prize" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:text-slate-900"
              }`}
            >
              Highest Prize Pool
            </button>
            <button
              onClick={() => setSortBy("deadline")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === "deadline" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:text-slate-900"
              }`}
            >
              Closing Soon
            </button>
            <button
              onClick={() => setSortBy("newest")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortBy === "newest" ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:text-slate-900"
              }`}
            >
              Recently Launched
            </button>
          </div>
          <span className="text-slate-400">{filteredCampaigns.length} campaigns found</span>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <Trophy className="h-8 w-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No campaigns match your filter</h3>
          <p className="text-xs text-slate-500">Try modifying your search or resetting category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(camp => (
            <div
              key={camp.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={camp.organizerLogo}
                      alt={camp.organizerName}
                      className="h-8 w-8 rounded-lg object-cover border border-slate-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {camp.organizerName}
                      </p>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {camp.category}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      camp.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {camp.status === "active" ? "Open for Submissions" : "Completed"}
                  </span>
                </div>

                {/* Title & brief */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {camp.description}
                  </p>
                </div>

                {/* Prize Breakdown Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-slate-600">Total Prize Pool</span>
                    <span className="text-xl font-black text-indigo-700">
                      {formatCurrency(camp.prizePool)}
                    </span>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-1 text-[11px] text-slate-600">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-medium">1st (50%)</span>
                      <span className="font-bold text-slate-900">{formatCurrency(camp.firstPrize)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-medium">2nd (30%)</span>
                      <span className="font-bold text-slate-900">{formatCurrency(camp.secondPrize)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-medium">3rd (20%)</span>
                      <span className="font-bold text-slate-900">{formatCurrency(camp.thirdPrize)}</span>
                    </div>
                  </div>
                </div>

                {/* Metadata details */}
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <Video className="h-3.5 w-3.5 text-slate-400" />
                    <span>{camp.contentFormat} ({camp.socialPlatform})</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{camp.enrolledCreatorIds.length} Enrolled</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-2">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Deadline: {new Date(camp.submissionDeadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Escrow Funded</span>
                </span>
                <Link
                  href={`/campaign/${camp.id}`}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center space-x-1 shadow-xs"
                >
                  <span>View & Enroll</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
