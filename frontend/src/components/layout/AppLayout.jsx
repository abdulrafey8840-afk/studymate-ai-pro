import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">

      {/* Mobile Sidebar */}
      <div
        className={
          mobileOpen
            ? "mobile-sidebar open"
            : "mobile-sidebar"
        }
      >
        <Sidebar
          collapsed={false}
          setCollapsed={() => setMobileOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      {/* Main Content */}
      <div
        className={`main-wrapper ${
          collapsed ? "expanded" : ""
        }`}
      >
        <Header
          onMobileMenu={() => setMobileOpen(true)}
        />

        <main className="page-content">
          {children}
        </main>
      </div>

    </div>
  );
}

export default AppLayout;