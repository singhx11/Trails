"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Scale, Award, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Fair Competition Standards</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Rules & Prize Policy
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          CreatorBid is built on strict algorithmic transparency, pre-funded prize escrows, and verifiable engagement.
        </p>
      </div>

      <div className="space-y-6 text-xs text-slate-600 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Award className="h-4 w-4 text-indigo-600" />
            <span>1. Guaranteed Prize Pool Distribution (50% / 30% / 20%)</span>
          </h2>
          <p>
            Every campaign launched on CreatorBid requires 100% pre-funding by the organization into escrow before creators can submit.
          </p>
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl font-semibold text-slate-800 text-center">
            <div>1st Place: 50%</div>
            <div>2nd Place: 30%</div>
            <div>3rd Place: 20%</div>
          </div>
          <p className="text-[11px] text-slate-500">
            Prize distributions are fixed at campaign creation and cannot be reduced by organizers during or after the competition.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Scale className="h-4 w-4 text-indigo-600" />
            <span>2. Automated Multi-Modal Verification Engine</span>
          </h2>
          <p>
            Submissions are subjected to automated compliance checks:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Hashtags & Mentions:</strong> Deterministically verified in public post captions.</li>
            <li><strong>Spoken Phrases:</strong> Whisper AI audio transcription matches required spoken dialogue.</li>
            <li><strong>Visual Elements:</strong> Computer vision checks detect brand logos and product UI.</li>
            <li><strong>Duration & Ratio:</strong> Video headers confirm 9:16 vertical and duration compliance.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>3. Anti-Fraud & Engagement Authenticity Review</span>
          </h2>
          <p>
            Metric snapshots (views, likes, comments, shares) are recorded at regular intervals. Suspicious spikes, abnormal comment-to-like ratios, or bot patterns are classified by our risk engine:
          </p>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold">Low Risk</span>
            <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-bold">Moderate Risk</span>
            <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-bold">High Risk (Investigated)</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Creators with high fraud signals are given an opportunity to appeal with proof before any final disqualification.
          </p>
        </div>
      </div>
    </div>
  );
}
