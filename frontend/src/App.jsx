
import { useState } from "react";
import "./App.css";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle PDF selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setResult(null);

    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validate PDF
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    // Validate file size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      e.target.value = "";
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  // Remove selected file
  const removeFile = () => {
    setResumeFile(null);
    setResult(null);

    const fileInput = document.getElementById("resume-upload");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Send resume to FastAPI
  const analyzeResume = async () => {
    if (!resumeFile) {
      setError("Please upload your resume.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      const response = await fetch(
        "https://resume-analyzer-48780744.fastapicloud.dev/api/v1/analyze-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(
          errorData.error || "Failed to analyze resume."
        );
      }

      const data = await response.json();

      setResult(data);

    } catch (err) {
      setError(
        err.message || "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset application
  const resetForm = () => {
    setResumeFile(null);
    setJobDescription("");
    setResult(null);
    setError("");

    const fileInput = document.getElementById("resume-upload");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="app">

      {/* Navigation */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <span>CareerAI</span>
        </div>

        <div className="nav-right">
          <span className="ai-badge">
            <span className="status-dot"></span>
            AI Powered
          </span>
        </div>
      </header>

      <main className="main-container">

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-tag">
            <span>✦</span> SMART CAREER ASSISTANT
          </div>

          <h1>
            Analyze Your Resume
            <br />
            <span>With Artificial Intelligence</span>
          </h1>

          <p>
            Discover how well your resume matches your
            dream job. Get personalized insights and
            actionable recommendations.
          </p>
        </section>

        {/* Input Section */}
        <section className="form-container">

          {/* PDF Upload */}
          <div className="form-group">
            <div className="section-heading">
              <div className="heading-icon">📄</div>

              <div>
                <h3>Upload Your Resume</h3>
                <p>Upload your resume in PDF format.</p>
              </div>
            </div>

            <label
              htmlFor="resume-upload"
              className={`upload-area ${
                resumeFile ? "file-selected" : ""
              }`}
            >
              {!resumeFile ? (
                <>
                  <div className="upload-icon">↑</div>

                  <h4>Click to upload your resume</h4>

                  <p>
                    or select a PDF file from your computer
                  </p>

                  <span className="upload-info">
                    PDF only · Maximum 5 MB
                  </span>
                </>
              ) : (
                <div className="selected-file">

                  <div className="pdf-icon">PDF</div>

                  <div className="file-details">
                    <h4>{resumeFile.name}</h4>

                    <p>
                      {(resumeFile.size / 1024 / 1024).toFixed(2)}
                      {" MB"} · Ready to analyze
                    </p>
                  </div>

                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => {
                      e.preventDefault();
                      removeFile();
                    }}
                  >
                    ✕
                  </button>

                </div>
              )}
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              hidden
            />
          </div>

          {/* Job Description */}
          <div className="form-group">
            <div className="section-heading">
              <div className="heading-icon">💼</div>

              <div>
                <h3>Job Description</h3>
                <p>
                  Paste the job description you want to apply for.
                </p>
              </div>
            </div>

            <textarea
              className="job-textarea"
              placeholder={`Example:

We are looking for a Python Backend Developer.

Requirements:
- Strong knowledge of Python.
- Experience with FastAPI.
- Knowledge of REST APIs.
- Experience with PostgreSQL.
- Understanding of Git and GitHub.`}
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError("");
              }}
            />

            <div className="textarea-footer">
              <span>
                {jobDescription.length} characters
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠</span>
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            className="analyze-button"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Your Resume...
              </>
            ) : (
              <>
                <span>✦</span>
                Analyze Resume
                <span>→</span>
              </>
            )}
          </button>

          <p className="privacy-note">
            🔒 Your resume is processed for analysis.
            Avoid uploading sensitive personal information.
          </p>

        </section>

        {/* Results Section */}
        {result && (
          <section className="results-section">

            <div className="results-header">
              <div>
                <span className="results-tag">
                  ✦ ANALYSIS COMPLETE
                </span>

                <h2>Your Resume Analysis</h2>

                <p>
                  Here is how your resume matches the job.
                </p>
              </div>

              <button
                className="reset-button"
                onClick={resetForm}
              >
                New Analysis
              </button>
            </div>

            {/* Match Score */}
            <div className="score-card">

              <div>
                <span className="card-label">
                  OVERALL MATCH SCORE
                </span>

                <div className="score-value">
                  {result.match_score}%
                </div>

                <p>
                  Estimated match based on the provided
                  resume and job description.
                </p>
              </div>

              <div
                className="score-circle"
                style={{
                  "--score": `${Math.max(
                    0,
                    Math.min(100, result.match_score)
                  )}%`,
                }}
              >
                <div className="score-circle-inner">
                  {result.match_score}%
                </div>
              </div>

            </div>

            {/* Summary */}
            <div className="result-card">
              <div className="result-title">
                <span>📋</span>
                <h3>AI Summary</h3>
              </div>

              <p>{result.summary}</p>
            </div>

            {/* Skills */}
            <div className="results-grid">

              <div className="result-card">
                <div className="result-title">
                  <span>✓</span>
                  <h3>Matching Skills</h3>
                </div>

                {result.matching_skills.length > 0 ? (
                  <ul className="skill-list matching-list">
                    {result.matching_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No matching skills identified.</p>
                )}
              </div>

              <div className="result-card">
                <div className="result-title">
                  <span>!</span>
                  <h3>Missing Skills</h3>
                </div>

                {result.missing_skills.length > 0 ? (
                  <ul className="skill-list missing-list">
                    {result.missing_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No missing skills identified.</p>
                )}
              </div>

            </div>

            {/* Strengths */}
            <div className="result-card">
              <div className="result-title">
                <span>💪</span>
                <h3>Your Strengths</h3>
              </div>

              <ul className="detail-list">
                {result.strengths.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="result-card">
              <div className="result-title">
                <span>🚀</span>
                <h3>Suggested Improvements</h3>
              </div>

              <ul className="detail-list">
                {result.improvements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <p className="disclaimer">
              AI-generated analysis is an estimate and
              should not be treated as a hiring decision.
            </p>

          </section>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            © 2026 CareerAI. Powered by Pydantic AI and Gemini.
          </p>
        </footer>

      </main>
    </div>
  );
}

export default App;
