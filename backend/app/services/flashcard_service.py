import json
import re

from langchain_ollama import ChatOllama


def generate_flashcards(topic: str, count: int):
    """Generate AI-powered study flashcards."""

    if not topic or not topic.strip():
        raise ValueError("Please provide a study topic.")

    if count not in [5, 10, 15, 20]:
        raise ValueError("Flashcard count must be 5, 10, 15 or 20.")

    llm = ChatOllama(
        model="qwen2.5:3b",
        temperature=0.2,
        num_predict=1800,
        num_ctx=4096,
        keep_alive="30m",
    )

    prompt = f"""
You are StudyMate AI, an expert teacher.

Create exactly {count} educational flashcards.

TOPIC: {topic}

RULES:
- Use simple and clear English.
- Focus on important concepts and definitions.
- Make every question meaningful.
- Keep answers accurate and concise.
- Avoid duplicate flashcards.
- Make the content useful for exam preparation.

Return ONLY valid JSON in this structure:

{{
  "flashcards": [
    {{
      "question": "What is Machine Learning?",
      "answer": "Machine Learning is a branch of AI..."
    }}
  ]
}}

Do not include markdown or text outside JSON.
"""

    response = llm.invoke(prompt)
    result = response.content.strip()

    result = re.sub(r"^```(?:json)?\s*", "", result)
    result = re.sub(r"\s*```$", "", result)

    try:
        data = json.loads(result)
    except json.JSONDecodeError as error:
        raise ValueError(
            "AI returned an invalid flashcard format. Please try again."
        ) from error

    flashcards = data.get("flashcards")

    if not isinstance(flashcards, list) or len(flashcards) != count:
        raise ValueError(
            "AI did not generate the requested number of flashcards."
        )

    for card in flashcards:
        if not isinstance(card, dict):
            raise ValueError("AI generated an invalid flashcard.")

        if not all(
            key in card and isinstance(card[key], str) and card[key].strip()
            for key in ["question", "answer"]
        ):
            raise ValueError("AI generated an incomplete flashcard.")

    return flashcards