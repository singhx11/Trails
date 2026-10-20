"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { calculatePrizePool, calculateConfigurablePrizePool, formatCurrency, WinnerTierCount } from "@/lib/utils";
import { CampaignRequirementItem } from "@/types";
import {
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Award,
} from "lucide-react";

export default function CreateCampaignWizard() {
  const router = useRouter();
  const { createCampaign, fundCampaign } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productPromoted, setProductPromoted] = useState("");
  const [category, setCategory] = useState("technology");
  const [targetAudience, setTargetAudience] = useState("College students & Gen-Z creators");
  const [targetLocation, setTargetLocation] = useState("India (Pan-India)");

  // Step 2: Content Requirements
  const [contentFormat, setContentFormat] = useState<"Reel" | "Short" | "Long-form Video">("Reel");
  const [socialPlatform, setSocialPlatform] = useState<"Instagram" | "YouTube">("Instagram");
  const [minDurationSec, setMinDurationSec] = useState(20);
  const [maxDurationSec, setMaxDurationSec] = useState(60);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [brandGuidelines, setBrandGuidelines] = useState("");
  const [requirements, setRequirements] = useState<CampaignRequirementItem[]>([
    {
      id: "req-init-1",
      type: "hashtag",
      title: "Required Hashtags",
      description: "Must be in the post caption",
      mandatory: true,
      ruleValue: "#BrandName #CreatorBid",
    },
    {
      id: "req-init-2",
      type: "spoken_phrase",
      title: "Mandatory Spoken Hook",
      description: "Creator must verbally pronounce phrase in video",
      mandatory: true,
      ruleValue: "Try out this revolutionary app",
    },
  ]);

  // Step 3: Budget & Configurable Winner Tiers (Top 3, Top 5, Top 10)
  const [prizePool, setPrizePool] = useState<number>(10000);
  const [winnerCount, setWinnerCount] = useState<WinnerTierCount>(3);
  const prizeBreakdown = calculateConfigurablePrizePool(prizePool, winnerCount);

  // Step 4: Duration
  const [submissionDays, setSubmissionDays] = useState(30);

  // Step 5: Rules & Scoring
  const [scoringFormula, setScoringFormula] = useState<"weighted_engagement" | "views_only">("weighted_engagement");
  const [maxSubmissionsPerCreator, setMaxSubmissionsPerCreator] = useState(1);

  // Requirement handlers
  const addRequirement = () => {
    const newReq: CampaignRequirementItem = {
      id: `req-${Date.now()}`,
      type: "hashtag",
      title: "New Requirement",
      description: "Specify criteria here",
      mandatory: true,
      ruleValue: "",
    };
    setRequirements([...requirements, newReq]);
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
  };

  const updateRequirement = (id: string, field: keyof CampaignRequirementItem, value: any) => {
    setRequirements(
      requirements.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handlePublish = async (andFund: boolean) => {
    setIsSubmitting(true);
    const deadlineDate = new Date(Date.now() + submissionDays * 86400000).toISOString();

    const created = createCampaign({
      title: title || "New Innovation Challenge",
      description,
      productPromoted,
      category,
      targetAudience,
      targetLocation,
      contentFormat,
      socialPlatform,
      minDurationSec,
      maxDurationSec,
      aspectRatio,
      prizePool,
      winnerCount,
      submissionDeadline: deadlineDate,
      scoringFormula,
      maxSubmissionsPerCreator,
      requirements,
      brandGuidelines,
    });

    if (andFund) {
      await fundCampaign(created.id, "Mock UPI / Razorpay");
    }

    setIsSubmitting(false);
    router.push(`/campaign/${created.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Launch a Content Campaign Bid
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set up requirements, pre-fund the prize pool, and let verified creators compete for top leaderboard rewards.
        </p>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between text-xs font-semibold text-slate-500">
        {[
          { num: 1, label: "Info" },
          { num: 2, label: "Requirements" },
          { num: 3, label: "Prize & Budget" },
          { num: 4, label: "Duration" },
          { num: 5, label: "Scoring" },
          { num: 6, label: "Publish" },
        ].map(step => (
          <button
            key={step.num}
            onClick={() => setCurrentStep(step.num)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-colors ${
              currentStep === step.num
                ? "bg-indigo-600 text-white shadow-xs"
                : currentStep > step.num
                ? "text-indigo-600 bg-indigo-50"
                : "hover:bg-slate-50"
            }`}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current">
              {step.num}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Basic Campaign Info */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <span>Step 1: Campaign Details</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Campaign Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Next-Gen Cloud AI: Show Your Workflow in 30s"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Product, Service, or Event Promoted
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud AI Workspace for macOS & Windows"
                value={productPromoted}
                onChange={e => setProductPromoted(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="technology">Technology & Software</option>
                  <option value="education">Education & Universities</option>
                  <option value="food">Food & Beverage</option>
                  <option value="lifestyle">Lifestyle & Fashion</option>
                  <option value="gaming">Gaming & Entertainment</option>
                  <option value="business">Business & Finance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Location</label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={e => setTargetLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Creative Brief & Description
              </label>
              <textarea
                rows={4}
                placeholder="Explain the narrative, angle, vibe, and goals for the creators..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Content Requirements */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Content Requirements</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define the mandatory rules our verification engine will evaluate before ranking submissions.
              </p>
            </div>
            <button
              onClick={addRequirement}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Content Format</label>
              <select
                value={contentFormat}
                onChange={e => setContentFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Reel">Instagram Reel</option>
                <option value="Short">YouTube Short</option>
                <option value="Long-form Video">Long-form Video</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform</label>
              <select
                value={socialPlatform}
                onChange={e => setSocialPlatform(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Aspect Ratio</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Min Duration (seconds)</label>
              <input
                type="number"
                value={minDurationSec}
                onChange={e => setMinDurationSec(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Max Duration (seconds)</label>
              <input
                type="number"
                value={maxDurationSec}
                onChange={e => setMaxDurationSec(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Verification Rules List */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Automated Verification Rules
            </h3>
            {requirements.map((req, idx) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Rule #{idx + 1}</span>
                  <button
                    onClick={() => removeRequirement(req.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Rule Type</label>
                    <select
                      value={req.type}
                      onChange={e => updateRequirement(req.id, "type", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="hashtag">Required Hashtags</option>
                      <option value="spoken_phrase">Spoken Audio Phrase (Whisper AI)</option>
                      <option value="keyword">Caption Keyword</option>
                      <option value="visual_element">Visual Element (Vision AI)</option>
                      <option value="duration">Duration Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Rule Target Value</label>
                    <input
                      type="text"
                      placeholder="e.g. #ApexAI or 'Discover the future'"
                      value={req.ruleValue}
                      onChange={e => updateRequirement(req.id, "ruleValue", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Requirement Policy</label>
                    <select
                      value={req.mandatory ? "mandatory" : "optional"}
                      onChange={e => updateRequirement(req.id, "mandatory", e.target.value === "mandatory")}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="mandatory">Mandatory (Disqualifies if failed)</option>
                      <option value="optional">Optional / Recommended</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 text-xs mb-1">
              Brand Guidelines & Prohibited Elements
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Do not show competitor logos. Keep background audio royalty-free."
              value={brandGuidelines}
              onChange={e => setBrandGuidelines(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Budget and Prize Pool (50/30/20) */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 3: Budget & Guaranteed Prize Distribution</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CreatorBid enforces transparent, performance-based prize distribution. Organizers must pre-fund the campaign before submissions open.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Campaign Prize Pool (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    step="1000"
                    min="5000"
                    value={prizePool}
                    onChange={e => setPrizePool(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 text-sm focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Minimum recommended prize pool: ₹5,000</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prize Pool Tier Structure
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { count: 3, title: "Top 3", desc: "50/30/20" },
                    { count: 5, title: "Top 5", desc: "40/25/15/12/8" },
                    { count: 10, title: "Top 10", desc: "10 Winners" },
                  ].map(tier => (
                    <button
                      key={tier.count}
                      type="button"
                      onClick={() => setWinnerCount(tier.count as WinnerTierCount)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        winnerCount === tier.count
                          ? "border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold shadow-xs"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="block text-xs font-extrabold">{tier.title}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{tier.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-indigo-600 font-medium mt-1">
                  Allocates rewards across top {winnerCount} eligible creators.
                </p>
              </div>
            </div>

            {/* Dynamic Calculated Reward Cards for Top 3, Top 5, or Top 10 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900">
                  Calculated Payout Tiers ({prizeBreakdown.tiers.length} Winners)
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Sum: 100% of Prize Pool
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                {prizeBreakdown.tiers.map(tier => (
                  <div
                    key={tier.rank}
                    className={`p-3 rounded-xl border transition-all ${
                      tier.rank === 1
                        ? "bg-amber-50/80 border-amber-200 text-amber-900"
                        : tier.rank === 2
                        ? "bg-slate-100/90 border-slate-200 text-slate-800"
                        : tier.rank === 3
                        ? "bg-amber-900/5 border-amber-900/10 text-amber-900"
                        : "bg-indigo-50/40 border-indigo-100/80 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold flex items-center space-x-1">
                        <Trophy className={`h-3.5 w-3.5 ${
                          tier.rank === 1 ? "text-amber-600" : tier.rank === 2 ? "text-slate-400" : "text-amber-700"
                        }`} />
                        <span>{tier.label}</span>
                      </span>
                      <span className="text-[10px] font-bold opacity-75">{tier.percentage}%</span>
                    </div>
                    <p className="text-base font-black mt-1.5">
                      {formatCurrency(tier.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform fees and total payable */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Creator Prize Pool</span>
                <span className="font-semibold text-slate-900">{formatCurrency(prizePool)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Service & Verification Fee (10%)</span>
                <span>{formatCurrency(prizeBreakdown.platformFee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST on Platform Fee (18%)</span>
                <span>{formatCurrency(prizeBreakdown.taxGst)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount Payable to Escrow</span>
                <span className="text-indigo-600">{formatCurrency(prizeBreakdown.totalPayable)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Duration */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Step 4: Campaign Duration & Deadlines</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Content Submission Period (Default: 30 Days)
              </label>
              <select
                value={submissionDays}
                onChange={e => setSubmissionDays(Number(e.target.value))}
                className="w-full max-w-xs px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value={15}>15 Days</option>
                <option value={30}>30 Days (Standard Recommended)</option>
                <option value={45}>45 Days</option>
                <option value={60}>60 Days</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 text-xs space-y-1">
              <p className="font-bold">Automated Deadline Handling:</p>
              <p>
                When the {submissionDays}-day deadline passes, the submission portal closes automatically. Metric tracking collects final data points, and provisional ranks are locked for administrative verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Eligibility & Scoring Rules */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Step 5: Eligibility & Scoring Formula</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ranking & Scoring Formula
              </label>
              <div className="space-y-2">
                <label className="flex items-start space-x-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="scoring"
                    checked={scoringFormula === "weighted_engagement"}
                    onChange={() => setScoringFormula("weighted_engagement")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Weighted Engagement Score (Recommended)
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Formula: (Verified Views × 0.40) + (Verified Likes × 0.40) + (Verified Comments × 0.20)
                    </span>
                  </div>
                </label>

                <label className="flex items-start space-x-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="radio"
                    name="scoring"
                    checked={scoringFormula === "views_only"}
                    onChange={() => setScoringFormula("views_only")}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Pure Verified Views Count
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Ranked strictly by highest verified view count on the platform.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Allowed Submissions per Creator
              </label>
              <input
                type="number"
                min={1}
                max={3}
                value={maxSubmissionsPerCreator}
                onChange={e => setMaxSubmissionsPerCreator(Number(e.target.value))}
                className="w-32 px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">Prevents spamming; standard is 1 submission.</p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Review and Publish */}
      {currentStep === 6 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Step 6: Review & Pre-Fund Campaign</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your campaign preview. Fund through test payment gateway to make it live for creators.
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs">
            <div className="flex justify-between items-baseline border-b border-slate-200/80 pb-2">
              <div>
                <p className="font-extrabold text-base text-slate-900">{title || "Untitled Competition"}</p>
                <p className="text-slate-500 capitalize">{category} • {contentFormat} ({socialPlatform})</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-indigo-700">{formatCurrency(prizePool)}</span>
                <p className="text-[10px] text-slate-400">Prize Pool</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              <div>
                <span className="text-slate-400 block">Winner Pool</span>
                <span className="font-bold text-indigo-700">Top {winnerCount} Creators</span>
              </div>
              <div>
                <span className="text-slate-400 block">1st Prize</span>
                <span className="font-bold text-slate-900">{formatCurrency(prizeBreakdown.firstPlace)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">2nd Prize</span>
                <span className="font-bold text-slate-900">{formatCurrency(prizeBreakdown.secondPlace)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Deadline</span>
                <span className="font-bold text-slate-900">{submissionDays} Days</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              <span className="font-bold text-slate-900">Mandatory Rules: </span>
              {requirements.map(r => r.ruleValue || r.title).join(", ")}
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-indigo-900 text-xs">
              <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold">Total Pre-Funding Required: {formatCurrency(prizeBreakdown.totalPayable)}</p>
                <p className="text-[11px] text-indigo-700">Protected in escrow until campaign completion.</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                disabled={isSubmitting}
                onClick={() => handlePublish(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold"
              >
                Save as Draft
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handlePublish(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                <CreditCard className="h-4 w-4" />
                <span>Pay & Publish Campaign</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold flex items-center space-x-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Previous Step</span>
        </button>

        {currentStep < 6 && (
          <button
            onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1"
          >
            <span>Next Step</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
