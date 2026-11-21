import os
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage

# StudyMate AI - Groq Cloud Language Model
_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    max_tokens=500,
    api_key=os.getenv("GROQ_API_KEY"),
)


def ask_question_from_pdf(pdf_text: str, question: str) -> str:
    """Answer a question using the uploaded PDF content."""

    if not pdf_text.strip():
        return "The PDF does not contain readable text."

    if not question.strip():
        return "Please enter a question."

    context = pdf_text[:12000]

    messages = [
        SystemMessage(
            content=(
                "You are StudyMate AI, an educational assistant. "
                "Answer questions using only the provided PDF content. "
                "If the answer is not present in the PDF, say so clearly. "
                "Give simple, clear explanations for students."
            )
        ),
        HumanMessage(
            content=(
                f"PDF CONTENT:\n{context}\n\n"
                f"STUDENT QUESTION:\n{question}"
            )
        ),
    ]

    response = _llm.invoke(messages)

    return str(response.content)