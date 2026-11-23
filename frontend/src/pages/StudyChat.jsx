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
  Image,
} from "lucide-react";

import {
  uploadFile,
  chatWithPDF,
  chatWithImage,
} from "../services/api";

import "./StudyChat.css";

function StudyChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [filename, setFilename] = useState("");
  const [originalFilename, setOriginalFilename] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".pptx",
    ".txt",
    ".md",
    ".csv",
  ];

  const allowedImageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // Upload study documents
  const handlePDFUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(
        "Unsupported file. Please upload PDF, Word, Excel, PowerPoint, TXT, CSV or MD."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("File must be smaller than 20 MB.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setError("The selected file is empty.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");

    try {
      const data = await uploadFile(file);

      setFilename(data.filename);
      setOriginalFilename(
        data.original_filename || file.name
      );

      setSelectedImage(null);
      setMessages([]);
      setMessage("");
      setError("");
    } catch (err) {
      setError(err.message || "File upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  // Select image for AI understanding
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedImageExtensions.includes(extension)) {
      setError("Please upload a JPG, JPEG or PNG image.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Invalid image format. Please select a JPG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setError("The selected image is empty.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    // Clear document selection to avoid confusion
    setFilename("");
    setOriginalFilename("");

    setMessages([]);
    setMessage("");
    setError("");

    event.target.value = "";
  };

  // Send question to AI
  const sendMessage = async () => {
    if (
      !message.trim() ||
      (!filename && !selectedImage) ||
      loading ||
      uploading
    ) {
      return;
    }

    const question = message.trim();

    setMessages((old) => [
      ...old,
      { role: "user", text: question },
    ]);

    setMessage("");
    setLoading(true);
    setError("");

    try {
      let data;

      if (selectedImage) {
        data = await chatWithImage(
          selectedImage,
          question
        );
      } else {
        data = await chatWithPDF(
          filename,
          question
        );
      }

      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text: data.answer || "Sorry, I could not generate an answer.",
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

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setMessage("");
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
                Upload a study document or an image of your notes.
                StudyMate AI will help you understand difficult concepts.
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

                <button
                  onClick={() =>
                    setMessage("Read the text in this image and explain it.")
                  }
                >
                  <Image size={16} />
                  Read my image
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
                          {item.text?.replace(
                            /<br\s*\/?>/gi,
                            "\n"
                          )}
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
                <strong>{originalFilename}</strong>
                <small>Document uploaded successfully</small>
              </div>

              <span className="pdf-ready">Ready</span>
            </div>
          )}

          {selectedImage && (
            <div className="attached-pdf">
              <Image size={18} />

              <div>
                <strong>{selectedImage.name}</strong>
                <small>Image selected for AI understanding</small>
              </div>

              <button
                type="button"
                onClick={removeSelectedImage}
                disabled={loading}
                aria-label="Remove selected image"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="chat-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.xls,.pptx,.txt,.md,.csv"
              onChange={handlePDFUpload}
              hidden
            />

            <input
              ref={imageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              onChange={handleImageUpload}
              hidden
            />

            <div className="chat-upload-buttons">
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

                {uploading ? "Uploading..." : "Upload Document"}
              </button>

              <button
                className="chat-upload-btn"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading || loading}
              >
                <Image size={19} />
                Upload Image
              </button>
            </div>

            <span>
              {selectedImage
                ? "Ask questions about your selected image"
                : filename
                  ? "Your document is ready for questions"
                  : "Documents: Max 20 MB | Images: JPG, JPEG, PNG (Max 10 MB)"}
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
                selectedImage
                  ? "Ask anything about your image..."
                  : filename
                    ? "Ask anything about your document..."
                    : "Upload a document or image first..."
              }
              disabled={
                (!filename && !selectedImage) ||
                loading ||
                uploading
              }
              rows={1}
            />

            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={
                (!filename && !selectedImage) ||
                loading ||
                uploading ||
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