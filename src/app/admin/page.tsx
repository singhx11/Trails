"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Trophy,
  CreditCard,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

export default function AdminDashboard() {
  const {
    campaigns,
    submissions,
    payouts,
    disputes,
    auditLogs,
    moderateSubmissionAdmin,
    approveCampaignAdmin,
    processPayoutAdmin,
    resolveDisputeAdmin,
    resetToSampleData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"submissions" | "campaigns" | "payouts" | "disputes" | "audit">("submissions");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Internal Platform Controls</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Moderation & Administration Console
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit campaigns, examine verification evidence, prevent fraud, approve prize payouts, and resolve creator disputes.
          </p>
        </div>

        <button
          onClick={resetToSampleData}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "submissions" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          Submission Moderation ({submissions.length})
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "campaigns" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          Campaign Approvals ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "payouts" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          Prize Disbursements ({payouts.length})
        </button>
        <button
          onClick={() => setActiveTab("disputes")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "disputes" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          Disputes & Appeals ({disputes.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "audit" ? "bg-indigo-600 text-white" : "hover:bg-slate-100"
          }`}
        >
          Audit Trails ({auditLogs.length})
        </button>
      </div>

      {/* SUBMISSION MODERATION TAB */}
      {activeTab === "submissions" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Content Submissions & Fraud Risk Analysis</h2>
            <p className="text-xs text-slate-500">Examine AI checks and approve or flag suspicious engagement</p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {submissions.map(sub => (
              <div key={sub.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sub.creatorAvatar}
                      alt={sub.creatorName}
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{sub.creatorName}</span>
                      <a
                        href={sub.contentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline truncate max-w-xs block font-mono text-[11px]"
                      >
                        {sub.contentUrl}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                        sub.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : sub.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border border-rose-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-slate-100 text-slate-700">
                      {sub.fraudRisk}
                    </span>
                  </div>
                </div>

                {/* Evidence accordion */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] block">AI & Deterministic Evidence Trail:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {sub.verificationChecks.map(check => (
                      <div key={check.requirementId} className="p-2 bg-white rounded border border-slate-200">
                        <span className="font-semibold text-slate-800 block">{check.requirementTitle}</span>
                        <span className="text-slate-500">{check.evidence}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderate Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400">
                    Calculated Score: <span className="font-bold text-slate-800">{sub.calculatedScore}</span> | Views: {sub.metrics.views.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moderateSubmissionAdmin(sub.id, "approved", "Admin verified")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderateSubmissionAdmin(sub.id, "rejected", "Rule criteria unfulfilled")}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRIZE PAYOUTS TAB */}
      {activeTab === "payouts" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Prize Allocations & Disbursal</h2>
            <p className="text-xs text-slate-500">Initiate automated UPI / Bank Transfer disbursements to competition winners</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 font-bold">Campaign</th>
                  <th className="px-6 py-3 font-bold">Creator</th>
                  <th className="px-6 py-3 font-bold">Rank</th>
                  <th className="px-6 py-3 font-bold">Prize Amount</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.campaignTitle}</td>
                    <td className="px-6 py-4">{p.creatorName}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">Rank #{p.rank}</td>
                    <td className="px-6 py-4 font-black text-slate-900 text-sm">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.status !== "Paid" && (
                        <button
                          onClick={() => processPayoutAdmin(p.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                        >
                          Disburse Funds
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DISPUTES TAB */}
      {activeTab === "disputes" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Disputes & Inquiries</h2>
          <div className="space-y-3 text-xs">
            {disputes.map(disp => (
              <div key={disp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{disp.title}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    {disp.status}
                  </span>
                </div>
                <p className="text-slate-600">{disp.description}</p>
                {disp.resolutionNotes && (
                  <p className="text-[11px] text-emerald-700 font-semibold bg-white p-2 rounded border border-slate-200">
                    Resolution: {disp.resolutionNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOG TAB */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Immutable Audit Trail</h2>
            <p className="text-xs text-slate-500">Tamper-evident logs of financial, ranking, and moderation actions</p>
          </div>
          <div className="divide-y divide-slate-100 text-xs font-mono">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-indigo-700 block">{log.action}</span>
                  <span className="text-slate-600 text-[11px]">{log.details}</span>
                </div>
                <div className="text-right text-[10px] text-slate-400 shrink-0">
                  <span>{log.performedBy} ({log.role})</span>
                  <span className="block">{formatDate(log.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
