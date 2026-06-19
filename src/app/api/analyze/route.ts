import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { name, idea, audience, country, constraints, fileAttachment, language } = await req.json();

    if (!name || !idea) {
      return NextResponse.json(
        { error: "Project name and idea description are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured on the server." },
        { status: 500 }
      );
    }

    // Initialize Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Allow model override via environment variables (e.g. during high demand spikes)
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"; 

    const prompt = `
You are a market validation analyst and startup architect.
Analyze the following project idea:
Project Name: ${name}
Vague Idea: ${idea}
Target Audience: ${audience || "General Public"}
Country Context: ${country || "Global"}
Constraints/Resources: ${constraints || "None specified"}
Target Output Language: ${language || "English"}

Tasks:
1. Conduct a grounded analysis using Google Search. Search for active competitors, companies, or open source projects doing something similar.
2. Determine a realistic overall feasibility score (0 to 100) and calculate a detailed score breakdown (each from 0 to 100) for the following five dimensions:
   - technical: Technical feasibility & build complexity
   - market: Market size, demand, & urgency of the problem
   - competition: Competitor landscape & saturation (higher score means less saturated / easier to compete)
   - monetization: Monetization ease, pricing viability & margin potential
   - distribution: Distribution channel strength, customer acquisition ease
   Based on these, generate a final recommendation: 'Proceed' (overall score >= 75), 'Validate More' (overall score >= 45 and < 75), or 'Do Not Proceed' (overall score < 45).
3. Improve competitor analysis by separating competitors into direct competitors (offering the same solution), indirect competitors (offering different solutions for the same problem), and current user alternatives (manual workarounds, spreadsheets, or doing nothing).
4. Extract 3 critical user pain points or risks (e.g., regulatory bottlenecks in ${country || "the target country"}).
5. Generate a 3-stage validation roadmap:
   - Milestone 1: Focuses purely on low-cost validation (e.g., interviewing users).
   - Milestone 2: Focuses on building a low-fidelity wireframe or paper prototype.
   - Milestone 3: Focuses on launching a pilot/waitlist page to gather active interest.
   Each milestone must have:
   - title
   - duration (e.g., 'Days 1-10')
   - description
   - inputs (list of resources, questions, or assets needed to start)
   - firstStep (a highly concrete, 2-hour task the user can do immediately in the real world to start)
   - completionGate (the strict exit criteria that the user must manually check off to verify this stage has been validated)
6. Formulate 3 contrarian "Devil's Advocate" feedback points challenging the user's core assumptions.
7. Generate all text fields and values inside the JSON output (advice, direct, indirect, alternatives, painPoints, title, description, firstStep, completionGate, etc.) EXCLUSIVELY in the language specified as "Target Output Language" (${language || "English"}). Do not translate the JSON keys. Do not mix languages (e.g. do not mix English and French). All content in the text values must be in ${language || "English"}.

Your output must be a single, valid JSON block. Do not include any explaining text outside of the JSON block. Do not use markdown wraps.
The JSON structure must match this example:
{
  "score": 75,
  "scoreBreakdown": {
    "technical": 80,
    "market": 70,
    "competition": 60,
    "monetization": 75,
    "distribution": 90
  },
  "advice": "Viable project. Focus on Milestone 1 validation.",
  "competitors": {
    "direct": ["Comp A", "Comp B"],
    "indirect": ["Comp C"],
    "alternatives": ["Spreadsheets", "Manual work"]
  },
  "painPoints": ["Risk 1", "Risk 2", "Risk 3"],
  "roadmap": [
    {
      "title": "Stage 1 Title",
      "duration": "Days 1-10",
      "description": "Stage description",
      "inputs": ["Input 1", "Input 2"],
      "firstStep": "First action step details",
      "completionGate": "Exit gate details"
    }
  ],
  "devilAdvocate": ["Point 1", "Point 2", "Point 3"],
  "recommendation": "Validate More"
}
`;

    // Call Gemini for feasibility analysis (free tier without search grounding)
    console.log(`[API] Running feasibility analysis using model "${modelName}"...`);
    
    // Prepare contents array to support inline files if present
    const contents: any[] = [prompt];
    if (fileAttachment) {
      if (fileAttachment.isBinary) {
        contents.push({
          inlineData: {
            mimeType: fileAttachment.mimeType,
            data: fileAttachment.data, // base64 string
          }
        });
        console.log(`[API] Attached binary file "${fileAttachment.name}" (${fileAttachment.mimeType})`);
      } else {
        // Direct text embedding
        contents.push(`\n\n[Uploaded File Context: ${fileAttachment.name}]\n${fileAttachment.data}`);
        console.log(`[API] Attached text file "${fileAttachment.name}"`);
      }
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
    });
    console.log("[API] Analysis completed successfully.");

    let responseText = response.text || "";
    if (!responseText) {
      throw new Error("Empty response received from Gemini model.");
    }

    // Strip markdown code block wrappers if present
    responseText = responseText.trim();
    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7);
      if (responseText.endsWith("```")) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
    } else if (responseText.startsWith("```")) {
      responseText = responseText.substring(3);
      if (responseText.endsWith("```")) {
        responseText = responseText.substring(0, responseText.length - 3);
      }
    }
    
    responseText = responseText.trim();

    const parsedResult = JSON.parse(responseText);
    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("API Error in /api/analyze:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process feasibility analysis." },
      { status: 500 }
    );
  }
}
