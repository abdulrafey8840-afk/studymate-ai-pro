import { useEffect, useState } from "react";
import "./Dashboard.css";

import {
  FileText,
  MessageSquare,
  Brain,
  Sparkles,
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  Zap,
  BookOpen,
  GraduationCap,
  Activity,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";

import { Link } from "react-router-dom";
import { checkBackendHealth } from "../services/api";

const tools = [
  {
    title: "Chat with PDF",
    description: "Ask questions and understand your documents with AI.",
    icon: MessageSquare,
    color: "violet",
    path: "/chat",
    tag: "AI ASSISTANT",
  },
  {
    title: "PDF Summarizer",
    description: "Convert lengthy study material into smart revision notes.",
    icon: Sparkles,
    color: "blue",
    path: "/summarizer",
    tag: "SMART NOTES",
  },
  {
    title: "AI Quiz",
    description: "Test your understanding with intelligent quizzes.",
    icon: Brain,
    color: "green",
    path: "/quiz",
    tag: "PRACTICE",
  },
  {
    title: "My Documents",
    description: "Keep your study PDFs organised in one workspace.",
    icon: FileText,
    color: "orange",
    path: "/documents",
    tag: "LIBRARY",
  },
];

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    async function checkServer() {
      try {
        await checkBackendHealth();
        if (active) setBackendStatus("online");
      } catch {
        if (active) setBackendStatus("offline");
      }
    }

    checkServer();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page dashboard-page">

      {/* Welcome Hero */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <div className="dashboard-eyebrow">
            <Sparkles size={14} />
            YOUR PERSONAL AI LEARNING SPACE
          </div>

          <h1>
            Learn smarter.
            <br />
            <span>Achieve more.</span>
          </h1>

          <p>
            Your intelligent study companion is ready.
            Explore your documents, understand complex topics
            and make every study session count.
          </p>

          <div className="dashboard-hero-actions">
            <Link to="/chat" className="dashboard-primary-btn">
              <MessageSquare size={17} />
              Start Learning
              <ArrowUpRight size={17} />
            </Link>

            <Link to="/documents" className="dashboard-secondary-btn">
              <FileText size={17} />
              My Documents
            </Link>
          </div>

          <div className="dashboard-trust-line">
            <ShieldCheck size={15} />
            Powered by your AI study workspace
          </div>
        </div>

        <div className="dashboard-hero-visual">
          <div className="dashboard-visual-ring ring-one" />
          <div className="dashboard-visual-ring ring-two" />

          <div className="dashboard-visual-card">
            <div className="dashboard-visual-icon">
              <GraduationCap size={46} />
            </div>
            <Sparkles className="dashboard-visual-sparkle" size={23} />
            <span>STUDY SMARTER</span>
            <strong>AI Learning</strong>
            <small>Your knowledge companion</small>
          </div>

          <div className="dashboard-floating-icon floating-one">
            <BookOpen size={21} />
          </div>

          <div className="dashboard-floating-icon floating-two">
            <Brain size={21} />
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="dashboard-status-row">
        <div className="dashboard-status-card">
          <div className="dashboard-status-icon">
            <Activity size={19} />
          </div>

          <div className="dashboard-status-info">
            <span>AI BACKEND</span>
            <strong>
              {backendStatus === "online"
                ? "Connected"
                : backendStatus === "offline"
                ? "Disconnected"
                : "Checking connection"}
            </strong>
          </div>

          <span className={`dashboard-status-indicator ${backendStatus}`}>
            <span />
            {backendStatus === "online"
              ? "Online"
              : backendStatus === "offline"
              ? "Offline"
              : "Checking"}
          </span>
        </div>

        <div className="dashboard-status-card">
          <div className="dashboard-status-icon blue">
            <Zap size={19} />
          </div>

          <div className="dashboard-status-info">
            <span>LEARNING TOOLS</span>
            <strong>AI Workspace</strong>
          </div>

          <span className="dashboard-tool-count">04 TOOLS</span>
        </div>

        <div className="dashboard-status-card">
          <div className="dashboard-status-icon green">
            <ShieldCheck size={19} />
          </div>

          <div className="dashboard-status-info">
            <span>WORKSPACE</span>
            <strong>Ready to learn</strong>
          </div>

          <CheckCircle2 className="dashboard-ready-icon" size={20} />
        </div>
      </section>

      {/* Quick Tools */}
      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-section-label">
              YOUR AI TOOLKIT
            </span>
            <h2>Explore your workspace</h2>
            <p>Everything you need for a smarter study session.</p>
          </div>

          <div className="dashboard-section-decoration">
            <Sparkles size={19} />
          </div>
        </div>

        <div className="dashboard-tools-grid">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                to={tool.path}
                className="dashboard-tool-card"
                key={tool.title}
              >
                <div className={`dashboard-tool-icon ${tool.color}`}>
                  <Icon size={23} />
                </div>

                <span className="dashboard-tool-tag">
                  {tool.tag}
                </span>

                <h3>{tool.title}</h3>
                <p>{tool.description}</p>

                <div className="dashboard-tool-link">
                  Open tool
                  <ArrowUpRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Learning Banner */}
      <section className="dashboard-bottom-banner">
        <div className="dashboard-banner-icon">
          <CalendarDays size={26} />
        </div>

        <div className="dashboard-banner-content">
          <span>YOUR NEXT STUDY SESSION</span>
          <h3>Make today a productive learning day.</h3>
          <p>
            Choose a document, ask AI a question or create
            revision notes to get started.
          </p>
        </div>

        <Link to="/summarizer" className="dashboard-banner-btn">
          Create Study Notes
          <ArrowUpRight size={17} />
        </Link>
      </section>

      <div className="dashboard-footer">
        <Clock3 size={14} />
        <span>StudyMate AI Pro · Your intelligent learning companion</span>
      </div>

    </div>
  );
}

export default Dashboard;