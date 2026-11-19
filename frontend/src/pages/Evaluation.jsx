import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Brain,
  TrendingUp,
  Target,
  Trophy,
  Clock3,
} from "lucide-react";

function Evaluation() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [studyTasks, setStudyTasks] = useState([]);

  useEffect(() => {
    const loadData = () => {
      try {
        const quizzes = JSON.parse(
          localStorage.getItem("studymate_quiz_history") || "[]"
        );

        const tasks = JSON.parse(
          localStorage.getItem("studymate_study_tasks") || "[]"
        );

        setQuizHistory(Array.isArray(quizzes) ? quizzes : []);
        setStudyTasks(Array.isArray(tasks) ? tasks : []);
      } catch {
        setQuizHistory([]);
        setStudyTasks([]);
      }
    };

    loadData();

    window.addEventListener("focus", loadData);
    window.addEventListener("studymateQuizUpdated", loadData);
    window.addEventListener("storage", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
      window.removeEventListener("studymateQuizUpdated", loadData);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  const totalQuizzes = quizHistory.length;

  const averageScore = totalQuizzes
    ? Math.round(
        quizHistory.reduce(
          (sum, quiz) => sum + Number(quiz.percentage || 0),
          0
        ) / totalQuizzes
      )
    : 0;

  const totalQuestions = quizHistory.reduce(
    (sum, quiz) => sum + Number(quiz.totalQuestions || 0),
    0
  );

  const totalCorrect = quizHistory.reduce(
    (sum, quiz) => sum + Number(quiz.correctAnswers || 0),
    0
  );

  const completedTasks = studyTasks.filter(
    (task) => task.completed
  ).length;

  const studyProgress = studyTasks.length
    ? Math.round((completedTasks / studyTasks.length) * 100)
    : 0;

  const performanceLabel =
    averageScore >= 80
      ? "Excellent"
      : averageScore >= 60
      ? "Good progress"
      : averageScore > 0
      ? "Needs improvement"
      : "No data yet";

  const recentQuizzes = [...quizHistory]
    .sort(
      (a, b) =>
        new Date(b.completedAt || 0) -
        new Date(a.completedAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="page evaluation-page">
      <section className="welcome-section">
        <div>
          <span className="eyebrow">AI LEARNING ANALYTICS</span>
          <h1>Evaluation</h1>
          <p>
            Track your real learning performance and discover
            where you can improve.
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
            <Brain size={21} />
          </div>
          <div>
            <span className="stat-label">Quizzes Completed</span>
            <strong className="stat-value">{totalQuizzes}</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon blue">
            <Target size={21} />
          </div>
          <div>
            <span className="stat-label">Average Score</span>
            <strong className="stat-value">{averageScore}%</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span className="stat-label">Correct Answers</span>
            <strong className="stat-value">{totalCorrect}</strong>
          </div>
        </div>

        <div className="card">
          <div className="stat-icon orange">
            <Trophy size={21} />
          </div>
          <div>
            <span className="stat-label">Study Progress</span>
            <strong className="stat-value">{studyProgress}%</strong>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="card">
          <div className="card-heading">
            <div>
              <h2>Overall Performance</h2>
              <p>Based on your completed quizzes.</p>
            </div>
            <BarChart3 size={22} />
          </div>

          <div className="progress-circle">
            <div>
              <strong>{averageScore}%</strong>
              <span>Average Score</span>
            </div>
          </div>

          <div className="progress-info">
            <span>Performance</span>
            <strong>{performanceLabel}</strong>
          </div>

          <div className="progress-bar">
            <span style={{ width: `${averageScore}%` }}></span>
          </div>

          <div className="evaluation-extra">
            <span>Total Questions</span>
            <strong>{totalQuestions}</strong>
          </div>
        </div>

        <div className="card">
          <div className="card-heading">
            <div>
              <h2>Study Summary</h2>
              <p>Your actual learning activity.</p>
            </div>
            <TrendingUp size={22} />
          </div>

          <div className="document-list">
            <div className="document-row">
              <div className="document-icon">
                <Brain size={20} />
              </div>
              <div className="document-info">
                <strong>Quiz Performance</strong>
                <span>{averageScore}% average score</span>
              </div>
              <span className="status-badge">
                {totalQuizzes} Tests
              </span>
            </div>

            <div className="document-row">
              <div className="document-icon">
                <CheckCircle2 size={20} />
              </div>
              <div className="document-info">
                <strong>Study Tasks</strong>
                <span>{completedTasks} of {studyTasks.length} completed</span>
              </div>
              <span className="status-badge">
                {studyProgress}%
              </span>
            </div>

            <div className="document-row">
              <div className="document-icon">
                <FileText size={20} />
              </div>
              <div className="document-info">
                <strong>Questions Attempted</strong>
                <span>{totalQuestions} total questions</span>
              </div>
              <span className="status-badge">
                {totalCorrect} Correct
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="card evaluation-history">
        <div className="card-heading">
          <div>
            <h2>Recent Quiz History</h2>
            <p>Your latest completed assessments.</p>
          </div>
          <Clock3 size={22} />
        </div>

        {recentQuizzes.length === 0 ? (
          <div className="evaluation-empty">
            <Brain size={32} />
            <h3>No quiz history yet</h3>
            <p>Complete a quiz to see your performance here.</p>
          </div>
        ) : (
          <div className="evaluation-history-list">
            {recentQuizzes.map((quiz, index) => (
              <div
                className="evaluation-history-row"
                key={quiz.completedAt + index}
              >
                <div>
                  <strong>{quiz.topic || "General Quiz"}</strong>
                  <span>
                    {quiz.difficulty || "Standard"} ·{" "}
                    {quiz.correctAnswers}/{quiz.totalQuestions} correct
                  </span>
                </div>

                <div className="evaluation-score">
                  <strong>{quiz.percentage}%</strong>
                  <span>Score</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Evaluation;