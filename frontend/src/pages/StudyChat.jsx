import { useState } from "react";
import { Send, Sparkles, FileText } from "lucide-react";
import Card from "../components/common/Card";

function StudyChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((old) => [
      ...old,
      {
        role: "user",
        text: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="page chat-page">
      <div className="page-title">
        <div>
          <span className="eyebrow">AI LEARNING ASSISTANT</span>
          <h1>AI Study Chat</h1>
          <p>Ask questions from your uploaded study material.</p>
        </div>

        <div className="ai-status">
          <span></span>
          AI Ready
        </div>
      </div>

      <Card className="chat-card">
        <div className="chat-empty">
          <div className="chat-logo">
            <Sparkles size={28} />
          </div>

          <h2>How can I help you study?</h2>

          <p>
            Upload your notes and ask questions. The RAG pipeline will
            provide answers with document citations.
          </p>

          <div className="suggestion-grid">
            <button onClick={() => setMessage("Explain this topic simply.")}>
              Explain this topic simply
            </button>

            <button onClick={() => setMessage("Give me important points.")}>
              Give me important points
            </button>

            <button onClick={() => setMessage("Create revision notes.")}>
              Create revision notes
            </button>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="messages">
            {messages.map((item, index) => (
              <div className="message user-message" key={index}>
                {item.text}
              </div>
            ))}
          </div>
        )}

        <div className="chat-input">
          <FileText size={19} />

          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
            placeholder="Ask something about your notes..."
          />

          <button onClick={sendMessage}>
            <Send size={18} />
          </button>
        </div>

        <small className="demo-note">
          AI/RAG backend connection will be added in the next development stage.
        </small>
      </Card>
    </div>
  );
}

export default StudyChat;