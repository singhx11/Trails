"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Video,
  FileCheck,
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Info,
  Users,
} from "lucide-react";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const {
    campaigns,
    currentUser,
    enrollInCampaign,
    submitContent,
    getCampaignLeaderboard,
    submissions,
  } = useApp();

  const campaign = campaigns.find(c => c.id === campaignId);
  const [activeTab, setActiveTab] = useState<"brief" | "leaderboard" | "submit">("brief");

  // Submission Form State
  const [contentUrl, setContentUrl] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  if (!campaign) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Campaign Not Found</h2>
        <Link href="/marketplace" className="text-indigo-600 text-xs font-semibold mt-2 inline-block">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isEnrolled = campaign.enrolledCreatorIds.includes(currentUser.id);
  const existingSubmission = submissions.find(
    s => s.campaignId === campaign.id && s.creatorId === currentUser.id
  );
  const leaderboard = getCampaignLeaderboard(campaign.id);

  const handleEnroll = () => {
    enrollInCampaign(campaign.id, currentUser.id);
  };

  const handleSubmitContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      if (!contentUrl.includes("instagram.com") && !contentUrl.includes("youtube.com")) {
        throw new Error("Please provide a valid Instagram Reel or YouTube Shorts URL.");
      }

      await submitContent(
        campaign.id,
        currentUser.id,
        contentUrl,
        campaign.socialPlatform,
        captionText,
        notes
      );

      setSubmissionSuccess(true);
      setActiveTab("leaderboard");
    } catch (err: any) {
      setSubmissionError(err.message || "Failed to submit content.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={campaign.organizerLogo}
                alt={campaign.organizerName}
                className="h-12 w-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-800">{campaign.organizerName}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center space-x-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Escrow</span>
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                  {campaign.title}
                </h1>
              </div>
            </div>

            {/* Quick Action Button */}
            <div>
              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Enroll in Campaign
                </button>
              ) : existingSubmission ? (
                <button
                  onClick={() => setActiveTab("leaderboard")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submission Active</span>
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab("submit")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Submit Content Link
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-semibold block">Total Prize Pool</span>
              <span className="text-xl font-black text-indigo-700">{formatCurrency(campaign.prizePool)}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-semibold block">Format / Platform</span>
              <span className="text-sm font-bold text-slate-800">{campaign.contentFormat} ({campaign.socialPlatform})</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-semibold block">Enrolled Creators</span>
              <span className="text-sm font-bold text-slate-800">{campaign.enrolledCreatorIds.length} enrolled</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 text-[10px] font-semibold block">Submission Deadline</span>
              <span className="text-sm font-bold text-amber-600">{formatDate(campaign.submissionDeadline)}</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 border-t border-slate-100 flex space-x-6 text-xs font-bold text-slate-500 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("brief")}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === "brief"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            Campaign Brief & Rules
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`py-3.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === "leaderboard"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <span>Live Provisional Leaderboard</span>
            <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
              {leaderboard.length}
            </span>
          </button>
          {isEnrolled && (
            <button
              onClick={() => setActiveTab("submit")}
              className={`py-3.5 border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === "submit"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent hover:text-slate-900"
              }`}
            >
              <span>{existingSubmission ? "Your Submission" : "Submit Entry"}</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: BRIEF & REQUIREMENTS */}
      {activeTab === "brief" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Creative Campaign Brief</h2>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
              {campaign.brandGuidelines && (
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center space-x-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Brand & Style Guidelines</span>
                  </p>
                  <p>{campaign.brandGuidelines}</p>
                </div>
              )}
            </div>

            {/* Mandatory Verification Rules */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Verification Engine Rules</h2>
                  <p className="text-xs text-slate-500">Every submission is automatically parsed against these rules.</p>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {campaign.requirements.filter(r => r.mandatory).length} Mandatory Checks
                </span>
              </div>

              <div className="space-y-3">
                {campaign.requirements.map(req => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{req.title}</span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            req.mandatory
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {req.mandatory ? "Mandatory" : "Optional"}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1">{req.description}</p>
                      <div className="mt-2 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 inline-block text-indigo-700">
                        Target Value: {req.ruleValue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Prize Distribution & Formula */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Guaranteed Prize Tiers</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  Top {campaign.winnerCount || 3} Winners
                </span>
              </div>

              <div className="space-y-2.5 text-xs max-h-96 overflow-y-auto pr-1">
                {(campaign.prizeTiers || [
                  { rank: 1, percentage: 50, amount: campaign.firstPrize, label: "1st Place" },
                  { rank: 2, percentage: 30, amount: campaign.secondPrize, label: "2nd Place" },
                  { rank: 3, percentage: 20, amount: campaign.thirdPrize, label: "3rd Place" },
                ]).map(tier => (
                  <div
                    key={tier.rank}
                    className={`p-2.5 rounded-xl border flex items-center justify-between ${
                      tier.rank === 1
                        ? "bg-amber-50/70 border-amber-200"
                        : tier.rank === 2
                        ? "bg-slate-100/70 border-slate-200"
                        : tier.rank === 3
                        ? "bg-amber-900/5 border-amber-900/10"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Trophy className={`h-3.5 w-3.5 ${
                        tier.rank === 1 ? "text-amber-600" : tier.rank === 2 ? "text-slate-400" : "text-amber-700"
                      }`} />
                      <span className="font-bold text-slate-800">
                        {tier.label} ({tier.percentage}%)
                      </span>
                    </div>
                    <span className="font-black text-slate-900 text-xs">
                      {formatCurrency(tier.amount)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-800">Fixed Scoring Formula:</p>
                {campaign.scoringFormula === "weighted_engagement" ? (
                  <p>Score = (Views × 0.40) + (Likes × 0.40) + (Comments × 0.20)</p>
                ) : (
                  <p>Score = Pure Verified View Count</p>
                )}
                <p className="text-slate-400">Rules are locked and cannot be altered by organizers.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Trophy className="h-3.5 w-3.5" />
                <span>Live Provisional Standings</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                Campaign Leaderboard
              </h2>
            </div>
            <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              Rankings finalize at deadline: {formatDate(campaign.submissionDeadline)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-3 font-bold">Rank</th>
                  <th className="px-6 py-3 font-bold">Creator</th>
                  <th className="px-6 py-3 font-bold">Verified Views</th>
                  <th className="px-6 py-3 font-bold">Likes / Comments</th>
                  <th className="px-6 py-3 font-bold">Score</th>
                  <th className="px-6 py-3 font-bold">Compliance</th>
                  <th className="px-6 py-3 font-bold">Prize Allocated</th>
                  <th className="px-6 py-3 font-bold text-right">Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                      No submissions verified yet. Be the first creator to submit your link!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map(entry => (
                    <tr
                      key={entry.submissionId}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        entry.rank <= (campaign.winnerCount || 3) ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              entry.rank === 1
                                ? "bg-amber-400 text-slate-900"
                                : entry.rank === 2
                                ? "bg-slate-300 text-slate-900"
                                : entry.rank === 3
                                ? "bg-amber-700 text-white"
                                : entry.rank <= (campaign.winnerCount || 3)
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {entry.rank}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={entry.creatorAvatar}
                            alt={entry.creatorName}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{entry.creatorName}</span>
                            <span className="text-[10px] text-slate-400">Verified Creator</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-800">
                        {entry.views.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-800">{entry.likes.toLocaleString()} likes</span>
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
                          <span>{entry.compliancePassed ? "All Passed" : "Violated"}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {entry.allocatedPrize ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
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
                          <span>Watch</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SUBMISSION PORTAL & COMPLIANCE REPORT */}
      {activeTab === "submit" && isEnrolled && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {existingSubmission ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-900 text-xs">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Content Submitted & Verified</p>
                    <p className="text-[11px] text-emerald-700">
                      Your submission is officially active on the leaderboard. Live Score: {existingSubmission.calculatedScore}
                    </p>
                  </div>
                </div>
                <a
                  href={existingSubmission.contentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  View Live Post
                </a>
              </div>

              {/* Compliance Report Card */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Automated Compliance Report</h3>
                <div className="space-y-2">
                  {existingSubmission.verificationChecks.map(check => (
                    <div
                      key={check.requirementId}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs flex items-start justify-between"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">{check.requirementTitle}</p>
                        <p className="text-slate-500 text-[11px]">{check.evidence}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {check.status} ({check.confidenceScore}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitContent} className="space-y-5 text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">Submit Your Content Link</h2>
                <p className="text-slate-500 mt-0.5">
                  Paste the publicly accessible URL of your published Reel or Short. Our engine will verify mandatory hashtags, audio transcripts, and metrics.
                </p>
              </div>

              {submissionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Public Content URL (Instagram Reel or YouTube Short) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.instagram.com/reel/C8_example/ or https://youtube.com/shorts/..."
                  value={contentUrl}
                  onChange={e => setContentUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Post Caption / Description Text (for Hashtag & Keyword matching) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Paste the exact caption used in your social media post including hashtags..."
                  value={captionText}
                  onChange={e => setCaptionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Production Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spoken hook occurs at second 00:03"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center space-x-2"
              >
                <UploadCloud className="h-4 w-4" />
                <span>{isSubmitting ? "Running Automated Checks..." : "Verify & Submit Content"}</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
