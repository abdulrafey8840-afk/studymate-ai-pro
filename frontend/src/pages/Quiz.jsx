import { Brain } from "lucide-react";
import Card from "../components/common/Card";

function Quiz() {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">ACTIVE LEARNING</span>
          <h1>Quiz Generator</h1>
          <p>Generate quizzes from your study material.</p>
        </div>
      </div>

      <Card className="feature-placeholder">
        <Brain size={32} />
        <h2>AI Quiz Generator</h2>
        <p>
          Choose a document, difficulty and number of questions.
          StudyMate will generate an interactive quiz.
        </p>
        <span className="coming-badge">Backend integration next</span>
      </Card>
    </div>
  );
}

export default Quiz;