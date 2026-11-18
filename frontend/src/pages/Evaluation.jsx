import {
  BarChart3,
  CheckCircle2,
  FileText,
  Brain,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

function Evaluation() {
  return (
    <div className="page">
      <section className="welcome-section">
        <div>
          <span className="eyebrow">AI LEARNING ANALYTICS</span>

          <h1>Evaluation</h1>

          <p>
            Track your learning performance and understand where
            you can improve.
          </p>
        </div>

        <div className="welcome-badge">
          <TrendingUp size={18} />
          Learning Progress
        </div>
      </section>

      <section className="stats-grid">
        <div className="card">
          <div className="stat-icon purple">
            <FileText size={21} />
          </div>

          <div>
            <span className="stat-label">Documents</span>
            <strong className="stat-value">12</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon blue">
            <MessageSquare size={21} />
          </div>

          <div>
            <span className="stat-label">AI Questions</span>
            <strong className="stat-value">48</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon green">
            <Brain size={21} />
          </div>

          <div>
            <span className="stat-label">Quiz Score</span>
            <strong className="stat-value">82%</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon orange">
            <BarChart3 size={21} />
          </div>

          <div>
            <span className="stat-label">Study Goal</span>
            <strong className="stat-value">72%</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="card">
          <div className="card-heading">
            <div>
              <h2>Overall Performance</h2>
              <p>Your current learning performance.</p>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="progress-circle">
            <div>
              <strong>82%</strong>
              <span>Overall Score</span>
            </div>
          </div>

          <div className="progress-info">
            <span>Learning progress</span>
            <strong>Good progress</strong>
          </div>

          <div className="progress-bar">
            <span style={{ width: "82%" }}></span>
          </div>
        </div>

        <div className="card">
          <div className="card-heading">
            <div>
              <h2>Evaluation Summary</h2>
              <p>Recent learning activity.</p>
            </div>
          </div>

          <div className="document-list">
            <div className="document-row">
              <div className="document-icon">
                <CheckCircle2 size={20} />
              </div>

              <div className="document-info">
                <strong>Quiz Performance</strong>
                <span>82% average score</span>
              </div>

              <span className="status-badge">Good</span>
            </div>

            <div className="document-row">
              <div className="document-icon">
                <Brain size={20} />
              </div>

              <div className="document-info">
                <strong>Knowledge Coverage</strong>
                <span>76% of uploaded material</span>
              </div>

              <span className="status-badge">Active</span>
            </div>

            <div className="document-row">
              <div className="document-icon">
                <TrendingUp size={20} />
              </div>

              <div className="document-info">
                <strong>Weekly Progress</strong>
                <span>18 of 25 study hours</span>
              </div>

              <span className="status-badge">72%</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Evaluation;