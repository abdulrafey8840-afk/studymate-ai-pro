"""The main FastAPI application for StudyMate AI."""

from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware


# Create the FastAPI application object.
app = FastAPI(title="StudyMate AI API")


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://studymate-ai-pro-1.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Upload directory
# ---------------------------------------------------------

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------

@app.get("/")
def read_root() -> dict[str, str]:
    """Return a simple welcome message from the API."""
    return {"message": "Welcome to StudyMate AI"}


# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------

@app.get("/api/health")
def health_check() -> dict[str, str]:
    """Report whether the API process is running."""
    return {"status": "ok"}


# ---------------------------------------------------------
# PDF Upload
# ---------------------------------------------------------

@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF document to the StudyMate backend."""

    # Check file type
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    # Check file name
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file name was provided.",
        )

    # Maximum file size = 20 MB
    max_size = 20 * 1024 * 1024

    file_content = await file.read()

    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="PDF file must be smaller than 20 MB.",
        )

    # Create a safe filename
    safe_filename = Path(file.filename).name

    file_path = UPLOAD_DIR / safe_filename

    # Save PDF
    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    return {
        "message": "PDF uploaded successfully.",
        "filename": safe_filename,
        "size": len(file_content),
        "path": str(file_path),
    }