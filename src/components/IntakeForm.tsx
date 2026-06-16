"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, Users, AlertCircle } from "lucide-react";

interface IntakeFormProps {
  onSubmit: (data: {
    name: string;
    idea: string;
    audience: string;
    country: string;
    constraints: string;
  }) => void;
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [country, setCountry] = useState("");
  const [constraints, setConstraints] = useState("No-Code, 2 weeks, $0 budget");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!idea.trim()) {
      setError("Idea description is required.");
      return;
    }
    if (idea.trim().length < 10) {
      setError("Please describe the idea in at least 10 characters.");
      return;
    }
    setError("");
    onSubmit({ name, idea, audience, country, constraints });
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-slide-up">
      {/* Header Info */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Zero-to-One Project Architect
        </h1>
        <p className="text-on-surface-variant text-sm max-w-md mx-auto">
          Refine your vague concept, run grounded feasibility checks, and generate a step-by-step roadmap to launch.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
      >
        {error && (
          <div className="flex items-center gap-3 p-4 bg-error-container text-on-error-container rounded-2xl text-sm border border-error/20">
            <AlertCircle className="w-5 h-5 shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            Project name *
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g. EcoRide, StudyBuddy, PayFlow"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>

        {/* The Idea Description */}
        <div className="space-y-2">
          <label htmlFor="idea" className="block text-sm font-medium text-foreground">
            What is the core idea? *
          </label>
          <textarea
            id="idea"
            rows={4}
            placeholder="Describe the problem you are solving, how it works, and why it matters. Keep it plain and factual."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm resize-none"
          />
          <p className="text-xs text-on-surface-variant/75">
            Tip: Writing a short or highly competitive idea (e.g. containing &apos;fail&apos;) will trigger the feasibility warning (&lt; 40 score) so you can test both paths.
          </p>
        </div>

        {/* Grid Inputs for metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Target Audience */}
          <div className="space-y-2">
            <label htmlFor="audience" className="block text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-on-surface-variant" />
              Target audience
            </label>
            <input
              type="text"
              id="audience"
              placeholder="e.g. University students, Local cafes"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </div>

          {/* Target Country */}
          <div className="space-y-2">
            <label htmlFor="country" className="block text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-on-surface-variant" />
              Country context
            </label>
            <input
              type="text"
              id="country"
              placeholder="e.g. Nigeria, United Kingdom"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <label htmlFor="constraints" className="block text-sm font-medium text-foreground">
            Constraints & Resources
          </label>
          <input
            type="text"
            id="constraints"
            placeholder="e.g. 2 weeks, $100 budget, sole developer"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 bg-primary text-on-primary font-medium rounded-2xl shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 cursor-pointer mt-4"
        >
          <Sparkles className="w-4 h-4" />
          Generate Grounded Roadmap
        </button>
      </form>
    </div>
  );
}
