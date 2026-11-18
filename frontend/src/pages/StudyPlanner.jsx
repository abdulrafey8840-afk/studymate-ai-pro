import { CalendarDays } from "lucide-react";
import Card from "../components/common/Card";

function StudyPlanner() {
  return (
    <div className="page">
      <div className="page-title">
        <div>
          <span className="eyebrow">PERSONALIZED LEARNING</span>
          <h1>Study Planner</h1>
          <p>Create and manage your personalized study goals.</p>
        </div>
      </div>

      <Card className="feature-placeholder">
        <CalendarDays size={32} />
        <h2>Personal Study Plan</h2>
        <p>
          Your future AI agent will create study schedules based
          on subjects, deadlines and progress.
        </p>
        <span className="coming-badge">Agentic workflow next</span>
      </Card>
    </div>
  );
}

export default StudyPlanner;