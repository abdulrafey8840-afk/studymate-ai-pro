import json
import re

from langchain_ollama import ChatOllama


def generate_quiz(topic: str, difficulty: str, count: int, quiz_mode: str):
    """Generate a structured student-friendly quiz using Ollama."""

    if not topic or not topic.strip():
        raise ValueError("Please provide a study topic.")

    if difficulty not in ["Easy", "Medium", "Hard"]:
        raise ValueError("Invalid difficulty level.")

    if count not in [5, 10, 15, 20]:
        raise ValueError("Question count must be 5, 10, 15 or 20.")

    if quiz_mode not in ["Multiple Choice", "True or False"]:
        raise ValueError("Invalid quiz format.")

    llm = ChatOllama(
        model="qwen2.5:3b",
        temperature=0.2,
        num_predict=1800,
        num_ctx=4096,
        keep_alive="30m",
    )

    prompt = f"""
You are StudyMate AI, an expert teacher and quiz creator.

Create exactly {count} educational quiz questions.

TOPIC: {topic}
DIFFICULTY: {difficulty}
QUIZ FORMAT: {quiz_mode}

RULES:
- Questions must be factually accurate.
- Questions must be relevant to the selected topic.
- Use clear and student-friendly language.
- Avoid duplicate questions.
- Provide the correct answer.
- Provide a short explanation for every answer.

For Multiple Choice:
- Provide exactly four options per question.
- The answer must exactly match one of the four options.

For True or False:
- Provide exactly two options: True and False.
- The answer must be either True or False.

Return ONLY valid JSON in this exact structure:

{{
  "questions": [
    {{
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct option",
      "explanation": "Short explanation"
    }}
  ]
}}

Do not include markdown or text outside the JSON.
"""

    response = llm.invoke(prompt)
    result = response.content.strip()

    result = re.sub(r"^```(?:json)?\s*", "", result)
    result = re.sub(r"\s*```$", "", result)

    try:
        quiz_data = json.loads(result)
    except json.JSONDecodeError as error:
        raise ValueError("AI returned an invalid quiz format. Please try again.") from error

    questions = quiz_data.get("questions")

    if not isinstance(questions, list) or len(questions) != count:
        raise ValueError("AI did not generate the requested number of questions.")

    for question in questions:
        if not all(
            key in question
            for key in ["question", "options", "answer", "explanation"]
        ):
            raise ValueError("AI generated an incomplete question.")

        if not isinstance(question["options"], list):
            raise ValueError("AI generated invalid question options.")

        if question["answer"] not in question["options"]:
            raise ValueError("AI generated an invalid correct answer.")

        expected_options = 4 if quiz_mode == "Multiple Choice" else 2

        if len(question["options"]) != expected_options:
            raise ValueError("AI generated an incorrect number of options.")

    return questions