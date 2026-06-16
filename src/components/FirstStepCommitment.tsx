"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Check, Clock, RefreshCw, ClipboardCheck, Lock } from "lucide-react";

interface FirstStepCommitmentProps {
  task: string;
  completionGate: string;
  onCompleteMilestone: () => void;
}

export default function FirstStepCommitment({
  task,
  completionGate,
  onCompleteMilestone,
}: FirstStepCommitmentProps) {
  const [timerState, setTimerState] = useState<"idle" | "running" | "completed">("idle");
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
  const [validationChecked, setValidationChecked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerState === "running") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimerState("completed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState]);

  const startTimer = () => {
    setTimerState("running");
  };

  const resetTimer = () => {
    setTimerState("idle");
    setTimeLeft(7200);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 space-y-6 shadow-sm">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-sm text-foreground">
          Step Gate: First Actionable Step (2 Hours)
        </h3>
      </div>

      <div className="bg-surface border border-outline-variant rounded-2xl p-4 space-y-3">
        <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
          Current Action Item
        </span>
        <p className="text-sm font-medium text-foreground leading-relaxed">
          {task}
        </p>
      </div>

      {/* Timer Section */}
      <div className="flex flex-col items-center justify-center py-4 bg-surface-container-high/40 rounded-2xl border border-outline-variant/50 space-y-3">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-mono text-foreground">
          <Clock className="w-6 h-6 text-on-surface-variant animate-pulse" />
          {formatTime(timeLeft)}
        </div>

        {timerState === "idle" && (
          <button
            onClick={startTimer}
            className="px-5 py-2.5 bg-primary text-on-primary font-medium text-xs rounded-xl shadow hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-on-primary" />
            Commit & Start 2-Hour Timer
          </button>
        )}

        {timerState === "running" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">Active focus session. Take action now!</span>
            <button
              onClick={resetTimer}
              className="p-2 bg-surface text-on-surface-variant hover:bg-surface-container-high rounded-lg border border-outline-variant cursor-pointer"
              title="Reset Timer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {timerState === "completed" && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Time is up! Complete validation below.
          </span>
        )}
      </div>

      {/* Human-in-the-Loop Completion Checklist */}
      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <h4 className="text-xs uppercase font-bold text-on-surface-variant tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-primary" />
            Manual Validation Verification (Human Gate)
          </h4>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            The AI does not decide if your project is validated. You must perform the real-world exit check:
          </p>
        </div>

        <div className="p-4 bg-surface border border-outline-variant rounded-2xl">
          <label className="flex items-start gap-3.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={validationChecked}
              onChange={(e) => setValidationChecked(e.target.checked)}
              className="w-4 h-4 text-primary bg-surface border border-outline rounded focus:ring-primary focus:ring-offset-background mt-0.5 cursor-pointer"
            />
            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block">
                Verification Rule:
              </span>
              <span className="text-xs text-on-surface-variant leading-relaxed block">
                {completionGate}
              </span>
            </div>
          </label>
        </div>

        {/* Complete button */}
        <button
          onClick={onCompleteMilestone}
          disabled={!validationChecked}
          className={`w-full py-3.5 rounded-2xl font-medium text-xs shadow transition-all flex items-center justify-center gap-2 ${
            validationChecked
              ? "bg-primary text-on-primary hover:bg-primary/95 cursor-pointer"
              : "bg-surface-container-high text-on-surface-variant/40 border border-outline-variant cursor-not-allowed"
          }`}
        >
          <Check className="w-4 h-4" />
          Mark Milestone 1 De-Risked & Unlock Next Stage
        </button>
      </div>
    </div>
  );
}
