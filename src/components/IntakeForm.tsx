"use client";

import React, { useState } from "react";
import { Sparkles, MapPin, Users, AlertCircle, Upload, FileText, X } from "lucide-react";

interface IntakeFormProps {
  onSubmit: (data: {
    name: string;
    idea: string;
    audience: string;
    country: string;
    constraints: string;
    fileAttachment?: {
      name: string;
      mimeType: string;
      data: string;
      isBinary: boolean;
    } | null;
  }) => void;
}

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [audience, setAudience] = useState("");
  const [country, setCountry] = useState("");
  const [constraints, setConstraints] = useState("No-Code, 2 weeks, $0 budget");
  const [fileAttachment, setFileAttachment] = useState<{
    name: string;
    mimeType: string;
    data: string;
    isBinary: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileAttachment(null);
      return;
    }

    const isBinary = file.type.startsWith("image/") || file.type === "application/pdf";
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (isBinary) {
        // Extract base64 encoding from data URL
        const base64Data = result.split(",")[1];
        setFileAttachment({
          name: file.name,
          mimeType: file.type,
          data: base64Data,
          isBinary: true,
        });
      } else {
        setFileAttachment({
          name: file.name,
          mimeType: file.type,
          data: result,
          isBinary: false,
        });
      }
    };

    if (isBinary) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFileAttachment(null);
  };

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
    onSubmit({ name, idea, audience, country, constraints, fileAttachment });
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

        {/* File Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Optional Project Document (PDF, Image, or Text/Code file)
          </label>
          {!fileAttachment ? (
            <div className="border border-dashed border-outline-variant hover:border-primary rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 bg-surface cursor-pointer relative group">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".txt,.md,.json,.pdf,.png,.jpg,.jpeg,.csv,.js,.ts,.tsx,.py"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-on-surface-variant group-hover:text-primary transition-colors" />
              <span className="text-xs text-on-surface-variant group-hover:text-primary font-medium transition-colors">
                Select or drag a file to analyze
              </span>
              <span className="text-[10px] text-on-surface-variant/70">
                PDF, PNG, JPG, or Text/Code files supported
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-2xl animate-fade-in">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[180px] sm:max-w-xs">
                    {fileAttachment.name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant">
                    {fileAttachment.isBinary ? "Binary Document/Image" : "Text/Code File"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="p-1 bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-lg text-on-surface-variant cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
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
