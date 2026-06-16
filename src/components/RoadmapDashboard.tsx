"use client";

import React from "react";
import { Lock, Unlock, ArrowLeft, PhoneCall, Check, ArrowRight, Shield } from "lucide-react";
import { Milestone } from "@/lib/types";
import DevilAdvocate from "./DevilAdvocate";
import FirstStepCommitment from "./FirstStepCommitment";

interface RoadmapDashboardProps {
  projectName: string;
  milestones: Milestone[];
  activeMilestoneIndex: number; // 0, 1, 2, or 3 (if completed)
  onCompleteMilestone: () => void;
  onBack: () => void;
  devilAdvocatePoints: string[];
  onHopInVoice: () => void;
}

export default function RoadmapDashboard({
  projectName,
  milestones,
  activeMilestoneIndex,
  onCompleteMilestone,
  onBack,
  devilAdvocatePoints,
  onHopInVoice,
}: RoadmapDashboardProps) {
  // Calculate progress percentage
  const progressPercent = Math.min(100, Math.round((activeMilestoneIndex / milestones.length) * 100));

  return (
    <div className="max-w-4xl mx-auto w-full animate-slide-up space-y-6 pb-16">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Edit Project Idea
          </button>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {projectName} Roadmap
          </h2>
          <p className="text-xs text-on-surface-variant">
            3-Stage Sequential De-risking Architect
          </p>
        </div>

        <button
          onClick={onHopInVoice}
          className="w-full sm:w-auto px-5 py-3 bg-primary text-on-primary font-medium text-xs rounded-2xl shadow hover:bg-primary/95 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          Voice Chat with AI Consultant
        </button>
      </div>

      {/* Progress Tracker Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-foreground block">Roadmap Progress</span>
          <span className="text-on-surface-variant">
            Milestone {Math.min(activeMilestoneIndex + 1, milestones.length)} of {milestones.length} Active
          </span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-64">
          <div className="w-full bg-surface border border-outline-variant h-3 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono font-bold text-foreground w-8 text-right">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Main Grid: Checklist Left, Active Details/Commitment Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Timeline Checklist (5 Cols) */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider px-1">
            Execution Stages
          </h3>

          <div className="space-y-3">
            {milestones.map((m, idx) => {
              const isActive = idx === activeMilestoneIndex;
              const isCompleted = idx < activeMilestoneIndex;
              const isLocked = idx > activeMilestoneIndex;

              return (
                <div
                  key={idx}
                  className={`border rounded-2xl p-4 transition-all ${
                    isActive
                      ? "border-primary bg-primary-container/20 shadow-sm"
                      : isCompleted
                      ? "border-outline-variant bg-surface-container-low/30"
                      : "border-outline-variant bg-surface-container-low/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-on-surface-variant block">
                        {m.duration}
                      </span>
                      <h4 className={`text-sm font-bold leading-snug ${isActive ? "text-primary" : "text-foreground"}`}>
                        {m.title}
                      </h4>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : isActive ? (
                        <div className="w-5 h-5 rounded-full border border-primary text-primary flex items-center justify-center bg-primary-container">
                          <Unlock className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-outline-variant text-on-surface-variant/40 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Devil's Advocate embedded under milestones */}
          <DevilAdvocate points={devilAdvocatePoints} />
        </div>

        {/* Right Column: Active Stage Details & First Step Gate (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          {activeMilestoneIndex < milestones.length ? (
            <>
              {/* Active Milestone Info Card */}
              <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 space-y-5 shadow-sm">
                <div className="space-y-2 border-b border-outline-variant/50 pb-4">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                    Currently Focused Stage ({milestones[activeMilestoneIndex].duration})
                  </span>
                  <h3 className="text-lg font-bold text-foreground">
                    {milestones[activeMilestoneIndex].title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {milestones[activeMilestoneIndex].description}
                  </p>
                </div>

                {/* Requirements / Inputs needed */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-foreground">
                    Required Inputs & Artifacts to Start:
                  </h4>
                  <ul className="space-y-2">
                    {milestones[activeMilestoneIndex].inputs.map((input, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span>{input}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action/Commitment timer & manual verification checklist */}
              <FirstStepCommitment
                task={milestones[activeMilestoneIndex].firstStep}
                completionGate={milestones[activeMilestoneIndex].completionGate}
                onCompleteMilestone={onCompleteMilestone}
              />
            </>
          ) : (
            /* All stages completed */
            <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-8 text-center space-y-6 shadow-sm animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Grounded Validation Plan Completed!</h3>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                  You have successfully committed to and verified every stage of the validation roadmap. You are now prepared to build out the production codebase with minimized market risk.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-primary text-on-primary font-medium text-xs rounded-2xl hover:bg-primary/95 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Analyze New Project Idea
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
