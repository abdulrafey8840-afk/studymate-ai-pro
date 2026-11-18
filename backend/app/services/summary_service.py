from langchain_ollama import ChatOllama


def summarize_pdf(pdf_text: str) -> str:
    """Generate detailed, student-friendly AI study notes from PDF content."""

    if not pdf_text or not pdf_text.strip():
        raise ValueError("PDF does not contain readable text.")

    llm = ChatOllama(
        model="qwen2.5:3b",
        temperature=0.2,
        num_predict=1400,
        num_ctx=4096,
        keep_alive="30m",
    )

    prompt = f"""
You are StudyMate AI, an expert teacher and study mentor.

Your task is to convert the provided PDF content into high-quality
study notes that help students understand, learn and prepare for exams.

IMPORTANT RULES:
- Explain concepts in simple, clear English.
- Preserve important technical terms and their meanings.
- Explain difficult topics step by step.
- Use headings, subheadings and bullet points.
- Avoid unnecessary repetition and filler.
- Use ONLY information supported by the PDF.
- Never invent facts, formulas, examples or definitions.
- If information is missing, clearly say "Not specified in the document".
- Focus on understanding, not just shortening the content.

FOLLOW THIS STRUCTURE:

# 1. Chapter Overview
Explain what the document or chapter is about and why it matters.

# 2. Detailed Summary
Explain the major topics in a logical order.
Break complex ideas into smaller, easy-to-understand sections.

# 3. Important Definitions
List important terms and explain each in simple language.

# 4. Key Concepts
Explain the most important concepts with their significance.

# 5. Examples and Applications
Include examples from the PDF and explain how concepts are applied.
Do not create unsupported examples.

# 6. Important Formulas and Facts
List relevant formulas, dates, facts and rules if present.
Explain symbols and units where applicable.

# 7. Exam Preparation
Create 5 important questions based on the document.
Include short, accurate answers.

# 8. Quick Revision Notes
Give concise bullet points covering the most important information.

# 9. Final Takeaways
List the 5 most important things a student should remember.

If a section is not relevant to the PDF, write "Not applicable".
Do not repeat the same information across sections unnecessarily.

PDF CONTENT:
{pdf_text[:20000]}
"""

    response = llm.invoke(prompt)

    result = response.content

    if not result or not result.strip():
        raise ValueError("AI could not generate a summary.")

    return result.strip()