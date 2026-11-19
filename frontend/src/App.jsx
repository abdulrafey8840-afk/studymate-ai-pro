import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import StudyChat from "./pages/StudyChat";
import Summarizer from "./pages/Summarizer";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import StudyPlanner from "./pages/StudyPlanner";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/chat" element={<StudyChat />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;