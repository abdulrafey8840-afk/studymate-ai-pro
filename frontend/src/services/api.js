const API_BASE_URL = "https://studymate-ai-backend-ow3g.onrender.com";

export async function checkBackendHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend is not available.");
  }

  return response.json();
}

// Upload supported study documents
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/upload-file`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "File upload failed.");
  }

  return data;
}

// Keep old function name for existing components
export async function uploadPDF(file) {
  return uploadFile(file);
}

// Chat with uploaded document
export async function chatWithPDF(filename, question) {
  const response = await fetch(
    `${API_BASE_URL}/api/chat-pdf`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename,
        question,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "AI chat failed.");
  }

  return data;
}

// Summarize uploaded document
export async function summarizePDF(filename) {
  const response = await fetch(
    `${API_BASE_URL}/api/summarize-pdf`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "Document summarization failed.");
  }

  return data;
}

// Generate AI Quiz
export async function generateQuiz(topic, difficulty, count, quiz_mode) {
  const response = await fetch(
    `${API_BASE_URL}/api/generate-quiz`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        difficulty,
        count: Number(count),
        quiz_mode,
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || "AI Quiz generation failed.");
  }

  return data;
}

// Generate AI Flashcards
export async function generateFlashcards(topic, count) {
  const response = await fetch(
    `${API_BASE_URL}/api/generate-flashcards`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        count: Number(count),
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || "AI Flashcard generation failed."
    );
  }

  return data;
}