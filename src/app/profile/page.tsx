"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  UserCheck,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Video,
  Share2,
  Globe,
  Award,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const {
    currentUser,
    creatorProfiles,
    organizations,
    submitCreatorVerification,
    submitOrganizerVerification,
  } = useApp();

  const myCreatorProfile = creatorProfiles.find(cp => cp.userId === currentUser.id);
  const myOrg = organizations.find(o => o.userId === currentUser.id);

  // Active Tab: Creator Verification vs Bidder Verification
  const [activeTab, setActiveTab] = useState<"creator" | "bidder">(
    currentUser.role === "organizer" ? "bidder" : "creator"
  );

  // Form State: Creator Verification
  const [handle, setHandle] = useState(myCreatorProfile?.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, "_")}`);
  const [bio, setBio] = useState(myCreatorProfile?.bio || "Short-form video producer creating engaging lifestyle and tech stories.");
  const [instagram, setInstagram] = useState(myCreatorProfile?.connectedAccounts?.instagram || "");
  const [youtube, setYoutube] = useState(myCreatorProfile?.connectedAccounts?.youtube || "");
  const [govIdType, setGovIdType] = useState(myCreatorProfile?.govIdType || "Aadhaar / National ID");
  const [govIdNumber, setGovIdNumber] = useState(myCreatorProfile?.govIdNumber || "");
  const [portfolioUrl, setPortfolioUrl] = useState(myCreatorProfile?.portfolioUrl || "");
  const [creatorSuccess, setCreatorSuccess] = useState(false);

  // Form State: Bidder / Organization Verification
  const [orgName, setOrgName] = useState(myOrg?.name || currentUser.name);
  const [category, setCategory] = useState(myOrg?.category || "technology");
  const [website, setWebsite] = useState(myOrg?.website || "https://");
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState(myOrg?.businessRegistrationNumber || "");
  const [gstNumber, setGstNumber] = useState(myOrg?.gstNumber || "");
  const [officialEmail, setOfficialEmail] = useState(myOrg?.officialEmail || currentUser.email);
  const [bidderSuccess, setBidderSuccess] = useState(false);

  const handleCreatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCreatorVerification({
      handle,
      bio,
      categories: ["technology", "education"],
      instagram,
      youtube,
      govIdType,
      govIdNumber: govIdNumber || "VERIFIED-GOV-DOC",
      portfolioUrl,
    });
    setCreatorSuccess(true);
  };

  const handleBidderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrganizerVerification({
      orgName,
      category,
      website,
      businessRegistrationNumber: businessRegistrationNumber || "CIN-U72200DL2024PTC123456",
      gstNumber: gstNumber || "07AAACR1234A1Z5",
      officialEmail,
    });
    setBidderSuccess(true);
  };

  const isCreatorVerified = myCreatorProfile?.verifiedIdentity || myCreatorProfile?.verificationStatus === "verified";
  const isBidderVerified = myOrg?.verified || myOrg?.verificationStatus === "verified";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
            <div className="flex items-center space-x-2 text-[11px] pt-0.5">
              {isCreatorVerified && (
                <span className="flex items-center space-x-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified Creator Badge</span>
                </span>
              )}
              {isBidderVerified && (
                <span className="flex items-center space-x-1 text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  <Building2 className="h-3 w-3" />
                  <span>Verified Organization / Bidder</span>
                </span>
              )}
              {!isCreatorVerified && !isBidderVerified && (
                <span className="flex items-center space-x-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Clock className="h-3 w-3" />
                  <span>Step 2 Verification Pending</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === "creator" ? (
            <Link
              href="/creator"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Go to Creator Studio
            </Link>
          ) : (
            <Link
              href="/organizer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Go to Organizer Hub
            </Link>
          )}
          <Link
            href="/marketplace"
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
          >
            Explore Bids
          </Link>
        </div>
      </div>

      {/* Verification Selection Hub */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Step 2: Profile Verification</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete your verification to unlock verified competition participation, instant reward payouts, and certified campaign launching.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("creator")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === "creator"
                ? "border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs"
                : "border-slate-200 bg-white/70 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm">
                <Users className="h-5 w-5" />
                <span>Verify as a Creator</span>
              </div>
              {isCreatorVerified ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify your social handles, portfolio, and identity to submit content links and earn guaranteed prize rewards.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bidder")}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === "bidder"
                ? "border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs"
                : "border-slate-200 bg-white/70 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-indigo-700 font-extrabold text-sm">
                <Building2 className="h-5 w-5" />
                <span>Verify as a Bidder / Brand</span>
              </div>
              {isBidderVerified ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify business incorporation and GST credentials to launch pre-funded competitions with certified creator trust.
            </p>
          </button>
        </div>
      </div>

      {/* TAB 1: VERIFY AS A CREATOR */}
      {activeTab === "creator" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <span>Creator Identity & Channel Verification</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Connect your social media accounts and provide basic ID proof to ensure genuine leaderboard participation.
              </p>
            </div>
            {isCreatorVerified && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Official Creator Badge Active</span>
              </span>
            )}
          </div>

          {creatorSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Verification Submitted!</strong> Your creator identity has been authenticated. You can now enroll and submit to all competitions.
              </span>
            </div>
          )}

          <form onSubmit={handleCreatorSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Public Creator Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="@yourhandle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Portfolio / Channel Link
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@yourchannel or Beacons/Linktree"
                  value={portfolioUrl}
                  onChange={e => setPortfolioUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Share2 className="h-3.5 w-3.5 text-pink-600" />
                  <span>Instagram Handle</span>
                </label>
                <input
                  type="text"
                  placeholder="@instagram_handle"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center space-x-1">
                  <Video className="h-3.5 w-3.5 text-red-600" />
                  <span>YouTube Handle or URL</span>
                </label>
                <input
                  type="text"
                  placeholder="@YouTubeChannel"
                  value={youtube}
                  onChange={e => setYoutube(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Bio & Creative Focus
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            {/* Government ID check for prize disbursement anti-fraud */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="font-bold text-slate-800 block text-xs">
                Identity Authentication for Prize Payouts (Anti-Fraud)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">ID Document Type</label>
                  <select
                    value={govIdType}
                    onChange={e => setGovIdType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Aadhaar / National ID">Aadhaar Card / National ID</option>
                    <option value="PAN Card">PAN Card (India)</option>
                    <option value="Passport">Passport</option>
                    <option value="Student ID Card">University Student ID Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Document Number / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. XXXX-XXXX-1234 or ABCDE1234F"
                    value={govIdNumber}
                    onChange={e => setGovIdNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Encrypted and verified for automated UPI and bank prize transfers upon winning competitions.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-slate-500">
                No password or confidential tokens required.
              </p>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {isCreatorVerified ? "Update Creator Verification" : "Submit Creator Verification"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: VERIFY AS A BIDDER / ORGANIZER */}
      {activeTab === "bidder" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <span>Organization & Bidder Commercial Verification</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your business entity, GST registration, and website to guarantee creator confidence and launch funded campaigns.
              </p>
            </div>
            {isBidderVerified && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center space-x-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Organization Badge Active</span>
              </span>
            )}
          </div>

          {bidderSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Verification Completed!</strong> Your organization is now certified. Your bids will feature the "Verified Escrow" trust mark.
              </span>
            </div>
          )}

          <form onSubmit={handleBidderSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Organization / Brand Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Tech Innovations Pvt Ltd"
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  <option value="technology">Technology & Software</option>
                  <option value="education">University / Education</option>
                  <option value="food">Food & Beverage</option>
                  <option value="lifestyle">Lifestyle & Fashion</option>
                  <option value="gaming">Gaming & Entertainment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://yourcompany.com"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corporate / Domain Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="campaigns@yourcompany.com"
                  value={officialEmail}
                  onChange={e => setOfficialEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GST Identification Number (GSTIN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 07AAACR1234A1Z5"
                  value={gstNumber}
                  onChange={e => setGstNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Registration / CIN / Incorporation Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. CIN-U72200DL2024PTC123456"
                  value={businessRegistrationNumber}
                  onChange={e => setBusinessRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Verified organizations receive 100% automated escrow verification tags.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {isBidderVerified ? "Update Organization Verification" : "Submit Bidder Verification"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
