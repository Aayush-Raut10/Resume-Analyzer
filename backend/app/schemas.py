from pydantic import BaseModel


# Structure of AI-generated analysis
class ResumeAnalysis(BaseModel):
    match_score: int
    matching_skills: list[str]
    missing_skills: list[str]
    strengths: list[str]
    improvements: list[str]
    summary: str



class ResumeRequest(BaseModel):
    resume: str
    job_description: str