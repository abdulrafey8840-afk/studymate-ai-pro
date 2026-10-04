import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Sparkles,
  Brain,
  CalendarDays,
  BarChart3,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "My Documents",
    path: "/documents",
    icon: FileText,
  },
  {
    label: "AI Study Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    label: "Summarizer",
    path: "/summarizer",
    icon: Sparkles,
  },
  {
    label: "Quiz Generator",
    path: "/quiz",
    icon: Brain,
  },
  {
    label: "Study Planner",
    path: "/planner",
    icon: CalendarDays,
  },
  {
    label: "Evaluation",
    path: "/evaluation",
    icon: BarChart3,
  },
];

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <GraduationCap size={23} />
        </div>

        {!collapsed && (
          <div>
            <h2>StudyMate</h2>
            <span>AI Pro</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        
        <div className="nav-section-title">
          {!collapsed && "WORKSPACE"}
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              title={collapsed ? item.label : ""}
            >
              <Icon size={19} />

              {!collapsed && (
                <span>{item.label}</span>
              )}
            </NavLink>
          );
        })}

        {/* System */}
        <div className="nav-section-title">
          {!collapsed && "SYSTEM"}
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
          title={collapsed ? "Settings" : ""}
        >
          <Settings size={19} />

          {!collapsed && (
            <span>Settings</span>
          )}
        </NavLink>
      </nav>

      {/* Bottom User Section */}
      <div className="sidebar-bottom">
        
        {!collapsed && (
          <div className="user-mini">
            <div className="avatar">
              AR
            </div>

            <div className="user-info">
              <strong>Abdul Rafey</strong>
              <span>Student</span>
            </div>
          </div>
        )}

        {/* Collapse Button */}
        <button
          className="collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
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