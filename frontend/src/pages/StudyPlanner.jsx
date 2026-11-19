import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock3,
  BookOpen,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import Card from "../components/common/Card";

const STORAGE_KEY = "studymate_study_tasks";

function StudyPlanner() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    subject: "",
    topic: "",
    date: "",
    time: "",
    priority: "Medium",
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const filteredTasks = useMemo(() => {
    if (filter === "Completed") {
      return tasks.filter((task) => task.completed);
    }
    if (filter === "Pending") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.topic.trim() || !form.date) {
      return;
    }

    const newTask = {
      id: `${Date.now()}-${Math.random()}`,
      ...form,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    setForm({
      subject: "",
      topic: "",
      date: "",
      time: "",
      priority: "Medium",
    });

    setShowForm(false);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  return (
    <div className="page planner-page">
      <div className="page-title planner-heading">
        <div>
          <span className="eyebrow">PERSONALIZED LEARNING</span>
          <h1>Study Planner</h1>
          <p>Plan your learning, stay consistent and achieve your goals.</p>
        </div>

        <button
          className="planner-add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close" : "Add Study Task"}
        </button>
      </div>

      <div className="planner-stats">
        <Card className="planner-stat-card">
          <div className="planner-stat-icon purple">
            <BookOpen size={21} />
          </div>
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </Card>

        <Card className="planner-stat-card">
          <div className="planner-stat-icon green">
            <CheckCircle2 size={21} />
          </div>
          <span>Completed</span>
          <strong>{completed}</strong>
        </Card>

        <Card className="planner-stat-card">
          <div className="planner-stat-icon orange">
            <Clock3 size={21} />
          </div>
          <span>Pending</span>
          <strong>{pending}</strong>
        </Card>

        <Card className="planner-stat-card">
          <div className="planner-stat-icon blue">
            <Target size={21} />
          </div>
          <span>Progress</span>
          <strong>{progress}%</strong>
        </Card>
      </div>

      <Card className="planner-progress-card">
        <div className="planner-progress-heading">
          <div>
            <h3><TrendingUp size={18} /> Overall Progress</h3>
            <p>Keep going! Every completed task brings you closer to your goal.</p>
          </div>
          <strong>{progress}%</strong>
        </div>

        <div className="planner-progress-track">
          <div
            className="planner-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {showForm && (
        <Card className="planner-form-card">
          <h2>Create Study Task</h2>
          <p>Add a new subject or learning goal to your schedule.</p>

          <form onSubmit={handleAddTask}>
            <div className="planner-form-grid">
              <label>
                Subject
                <input
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="e.g. Mathematics"
                  required
                />
              </label>

              <label>
                Topic / Task
                <input
                  value={form.topic}
                  onChange={(e) =>
                    setForm({ ...form, topic: e.target.value })
                  }
                  placeholder="e.g. Algebra chapter 2"
                  required
                />
              </label>

              <label>
                Study Date
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Study Time
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                />
              </label>

              <label>
                Priority
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
            </div>

            <button type="submit" className="planner-add-button">
              <Plus size={17} /> Save Study Task
            </button>
          </form>
        </Card>
      )}

      <div className="planner-list-header">
        <div>
          <h2>My Study Tasks</h2>
          <p>Manage your daily learning schedule.</p>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="planner-filter"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      <div className="planner-task-list">
        {filteredTasks.length === 0 ? (
          <Card className="planner-empty">
            <CalendarDays size={36} />
            <h3>No study tasks yet</h3>
            <p>Add your first study task and start planning your learning.</p>
            <button
              className="planner-add-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} /> Create First Task
            </button>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card
              className={`planner-task-card ${task.completed ? "task-completed" : ""}`}
              key={task.id}
            >
              <button
                className="planner-check"
                onClick={() => toggleTask(task.id)}
                title={task.completed ? "Mark pending" : "Mark completed"}
              >
                {task.completed ? (
                  <CheckCircle2 size={23} />
                ) : (
                  <Circle size={23} />
                )}
              </button>

              <div className="planner-task-info">
                <span className="planner-task-subject">{task.subject}</span>
                <h3>{task.topic}</h3>
                <div className="planner-task-meta">
                  <span><CalendarDays size={14} /> {task.date}</span>
                  {task.time && (
                    <span><Clock3 size={14} /> {task.time}</span>
                  )}
                  <span className={`planner-priority ${getPriorityClass(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  {task.completed && (
                    <span className="planner-completed-label">Completed</span>
                  )}
                </div>
              </div>

              <button
                className="planner-delete"
                onClick={() => deleteTask(task.id)}
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;