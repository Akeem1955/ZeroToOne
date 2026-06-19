import os
import json
import logging
from dotenv import load_dotenv
from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, cli
from livekit.plugins import google

# Load env variables from .env.local
load_dotenv(".env.local")

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("startup-agent")

# Map GEMINI_API_KEY to GOOGLE_API_KEY for the LiveKit Google plugin
if "GEMINI_API_KEY" in os.environ and "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]

async def entrypoint(ctx: JobContext):
    logger.info("Starting agent job context...")
    await ctx.connect()
    logger.info(f"Connected to room: {ctx.room.name}")
    
    project_name = "early-stage project"
    active_milestone = "milestone validation"
    file_name = ""
    file_summary = ""
    language = "English"
    
    # Read participant metadata to dynamically guide the agent
    for p in ctx.room.remote_participants.values():
        if p.metadata:
            try:
                meta = json.loads(p.metadata)
                project_name = meta.get("projectName", project_name)
                active_milestone = meta.get("activeMilestoneTitle", active_milestone)
                file_name = meta.get("fileName", "")
                file_summary = meta.get("fileSummary", "")
                language = meta.get("language", language)
                logger.info(f"Parsed participant metadata: project='{project_name}', milestone='{active_milestone}', file='{file_name}', language='{language}'")
                break
            except Exception as e:
                logger.warning(f"Failed to parse participant metadata: {e}")
                
    file_context = ""
    if file_name:
        file_context = f"\n\n[Uploaded Document Context: {file_name}]\n{file_summary}\nUse this context when discussing the project details or milestones."
 
    instructions = (
        f"You are a professional, encouraging, and sharp startup validator assisting a creator on their project: \"{project_name}\".\n"
        f"The user is currently focused on the milestone: \"{active_milestone}\".{file_context}\n\n"
        "Your guidelines:\n"
        "1. Speak in a conversational, friendly, and highly professional tone. Keep your responses relatively brief (1-3 sentences) so it feels like a natural voice conversation.\n"
        f"2. Greet the user, acknowledge their project \"{project_name}\", and ask them about their progress on the active milestone: \"{active_milestone}\".\n"
        "3. Act as a helpful devil's advocate. Constructively challenge their assumptions and guide them toward a concrete, low-cost action step they can perform in 2 hours to validate their idea.\n"
        "4. Answer their questions about target audience, feasibility, and demand gathering.\n"
        f"5. Speak and respond EXCLUSIVELY in the following language: {language}. Do not mix in any other language. Always start the greeting and continue the whole session in {language}. If the language is set to French, you must speak only French. If it is set to English, speak only English.\n"
    )
    
    # Configure Gemini Realtime model
    model = google.beta.realtime.RealtimeModel(
        model="gemini-2.5-flash-native-audio-preview-12-2025",
        voice="Aoede",  # Choices: Puck, Charon, Kore, Fenrir, Aoede
        temperature=0.8,
        instructions=instructions
    )
    
    # Initialize agent and start session
    agent = Agent(
        instructions=instructions,
        llm=model
    )
    
    session = AgentSession()
    await session.start(agent, room=ctx.room)
    logger.info("Agent session finished.")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
