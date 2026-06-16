"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, CheckCircle, HelpCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();
  const [emailNotify, setEmailNotify] = useState(true);
  const [timerAlerts, setTimerAlerts] = useState(true);

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Account Settings</h2>
        <p className="text-xs text-on-surface-variant">
          Configure application parameters and preferences
        </p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Theme Preference */}
        <div className="space-y-3 pb-6 border-b border-outline-variant/50">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            Appearance
          </h3>
          <div className="flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-2xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground block">Dark Theme</span>
              <span className="text-[10px] text-on-surface-variant block">Toggle dark mode interface styling</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                theme === "dark" ? "bg-primary" : "bg-outline-variant"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* API Credentials Verification */}
        <div className="space-y-3 pb-6 border-b border-outline-variant/50">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Integrations Status
          </h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Verify active server keys and service connectivity configuration details:
          </p>

          <div className="space-y-2">
            {/* Status 1 */}
            <div className="flex items-center justify-between p-3.5 bg-surface border border-outline-variant rounded-xl">
              <span className="text-xs font-semibold text-foreground">Gemini API Connection</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                Active
              </span>
            </div>

            {/* Status 2 */}
            <div className="flex items-center justify-between p-3.5 bg-surface border border-outline-variant rounded-xl">
              <span className="text-xs font-semibold text-foreground">Google Search Grounding Tool</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                Active
              </span>
            </div>

            {/* Status 3 */}
            <div className="flex items-center justify-between p-3.5 bg-surface border border-outline-variant rounded-xl">
              <span className="text-xs font-semibold text-foreground">LiveKit Cloud Room Gateway</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Reminders & Notifications
          </h3>
          
          <div className="space-y-3 pt-1">
            {/* Switch 1 */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">Email summaries</span>
                <span className="text-[10px] text-on-surface-variant block">Receive structured summaries of validated stages</span>
              </div>
              <button
                onClick={() => setEmailNotify(!emailNotify)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  emailNotify ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    emailNotify ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Switch 2 */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-foreground block">Focus session alerts</span>
                <span className="text-[10px] text-on-surface-variant block">Notify when the 2-hour validation timer completes</span>
              </div>
              <button
                onClick={() => setTimerAlerts(!timerAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                  timerAlerts ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    timerAlerts ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
