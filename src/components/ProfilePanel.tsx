"use client";

import React from "react";
import { User, Calendar, ShieldCheck, Milestone, Clock } from "lucide-react";

interface ProfilePanelProps {
  email: string;
  projectsCount: number;
  completedMilestonesCount: number;
}

export default function ProfilePanel({
  email,
  projectsCount,
  completedMilestonesCount,
}: ProfilePanelProps) {
  // Extract user initials
  const initials = email ? email.split("@")[0].substring(0, 2).toUpperCase() : "U";

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up space-y-6">
      {/* Header Profile Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">User Profile</h2>
        <p className="text-xs text-on-surface-variant">
          Manage your account information and stats
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-outline-variant/50">
          {/* Avatar Initials */}
          <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shrink-0">
            {initials}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-bold text-base text-foreground">{email}</h3>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-on-surface-variant">
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered via Firebase Auth</span>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Stat 1 */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-1.5 text-center">
            <ShieldCheck className="w-5 h-5 text-primary mx-auto" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Analyzed Ideas
            </span>
            <span className="text-2xl font-extrabold text-foreground block">
              {projectsCount}
            </span>
          </div>

          {/* Stat 2 */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-1.5 text-center">
            <Milestone className="w-5 h-5 text-primary mx-auto" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Steps De-Risked
            </span>
            <span className="text-2xl font-extrabold text-foreground block">
              {completedMilestonesCount}
            </span>
          </div>

          {/* Stat 3 */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-1.5 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
              Voice Consultation
            </span>
            <span className="text-2xl font-extrabold text-foreground block">
              Active
            </span>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 bg-primary-container/20 border border-primary/10 rounded-2xl flex gap-3 items-start text-xs leading-relaxed text-on-surface-variant">
          <User className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-foreground block">Verification Tier: Developer</span>
            <span>Your account has unrestricted access to LiveKit voice WebRTC rooms and grounded Google Search models.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
