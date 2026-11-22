"""The main FastAPI application for StudyMate AI."""

from pathlib import Path
from uuid import uuid4

from fastapi import (
    FastAPI,
    File,
    UploadFile,
    HTTPException,
    Depends,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from app.auth_routes import router as auth_router
from app.models import Base, User, Document
from app.dependencies import get_current_user
from database import engine, get_db

from app.services.flashcard_service import generate_flashcards
from app.services.summary_service import summarize_pdf
from app.services.chat_service import ask_question_from_pdf
from app.services.quiz_service import generate_quiz
from app.services.file_extractor import (
    extract_text_from_file,
    SUPPORTED_EXTENSIONS,
)


app = FastAPI(title="StudyMate AI API")

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://studymate-ai-pro-xi.vercel.app",
        "https://studymate-ai-gax9wru18-study-mate-ai-pro.vercel.app",
        "https://studymate-ai-ncnh3b87h-study-mate-ai-pro.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 20 * 1024 * 1024


@app.get("/")
def read_root() -> dict:
    return {"message": "Welcome to StudyMate AI"}


@app.get("/api/health")
def health_check() -> dict:
    return {"status": "ok"}


@app.post("/api/upload-pdf")
@app.post("/api/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file name was provided.",
        )

    original_filename = Path(file.filename).name
    extension = Path(original_filename).suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format.",
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File must be smaller than 20 MB.",
        )

    stored_filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / stored_filename

    try:
        file_path.write_bytes(file_content)

        extracted_text = extract_text_from_file(str(file_path))

        document = Document(
            user_id=current_user.id,
            stored_filename=stored_filename,
            original_filename=original_filename,
            file_type=extension,
            size=len(file_content),
        )

        db.add(document)
        db.commit()

    except ValueError as error:
        db.rollback()
        file_path.unlink(missing_ok=True)

        raise HTTPException(
            status_code=422,
            detail=str(error),
        ) from error

    except Exception as error:
        db.rollback()
        file_path.unlink(missing_ok=True)

        print("UPLOAD ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="File upload or database saving failed.",
        ) from error

    return {
        "message": "File uploaded and text extracted successfully.",
        "filename": stored_filename,
        "original_filename": original_filename,
        "file_type": extension,
        "size": len(file_content),
        "extracted_text": extracted_text,
    }


class PDFChatRequest(BaseModel):
    filename: str
    question: str = Field(min_length=1, max_length=2000)


@app.post("/api/chat-pdf")
async def chat_with_pdf(
    request: PDFChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    safe_filename = Path(request.filename).name

    document = db.query(Document).filter(
        Document.stored_filename == safe_filename,
        Document.user_id == current_user.id,
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="File not found or access denied.",
        )

    file_path = UPLOAD_DIR / safe_filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file is missing.",
        )

    try:
        file_text = extract_text_from_file(str(file_path))

        answer = ask_question_from_pdf(
            file_text,
            request.question,
        )

        return {
            "message": "Answer generated successfully.",
            "filename": safe_filename,
            "question": request.question,
            "answer": answer,
        }

    except Exception as error:
        print("CHAT ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="AI question answering failed.",
        ) from error


class PDFSummaryRequest(BaseModel):
    filename: str


@app.post("/api/summarize-pdf")
async def summarize_uploaded_file(
    request: PDFSummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    safe_filename = Path(request.filename).name

    document = db.query(Document).filter(
        Document.stored_filename == safe_filename,
        Document.user_id == current_user.id,
    ).first()

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="File not found or access denied.",
        )

    file_path = UPLOAD_DIR / safe_filename

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Uploaded file is missing.",
        )

    try:
        file_text = extract_text_from_file(str(file_path))
        summary = summarize_pdf(file_text)

        return {
            "message": "File summarized successfully.",
            "filename": safe_filename,
            "summary": summary,
        }

    except Exception as error:
        print("SUMMARY ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="File summarization failed.",
        ) from error


class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    count: int
    quiz_mode: str


@app.post("/api/generate-quiz")
async def generate_ai_quiz(
    request: QuizRequest,
    current_user: User = Depends(get_current_user),
):
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
        print("QUIZ ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Quiz generation failed.",
        ) from error


class FlashcardRequest(BaseModel):
    topic: str
    count: int


@app.post("/api/generate-flashcards")
async def generate_ai_flashcards(
    request: FlashcardRequest,
    current_user: User = Depends(get_current_user),
):
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
        print("FLASHCARD ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Flashcard generation failed.",
        ) from error