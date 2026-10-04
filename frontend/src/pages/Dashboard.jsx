import { useEffect, useState } from "react";

import {
  FileText,
  MessageSquare,
  Brain,
  Sparkles,
  ArrowRight,
  Clock3,
} from "lucide-react";

import Card from "../components/common/Card";
import { checkBackendHealth } from "../services/api";

const recentDocuments = [
  {
    name: "Machine Learning Notes.pdf",
    pages: 42,
    status: "Ready",
  },
  {
    name: "Deep Learning Unit 3.pdf",
    pages: 28,
    status: "Ready",
  },
  {
    name: "DBMS Revision.pdf",
    pages: 19,
    status: "Ready",
  },
];

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("checking");

  useEffect(() => {
    async function checkServer() {
      try {
        await checkBackendHealth();
        setBackendStatus("online");
      } catch (error) {
        setBackendStatus("offline");
      }
    }

    checkServer();
  }, []);

  const getBackendStatus = () => {
    if (backendStatus === "online") {
      return {
        text: "Backend Online",
        className: "online",
      };
    }

    if (backendStatus === "offline") {
      return {
        text: "Backend Offline",
        className: "offline",
      };
    }

    return {
      text: "Checking...",
      className: "checking",
    };
  };

  const status = getBackendStatus();

  return (
    <div className="page">
      {/* Welcome Section */}
      <section className="welcome-section">
        <div>
          <span className="eyebrow">
            YOUR AI LEARNING WORKSPACE
          </span>

          <h1>السلام عليكم, Abdul Rafey 👋</h1>

          <p>
            Learn smarter with your personal AI study assistant.
            Upload your notes, ask questions and generate learning
            material.
          </p>
        </div>

        <div className="welcome-badge">
          <Sparkles size={18} />
          AI Powered
        </div>
      </section>

      {/* Backend Status */}
      <div className={`backend-status ${status.className}`}>
        <span className="status-dot"></span>
        {status.text}
      </div>

      {/* Statistics */}
      <section className="stats-grid">
        <Card>
          <div className="stat-icon purple">
            <FileText size={21} />
          </div>

          <div>
            <span className="stat-label">Documents</span>
            <strong className="stat-value">12</strong>
          </div>
        </Card>

        <Card>
          <div className="stat-icon blue">
            <MessageSquare size={21} />
          </div>

          <div>
            <span className="stat-label">AI Questions</span>
            <strong className="stat-value">48</strong>
          </div>
        </Card>

        <Card>
          <div className="stat-icon green">
            <Brain size={21} />
          </div>

          <div>
            <span className="stat-label">Quizzes</span>
            <strong className="stat-value">8</strong>
          </div>
        </Card>

        <Card>
          <div className="stat-icon orange">
            <Clock3 size={21} />
          </div>

          <div>
            <span className="stat-label">Study Hours</span>
            <strong className="stat-value">24h</strong>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="section-heading">
        <div>
          <h2>Quick Actions</h2>
          <p>Start your next learning activity.</p>
        </div>
      </section>

      <section className="quick-grid">
        <a href="/documents" className="quick-card">
          <div className="quick-icon purple">
            <FileText />
          </div>

          <div>
            <h3>Upload Documents</h3>
            <p>
              Add PDF notes to your learning workspace.
            </p>
          </div>

          <ArrowRight />
        </a>

        <a href="/chat" className="quick-card">
          <div className="quick-icon blue">
            <MessageSquare />
          </div>

          <div>
            <h3>Ask AI</h3>
            <p>
              Ask questions from your study material.
            </p>
          </div>

          <ArrowRight />
        </a>

        <a href="/quiz" className="quick-card">
          <div className="quick-icon green">
            <Brain />
          </div>

          <div>
            <h3>Generate Quiz</h3>
            <p>
              Test your knowledge with AI generated questions.
            </p>
          </div>

          <ArrowRight />
        </a>

        <a href="/summarizer" className="quick-card">
          <div className="quick-icon orange">
            <Sparkles />
          </div>

          <div>
            <h3>Summarize</h3>
            <p>
              Turn long notes into useful key points.
            </p>
          </div>

          <ArrowRight />
        </a>
      </section>

      {/* Content Grid */}
      <section className="content-grid">
        {/* Recent Documents */}
        <Card>
          <div className="card-heading">
            <div>
              <h2>Recent Documents</h2>
              <p>
                Your recently added study material.
              </p>
            </div>

            <a href="/documents">View all</a>
          </div>

          <div className="document-list">
            {recentDocuments.map((doc) => (
              <div
                className="document-row"
                key={doc.name}
              >
                <div className="document-icon">
                  <FileText size={20} />
                </div>

                <div className="document-info">
                  <strong>{doc.name}</strong>
                  <span>{doc.pages} pages</span>
                </div>

                <span className="status-badge">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Study Progress */}
        <Card>
          <div className="card-heading">
            <div>
              <h2>Study Progress</h2>
              <p>
                This week's learning activity.
              </p>
            </div>
          </div>

          <div className="progress-circle">
            <div>
              <strong>72%</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="progress-info">
            <span>Weekly study goal</span>
            <strong>18 / 25 hours</strong>
          </div>

          <div className="progress-bar">
            <span></span>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Dashboard;