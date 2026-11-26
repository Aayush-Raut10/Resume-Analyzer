# Resume Analyzer

An AI-powered application that analyzes a candidate's resume against a specific job description, providing a detailed breakdown of strengths, weaknesses, and areas for improvement.

The backend is built with FastAPI and Pydantic AI, using Google's Gemini model for analysis. The frontend is a responsive single-page application built with React and Vite.

## Features

- **Match Score:** Calculates a percentage score representing the resume's match with the job description.
- **Skill Analysis:** Identifies both matching and missing skills required for the role.
- **Strength Highlighting:** Pinpoints the candidate's key strengths based on their resume.
- **Actionable Improvements:** Suggests specific improvements to enhance the resume for the target job.
- **AI Summary:** Provides a concise summary of the candidate's profile in relation to the position.
- **PDF Processing:** Accepts resumes in PDF format, automatically extracting text for analysis.

## Tech Stack

**Backend:**
- **Framework:** FastAPI
- **AI Integration:** Pydantic AI
- **LLM:** Google Gemini
- **PDF Parsing:** `pypdf`
- **Language:** Python

**Frontend:**
- **Framework:** React
- **Build Tool:** Vite
- **Styling:** CSS
- **Language:** JavaScript (JSX)

## How It Works

1.  The user uploads their resume as a PDF and pastes the job description into the respective fields on the React frontend.
2.  The frontend sends a `multipart/form-data` request to the FastAPI backend.
3.  The backend validates the file type and size, then uses `pypdf` to extract the text from the resume.
4.  The extracted resume text and the job description are passed to a `pydantic-ai` agent.
5.  The agent, powered by Google Gemini, analyzes the inputs and generates a structured JSON output according to a predefined Pydantic schema (`ResumeAnalysis`).
6.  The backend returns the structured analysis to the frontend.
7.  The frontend displays the match score, skill breakdown, strengths, and improvements in a user-friendly interface.

## Local Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js and npm
- A Google API Key with access to the Gemini API.

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Aayush-Raut10/Resume-Analyzer.git
    cd Resume-Analyzer/backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Unix/macOS
    python -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the `backend/` directory and add your Google API key:
    ```env
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY"
    ```

5.  **Run the server:**
    The application will be available at `http://127.0.0.1:8000`.
    ```bash
    uvicorn app.main:app --reload
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    The application will be available at `http://localhost:5173`.
    ```bash
    npm run dev
    ```
    
    *Note: The frontend is configured to communicate with a deployed backend instance. To use your local backend, update the `fetch` URL in `frontend/src/App.jsx` from `https://resume-analyzer-48780744.fastapicloud.dev/...` to `http://127.0.0.1:8000/...`.*

## API Endpoint

### Analyze Resume

- **URL:** `/api/v1/analyze-resume`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Form Data:**
    - `resume`: The PDF file of the resume.
    - `job_description`: A string containing the job description.

- **Success Response (200 OK):**
  ```json
  {
    "match_score": 85,
    "matching_skills": ["Python", "FastAPI", "REST APIs"],
    "missing_skills": ["PostgreSQL"],
    "strengths": ["Strong experience with Python and building backend systems.", "Familiarity with modern web frameworks like FastAPI."],
    "improvements": ["Highlight experience with database management, specifically PostgreSQL if any.", "Quantify achievements in previous roles, e.g., 'Improved API response time by 30%'."],
    "summary": "The candidate is a strong fit for the Python Backend Developer role, possessing key skills in Python and FastAPI. Their profile could be further strengthened by detailing their experience with PostgreSQL."
  }