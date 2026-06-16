"use client";

import React, { useState } from "react";
import { UserProject } from "@/lib/db";
import { Plus, ArrowRight, Trash2, Calendar, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";

interface ProjectsListProps {
  projects: UserProject[];
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onCreateNewClick: () => void;
  loading: boolean;
}

export default function ProjectsList({
  projects,
  onSelectProject,
  onDeleteProject,
  onCreateNewClick,
  loading,
}: ProjectsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this project? This action is irreversible.")) {
      return;
    }
    setDeletingId(id);
    try {
      await onDeleteProject(id);
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-on-surface-variant">Fetching your projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up w-full">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">My Projects</h2>
          <p className="text-xs text-on-surface-variant">
            Persistence-tracked roadmaps and validation checkpoints
          </p>
        </div>

        {projects.length > 0 && (
          <button
            onClick={onCreateNewClick}
            className="px-4 py-2.5 bg-primary text-on-primary font-semibold text-xs rounded-xl shadow hover:bg-primary/95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Architect
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        /* Empty State */
        <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm max-w-xl mx-auto">
          <div className="w-12 h-12 bg-primary-container text-primary rounded-xl flex items-center justify-center mx-auto border border-primary/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">No Projects Found</h3>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto leading-relaxed">
              You haven&apos;t analyzed any ideas yet. Start by entering a vague concept and run our grounded validation engine.
            </p>
          </div>
          <button
            onClick={onCreateNewClick}
            className="px-5 py-3 bg-primary text-on-primary font-bold text-xs rounded-2xl shadow hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Architect Your First Idea
          </button>
        </div>
      ) : (
        /* Projects List Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const progressPercent = Math.min(
              100,
              Math.round((proj.activeMilestoneIndex / proj.milestones.length) * 100)
            );
            
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj.id)}
                className="bg-surface-container-low border border-outline-variant hover:border-primary rounded-3xl p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between group space-y-4 text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {proj.name}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(e, proj.id)}
                      disabled={deletingId === proj.id}
                      className="p-1.5 hover:bg-error/5 text-on-surface-variant hover:text-error rounded-lg transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                      title="Delete Project"
                    >
                      {deletingId === proj.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-error" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {proj.idea}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant">
                      <span>PROGRESS</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface border border-outline-variant/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Metadata footer */}
                  <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-1 border-t border-outline-variant/30">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {proj.updatedAt
                          ? new Date(proj.updatedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                            })
                          : "Unknown"}
                      </span>
                    </div>
                    <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
