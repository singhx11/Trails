"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/lib/utils";
import { Bell, CheckCircle2, Trophy, ShieldAlert, CreditCard } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, currentUser } = useApp();
  const userNotifs = notifications.filter(n => n.userId === currentUser.id || true);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated with deadlines, verification alerts, and prize payouts.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden text-xs">
        {userNotifs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No notifications at this time.</div>
        ) : (
          userNotifs.map(n => (
            <div key={n.id} className="p-4 flex items-start space-x-3.5 hover:bg-slate-50 transition-colors">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(n.timestamp)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
