"use client";

import React from "react";
import { AlertTriangle, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { FeasibilityResult, CompetitorSegment } from "@/lib/types";

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
  
  const recommendation = result.recommendation || (score >= 75 ? 'Proceed' : score >= 45 ? 'Validate More' : 'Do Not Proceed');
  const isSaturated = recommendation === 'Do Not Proceed';

  // Determine score color classes
  const getScoreColors = (val: number) => {
    if (val < 40) return { text: "text-error", border: "border-error", bg: "bg-error/10" };
    if (val < 70) return { text: "text-amber-500", border: "border-amber-500", bg: "bg-amber-500/10" };
    return { text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-600 dark:border-emerald-400", bg: "bg-emerald-500/10" };
  };

  const getProgressBarColor = (val: number) => {
    if (val < 40) return "bg-error";
    if (val < 70) return "bg-amber-500";
    return "bg-emerald-600 dark:bg-emerald-400";
  };

  const getRecConfig = (rec: 'Proceed' | 'Validate More' | 'Do Not Proceed') => {
    switch (rec) {
      case 'Proceed':
        return {
          title: "Proceed",
          description: "High potential. The market signals are strong, technical complexity is manageable, and customer acquisition channels are clear. Proceed with validation and prototype building.",
          bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
          border: "border-emerald-500/20 dark:border-emerald-500/10",
          text: "text-emerald-600 dark:text-emerald-400",
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        };
      case 'Validate More':
        return {
          title: "Validate More",
          description: "Moderate feasibility. There are promising signals, but critical assumptions about user behavior, monetization, or distribution channels require rigorous validation.",
          bg: "bg-amber-500/10 dark:bg-amber-500/5",
          border: "border-amber-500/20 dark:border-amber-500/10",
          text: "text-amber-500 dark:text-amber-400",
          icon: <AlertTriangle className="w-8 h-8 text-amber-500 dark:text-amber-400 mt-0.5 shrink-0" />
        };
      case 'Do Not Proceed':
      default:
        return {
          title: "Do Not Proceed",
          description: "High risk. Market saturation is severe, distribution is heavily bottlenecked, or technical hurdles outweigh the immediate opportunity. Pivot or heavily refine the core concept before writing code.",
          bg: "bg-error/10",
          border: "border-error/20",
          text: "text-error",
          icon: <AlertTriangle className="w-8 h-8 text-error mt-0.5 shrink-0" />
        };
    }
  };

  const recConfig = getRecConfig(recommendation);

  const breakdown = result.scoreBreakdown || {
    technical: score,
    market: score,
    competition: score,
    monetization: score,
    distribution: score
  };

  const dimensions = [
    { key: "technical", label: "Technical Feasibility", desc: "Build complexity & dependencies", score: breakdown.technical },
    { key: "market", label: "Market Size & Demand", desc: "Urgency of problem & audience scale", score: breakdown.market },
    { key: "competition", label: "Competition Saturation", desc: "Crowdedness vs blue-ocean space", score: breakdown.competition },
    { key: "monetization", label: "Monetization Ease", desc: "Willingness to pay & pricing options", score: breakdown.monetization },
    { key: "distribution", label: "Distribution Channels", desc: "Customer acquisition cost & channel access", score: breakdown.distribution },
  ];

  const isSegmented = (comp: any): comp is CompetitorSegment => {
    return comp && typeof comp === 'object' && !Array.isArray(comp);
  };

  const directComps = isSegmented(competitors) ? (competitors.direct || []) : (competitors || []);
  const indirectComps = isSegmented(competitors) ? (competitors.indirect || []) : [];
  const alternativesComps = isSegmented(competitors) ? (competitors.alternatives || []) : [];

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
        
        {/* Recommendation Banner & Score Badge */}
        <div className={`flex flex-col sm:flex-row gap-5 p-5 ${recConfig.bg} rounded-2xl border ${recConfig.border} items-center sm:items-start`}>
          {recConfig.icon}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className={`text-lg font-extrabold tracking-tight uppercase ${recConfig.text}`}>
                Recommendation: {recConfig.title}
              </span>
              <div className="bg-surface-container-high border border-outline-variant px-3 py-1 rounded-full text-xs font-bold text-foreground shrink-0">
                Overall Score: <span className={getScoreColors(score).text}>{score}</span>/100
              </div>
            </div>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              {advice || recConfig.description}
            </p>
          </div>
        </div>

        {/* 5-Dimension Score Breakdown */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
            Feasibility Score Breakdown
          </h4>
          <div className="grid gap-4 bg-surface border border-outline-variant rounded-2xl p-5">
            {dimensions.map((dim) => {
              const dimColors = getScoreColors(dim.score);
              return (
                <div key={dim.key} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-semibold text-foreground">{dim.label}</span>
                      <span className="text-[10px] text-on-surface-variant ml-2 font-normal hidden sm:inline">({dim.desc})</span>
                    </div>
                    <span className={`text-xs font-bold ${dimColors.text}`}>{dim.score}/100</span>
                  </div>
                  <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(dim.score)}`}
                      style={{
                        width: `${dim.score}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Grounded Research Results */}
        <div className="space-y-5">
          {/* Competitors Segmented */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
              Identified Competitor Landscape
            </h4>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Direct Competitors */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <h5 className="text-xs font-bold text-foreground">Direct Competitors</h5>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-tight font-medium">Same solution & model.</p>
                {directComps.length > 0 ? (
                  <ul className="space-y-1.5 pt-1.5">
                    {directComps.map((comp, idx) => (
                      <li key={idx} className="text-xs text-foreground bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 font-medium">
                        {comp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-on-surface-variant/60 italic pt-1.5">None identified</p>
                )}
              </div>

              {/* Indirect Competitors */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <h5 className="text-xs font-bold text-foreground">Indirect Competitors</h5>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-tight font-medium">Different way to solve problem.</p>
                {indirectComps.length > 0 ? (
                  <ul className="space-y-1.5 pt-1.5">
                    {indirectComps.map((comp, idx) => (
                      <li key={idx} className="text-xs text-foreground bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 font-medium">
                        {comp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-on-surface-variant/60 italic pt-1.5">None identified</p>
                )}
              </div>

              {/* Current Alternatives */}
              <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <h5 className="text-xs font-bold text-foreground">User Alternatives</h5>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-tight font-medium">Spreadsheets, manual habits.</p>
                {alternativesComps.length > 0 ? (
                  <ul className="space-y-1.5 pt-1.5">
                    {alternativesComps.map((comp, idx) => (
                      <li key={idx} className="text-xs text-foreground bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30 font-medium">
                        {comp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-on-surface-variant/60 italic pt-1.5">None identified</p>
                )}
              </div>
            </div>
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
