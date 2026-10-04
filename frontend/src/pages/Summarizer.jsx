import { Sparkles } from "lucide-react";
import Card from "../components/common/Card";

function Summarizer() {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">AI TOOL</span>
          <h1>Summarizer</h1>
          <p>Convert long study material into concise revision notes.</p>
        </div>
      </div>

      <Card className="feature-placeholder">
        <Sparkles size={32} />
        <h2>AI Summarization</h2>
        <p>
          Select a document and generate structured summaries,
          key points and revision notes.
        </p>
        <span className="coming-badge">Backend integration next</span>
      </Card>
    </div>
  );
}

export default Summarizer;