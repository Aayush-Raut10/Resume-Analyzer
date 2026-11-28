from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.providers.google import GoogleProvider
from schemas import ResumeAnalysis
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.models.fallback import FallbackModel
from dotenv import load_dotenv
import os

load_dotenv()


provider = GoogleProvider(api_key=os.getenv("GOOGLE_API_KEY"))

primary_model = GoogleModel("gemini-2.5-flash", provider=provider)
backup_model = GoogleModel("gemini-2.5-flash-lite", provider=provider)

# Automatically switch to backup_model if primary_model gets a 503 error
model = FallbackModel(primary_model, backup_model)


agent = Agent(
    model,
    output_type=ResumeAnalysis,
    instructions="""
    You are an expert resume analysis assistant.

    Compare the candidate's resume with the
    provided job description.

    Your responsibilities:

    1. Calculate a reasonable match score
       between 0 and 100.

    2. Identify matching skills.

    3. Identify missing required skills.

    4. Identify candidate strengths.

    5. Suggest improvements to the resume.

    6. Provide a short summary.

    Only use information supported by the
    resume and job description.

    Do not invent qualifications or experience.
    """
)