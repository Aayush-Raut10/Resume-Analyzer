from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pypdf import PdfReader
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
from .schemas import ResumeRequest
from app.agent import agent 


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)



@app.post("/api/v1/analyze-resume")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    # 1. Validate file type
    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # 2. Read PDF file
    file_bytes = await resume.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File must be smaller than 5 MB."
        )

    # 3. Extract text from PDF
    pdf = PdfReader(BytesIO(file_bytes))

    resume_text = "\n".join(
        page.extract_text() or ""
        for page in pdf.pages
    )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract readable text from PDF."
        )

    # 4. Send extracted text to AI agent
    prompt = f"""
    Analyze this resume against the job description.

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description}
    """

    result = await agent.run(prompt)

    # 5. Return AI analysis
    return result.output
