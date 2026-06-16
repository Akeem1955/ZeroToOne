"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { FeasibilityResult } from "@/lib/types";

interface FeasibilityGateProps {
  result: FeasibilityResult;
  projectName: string;
  onProceed: () => void;
  onBack: () => void;
}

export default function FeasibilityGate({
  result,
  projectName,
  onProceed,
  onBack,
}: FeasibilityGateProps) {
  const { score, advice, competitors, painPoints } = result;
  const isSaturated = score < 40;

  // Determine score color classes
  const getScoreColors = (val: number) => {
    if (val < 40) return { text: "text-error", border: "border-error", bg: "bg-error/10" };
    if (val < 70) return { text: "text-amber-500", border: "border-amber-500", bg: "bg-amber-500/10" };
    return { text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-600 dark:border-emerald-400", bg: "bg-emerald-500/10" };
  };

  const colors = getScoreColors(score);

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Market & Feasibility Gate
        </h2>
        <p className="text-on-surface-variant text-sm">
          Grounded validation results for <span className="font-semibold text-foreground">{projectName}</span>
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Score indicator */}
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <div className={`w-28 h-28 rounded-full border-4 ${colors.border} ${colors.bg} flex flex-col items-center justify-center`}>
            <span className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>
              {score}
            </span>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant">
              Score
            </span>
          </div>
          <span className="text-xs text-on-surface-variant text-center">
            * Score is based on competitor density, ease of validation, and market readiness.
          </span>
        </div>

        {/* Warning / Advice Box */}
        {isSaturated ? (
          <div className="flex gap-4 p-5 bg-error-container text-on-error-container rounded-2xl border border-error/20">
            <AlertTriangle className="w-6 h-6 shrink-0 text-error mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-error">Low Feasibility Alert</h3>
              <p className="text-xs leading-relaxed text-on-error-container/90">
                {advice}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 p-5 bg-primary-container text-on-primary-container rounded-2xl border border-primary/20">
            <ShieldCheck className="w-6 h-6 shrink-0 text-primary mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-primary">Feasibility Passed</h3>
              <p className="text-xs leading-relaxed text-on-primary-container/90">
                {advice}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Grounded Research Results */}
        <div className="space-y-5 pt-2">
          {/* Competitors */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
              Identified Market Players (Search Grounded)
            </h4>
            <ul className="space-y-2">
              {competitors.map((comp, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-sm text-foreground bg-surface border border-outline-variant px-4 py-2.5 rounded-xl"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/50" />
                  {comp}
                </li>
              ))}
            </ul>
          </div>

          {/* Pain Points */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
              Critical User Pain Points & Risks
            </h4>
            <ul className="space-y-2">
              {painPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed bg-surface border border-outline-variant px-4 py-3 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-outline-variant/50">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-4 bg-surface text-foreground font-medium rounded-2xl border border-outline hover:bg-surface-container-low active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            {isSaturated ? "Go Back & Refine" : "Back to Edit"}
          </button>

          <button
            type="button"
            onClick={onProceed}
            className={`flex-1 py-3 px-4 font-medium rounded-2xl shadow-sm active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer ${
              isSaturated
                ? "bg-surface-container-high text-foreground hover:bg-surface-container-high/80 border border-outline"
                : "bg-primary text-on-primary hover:bg-primary/95"
            }`}
          >
            {isSaturated ? "Proceed Anyway" : "Generate Roadmap"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
