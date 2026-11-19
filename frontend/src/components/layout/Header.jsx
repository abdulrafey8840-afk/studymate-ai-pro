import {
  Search,
  Bell,
  Menu,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Header({ onMobileMenu }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userName = user.name || "Student";
  const userEmail = user.email || "StudyMate Member";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <header className="top-header premium-header">
      <button
        className="mobile-menu"
        onClick={onMobileMenu}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      <div className="header-search premium-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search documents, chats, quizzes..."
        />
        <span className="search-shortcut">Ctrl K</span>
      </div>

      <div className="header-actions premium-header-actions">
        <button
          className="icon-button premium-notification"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile premium-profile">
          <div className="avatar premium-avatar">
            {initials || "S"}
          </div>

          <div className="header-user premium-user">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </div>
        </div>

        <button
          className="logout-button premium-logout"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;