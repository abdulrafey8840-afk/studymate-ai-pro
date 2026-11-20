"""The main FastAPI application for StudyMate AI."""

from pathlib import Path

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.auth_routes import router as auth_router
from app.models import Base
from database import engine

from app.services.flashcard_service import generate_flashcards
from app.services.summary_service import summarize_pdf
from app.services.chat_service import ask_question_from_pdf
from app.services.quiz_service import generate_quiz
from app.services.pdf_extractor import extract_text_from_pdf


app = FastAPI(title="StudyMate AI API")

# Create database tables
Base.metadata.create_all(bind=engine)

# Register authentication routes
app.include_router(auth_router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://studymate-ai-pro-xi.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to StudyMate AI"}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


# PDF Upload
@app.post("/api/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

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


# PDF Chat
class PDFChatRequest(BaseModel):
    filename: str
    question: str


@app.post("/api/chat-pdf")
async def chat_with_pdf(request: PDFChatRequest):

    safe_filename = Path(request.filename).name
    file_path = UPLOAD_DIR / safe_filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found. Please upload the PDF first.",
        )

    try:
        pdf_text = extract_text_from_pdf(str(file_path))

        answer = ask_question_from_pdf(
            pdf_text,
            request.question,
        )

        return {
            "message": "Answer generated successfully.",
            "filename": safe_filename,
            "question": request.question,
            "answer": answer,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"AI question answering failed: {error}",
        ) from error


# PDF Summarizer
class PDFSummaryRequest(BaseModel):
    filename: str


@app.post("/api/summarize-pdf")
async def summarize_uploaded_pdf(request: PDFSummaryRequest):

    safe_filename = Path(request.filename).name
    file_path = UPLOAD_DIR / safe_filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="PDF not found. Please upload the PDF first.",
        )

    try:
        pdf_text = extract_text_from_pdf(str(file_path))
        summary = summarize_pdf(pdf_text)

        return {
            "message": "PDF summarized successfully.",
            "filename": safe_filename,
            "summary": summary,
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"PDF summarization failed: {error}",
        ) from error


# AI Quiz
class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    count: int
    quiz_mode: str


@app.post("/api/generate-quiz")
async def generate_ai_quiz(request: QuizRequest):

    try:
        questions = generate_quiz(
            topic=request.topic,
            difficulty=request.difficulty,
            count=request.count,
            quiz_mode=request.quiz_mode,
        )

        return {
            "message": "Quiz generated successfully.",
            "topic": request.topic,
            "difficulty": request.difficulty,
            "count": len(questions),
            "quiz_mode": request.quiz_mode,
            "questions": questions,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Quiz generation failed: {error}",
        ) from error


# AI Flashcards
class FlashcardRequest(BaseModel):
    topic: str
    count: int


@app.post("/api/generate-flashcards")
async def generate_ai_flashcards(request: FlashcardRequest):

    try:
        flashcards = generate_flashcards(
            topic=request.topic,
            count=request.count,
        )

        return {
            "message": "Flashcards generated successfully.",
            "topic": request.topic,
            "count": len(flashcards),
            "flashcards": flashcards,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Flashcard generation failed: {error}",
        ) from error