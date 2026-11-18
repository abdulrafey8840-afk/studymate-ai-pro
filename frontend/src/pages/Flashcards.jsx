import { useState } from "react";
import {
  Brain,
  Sparkles,
  Layers,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  LoaderCircle,
  BookOpen,
  Zap,
  Trophy,
  XCircle,
} from "lucide-react";

import { generateFlashcards } from "../services/api";
import "./Flashcards.css";

function Flashcards() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("10");
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [knownCards, setKnownCards] = useState([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a study topic.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCards([]);
      setCurrentIndex(0);
      setFlipped(false);
      setKnownCards([]);

      const data = await generateFlashcards(topic.trim(), count);
      setCards(data.flashcards);
    } catch (err) {
      setError(err.message || "Unable to generate flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setCurrentIndex((previous) =>
      Math.min(previous + 1, cards.length - 1)
    );
    setFlipped(false);
  };

  const previousCard = () => {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
    setFlipped(false);
  };

  const markKnown = () => {
    setKnownCards((previous) =>
      previous.includes(currentIndex)
        ? previous
        : [...previous, currentIndex]
    );

    if (currentIndex < cards.length - 1) {
      nextCard();
    }
  };

  const restartCards = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setKnownCards([]);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flashcards-page">
      <section className="flashcards-hero">
        <div className="flashcards-hero-content">
          <span className="flashcards-eyebrow">
            <Sparkles size={14} />
            SMART REVISION EXPERIENCE
          </span>

          <h1>
            Learn faster.
            <br />
            <span>Remember longer.</span>
          </h1>

          <p>
            Turn any study topic into intelligent flashcards.
            Practice active recall and strengthen your memory
            with StudyMate AI.
          </p>

          <div className="flashcards-hero-points">
            <span><CheckCircle2 size={15} /> AI-generated cards</span>
            <span><CheckCircle2 size={15} /> Active recall learning</span>
          </div>
        </div>

        <div className="flashcards-hero-art">
          <div className="flashcards-art-card art-card-back" />
          <div className="flashcards-art-card art-card-middle" />
          <div className="flashcards-art-card art-card-front">
            <Brain size={53} />
            <Sparkles size={20} />
          </div>
        </div>
      </section>

      <section className="flashcards-builder">
        <div className="flashcards-section-heading">
          <div>
            <span className="flashcards-section-label">
              CREATE YOUR STUDY DECK
            </span>
            <h2>Generate flashcards</h2>
            <p>Choose a topic and let AI prepare your revision cards.</p>
          </div>

          <div className="flashcards-heading-icon">
            <Layers size={23} />
          </div>
        </div>

        <div className="flashcards-form">
          <div className="flashcards-field">
            <label>
              <BookOpen size={16} />
              Study topic
            </label>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Machine Learning, DBMS, Biology..."
            />
            <small>Enter the subject you want to revise.</small>
          </div>

          <div className="flashcards-field">
            <label>
              <Layers size={16} />
              Number of flashcards
            </label>

            <div className="flashcards-count-options">
              {["5", "10", "15", "20"].map((number) => (
                <button
                  type="button"
                  key={number}
                  className={
                    count === number ? "active" : ""
                  }
                  onClick={() => setCount(number)}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="flashcards-generate-btn"
            onClick={handleGenerate}
            disabled={!topic.trim() || loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="flashcards-spinner" size={18} />
                Creating your flashcards...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate AI Flashcards
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {error && (
            <div className="flashcards-error">
              <XCircle size={17} />
              {error}
            </div>
          )}
        </div>
      </section>

      {cards.length > 0 && currentCard && (
        <section className="flashcards-study-section">
          <div className="flashcards-study-heading">
            <div>
              <span className="flashcards-section-label">
                YOUR STUDY DECK
              </span>
              <h2>{topic} Flashcards</h2>
              <p>Click the card to reveal its answer.</p>
            </div>

            <span className="flashcards-deck-badge">
              <Sparkles size={13} /> AI Generated
            </span>
          </div>

          <div className="flashcards-progress">
            <div className="flashcards-progress-info">
              <span>Card {currentIndex + 1} of {cards.length}</span>
              <span>{knownCards.length} mastered</span>
            </div>

            <div className="flashcards-progress-track">
              <div
                className="flashcards-progress-fill"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <button
            type="button"
            className={`flashcard ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped((previous) => !previous)}
          >
            <span className="flashcard-side-label">
              {flipped ? "ANSWER" : "QUESTION"}
            </span>

            <div className="flashcard-main-content">
              {flipped ? currentCard.answer : currentCard.question}
            </div>

            <span className="flashcard-flip-hint">
              <RotateCcw size={15} />
              Click to {flipped ? "see question" : "reveal answer"}
            </span>
          </button>

          <div className="flashcards-controls">
            <button
              type="button"
              className="flashcards-nav-btn"
              onClick={previousCard}
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            <button
              type="button"
              className="flashcards-known-btn"
              onClick={markKnown}
              disabled={knownCards.includes(currentIndex)}
            >
              <CheckCircle2 size={17} />
              {knownCards.includes(currentIndex)
                ? "Mastered"
                : "I know this"}
            </button>

            <button
              type="button"
              className="flashcards-nav-btn"
              onClick={nextCard}
              disabled={currentIndex === cards.length - 1}
            >
              Next
              <ArrowRight size={17} />
            </button>
          </div>

          {currentIndex === cards.length - 1 && (
            <div className="flashcards-complete">
              <Trophy size={22} />
              <div>
                <strong>You reached the last card!</strong>
                <p>Restart your deck to practice again.</p>
              </div>
              <button type="button" onClick={restartCards}>
                <RotateCcw size={15} />
                Restart
              </button>
            </div>
          )}
        </section>
      )}

      <div className="flashcards-footer">
        <Zap size={14} />
        Active recall today. Better memory tomorrow.
      </div>
    </div>
  );
}

export default Flashcards;