"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, PhoneCall, HelpCircle, CheckCircle } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  toggleTheme: () => void;
  themeIcon: React.ReactNode;
}

export default function LandingPage({
  onGetStarted,
  onLogin,
  toggleTheme,
  themeIcon,
}: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors animate-fade-in">
      {/* Header bar */}
      <header className="sticky top-0 z-40 w-full bg-surface-container border-b border-outline-variant/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">
              MindX <span className="text-primary font-medium">Zero-to-One</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-outline-variant hover:bg-surface-container-high text-on-surface-variant transition-colors cursor-pointer"
            >
              {themeIcon}
            </button>
            <button
              onClick={onLogin}
              className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-surface-container-low py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-[10px] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Grounded Market Validation
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Turn your vague idea into a <span className="text-primary">realistic execution plan</span>.
            </h1>
            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
              We help you move from a loose concept to a structured 30/60/90-day roadmap. No generic task generators—MindX runs live competitor and localized constraint checks, highlighting your very first 2-hour action step.
            </p>
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto px-6 py-3.5 bg-primary text-on-primary font-bold text-xs rounded-2xl shadow hover:bg-primary/95 hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Validating Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Visual Preview */}
          <div className="border border-outline-variant bg-surface rounded-3xl p-6 shadow-sm flex flex-col justify-between aspect-video overflow-hidden">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error/30" />
                <span className="w-3 h-3 rounded-full bg-amber-500/30" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/30" />
              </div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant">
                Live Architect
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div className="h-7 bg-surface-container border border-outline-variant rounded-xl flex items-center justify-between px-3">
                <span className="text-[10px] text-foreground font-bold">1. Value Prop & Target Interviews</span>
                <span className="text-[9px] px-2 py-0.5 bg-primary-container text-on-primary-container font-semibold rounded-full">Active</span>
              </div>
              <div className="h-7 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-between px-3 opacity-60">
                <span className="text-[10px] text-on-surface-variant">2. Low-Fidelity Interactive Wireframes</span>
                <span className="text-[9px] text-on-surface-variant/50">Locked</span>
              </div>
              <div className="h-7 bg-surface-container border border-outline-variant/40 rounded-xl flex items-center justify-between px-3 opacity-30">
                <span className="text-[10px] text-on-surface-variant">3. Closed Waitlist Beta Pilot</span>
                <span className="text-[9px] text-on-surface-variant/50">Locked</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/50 flex items-center justify-between text-[9px] text-on-surface-variant">
              <span>Next Action: Conduct 3 short user phone interviews.</span>
              <span className="font-bold text-primary">Time Gate: 2 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Struggle Section */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Overwhelmed Illustration */}
          <div className="border border-outline-variant bg-surface-container-low rounded-3xl p-6 shadow-sm flex items-center justify-center overflow-hidden order-last md:order-first">
            <Image
              src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800"
              alt="User struggling with chaotic planning and cognitive load"
              width={400}
              height={300}
              className="rounded-2xl object-cover w-full h-[300px]"
            />
          </div>

          {/* Right Side: Description */}
          <div className="space-y-6 text-left">
            <span className="text-xs uppercase font-bold text-primary tracking-widest block">
              The Startup Chasm
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              Why 90% of early-stage ideas stall out.
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Most projects fail not because founders can&apos;t code, but because they build in a vacuum. Creators experience action paralysis due to:
            </p>

            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">Cognitive Overload & Chaos</span>
                  <span className="text-xs text-on-surface-variant">Trying to plan a 12-month features list instead of focus validation today.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">Unverified Market Assumptions</span>
                  <span className="text-xs text-on-surface-variant">Building complex systems without checking local competitor density or pain points.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="bg-surface-container-low py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Description */}
          <div className="space-y-6 text-left">
            <span className="text-xs uppercase font-bold text-primary tracking-widest block">
              The MindX Method
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              Move from vague concept to your first real step.
            </h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              MindX turns planning on its head. Instead of listing arbitrary tasks, we construct a sequential de-risking roadmap backed by live search checks:
            </p>

            <div className="space-y-3">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">Grounded Feasibility Checks</span>
                  <span className="text-xs text-on-surface-variant">We query search APIs to find local regulatory risks and direct competitors before you continue.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">Structured 30/60/90-Day Milestones</span>
                  <span className="text-xs text-on-surface-variant">A minimal, clean board showcasing the exact inputs needed and strict exit gates for each phase.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Step-by-Step Illustration */}
          <div className="border border-outline-variant bg-surface rounded-3xl p-6 shadow-sm flex items-center justify-center overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              alt="Person climbing structured clean milestone blocks"
              width={400}
              height={300}
              className="rounded-2xl object-cover w-full h-[300px]"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-surface py-16 sm:py-24">
        <div className="max-w-6xl mx-auto w-full px-4 space-y-12">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Advanced AI & RTC Capabilities</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Equipped with state-of-the-art multimodal models to guide you when you get stuck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feat 1 */}
            <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 space-y-4 shadow-sm hover:border-primary transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Grounded Feasibility</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Uses Gemini 3.5 Flash to automatically cross-reference search indices. If feasibility falls below 40%, we flag it and provide detailed mitigation advice.
              </p>
            </div>

            {/* Feat 2 */}
            <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 space-y-4 shadow-sm hover:border-primary transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">Devil&apos;s Advocate Analysis</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We generate contrarian feedback challenging your core target metrics. Know the critical assumptions you need to test before building.
              </p>
            </div>

            {/* Feat 3 */}
            <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 space-y-4 shadow-sm hover:border-primary transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-primary flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">LiveKit Voice Consulting</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Hop into WebRTC audio consultation sessions using Gemini 2.5 Flash Native. Bounded context ensures the voice agent only details your active milestone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="bg-surface-container-low py-16 sm:py-24 text-center">
        <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 sm:p-12 space-y-6 border border-primary/20 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Stop guessing. Start executing.
          </h2>
          <p className="text-xs sm:text-sm max-w-md mx-auto leading-relaxed text-on-primary-container/80">
            Create an account to save multiple project ideas, persistence-track validation milestones, and unblock your workflow.
          </p>
          <button
            onClick={onGetStarted}
            className="px-6 py-3.5 bg-primary text-on-primary font-bold text-xs rounded-2xl shadow hover:bg-primary/95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            Create Your Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant/60 bg-surface-container py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <span>&copy; 2026 MindX Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer">Terms of Use</span>
            <span className="hover:text-primary cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
