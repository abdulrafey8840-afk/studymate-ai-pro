import {
  Search,
  Bell,
  Menu,
} from "lucide-react";

function Header({ onMobileMenu }) {
  return (
    <header className="top-header">
      <button className="mobile-menu" onClick={onMobileMenu}>
        <Menu size={21} />
      </button>

      <div className="header-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search documents, chats, quizzes..."
        />

        <span className="search-shortcut">Ctrl K</span>
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={19} />
          <span className="notification-dot"></span>
        </button>

        <div className="header-profile">
          <div className="avatar">AR</div>

          <div className="header-user">
            <strong>Abdul Rafey</strong>
            <span>B.Tech CS • AIML</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;