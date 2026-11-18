from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage, HumanMessage

# StudyMate AI local language model
_llm = ChatOllama(
    model="qwen2.5:3b",
    temperature=0,
    num_predict=500,
    num_ctx=2048,
    keep_alive="30m",
)


def ask_question_from_pdf(pdf_text: str, question: str) -> str:
    """Answer a question using the uploaded PDF content."""

    if not pdf_text.strip():
        return "The PDF does not contain readable text."

    if not question.strip():
        return "Please enter a question."

    # Limit context to avoid excessive memory usage
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

    return response.content