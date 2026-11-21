import json
import re
import random
import os

from langchain_groq import ChatGroq


def generate_quiz(topic: str, difficulty: str, count: int, quiz_mode: str):
    """Generate a structured student-friendly quiz using Groq."""

    if not topic or not topic.strip():
        raise ValueError("Please provide a study topic.")

    if difficulty not in ["Easy", "Medium", "Hard"]:
        raise ValueError("Invalid difficulty level.")

    if count not in [5, 10, 15, 20]:
        raise ValueError("Question count must be 5, 10, 15 or 20.")

    if quiz_mode not in ["Multiple Choice", "True or False"]:
        raise ValueError("Invalid quiz format.")

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise ValueError("GROQ_API_KEY is not configured.")

    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.3,
        max_tokens=4000,
        api_key=api_key,
    )

    true_false_answers = []

    if quiz_mode == "True or False":
        true_count = count // 2

        if count % 2:
            true_count += random.SystemRandom().randint(0, 1)

        false_count = count - true_count

        true_false_answers = (
            ["True"] * true_count +
            ["False"] * false_count
        )

        random.SystemRandom().shuffle(true_false_answers)

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
- The answer MUST exactly match one of the four options.
- Distribute correct answers across A, B, C and D.
- Do not always make the first option correct.
- Vary the correct answer position.

For True or False:
- Provide exactly two options: True and False.
- Create a balanced mixture of TRUE and FALSE statements.
- Follow this exact answer distribution:
{json.dumps(true_false_answers)}

Every False statement must contain a clear factual mistake.
Its explanation must state the correct fact.

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
        raise ValueError(
            "AI returned an invalid quiz format. Please try again."
        ) from error

    if not isinstance(quiz_data, dict):
        raise ValueError("AI returned an invalid quiz structure.")

    questions = quiz_data.get("questions")

    if not isinstance(questions, list) or len(questions) != count:
        raise ValueError(
            "AI did not generate the requested number of questions."
        )

    expected_options = 4 if quiz_mode == "Multiple Choice" else 2

    starting_position = random.SystemRandom().randrange(4)

    for index, question in enumerate(questions):

        if not isinstance(question, dict):
            raise ValueError("AI generated an invalid question.")

        if not all(
            key in question
            for key in ["question", "options", "answer", "explanation"]
        ):
            raise ValueError("AI generated an incomplete question.")

        if not isinstance(question["question"], str) or not question["question"].strip():
            raise ValueError("AI generated an empty question.")

        if not isinstance(question["explanation"], str) or not question["explanation"].strip():
            raise ValueError("AI generated an empty explanation.")

        if not isinstance(question["options"], list):
            raise ValueError("AI generated invalid question options.")

        if len(question["options"]) != expected_options:
            raise ValueError("AI generated an incorrect number of options.")

        if not all(
            isinstance(option, str) and option.strip()
            for option in question["options"]
        ):
            raise ValueError("AI generated invalid options.")

        if not isinstance(question["answer"], str):
            raise ValueError("AI generated an invalid correct answer.")

        question["question"] = question["question"].strip()
        question["explanation"] = question["explanation"].strip()

        question["options"] = [
            option.strip() for option in question["options"]
        ]

        answer = question["answer"].strip()

        matched_answer = next(
            (
                option
                for option in question["options"]
                if option.casefold() == answer.casefold()
            ),
            None
        )

        if matched_answer is None and quiz_mode == "Multiple Choice":
            letter_match = re.fullmatch(
                r"(?:option\s*)?([A-D])",
                answer,
                re.IGNORECASE
            )

            if letter_match:
                answer_index = (
                    ord(letter_match.group(1).upper()) - ord("A")
                )

                if answer_index < len(question["options"]):
                    matched_answer = question["options"][answer_index]

        if quiz_mode == "True or False":

            normalized_answer = answer.casefold()

            if normalized_answer not in ["true", "false"]:
                raise ValueError(
                    "AI generated an invalid True/False answer."
                )

            matched_answer = (
                "True" if normalized_answer == "true" else "False"
            )

            question["options"] = ["True", "False"]

        elif matched_answer is None:
            raise ValueError(
                "AI generated an invalid correct answer. Please try again."
            )

        if quiz_mode == "Multiple Choice":

            wrong_options = [
                option
                for option in question["options"]
                if option != matched_answer
            ]

            random.shuffle(wrong_options)

            correct_position = (
                starting_position + index
            ) % 4

            final_options = wrong_options.copy()
            final_options.insert(correct_position, matched_answer)

            question["options"] = final_options

        question["answer"] = matched_answer

    if quiz_mode == "True or False":
        actual_answers = [
            question["answer"] for question in questions
        ]

        if actual_answers.count("True") != true_false_answers.count("True"):
            raise ValueError(
                "AI could not create a balanced True/False quiz. Please generate again."
            )

        if actual_answers.count("False") != true_false_answers.count("False"):
            raise ValueError(
                "AI could not create a balanced True/False quiz. Please generate again."
            )

    return questions