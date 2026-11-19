import { useState } from "react";
import {
  Brain,
  Sparkles,
  FileText,
  Target,
  Clock3,
  ChevronDown,
  Zap,
  BookOpen,
  Trophy,
  CheckCircle2,
  ArrowRight,
  LoaderCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { generateQuiz } from "../services/api";
import "./Quiz.css";

function normalizeAnswer(value) {
  return String(value ?? "").trim().toLowerCase();
}

function Quiz() {
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState("10");
  const [topic, setTopic] = useState("");
  const [quizMode, setQuizMode] = useState("Multiple Choice");

  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTrueFalse = quizMode === "True or False";

  const isAnswerCorrect = (selected, correct) => {
    return normalizeAnswer(selected) === normalizeAnswer(correct);
  };

  const calculateScore = () => {
    if (!quizData?.questions) return 0;

    return quizData.questions.filter((question, index) =>
      isAnswerCorrect(answers[index], question.answer)
    ).length;
  };

  // GENERATE QUIZ
  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setError("");
      setQuizData(null);
      setAnswers({});
      setSubmitted(false);

      const data = await generateQuiz(
        topic.trim(),
        difficulty,
        questionCount,
        quizMode
      );

      if (
        !data ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0
      ) {
        throw new Error("Invalid quiz response from server.");
      }

      // Validate every generated question.
      const validatedQuestions = data.questions.map((question) => {
        if (
          !question.question ||
          !Array.isArray(question.options) ||
          !question.answer
        ) {
          throw new Error("AI generated an incomplete question.");
        }

        if (isTrueFalse) {
          const normalizedAnswer = normalizeAnswer(question.answer);

          if (!["true", "false"].includes(normalizedAnswer)) {
            throw new Error(
              "Invalid True/False answer received from AI."
            );
          }

          return {
            ...question,
            options: ["True", "False"],
            answer:
              normalizedAnswer === "true" ? "True" : "False",
          };
        }

        const matchedAnswer = question.options.find(
          (option) =>
            normalizeAnswer(option) ===
            normalizeAnswer(question.answer)
        );

        if (!matchedAnswer) {
          throw new Error(
            "AI generated an answer that does not match its options."
          );
        }

        return {
          ...question,
          answer: matchedAnswer,
        };
      });

      setQuizData({
        ...data,
        questions: validatedQuestions,
        topic: data.topic || topic.trim(),
        difficulty: data.difficulty || difficulty,
        quiz_mode: data.quiz_mode || quizMode,
        count: validatedQuestions.length,
      });

    } catch (err) {
      console.error("Quiz generation error:", err);
      setError(err.message || "Unable to generate quiz.");
    } finally {
      setLoading(false);
    }
  };

  // SELECT ANSWER
  const handleAnswer = (questionIndex, option) => {
    if (submitted) return;

    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: option,
    }));
  };

  // SAVE QUIZ RESULT
  const handleSubmit = () => {
    if (!quizData) return;

    const totalQuestions = quizData.questions.length;

    if (
      totalQuestions === 0 ||
      Object.keys(answers).length !== totalQuestions
    ) {
      return;
    }

    const correctAnswers = calculateScore();

    const percentage = Math.round(
      (correctAnswers / totalQuestions) * 100
    );

    const result = {
      id: crypto.randomUUID(),
      topic: quizData.topic || topic,
      difficulty: quizData.difficulty || difficulty,
      totalQuestions,
      correctAnswers,
      percentage,
      completedAt: new Date().toISOString(),
    };

    try {
      const previousHistory = JSON.parse(
        localStorage.getItem("studymate_quiz_history") || "[]"
      );

      const safeHistory = Array.isArray(previousHistory)
        ? previousHistory
        : [];

      localStorage.setItem(
        "studymate_quiz_history",
        JSON.stringify([result, ...safeHistory].slice(0, 100))
      );

      window.dispatchEvent(
        new Event("studymateQuizUpdated")
      );

      setSubmitted(true);

    } catch (err) {
      console.error("Unable to save quiz result:", err);
      setError("Quiz result could not be saved. Please try again.");
    }
  };

  // RETRY
  const handleRetry = () => {
    setQuizData(null);
    setAnswers({});
    setSubmitted(false);
    setError("");
  };

  return (
    <div className="quiz-page">

      {/* HERO */}
      <section className="quiz-hero">
        <div className="quiz-hero-content">
          <span className="quiz-eyebrow">
            <Sparkles size={14} />
            SMART LEARNING EXPERIENCE
          </span>

          <h1>
            Test your knowledge.
            <br />
            <span>Master every topic.</span>
          </h1>

          <p>
            Turn your study material into interactive quizzes.
            Practice smarter, identify weak areas and improve your
            understanding with StudyMate AI.
          </p>

          <div className="quiz-hero-points">
            <span>
              <CheckCircle2 size={15} />
              AI-powered questions
            </span>

            <span>
              <CheckCircle2 size={15} />
              Instant feedback
            </span>
          </div>
        </div>

        <div className="quiz-hero-art">
          <div className="quiz-orbit orbit-one" />
          <div className="quiz-orbit orbit-two" />

          <div className="quiz-brain-card">
            <Brain size={65} strokeWidth={1.4} />
            <Sparkles className="quiz-brain-sparkle" size={23} />
          </div>

          <div className="quiz-float-card quiz-float-top">
            <Target size={18} />
            <span>Knowledge</span>
          </div>

          <div className="quiz-float-card quiz-float-bottom">
            <Trophy size={18} />
            <span>Achievement</span>
          </div>
        </div>
      </section>

      {/* QUIZ BUILDER */}
      <section className="quiz-section">
        <div className="quiz-section-heading">
          <div>
            <span className="quiz-section-label">
              CREATE YOUR SESSION
            </span>

            <h2>Build your quiz</h2>

            <p>
              Customize your practice session according to your needs.
            </p>
          </div>

          <div className="quiz-heading-icon">
            <Brain size={23} />
          </div>
        </div>

        <div className="quiz-builder">
          <div className="quiz-builder-main">

            <div className="quiz-field">
              <label>
                <FileText size={16} />
                Study topic
              </label>

              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Machine Learning, DBMS, Biology..."
              />

              <small>
                Enter the topic you want to practice.
              </small>
            </div>

            <div className="quiz-field">
              <label>
                <Target size={16} />
                Difficulty level
              </label>

              <div className="quiz-option-grid">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    type="button"
                    key={level}
                    className={`quiz-option ${
                      difficulty === level ? "active" : ""
                    }`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level}

                    {difficulty === level && (
                      <CheckCircle2 size={15} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-field">
              <label>
                <BookOpen size={16} />
                Number of questions
              </label>

              <div className="quiz-option-grid">
                {["5", "10", "15", "20"].map((count) => (
                  <button
                    type="button"
                    key={count}
                    className={`quiz-option ${
                      questionCount === count ? "active" : ""
                    }`}
                    onClick={() => setQuestionCount(count)}
                  >
                    {count}

                    {questionCount === count && (
                      <CheckCircle2 size={15} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="quiz-field">
              <label>
                <Zap size={16} />
                Quiz format
              </label>

              <div className="quiz-mode-select">
                <select
                  value={quizMode}
                  onChange={(e) => setQuizMode(e.target.value)}
                >
                  <option>Multiple Choice</option>
                  <option>True or False</option>
                </select>

                <ChevronDown size={17} />
              </div>
            </div>

            <button
              className="quiz-generate-btn"
              type="button"
              onClick={handleGenerate}
              disabled={!topic.trim() || loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="quiz-spinner" size={18} />
                  Generating your quiz...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate AI Quiz
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {error && (
              <div className="quiz-error">
                <XCircle size={17} />
                {error}
              </div>
            )}

          </div>

          <aside className="quiz-builder-sidebar">
            <div className="quiz-sidebar-icon">
              <Brain size={27} />
            </div>

            <h3>Your quiz, your pace.</h3>

            <p>
              Create a focused learning session with questions
              tailored to your selected topic and difficulty.
            </p>

            <div className="quiz-summary-item">
              <Clock3 size={17} />
              <div>
                <strong>Flexible practice</strong>
                <span>Learn at your own speed</span>
              </div>
            </div>

            <div className="quiz-summary-item">
              <Target size={17} />
              <div>
                <strong>Focused learning</strong>
                <span>Practice specific subjects</span>
              </div>
            </div>

            <div className="quiz-summary-item">
              <Trophy size={17} />
              <div>
                <strong>Track improvement</strong>
                <span>Build confidence with practice</span>
              </div>
            </div>

            <div className="quiz-sidebar-footer">
              <Sparkles size={15} />
              Powered by StudyMate AI
            </div>
          </aside>
        </div>
      </section>

      {/* QUIZ RESULTS */}
      {quizData && (
        <section className="quiz-results-section">

          <div className="quiz-results-heading">
            <div>
              <span className="quiz-section-label">
                YOUR AI GENERATED TEST
              </span>

              <h2>{quizData.topic} Quiz</h2>

              <p>
                {quizData.count} questions · {quizData.difficulty} ·{" "}
                {quizData.quiz_mode}
              </p>
            </div>

            <span className="quiz-live-badge">
              <Sparkles size={13} />
              AI Generated
            </span>
          </div>

          {submitted && (
            <div className="quiz-score-card">
              <div className="quiz-score-icon">
                <Trophy size={30} />
              </div>

              <div>
                <span>YOUR FINAL SCORE</span>

                <h2>
                  {calculateScore()} / {quizData.questions.length}
                </h2>

                <p>
                  {Math.round(
                    (calculateScore() / quizData.questions.length) * 100
                  )}
                  % correct answers
                </p>
              </div>
            </div>
          )}

          <div className="quiz-questions-list">
            {quizData.questions.map((question, index) => {
              const correct = isAnswerCorrect(
                answers[index],
                question.answer
              );

              return (
                <article className="quiz-question-card" key={index}>
                  <div className="quiz-question-top">
                    <span>QUESTION {index + 1}</span>

                    {submitted && (
                      <span
                        className={
                          correct
                            ? "quiz-answer-status correct"
                            : "quiz-answer-status incorrect"
                        }
                      >
                        {correct ? (
                          <>
                            <CheckCircle2 size={14} />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            Incorrect
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <h3>{question.question}</h3>

                  <div className="quiz-answers-grid">
                    {question.options.map((option, optionIndex) => {
                      const selected = isAnswerCorrect(
                        answers[index],
                        option
                      );

                      const isCorrect =
                        submitted &&
                        isAnswerCorrect(option, question.answer);

                      let className = "quiz-answer-option";

                      if (selected) className += " selected";
                      if (isCorrect) className += " answer-correct";

                      if (submitted && selected && !correct) {
                        className += " answer-incorrect";
                      }

                      return (
                        <button
                          type="button"
                          key={optionIndex}
                          className={className}
                          onClick={() => handleAnswer(index, option)}
                          disabled={submitted}
                        >
                          <span className="quiz-answer-letter">
                            {String.fromCharCode(65 + optionIndex)}
                          </span>

                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="quiz-explanation">
                      <strong>
                        <Sparkles size={15} />
                        Explanation
                      </strong>

                      <p>{question.explanation}</p>

                      {!correct && (
                        <span>
                          Correct answer: {question.answer}
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {!submitted ? (
            <button
              className="quiz-submit-btn"
              type="button"
              onClick={handleSubmit}
              disabled={
                Object.keys(answers).length !==
                quizData.questions.length
              }
            >
              <CheckCircle2 size={18} />
              Submit Quiz
            </button>
          ) : (
            <button
              className="quiz-submit-btn"
              type="button"
              onClick={handleRetry}
            >
              <RotateCcw size={18} />
              Create Another Quiz
            </button>
          )}

        </section>
      )}

      <div className="quiz-footer">
        <Sparkles size={14} />
        Small steps every day lead to big achievements.
      </div>

    </div>
  );
}

export default Quiz;