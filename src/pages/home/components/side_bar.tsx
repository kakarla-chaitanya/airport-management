import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import "./styles/side_bar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const toggleSidebar = () => setOpen(prev => !prev);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (window.innerWidth > 768) {
      setOpen(false); // close if resizing to desktop
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <>
      {/* Overlay for drawer mode */}
      {open && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      {/* Hamburger for mobile */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Airport Baggage Management System</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/home/dashboard" onClick={handleNavClick}>Dashboard</NavLink>
          <NavLink to="/home/flights" onClick={handleNavClick}>Flights</NavLink>
          <NavLink to="/home/baggage" onClick={handleNavClick}>Baggage</NavLink>
          <NavLink to="/home/operations" onClick={handleNavClick}>Operations</NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
