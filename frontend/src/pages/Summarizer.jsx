import { useState } from "react";
import "./Summarizer.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Sparkles,
  UploadCloud,
  FileText,
  LoaderCircle,
  Copy,
  CheckCircle2,
  Download,
  BookOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { uploadPDF, summarizePDF } from "../services/api";

function Summarizer() {
  const [filename, setFilename] = useState("");
  const [summary, setSummary] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    setSummary("");
    setFilename("");

    try {
      const data = await uploadPDF(file);
      setFilename(data.filename);
    } catch (err) {
      setError(err.message || "PDF upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSummarize = async () => {
    if (!filename || loading) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const data = await summarizePDF(filename);
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "Summary generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy summary.");
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "StudyMate-Summary.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page summarizer-page">
      <div className="summarizer-hero">
        <div className="summarizer-hero-content">
          <div className="summarizer-badge">
            <Sparkles size={14} />
            STUDYMATE AI INTELLIGENCE
          </div>

          <h1>
            Turn documents into
            <span> knowledge.</span>
          </h1>

          <p>
            Transform lengthy study material into clear explanations,
            smart notes and exam-ready revision guides.
          </p>
        </div>

        <div className="summarizer-hero-icon">
          <div className="summarizer-orbit orbit-one" />
          <div className="summarizer-orbit orbit-two" />
          <div className="summarizer-glow">
            <BookOpen size={43} />
            <Sparkles className="summarizer-sparkle" size={19} />
          </div>
        </div>
      </div>

      <div className="summarizer-workspace">
        <section className="summarizer-upload-panel">
          <div className="summarizer-panel-heading">
            <div>
              <span className="summarizer-label">GET STARTED</span>
              <h2>Upload your material</h2>
            </div>
            <span className="summarizer-step">01</span>
          </div>

          <label className="summarizer-dropzone">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleUpload}
              disabled={uploading || loading}
              hidden
            />

            <div className="summarizer-upload-icon">
              {uploading ? (
                <LoaderCircle className="spin" size={30} />
              ) : (
                <UploadCloud size={30} />
              )}
            </div>

            <h3>
              {uploading ? "Uploading your PDF..." : "Drop your PDF here"}
            </h3>

            <p>or click to browse your files</p>

            <span className="summarizer-file-format">
              <ShieldCheck size={14} />
              PDF DOCUMENTS
            </span>
          </label>

          {filename && (
            <div className="summarizer-selected-file">
              <div className="summarizer-selected-icon">
                <FileText size={21} />
              </div>

              <div className="summarizer-file-info">
                <strong>{filename}</strong>
                <span>Successfully uploaded</span>
              </div>

              <CheckCircle2
                size={20}
                className="summarizer-success-icon"
              />
            </div>
          )}

          {error && (
            <div className="summarizer-error">
              {error}
            </div>
          )}

          <button
            className="summarizer-generate-btn"
            onClick={handleSummarize}
            disabled={!filename || loading || uploading}
          >
            {loading ? (
              <>
                <LoaderCircle className="spin" size={19} />
                Creating your study notes...
              </>
            ) : (
              <>
                <Sparkles size={19} />
                Generate AI Summary
              </>
            )}
          </button>

          <div className="summarizer-privacy">
            <ShieldCheck size={16} />
            Your study session is ready when you are.
          </div>

          <div className="summarizer-divider" />

          <div className="summarizer-benefits">
            <div>
              <Zap size={17} />
              <span>AI-powered insights</span>
            </div>
            <div>
              <BookOpen size={17} />
              <span>Student-friendly notes</span>
            </div>
            <div>
              <CheckCircle2 size={17} />
              <span>Exam-focused learning</span>
            </div>
          </div>
        </section>

        <section className="summarizer-result-panel">
          <div className="summarizer-result-top">
            <div>
              <span className="summarizer-label">YOUR AI WORKSPACE</span>
              <h2>Study notes</h2>
              <p>Your knowledge, organised beautifully.</p>
            </div>

            {summary && (
              <div className="summarizer-actions">
                <button
                  onClick={copySummary}
                  className="summarizer-action-btn"
                  title="Copy summary"
                >
                  {copied ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Copy size={17} />
                  )}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={downloadSummary}
                  className="summarizer-action-btn"
                  title="Download summary"
                >
                  <Download size={17} />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="summarizer-processing">
              <div className="summarizer-processing-icon">
                <LoaderCircle className="spin" size={35} />
              </div>
              <h3>Understanding your document</h3>
              <p>
                StudyMate AI is analysing your material and preparing
                structured study notes. This may take a little time.
              </p>
              <div className="summarizer-loading-line">
                <span />
              </div>
              <small>AI ANALYSIS IN PROGRESS</small>
            </div>
          ) : summary ? (
            <div className="summarizer-output">
              <div className="summarizer-output-badge">
                <CheckCircle2 size={15} />
                SUMMARY GENERATED
              </div>
              <div className="summarizer-output-text">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {summary}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="summarizer-empty">
              <div className="summarizer-empty-art">
                <FileText size={43} />
                <Sparkles size={19} />
              </div>
              <h3>Your study notes will appear here</h3>
              <p>
                Upload your PDF and generate your personalised AI
                study guide. Everything will be organised in one place.
              </p>
              <div className="summarizer-empty-tags">
                <span>Key concepts</span>
                <span>Definitions</span>
                <span>Exam questions</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Summarizer;