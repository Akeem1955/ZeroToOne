"use client";

import React, { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface DevilAdvocateProps {
  points: string[];
}

export default function DevilAdvocate({ points }: DevilAdvocateProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-surface-container border border-outline rounded-3xl overflow-hidden shadow-sm animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface-container-high transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Devil&apos;s Advocate: Critical Assumptions
            </h3>
            <p className="text-xs text-on-surface-variant">
              Contrarian perspective challenging your core thesis
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-on-surface-variant" />
        ) : (
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        )}
      </button>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 space-y-4 border-t border-outline-variant/30 bg-surface-container-low/50">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Responsible AI warning: To avoid confirmation bias and over-reliance, prioritize validating these specific assumptions in your user interviews:
          </p>
          <div className="space-y-3">
            {points.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-surface border border-outline-variant rounded-xl"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs text-foreground leading-normal">{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
