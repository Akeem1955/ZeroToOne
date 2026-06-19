import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room") || "default-room";
    const identity = searchParams.get("identity") || `user-${Math.floor(Math.random() * 10000)}`;
    const projectName = searchParams.get("projectName") || "";
    const activeMilestoneTitle = searchParams.get("activeMilestoneTitle") || "";
    const fileName = searchParams.get("fileName") || "";
    const fileSummary = searchParams.get("fileSummary") || "";
    const language = searchParams.get("language") || "English";

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const serverUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !serverUrl) {
      return NextResponse.json(
        { error: "LiveKit server credentials are not configured on the server." },
        { status: 500 }
      );
    }

    // Create a new Access Token
    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      ttl: "1h", // Token valid for 1 hour
    });

    // Set context metadata so the AI Agent can parse it and act as a personalized consultant
    at.metadata = JSON.stringify({
      projectName,
      activeMilestoneTitle,
      fileName,
      fileSummary,
      language,
    });

    // Grant join permissions for the specific room
    at.addGrant({
      roomJoin: true,
      room,
      canPublish: true,
      canSubscribe: true,
    });

    // Generate token JWT
    const token = await at.toJwt();

    return NextResponse.json({
      token,
      serverUrl,
    });

  } catch (error: any) {
    console.error("API Error in /api/livekit-token:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate LiveKit access token." },
      { status: 500 }
    );
  }
}
