import os
import base64

from groq import Groq
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage


# Existing text AI model - keep document chat working
_llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    max_tokens=500,
    api_key=os.getenv("GROQ_API_KEY"),
)


def ask_question_from_pdf(pdf_text: str, question: str) -> str:
    """Answer questions using uploaded document content."""

    if not pdf_text.strip():
        return "The document does not contain readable text."

    if not question.strip():
        return "Please enter a question."

    context = pdf_text[:12000]

    messages = [
        SystemMessage(
            content=(
                "You are StudyMate AI, an educational assistant. "
                "Answer using only the provided document content. "
                "If the answer is not present, say so clearly. "
                "Give simple explanations for students."
            )
        ),
        HumanMessage(
            content=(
                f"DOCUMENT CONTENT:\n{context}\n\n"
                f"STUDENT QUESTION:\n{question}"
            )
        ),
    ]

    response = _llm.invoke(messages)

    return str(response.content)


def ask_question_from_image(
    image_bytes: bytes,
    mime_type: str,
    question: str,
) -> str:
    """Understand an uploaded image and answer student questions."""

    if not image_bytes:
        raise ValueError("The uploaded image is empty.")

    if mime_type not in ("image/jpeg", "image/png"):
        raise ValueError("Only JPG, JPEG and PNG images are supported.")

    if not question.strip():
        raise ValueError("Please enter a question.")

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    client = Groq(api_key=api_key)

    response = client.chat.completions.create(
        model="qwen/qwen3.8-27b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are StudyMate AI, an educational assistant. "
                    "Understand the uploaded image carefully. "
                    "Read visible printed and handwritten text when possible. "
                    "Help students solve questions step by step. "
                    "If something is unclear or unreadable, say so honestly. "
                    "Never invent text that cannot be seen."
                ),
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": question,
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": (
                                f"data:{mime_type};base64,{encoded_image}"
                            )
                        },
                    },
                ],
            },
        ],
        temperature=0,
        max_completion_tokens=1200,
    )

    return response.choices[0].message.content or (
        "Sorry, I could not understand this image."
    )