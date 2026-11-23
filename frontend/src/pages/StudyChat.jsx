import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Sparkles,
  FileText,
  Upload,
  Bot,
  User,
  LoaderCircle,
  X,
  MessageSquare,
} from "lucide-react";

import { uploadPDF, chatWithPDF } from "../services/api";
import "./StudyChat.css";

function StudyChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const data = await uploadPDF(file);

      setFilename(data.filename);
      setMessages([]);
      setError("");
    } catch (err) {
      setError(err.message || "PDF upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !filename || loading) return;

    const question = message.trim();

    setMessages((old) => [
      ...old,
      { role: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);
    setError("");

    try {
      const data = await chatWithPDF(filename, question);

      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (err) {
      setError(err.message || "AI response failed.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <div>
          <span className="chat-eyebrow">
            YOUR PERSONAL LEARNING ASSISTANT
          </span>
          <h1>AI Study Chat</h1>
          <p>Learn smarter. Understand faster.</p>
        </div>

        <div className="chat-header-status">
          <span className="status-dot"></span>
          AI Online
        </div>
      </div>

      <div className="chat-workspace">
        <div className="chat-toolbar">
          <div className="chat-toolbar-title">
            <MessageSquare size={19} />
            <span>Study Conversation</span>
          </div>

          <button
            className="clear-chat-btn"
            onClick={clearChat}
            disabled={messages.length === 0}
          >
            <X size={15} />
            Clear chat
          </button>
        </div>

        <div className="chat-conversation">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon">
                <Sparkles size={32} />
              </div>

              <h2>What would you like to learn today?</h2>

              <p>
                Upload your study PDF and let StudyMate AI
                explain difficult concepts in simple language.
              </p>

              <div className="chat-suggestions">
                <button
                  onClick={() =>
                    setMessage("Explain this topic simply.")
                  }
                >
                  <Sparkles size={16} />
                  Explain simply
                </button>

                <button
                  onClick={() =>
                    setMessage("Give me the important points.")
                  }
                >
                  <FileText size={16} />
                  Important points
                </button>

                <button
                  onClick={() =>
                    setMessage("Create revision notes.")
                  }
                >
                  <MessageSquare size={16} />
                  Revision notes
                </button>
              </div>
            </div>
          ) : (
            <div className="chat-message-list">
              {messages.map((item, index) => (
                <div
                  className={`chat-message-row ${item.role}`}
                  key={index}
                >
                  <div className={`chat-avatar ${item.role}`}>
                    {item.role === "assistant" ? (
                      <Bot size={19} />
                    ) : (
                      <User size={19} />
                    )}
                  </div>

                  <div className="chat-message-content">
                    <span className="chat-sender">
                      {item.role === "assistant"
                        ? "StudyMate AI"
                        : "You"}
                    </span>

                    <div className="chat-message-bubble"> 
                       {item.role === "assistant" ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {item.text?.replace(/<br\s*\/?>/gi, "\n")}
</ReactMarkdown>
                               ) : (
                                item.text
                                  )}
                                  </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="chat-message-row assistant">
                  <div className="chat-avatar assistant">
                    <Bot size={19} />
                  </div>

                  <div className="chat-message-content">
                    <span className="chat-sender">
                      StudyMate AI
                    </span>

                    <div className="chat-typing">
                      <span></span>
                      <span></span>
                      <span></span>
                      <small>Thinking...</small>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        <div className="chat-bottom">
          {filename && (
            <div className="attached-pdf">
              <FileText size={18} />
              <div>
                <strong>{filename}</strong>
                <small>PDF uploaded successfully</small>
              </div>
              <span className="pdf-ready">Ready</span>
            </div>
          )}

          <div className="chat-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePDFUpload}
              hidden
            />

            <button
              className="chat-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
            >
              {uploading ? (
                <LoaderCircle size={19} className="spin" />
              ) : (
                <Upload size={19} />
              )}

              {uploading ? "Uploading PDF..." : "Upload PDF"}
            </button>

            <span>
              {filename
                ? "Your document is ready for questions"
                : "Upload a PDF to start your conversation"}
            </span>
          </div>

          <div className="chat-input-box">
            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={
                filename
                  ? "Ask anything about your PDF..."
                  : "Upload a PDF first..."
              }
              disabled={!filename || loading || uploading}
              rows={1}
            />

            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={
                !filename ||
                loading ||
                !message.trim()
              }
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </div>

          <p className="chat-disclaimer">
            StudyMate AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudyChat;