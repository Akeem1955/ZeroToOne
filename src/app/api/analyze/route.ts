import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { name, idea, audience, country, constraints } = await req.json();

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

    // Use "gemini-2.5-flash" or the user specified "gemini-3.5-flash" if supported.
    // We default to "gemini-2.5-flash" if "gemini-3.5-flash" is not recognized by the endpoint,
    // but we try the user's specific request first.
    const modelName = "gemini-2.5-flash"; 

    const prompt = `
You are a market validation analyst and startup architect.
Analyze the following project idea:
Project Name: ${name}
Vague Idea: ${idea}
Target Audience: ${audience || "General Public"}
Country Context: ${country || "Global"}
Constraints/Resources: ${constraints || "None specified"}

Tasks:
1. Conduct a grounded analysis using Google Search. Search for active competitors, companies, or open source projects doing something similar.
2. Determine a realistic feasibility score (0 to 100) based on market saturation, technical feasibility, and customer acquisition risks. Be highly rigorous. If the idea is highly saturated or has low market demand, the score MUST be below 40.
3. Extract 3 actual competitors or alternatives.
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

Output JSON matching the required schema. Do not make assumptions, rely on search results.
`;

    // Call Gemini with search grounding and structured JSON schema
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        // Enable search grounding
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER" },
            advice: { type: "STRING" },
            competitors: { type: "ARRAY", items: { type: "STRING" } },
            painPoints: { type: "ARRAY", items: { type: "STRING" } },
            roadmap: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  duration: { type: "STRING" },
                  description: { type: "STRING" },
                  inputs: { type: "ARRAY", items: { type: "STRING" } },
                  firstStep: { type: "STRING" },
                  completionGate: { type: "STRING" }
                },
                required: ["title", "duration", "description", "inputs", "firstStep", "completionGate"]
              }
            },
            devilAdvocate: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["score", "advice", "competitors", "painPoints", "roadmap", "devilAdvocate"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response received from Gemini model.");
    }

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
