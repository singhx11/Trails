"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Trophy,
  LayoutDashboard,
  Compass,
  PlusCircle,
  ShieldCheck,
  Wallet,
  Bell,
  UserCheck,
  User,
  Building2,
  CheckCircle2,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, users, notifications } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Creator<span className="text-indigo-600">Bid</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/marketplace")
                  ? "text-indigo-600 bg-indigo-50/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Compass className="h-4 w-4" />
                <span>Explore Bids</span>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith("/leaderboard")
                  ? "text-indigo-600 bg-indigo-50/70"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <Trophy className="h-4 w-4" />
                <span>Leaderboard Panel</span>
              </div>
            </Link>

            {currentUser.role === "organizer" && (
              <>
                <Link
                  href="/organizer"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/organizer"
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Organizer Hub</span>
                  </div>
                </Link>
                <Link
                  href="/organizer/create"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/organizer/create"
                      ? "text-indigo-600 bg-indigo-50/70"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-indigo-600 font-semibold">
                    <PlusCircle className="h-4 w-4" />
                    <span>Launch Campaign</span>
                  </div>
                </Link>
              </>
            )}

            {currentUser.role === "creator" && (
              <Link
                href="/creator"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith("/creator")
                    ? "text-indigo-600 bg-indigo-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Creator Studio</span>
                </div>
              </Link>
            )}

            {currentUser.role === "admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith("/admin")
                    ? "text-indigo-600 bg-indigo-50/70"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center space-x-1.5 text-amber-700 font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin Panel</span>
                </div>
              </Link>
            )}
          </nav>
        </div>

        {/* Right Action Bar / Role Switcher */}
        <div className="flex items-center space-x-3">
          {/* Quick Role Switcher Pill */}
          <div className="hidden lg:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <span className="px-2 text-slate-500 flex items-center space-x-1">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Simulate Role:</span>
            </span>
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => setCurrentUser(u)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  currentUser.id === u.id
                    ? "bg-white text-indigo-600 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {u.role === "organizer" ? "Brand" : u.role === "creator" ? u.name.split(" ")[0] : "Admin"}
              </button>
            ))}
          </div>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User Profile Pill & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full hover:bg-slate-100/90 transition-all border border-slate-200/90 bg-white shadow-2xs group"
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="hidden sm:block text-left pr-1">
                <div className="flex items-center space-x-1">
                  <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                    {currentUser.name}
                  </p>
                </div>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] font-semibold text-indigo-600 capitalize bg-indigo-50 px-1.5 py-0.2 rounded leading-tight">
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                {/* Profile Card Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center space-x-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center space-x-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Active</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="py-1.5 text-xs text-slate-700 font-medium">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2 hover:bg-indigo-50/70 text-indigo-700 font-bold flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-indigo-600" />
                      <span>My Profile & Verification</span>
                    </div>
                    <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">Step 2</span>
                  </Link>

                  {currentUser.role === "organizer" && (
                    <Link
                      href="/organizer"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 hover:bg-slate-50"
                    >
                      Organizer Dashboard
                    </Link>
                  )}
                  {currentUser.role === "creator" && (
                    <Link
                      href="/creator"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 hover:bg-slate-50"
                    >
                      Creator Studio
                    </Link>
                  )}
                  {currentUser.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 hover:bg-slate-50"
                    >
                      System Admin Hub
                    </Link>
                  )}
                  <Link
                    href="/marketplace"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-slate-50"
                  >
                    Campaign Marketplace
                  </Link>
                  <Link
                    href="/rules"
                    onClick={() => setUserDropdownOpen(false)}
                    className="block px-3 py-1.5 hover:bg-slate-50"
                  >
                    Fair Competition Rules
                  </Link>
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <Link
                      href="/login"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-3 py-1.5 hover:bg-slate-50 text-slate-500"
                    >
                      Switch Account / Login
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
