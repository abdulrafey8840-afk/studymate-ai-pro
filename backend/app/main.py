"""The main FastAPI application for StudyMate AI."""

from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.pdf_extractor import extract_text_from_pdf

app = FastAPI(title="StudyMate AI API")

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

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to StudyMate AI"}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF and extract its text."""

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file name was provided.",
        )

    max_size = 20 * 1024 * 1024
    file_content = await file.read()

    if len(file_content) > max_size:
        raise HTTPException(
            status_code=400,
            detail="PDF file must be smaller than 20 MB.",
        )

    safe_filename = Path(file.filename).name
    file_path = UPLOAD_DIR / safe_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    try:
        extracted_text = extract_text_from_pdf(str(file_path))
    except Exception as error:
        raise HTTPException(
            status_code=422,
            detail=f"PDF text extraction failed: {error}",
        ) from error

    return {
        "message": "PDF uploaded and text extracted successfully.",
        "filename": safe_filename,
        "size": len(file_content),
        "path": str(file_path),
        "extracted_text": extracted_text,
    }