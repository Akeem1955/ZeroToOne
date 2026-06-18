# MindX: Zero-to-One Builder Platform 🚀

MindX is a modern SaaS platform designed to help startup founders validate their early-stage ideas, structure actionable 30/60/90-day roadmaps, and work through critical validation milestones with the guidance of an interactive, voice-native AI consultant.

---

## ✨ Features

*   **Material 3 Expressive UI**: A clean, responsive design utilizing alternating backgrounds (`bg-surface` vs. `bg-surface-container-low`) for a seamless flow, omitting arbitrary border lines for a modern feel. Fully supports **Light and Dark themes**.
*   **Multimodal Project Intake**: Upload PDFs, images, text, and code files to give the AI engine full context about your project idea.
*   **Structured Roadmap Milestones**: Breaks down validation into clear stages (Problem-Solution Fit, Feasibility, Target Audience, demand acquisition) with exit gates.
*   **Real-time AI Voice Consultant**: An interactive, low-latency audio calling experience powered by **Gemini 2.5 Flash (Native Audio)** and **LiveKit WebRTC**. The consultant reads your project details and uploaded documents, greeting you with contextual guidance.
*   **Secure Authentication & Database**: User sign-in, signup, password recovery, and secure Firestore document synchronization (configured to handle custom database IDs).

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Vanilla CSS.
*   **Database & Auth**: Firebase Auth and Cloud Firestore.
*   **Voice Client**: LiveKit WebRTC SDK.
*   **AI Engine**: Google GenAI SDK (Gemini 2.5 Flash / 3.1 Flash-Lite) & Gemini Multimodal Live API.
*   **Voice Worker**: LiveKit Agents Python SDK, WebRTC Native Bindings.

---

## 🚀 Getting Started

### 1. Clone & Setup Environment
1. Clone the repository and navigate into the folder.
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and add your credentials:
   * **Firebase Database ID**
   * **Gemini API Key**
   * **LiveKit Cloud Credentials** (URL, API Key, API Secret)

---

### 2. Next.js Web Application
Install dependencies and run the development server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your app.

---

### 3. Voice Agent Worker
The WebRTC agent worker runs as a separate background process:
1. Create a Python virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt # Or install livekit-agents livekit-plugins-google python-dotenv
   ```
2. Start the resilient runner daemon:
   ```bash
   python run_agent.py
   ```
The daemon runs the agent worker and automatically recovers it if there are any network drops or WebRTC driver panics.

---

## 📦 Deployment

### Web App (Vercel)
Deploy your Next.js project to **Vercel** with one click. 
* Add the environment variables from `.env.local` in your Vercel project settings.
* Firebase and Gemini Text endpoints will work out-of-the-box in Vercel's serverless environment.

### Voice Agent (Railway / Render / VM)
Because the LiveKit agent worker runs a **persistent, long-lived WebRTC WebSocket connection**, it cannot run in serverless functions (like Vercel).
* Deploy the Python worker (`agent.py`) as a Docker container or background script on a persistent cloud provider (such as **Railway**, **Render**, or **Fly.io**).
* Configure the same environment variables. It will listen to your LiveKit room and instantly serve voice requests from your live website.
