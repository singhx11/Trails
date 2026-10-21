"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  Trophy,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Building2,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, users } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("creator");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      register(name, email, role);
    } else {
      login(email, role);
    }

    // Redirect to profile for Step 2 Verification
    router.push("/profile");
  };

  const handleQuickDemoLogin = (demoEmail: string, demoRole: UserRole) => {
    login(demoEmail, demoRole);
    router.push("/profile");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Trophy className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {mode === "login" ? "Sign in to CreatorBid" : "Create your account"}
          </h2>
          <p className="text-xs text-slate-500">
            Step 1: Sign in with your account. You can verify as a Creator or Bidder right after in your profile.
          </p>
        </div>

        {/* Tab Switcher (Login / Register) */}
        <div className="p-1 bg-slate-100 rounded-xl flex text-xs font-bold text-slate-600">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "login" ? "bg-white text-indigo-700 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              mode === "register" ? "bg-white text-indigo-700 shadow-xs" : "hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === "register" && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name or Organization Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rohan Sharma or Apex Tech"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Account Type / Primary Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRole("creator")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === "creator"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-xs">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span>Creator</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  Compete in competitions & earn prize pool rewards
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRole("organizer")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  role === "organizer"
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-xs">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span>Bidder / Org</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal">
                  Launch brand campaigns & pre-fund prize pools
                </p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 mt-2"
          >
            <span>{mode === "login" ? "Sign In & Proceed to Profile" : "Register & Start Verification"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Or quick sign-in as:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoLogin("rohan.creates@gmail.com", "creator")}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-all"
            >
              <span className="font-bold text-slate-800 block text-[11px]">Rohan Sharma</span>
              <span className="text-[10px] text-indigo-600">Verified Creator</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin("campaigns@apextech.io", "organizer")}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left transition-all"
            >
              <span className="font-bold text-slate-800 block text-[11px]">Apex Tech</span>
              <span className="text-[10px] text-blue-600">Verified Bidder / Org</span>
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Role-based access & two-step identity verification</span>
        </div>
      </div>
    </div>
  );
}
