import { useRef, useState } from "react";
import {
  FileText,
  Upload,
  Search,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  LoaderCircle,
} from "lucide-react";

import { uploadPDF } from "../services/api";

function Documents() {
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // -----------------------------
  // SELECT PDF
  // -----------------------------
  const handleFileSelect = (file) => {
    setMessage("");

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Only PDF files are allowed.");
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage("PDF size must be less than 20 MB.");
      return;
    }

    setSelectedFile(file);
    setMessage(`${file.name} selected successfully.`);
  };

  // -----------------------------
  // FILE INPUT
  // -----------------------------
  const handleInputChange = (event) => {
    const file = event.target.files?.[0];

    handleFileSelect(file);

    // Allows selecting the same file again
    event.target.value = "";
  };

  // -----------------------------
  // DRAG & DROP
  // -----------------------------
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    handleFileSelect(file);
  };

  // -----------------------------
  // UPLOAD PDF TO FASTAPI
  // -----------------------------
  const handleAddDocument = async () => {
    if (!selectedFile) {
      setMessage("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading PDF to StudyMate backend...");

      // Send the actual PDF to FastAPI
      const response = await uploadPDF(selectedFile);

      const newDocument = {
        id: crypto.randomUUID(),
        name: response.filename || selectedFile.name,
        size: selectedFile.size,
        pages: "Processing...",
        status: "Uploaded",
        file: selectedFile,
        backendPath: response.path,
      };

      setDocuments((previous) => [
        newDocument,
        ...previous,
      ]);

      setSelectedFile(null);

      setMessage(
        `${newDocument.name} uploaded successfully to the backend.`
      );
    } catch (error) {
      console.error("PDF upload error:", error);

      setMessage(
        error.message || "PDF upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // -----------------------------
  // DELETE DOCUMENT
  // -----------------------------
  const handleDelete = (id) => {
    setDocuments((previous) =>
      previous.filter((document) => document.id !== id)
    );
  };

  // -----------------------------
  // OPEN PDF
  // -----------------------------
  const handleOpenDocument = (document) => {
    if (!document.file) {
      setMessage("PDF preview is not available.");
      return;
    }

    const url = URL.createObjectURL(document.file);

    window.open(url, "_blank");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  };

  // -----------------------------
  // FORMAT FILE SIZE
  // -----------------------------
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // -----------------------------
  // SEARCH
  // -----------------------------
  const filteredDocuments = documents.filter((document) =>
    document.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page">

      {/* PAGE HEADER */}
      <section className="welcome-section">
        <div>
          <span className="eyebrow">
            YOUR KNOWLEDGE BASE
          </span>

          <h1>My Documents</h1>

          <p>
            Upload and manage your study materials for
            AI-powered learning.
          </p>
        </div>

        <button
          className="welcome-badge upload-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={18} />
          Upload PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={handleInputChange}
        />
      </section>

      {/* UPLOAD + KNOWLEDGE BASE */}
      <section className="content-grid">

        {/* UPLOAD CARD */}
        <div className="content-card">

          <div className="card-heading">
            <div>
              <h2>Upload study material</h2>

              <p>
                Add PDF notes to your StudyMate workspace.
              </p>
            </div>

            <Upload size={22} />
          </div>

          <div
            className={`upload-card ${
              dragActive ? "drag-active" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              fileInputRef.current?.click()
            }
            style={{
              cursor: uploading ? "not-allowed" : "pointer",
              border: dragActive
                ? "1px solid #8b7cff"
                : "1px dashed #383e4c",
              opacity: uploading ? 0.6 : 1,
            }}
          >

            <div className="upload-icon">
              <Upload size={28} />
            </div>

            <h2>Drop your PDF here</h2>

            <p>
              or click to browse files from your computer
            </p>

            <small>
              PDF files • Maximum 20 MB
            </small>

          </div>

          {/* SELECTED FILE */}
          {selectedFile && (
            <div className="selected-file">

              <FileText size={18} />

              <span>
                {selectedFile.name}
              </span>

              <span>
                {formatFileSize(selectedFile.size)}
              </span>

              <button
                className="danger-icon"
                onClick={() => setSelectedFile(null)}
                title="Remove selected file"
                disabled={uploading}
              >
                <X size={16} />
              </button>

            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <p
              style={{
                marginTop: "12px",
                color: uploading ? "#a79cff" : "#a79cff",
                fontSize: "12px",
              }}
            >
              {message}
            </p>
          )}

          {/* UPLOAD BUTTON */}
          {selectedFile && (
            <button
              className="upload-button"
              onClick={handleAddDocument}
              disabled={uploading}
              style={{
                border: "none",
                marginTop: "12px",
                opacity: uploading ? 0.7 : 1,
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="spin"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload to StudyMate
                </>
              )}
            </button>
          )}

        </div>

        {/* KNOWLEDGE BASE */}
        <div className="content-card">

          <div className="card-heading">
            <div>
              <h2>Knowledge Base</h2>

              <p>
                Your uploaded learning materials.
              </p>
            </div>

            <FileText size={22} />
          </div>

          <div className="stat-value">
            {documents.length}
          </div>

          <p className="stat-label">
            Documents available
          </p>

          <div className="progress-bar">
            <span
              style={{
                width:
                  documents.length > 0
                    ? "100%"
                    : "0%",
              }}
            />
          </div>

          <p className="upload-small">
            {documents.length === 0
              ? "No documents uploaded yet."
              : `${documents.length} document${
                  documents.length > 1 ? "s" : ""
                } available in this session.`}
          </p>

        </div>

      </section>

      {/* SEARCH */}
      <section
        className="section-heading"
        style={{ marginTop: "28px" }}
      >
        <div>
          <h2>All Documents</h2>

          <p>
            Manage your uploaded study materials.
          </p>
        </div>
      </section>

      <div className="mini-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      {/* DOCUMENT LIST */}
      <section
        className="content-card"
        style={{ marginTop: "14px" }}
      >

        {filteredDocuments.length === 0 ? (

          <div className="feature-placeholder">

            <FileText size={40} />

            <h2>
              {search
                ? "No documents found"
                : "No documents yet"}
            </h2>

            <p>
              {search
                ? "Try a different document name."
                : "Upload your first PDF to start building your StudyMate knowledge base."}
            </p>

          </div>

        ) : (

          <div className="document-list">

            {filteredDocuments.map((document) => (

              <div
                className="document-row"
                key={document.id}
              >

                <div className="document-icon">
                  <FileText size={19} />
                </div>

                <div className="document-info">

                  <strong>
                    {document.name}
                  </strong>

                  <span>
                    PDF •{" "}
                    {formatFileSize(document.size)}
                  </span>

                </div>

                <span className="status-badge">
                  <CheckCircle2 size={12} />
                  {document.status}
                </span>

                {/* OPEN */}
                <button
                  className="icon-button"
                  title="Open PDF"
                  onClick={() =>
                    handleOpenDocument(document)
                  }
                >
                  <Eye size={16} />
                </button>

                {/* DELETE */}
                <button
                  className="danger-icon"
                  title="Delete document"
                  onClick={() =>
                    handleDelete(document.id)
                  }
                >
                  <Trash2 size={16} />
                </button>

                {/* MORE */}
                <button
                  className="icon-button"
                  title="More options"
                >
                  <MoreVertical size={16} />
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Documents;