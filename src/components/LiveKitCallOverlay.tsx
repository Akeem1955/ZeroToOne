"use client";

import React, { useState, useEffect } from "react";
import { X, Mic, MicOff, PhoneOff, Wifi, Sparkles, Loader2 } from "lucide-react";
import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react";
import { FileAttachment } from "@/lib/types";

interface LiveKitCallOverlayProps {
  onClose: () => void;
  projectName: string;
  activeMilestoneTitle: string;
  fileAttachment?: FileAttachment | null;
  language?: string;
}

export default function LiveKitCallOverlay({
  onClose,
  projectName,
  activeMilestoneTitle,
  fileAttachment,
}: LiveKitCallOverlayProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [tokenError, setTokenError] = useState("");

  const roomName = projectName.toLowerCase().replace(/[^a-z0-9]/g, "-") || "default-room";

  useEffect(() => {
    async function fetchToken() {
      try {
        setLoadingToken(true);
        setTokenError("");
        let fileMetaParam = "";
        if (fileAttachment) {
          const summary = fileAttachment.isBinary
            ? `Binary file (${fileAttachment.mimeType})`
            : fileAttachment.data.substring(0, 300);
          fileMetaParam = `&fileName=${encodeURIComponent(fileAttachment.name)}&fileSummary=${encodeURIComponent(summary)}`;
        }

        const langParam = language ? `&language=${encodeURIComponent(language)}` : "";

        const res = await fetch(
          `/api/livekit-token?room=${roomName}&projectName=${encodeURIComponent(projectName)}&activeMilestoneTitle=${encodeURIComponent(activeMilestoneTitle)}${fileMetaParam}${langParam}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch connection token from server.");
        }
        const data = await res.json();
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (err: any) {
        console.error(err);
        setTokenError(err.message || "Failed to load voice configuration.");
      } finally {
        setLoadingToken(false);
      }
    }
    fetchToken();
  }, [roomName]);

  if (loadingToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="bg-surface-container border border-outline rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-xl">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-foreground font-medium">Connecting to WebRTC gateway...</p>
        </div>
      </div>
    );
  }

  if (tokenError || !token || !serverUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
        <div className="bg-surface-container border border-outline rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl">
          <span className="text-xs text-error font-bold block">Connection Error</span>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {tokenError || "Unable to retrieve LiveKit authentication token."}
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Call Widget
          </button>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={false}
      video={false}
      onDisconnected={onClose}
    >
      <RoomAudioRenderer />
      <CallControlsOverlay
        projectName={projectName}
        activeMilestoneTitle={activeMilestoneTitle}
        onClose={onClose}
      />
    </LiveKitRoom>
  );
}

function CallControlsOverlay({
  projectName,
  activeMilestoneTitle,
  onClose,
}: {
  projectName: string;
  activeMilestoneTitle: string;
  onClose: () => void;
}) {
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const [bars, setBars] = useState<number[]>([20, 20, 20, 20, 20, 20, 20, 20, 20, 20]);

  const isConnected = localParticipant !== null;

  // Determine if any remote participant is currently speaking
  const isAgentSpeaking = remoteParticipants.some((p) => p.isSpeaking);

  useEffect(() => {
    if (!isConnected) return;

    let interval: NodeJS.Timeout;
    if (isAgentSpeaking) {
      interval = setInterval(() => {
        setBars(Array.from({ length: 10 }, () => Math.floor(Math.random() * 45) + 12));
      }, 120);
    } else {
      setBars([20, 20, 20, 20, 20, 20, 20, 20, 20, 20]);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, isAgentSpeaking]);

  const toggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-surface-container border border-outline rounded-3xl w-full max-w-md overflow-hidden shadow-xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className={`w-4 h-4 ${isConnected ? "text-emerald-500 animate-pulse" : "text-amber-500 animate-bounce"}`} />
            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
              {isConnected ? "Connected to LiveKit Room" : "Joining Audio Room..."}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-surface border border-outline-variant hover:bg-surface-container-high rounded-lg text-on-surface-variant cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 py-8 flex-1 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-foreground">
              Gemini 2.5 Flash Voice Consultant
            </h3>
            <p className="text-xs text-on-surface-variant max-w-xs mx-auto">
              Live consultation for <span className="font-semibold">{projectName}</span>
            </p>
          </div>

          {/* Context Boundary Discloser */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-outline-variant rounded-full text-[10px] text-primary font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Bounded Context: {activeMilestoneTitle}
          </div>

          {/* Audio Wave Visualizer */}
          <div className="h-20 flex items-center justify-center gap-1.5 w-full">
            {!isConnected ? (
              <div className="text-xs text-on-surface-variant/70 animate-pulse">
                Establishing media streams...
              </div>
            ) : !isMicrophoneEnabled ? (
              <div className="text-xs text-error font-medium flex items-center gap-2">
                <MicOff className="w-4 h-4" />
                Your microphone is muted
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1 h-14 w-48">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full transition-all duration-100 ease-out"
                    style={{ height: `${h}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Grounding Info Card */}
          <div className="p-4 bg-surface border border-outline-variant rounded-2xl text-left w-full space-y-1">
            <span className="text-[10px] font-bold text-foreground block">Grounded Persona Active:</span>
            <span className="text-xs text-on-surface-variant leading-relaxed block">
              The agent will query live search for local competitor listings and country context rather than using predictive estimates.
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="px-6 py-5 bg-surface-container-high/40 border-t border-outline-variant/50 flex justify-center gap-4">
          <button
            onClick={toggleMic}
            disabled={!isConnected}
            className={`p-4 rounded-full border transition-all cursor-pointer ${
              !isMicrophoneEnabled
                ? "bg-error text-on-error border-error hover:bg-error/90"
                : "bg-surface text-foreground border-outline hover:bg-surface-container-low"
            }`}
            title={!isMicrophoneEnabled ? "Unmute Mic" : "Mute Mic"}
          >
            {!isMicrophoneEnabled ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full bg-error text-on-error border border-error hover:bg-error/90 transition-all cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
