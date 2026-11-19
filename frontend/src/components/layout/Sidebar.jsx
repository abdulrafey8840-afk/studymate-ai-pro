import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  Brain,
  Layers,
  CalendarDays,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "My Documents", path: "/documents", icon: FileText },
  { label: "AI Study Chat", path: "/chat", icon: MessageSquare },
  { label: "Summarizer", path: "/summarizer", icon: Sparkles },
  { label: "Quiz Generator", path: "/quiz", icon: Brain },
  { label: "AI Flashcards", path: "/flashcards", icon: Layers },
  { label: "Study Planner", path: "/planner", icon: CalendarDays },
  { label: "Evaluation", path: "/evaluation", icon: BarChart3 },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar premium-sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Premium Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={25} strokeWidth={2.2} />
          <span className="brand-icon-glow"></span>
        </div>

        {!collapsed && (
          <div className="brand-details">
            <h2>StudyMate</h2>
            <div className="brand-subtitle">
              <span>AI</span> PRO
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        {!collapsed && (
          <div className="nav-section-title">
            <span>WORKSPACE</span>
            <span className="section-line"></span>
          </div>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              title={collapsed ? item.label : ""}
              className={({ isActive }) =>
                `nav-item premium-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon">
                <Icon size={19} strokeWidth={2} />
              </span>

              {!collapsed && (
                <span className="nav-label">{item.label}</span>
              )}

              {!collapsed && item.path === "/quiz" && (
                <span className="nav-new-badge">AI</span>
              )}
            </NavLink>
          );
        })}

        {!collapsed && (
          <div className="nav-section-title system-title">
            <span>SYSTEM</span>
            <span className="section-line"></span>
          </div>
        )}

        <NavLink
          to="/settings"
          title={collapsed ? "Settings" : ""}
          className={({ isActive }) =>
            `nav-item premium-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">
            <Settings size={19} strokeWidth={2} />
          </span>

          {!collapsed && (
            <span className="nav-label">Settings</span>
          )}
        </NavLink>
      </nav>

      {/* Premium Bottom Section */}
      <div className="sidebar-bottom">

        {!collapsed && (
          <>
            <div className="sidebar-pro-card">
              <div className="pro-card-icon">
                <Zap size={17} />
              </div>

              <div className="pro-card-text">
                <strong>Study smarter</strong>
                <span>Your AI learning space</span>
              </div>
            </div>

            <div className="sidebar-user">
              <div className="avatar">AR</div>

              <div className="user-info">
                <strong>Abdul Rafey</strong>
                <span>Student Account</span>
              </div>
            </div>
          </>
        )}

        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;