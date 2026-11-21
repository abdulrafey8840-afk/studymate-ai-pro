import { useRef, useState, useEffect } from "react";
import "./Documents.css";

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

import { uploadFile } from "../services/api";

const SUPPORTED_EXTENSIONS = [
  ".pdf",
  ".docx",
  ".xlsx",
  ".xls",
  ".pptx",
  ".txt",
  ".md",
  ".csv",
];

const ACCEPTED_FILES = SUPPORTED_EXTENSIONS.join(",");

function getFileType(filename = "") {
  const extension = filename.split(".").pop()?.toLowerCase();

  const types = {
    pdf: "PDF",
    docx: "Word",
    xlsx: "Excel",
    xls: "Excel",
    pptx: "PowerPoint",
    txt: "Text",
    md: "Markdown",
    csv: "CSV",
  };

  return types[extension] || "Document";
}

function Documents() {
  const fileInputRef = useRef(null);

  const [search, setSearch] = useState("");

  const [documents, setDocuments] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("studymate_documents") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "studymate_documents",
      JSON.stringify(documents)
    );
  }, [documents]);

  // SELECT SUPPORTED FILE
  const handleFileSelect = (file) => {
    setMessage("");

    if (!file) return;

    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {
      setMessage(
        "Unsupported file. Please select PDF, DOCX, XLSX, XLS, PPTX, TXT, MD or CSV."
      );
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage("File size must be less than 20 MB.");
      return;
    }

    if (file.size === 0) {
      setMessage("This file is empty.");
      return;
    }

    setSelectedFile(file);
    setMessage(`${file.name} selected successfully.`);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileSelect(file);
    event.target.value = "";
  };

  // DRAG AND DROP
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

  // UPLOAD DOCUMENT
  const handleAddDocument = async () => {
    if (!selectedFile) {
      setMessage("Please select a document first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Uploading document to StudyMate backend...");

      const response = await uploadFile(selectedFile);

      const newDocument = {
        id: crypto.randomUUID(),
        name: response.original_filename || selectedFile.name,
        filename: response.filename,
        size: response.size || selectedFile.size,
        type: response.file_type || getFileType(selectedFile.name),
        pages: "Processing...",
        status: "Uploaded",
      };

      setDocuments((previous) => [
        newDocument,
        ...previous,
      ]);

      setSelectedFile(null);

      setMessage(
        `${newDocument.name} uploaded successfully!`
      );
    } catch (error) {
      console.error("Document upload error:", error);

      setMessage(
        error.message || "Document upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  // DELETE DOCUMENT FROM LIST
  const handleDelete = (id) => {
    setDocuments((previous) =>
      previous.filter((document) => document.id !== id)
    );

    setMessage("Document removed from your list.");
  };

  // PREVIEW DOCUMENT
  const handleOpenDocument = () => {
    setMessage(
      "Document preview is not available yet. You can use the uploaded document with supported AI features."
    );
  };

  // FORMAT FILE SIZE
  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // SEARCH
  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page documents-page">
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
          Upload File
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILES}
          hidden
          onChange={handleInputChange}
        />
      </section>

      <section className="content-grid">
        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Upload study material</h2>
              <p>
                Add documents to your StudyMate workspace.
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
            onClick={() => {
              if (!uploading) {
                fileInputRef.current?.click();
              }
            }}
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

            <h2>Drop your document here</h2>

            <p>
              or click to browse files from your computer
            </p>

            <small>
              PDF, DOCX, XLSX, XLS, PPTX, TXT, MD, CSV
              <br />
              Maximum 20 MB per file
            </small>
          </div>

          {selectedFile && (
            <div className="selected-file">
              <FileText size={18} />

              <span>{selectedFile.name}</span>

              <span>{formatFileSize(selectedFile.size)}</span>

              <button
                className="danger-icon"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedFile(null);
                }}
                title="Remove selected file"
                disabled={uploading}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {message && (
            <p
              style={{
                marginTop: "12px",
                color: "#a79cff",
                fontSize: "12px",
              }}
            >
              {message}
            </p>
          )}

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
                  <LoaderCircle size={16} className="spin" />
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

        <div className="content-card">
          <div className="card-heading">
            <div>
              <h2>Knowledge Base</h2>
              <p>Your uploaded learning materials.</p>
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
                width: documents.length > 0 ? "100%" : "0%",
              }}
            />
          </div>

          <p className="upload-small">
            {documents.length === 0
              ? "No documents uploaded yet."
              : `${documents.length} document${
                  documents.length > 1 ? "s" : ""
                } saved in your list.`}
          </p>
        </div>
      </section>

      <section
        className="section-heading"
        style={{ marginTop: "28px" }}
      >
        <div>
          <h2>All Documents</h2>
          <p>Manage your uploaded study materials.</p>
        </div>
      </section>

      <div className="mini-search">
        <Search size={17} />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section
        className="content-card"
        style={{ marginTop: "14px" }}
      >
        {filteredDocuments.length === 0 ? (
          <div className="feature-placeholder">
            <FileText size={40} />

            <h2>
              {search ? "No documents found" : "No documents yet"}
            </h2>

            <p>
              {search
                ? "Try a different document name."
                : "Upload your first study document to start building your StudyMate knowledge base."}
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
                  <strong>{document.name}</strong>

                  <span>
                    {document.type || getFileType(document.name)}
                    {" • "}
                    {formatFileSize(document.size)}
                  </span>
                </div>

                <span className="status-badge">
                  <CheckCircle2 size={12} />
                  {document.status}
                </span>

                <button
                  className="icon-button"
                  title="Open document"
                  onClick={() => handleOpenDocument(document)}
                >
                  <Eye size={16} />
                </button>

                <button
                  className="danger-icon"
                  title="Delete document"
                  onClick={() => handleDelete(document.id)}
                >
                  <Trash2 size={16} />
                </button>

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