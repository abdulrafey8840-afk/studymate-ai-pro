import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import StudyChat from "./pages/StudyChat";
import Summarizer from "./pages/Summarizer";
import Quiz from "./pages/Quiz";
import StudyPlanner from "./pages/StudyPlanner";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/chat"
            element={<StudyChat />}
          />

          <Route
            path="/summarizer"
            element={<Summarizer />}
          />

          <Route
            path="/quiz"
            element={<Quiz />}
          />

          <Route
            path="/planner"
            element={<StudyPlanner />}
          />

          <Route
            path="/evaluation"
            element={<Evaluation />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;