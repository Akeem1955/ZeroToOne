"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { LayoutDashboard, PlusCircle, User, Settings, LogOut, Moon, Sun, Menu, Lightbulb } from "lucide-react";

interface DashboardShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail: string;
  onSignOut: () => void;
  children: React.ReactNode;
}

export default function DashboardShell({
  activeTab,
  onTabChange,
  userEmail,
  onSignOut,
  children,
}: DashboardShellProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: "home", label: "My Projects", icon: LayoutDashboard },
    { id: "create", label: "New Architect", icon: PlusCircle },
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors animate-fade-in">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-surface-container border-r border-outline-variant/60 shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-outline-variant/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center">
            <Lightbulb className="w-4.5 h-4.5" />
          </div>
          <span className="font-bold text-sm text-foreground tracking-tight">
            MindX <span className="text-primary font-medium">Zero-to-One</span>
          </span>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-foreground"
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-outline-variant/60 bg-surface-container-low/50 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="space-y-0.5 max-w-[140px] truncate">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Logged In As
              </span>
              <span className="text-xs font-medium text-foreground truncate block">
                {userEmail}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 bg-surface hover:bg-surface-container-high rounded-xl border border-outline-variant text-on-surface-variant transition-colors cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={onSignOut}
            className="w-full py-2.5 bg-surface-container-high text-error hover:bg-error/5 border border-outline-variant/60 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Header bar - Mobile only */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-surface-container border-b border-outline-variant/60 h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-foreground">
            MindX <span className="text-primary font-medium">Zero-to-One</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-surface hover:bg-surface-container-high rounded-xl border border-outline-variant text-on-surface-variant transition-colors cursor-pointer"
          >
            {theme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onSignOut}
            className="p-2 bg-surface hover:bg-error/5 rounded-xl border border-outline-variant text-error cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 px-4 sm:px-6 py-6 md:py-8 max-w-5xl w-full mx-auto flex flex-col justify-start">
          {children}
        </main>

        {/* Bottom Nav bar - Mobile only */}
        <nav className="md:hidden sticky bottom-0 z-40 w-full bg-surface-container border-t border-outline-variant/60 h-16 flex items-center justify-around px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all cursor-pointer ${
                  isActive ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                <span className="text-[9px] font-bold tracking-tight uppercase">
                  {item.id === "create" ? "New" : item.id === "home" ? "Projects" : item.id}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
