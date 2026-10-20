import React from "react";
import Link from "next/link";
import { Trophy, Shield, ArrowUpRight, Award, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-12 pb-8 text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Trophy className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">
                Creator<span className="text-indigo-600">Bid</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The transparent, performance-driven content competition and rewards marketplace. Organizations fund campaigns, creators compete with verified content.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Automated Verification & RLS Security</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/marketplace" className="hover:text-indigo-600 transition-colors">
                  Explore Active Bids
                </Link>
              </li>
              <li>
                <Link href="/organizer" className="hover:text-indigo-600 transition-colors">
                  For Organizations & Brands
                </Link>
              </li>
              <li>
                <Link href="/creator" className="hover:text-indigo-600 transition-colors">
                  For Content Creators
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 transition-colors">
                  Moderator & Trust Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Fair Play & Rules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/rules" className="hover:text-indigo-600 transition-colors">
                  Prize Distribution (50/30/20)
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-indigo-600 transition-colors">
                  Anti-Fraud & Authenticity Engine
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-indigo-600 transition-colors">
                  Dispute & Appeals Workflow
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-indigo-600 transition-colors">
                  GST & Payout Compliance (India)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Tech & Architecture</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Powered by Next.js, Tailwind CSS, Whisper AI transcription, and deterministic metadata verification.
            </p>
            <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Status: </span>
              All systems operational. Official APIs connected.
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CreatorBid Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/rules" className="hover:text-slate-600">
              Privacy Policy
            </Link>
            <Link href="/rules" className="hover:text-slate-600">
              Terms of Competition
            </Link>
            <Link href="/rules" className="hover:text-slate-600">
              Creator Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
