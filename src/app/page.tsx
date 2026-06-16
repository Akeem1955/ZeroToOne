"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProjects,
  saveProject,
  updateProjectMilestone,
  deleteProject,
  UserProject,
} from "@/lib/db";
import { Moon, Sun, Loader2, AlertCircle } from "lucide-react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

// View components
import LandingPage from "@/components/LandingPage";
import Auth from "@/components/Auth";
import DashboardShell from "@/components/DashboardShell";
import ProjectsList from "@/components/ProjectsList";
import IntakeForm from "@/components/IntakeForm";
import FeasibilityGate from "@/components/FeasibilityGate";
import RoadmapDashboard from "@/components/RoadmapDashboard";
import ProfilePanel from "@/components/ProfilePanel";
import SettingsPanel from "@/components/SettingsPanel";
import LiveKitCallOverlay from "@/components/LiveKitCallOverlay";

import { FeasibilityResult } from "@/lib/types";

type AppView = "landing" | "auth" | "app";
type DashboardTab = "home" | "create" | "profile" | "settings";

function HomeContent() {
  const { theme, toggleTheme } = useTheme();

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appView, setAppView] = useState<AppView>("landing");

  // Dashboard Sidebar tab navigation
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");

  // Active user projects list loaded from Firestore
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // New project creation state
  const [creationStep, setCreationStep] = useState<"intake" | "feasibility">("intake");
  const [creationLoading, setCreationLoading] = useState(false);
  const [creationError, setCreationError] = useState("");
  const [projectData, setProjectData] = useState<{
    name: string;
    idea: string;
    audience: string;
    country: string;
    constraints: string;
  } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FeasibilityResult | null>(null);

  // Active selected project detail view (roadmap tracker)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Voice Call overlay
  const [voiceCallActive, setVoiceCallActive] = useState(false);

  // 1. Listen to Authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) {
        setAppView("app");
        setActiveTab("home");
      } else {
        setAppView("landing");
        setActiveProjectId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch projects from Firestore when authenticated
  const fetchUserProjects = async (uid: string) => {
    setLoadingProjects(true);
    try {
      const projs = await getUserProjects(uid);
      setUserProjects(projs);
    } catch (err) {
      console.error("Failed to load user projects:", err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProjects(user.uid);
    }
  }, [user]);

  // 3. User sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  // 4. Form Submit - Run search grounded Gemini analysis
  const handleIntakeSubmit = async (data: {
    name: string;
    idea: string;
    audience: string;
    country: string;
    constraints: string;
  }) => {
    setCreationLoading(true);
    setCreationError("");
    setProjectData(data);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || "Failed to analyze feasibility.");
      }

      const result = await res.json();
      setAnalysisResult(result);
      setCreationStep("feasibility");
    } catch (err: any) {
      console.error(err);
      setCreationError(err.message || "An unexpected error occurred.");
    } finally {
      setCreationLoading(false);
    }
  };

  // 5. Proceed Save Gate - User overrides or passes feasibility and saves project to Firestore
  const handleProceedSave = async () => {
    if (!user || !projectData || !analysisResult) return;

    setCreationLoading(true);
    try {
      const docId = await saveProject(
        user.uid,
        projectData.name,
        projectData.idea,
        projectData.audience,
        projectData.country,
        projectData.constraints,
        analysisResult
      );

      // Refresh project list and open the newly saved project details
      await fetchUserProjects(user.uid);
      setActiveProjectId(docId);
      setActiveTab("home");
      
      // Reset creation state
      setCreationStep("intake");
      setProjectData(null);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setCreationLoading(false);
    }
  };

  // 6. Complete Milestone progress update inside active project
  const handleCompleteMilestone = async () => {
    if (!activeProjectId) return;
    const activeProj = userProjects.find((p) => p.id === activeProjectId);
    if (!activeProj) return;

    const newIndex = activeProj.activeMilestoneIndex + 1;
    try {
      // Update local state first for fast response
      setUserProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId ? { ...p, activeMilestoneIndex: newIndex } : p
        )
      );

      // Save to Firestore
      await updateProjectMilestone(activeProjectId, newIndex);
    } catch (err) {
      console.error("Failed to update milestone progress:", err);
    }
  };

  // 7. Delete Project from Firestore
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setUserProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  // Back from feasibility gate to form edit
  const handleBackToIntake = () => {
    setCreationStep("intake");
  };

  // Switch tab from projects list to intake form
  const handleGoToIntake = () => {
    setActiveProjectId(null);
    setActiveTab("create");
  };

  // Select project from list to view detailed roadmap dashboard
  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
  };

  // Back from detailed roadmap dashboard to projects list
  const handleCloseProject = () => {
    setActiveProjectId(null);
  };

  const activeProject = userProjects.find((p) => p.id === activeProjectId);

  // Calculate stats for profile panel
  const totalCompletedMilestones = userProjects.reduce(
    (acc, curr) => acc + curr.activeMilestoneIndex,
    0
  );

  // Global Auth Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-on-surface-variant font-medium">Loading MindX Platform...</p>
        </div>
      </div>
    );
  }

  // --- RENDERING ROUTER ---

  // public views (not logged in)
  if (appView === "landing" && !user) {
    return (
      <LandingPage
        onGetStarted={() => setAppView("auth")}
        onLogin={() => setAppView("auth")}
        toggleTheme={toggleTheme}
        themeIcon={theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      />
    );
  }

  if (appView === "auth" && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors">
        <Auth onSuccess={() => setAppView("app")} onBack={() => setAppView("landing")} />
      </div>
    );
  }

  // authenticated SaaS views
  return (
    <DashboardShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab as DashboardTab);
        setActiveProjectId(null); // Close active project details on tab change
        setCreationStep("intake"); // Reset intake form step
      }}
      userEmail={user?.email || ""}
      onSignOut={handleSignOut}
    >
      {/* Tab 1: Home (Projects List or Active Project Details) */}
      {activeTab === "home" && (
        <>
          {activeProjectId && activeProject ? (
            <RoadmapDashboard
              projectName={activeProject.name}
              milestones={activeProject.milestones}
              activeMilestoneIndex={activeProject.activeMilestoneIndex}
              onCompleteMilestone={handleCompleteMilestone}
              onBack={handleCloseProject}
              devilAdvocatePoints={activeProject.devilAdvocate}
              onHopInVoice={() => setVoiceCallActive(true)}
            />
          ) : (
            <ProjectsList
              projects={userProjects}
              onSelectProject={handleSelectProject}
              onDeleteProject={handleDeleteProject}
              onCreateNewClick={handleGoToIntake}
              loading={loadingProjects}
            />
          )}
        </>
      )}

      {/* Tab 2: Create New (Intake form, Loader, or Feasibility warning gate) */}
      {activeTab === "create" && (
        <div className="w-full">
          {creationLoading ? (
            <div className="max-w-md mx-auto text-center space-y-4 py-16 bg-surface-container-low border border-outline-variant rounded-3xl shadow-sm">
              <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
              <h3 className="font-bold text-sm text-foreground">Performing Grounded Validation...</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Gemini 3.5 Flash is executing Google Search live to locate competitor platforms and verify regional constraints. This will take 5-10 seconds.
              </p>
            </div>
          ) : (
            <>
              {creationError && creationStep === "intake" && (
                <div className="max-w-2xl mx-auto w-full mb-4 flex items-center gap-3 p-4 bg-error-container text-on-error-container rounded-2xl text-sm border border-error/20">
                  <AlertCircle className="w-5 h-5 shrink-0 text-error" />
                  <span>{creationError}</span>
                </div>
              )}

              {creationStep === "intake" && (
                <IntakeForm onSubmit={handleIntakeSubmit} />
              )}

              {creationStep === "feasibility" && projectData && analysisResult && (
                <FeasibilityGate
                  result={analysisResult}
                  projectName={projectData.name}
                  onProceed={handleProceedSave}
                  onBack={handleBackToIntake}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Tab 3: Profile */}
      {activeTab === "profile" && (
        <ProfilePanel
          email={user?.email || ""}
          projectsCount={userProjects.length}
          completedMilestonesCount={totalCompletedMilestones}
        />
      )}

      {/* Tab 4: Settings */}
      {activeTab === "settings" && <SettingsPanel />}

      {/* Real LiveKit Audio overlay */}
      {voiceCallActive && activeProjectId && activeProject && (
        <LiveKitCallOverlay
          projectName={activeProject.name}
          activeMilestoneTitle={
            activeProject.activeMilestoneIndex < activeProject.milestones.length
              ? activeProject.milestones[activeProject.activeMilestoneIndex].title
              : "Validation Complete"
          }
          onClose={() => setVoiceCallActive(false)}
        />
      )}
    </DashboardShell>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
