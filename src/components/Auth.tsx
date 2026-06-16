"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AlertCircle, ArrowLeft, Loader2, KeyRound, Mail, Sparkles } from "lucide-react";

interface AuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function Auth({ onSuccess, onBack }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isReset, setIsReset] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (isReset) {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent! Check your inbox.");
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to send reset email.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      // Clean up common Firebase error messages
      let cleanErr = err.message || "Authentication failed.";
      if (cleanErr.includes("auth/invalid-credential") || cleanErr.includes("auth/user-not-found")) {
        cleanErr = "Invalid email or password combination.";
      } else if (cleanErr.includes("auth/email-already-in-use")) {
        cleanErr = "An account with this email already exists.";
      } else if (cleanErr.includes("auth/weak-password")) {
        cleanErr = "Password must be at least 6 characters long.";
      }
      setError(cleanErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full animate-slide-up space-y-6">
      {/* Back to landing */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Main card */}
      <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {isReset ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
            {isReset
              ? "Enter your email to receive a password recovery link."
              : isSignUp
              ? "Join MindX to validate and persistence-track your roadmap milestones."
              : "Sign in to access your saved projects and continue validating."}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-error-container text-on-error-container rounded-2xl text-xs border border-error/20">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 text-error mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 bg-primary-container text-on-primary-container rounded-2xl text-xs border border-primary/20">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-on-surface-variant" />
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-xs"
            />
          </div>

          {/* Password */}
          {!isReset && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-on-surface-variant" />
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsReset(true);
                      setError("");
                      setMessage("");
                    }}
                    className="text-[10px] text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 bg-surface border border-outline rounded-2xl text-foreground placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-xs"
              />
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-on-primary font-semibold rounded-2xl shadow hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isReset ? "Send Reset Link" : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* Toggles */}
        <div className="text-center pt-2 text-xs border-t border-outline-variant/50 space-y-2">
          {isReset ? (
            <button
              type="button"
              onClick={() => {
                setIsReset(false);
                setError("");
                setMessage("");
              }}
              className="text-primary hover:underline font-medium block mx-auto"
            >
              Back to Login
            </button>
          ) : (
            <p className="text-on-surface-variant text-[11px]">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                  setMessage("");
                }}
                className="text-primary hover:underline font-semibold"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
