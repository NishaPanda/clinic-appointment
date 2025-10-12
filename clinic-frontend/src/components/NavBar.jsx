import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login status from localStorage
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = localStorage.getItem("user");
      setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
    };

    checkUser(); // Initial check
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // ✅ Navigate to profile
  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      {/* Left Side - Brand */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <span className="brand-health">Health</span>
        <span className="brand-hub">Hub</span>
      </div>

      {/* Hamburger menu for mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
        <div className={`line ${isOpen ? "open" : ""}`}></div>
      </div>

      {/* Center - Main Links */}
      <div className={`navbar-links ${isOpen ? "active" : ""}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? "active" : "")}>
          Doctors
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>
          My Appointments
        </NavLink>
      </div>

      {/* Right Side - Auth / Profile */}
      <div className={`navbar-auth ${isOpen ? "active" : ""}`}>
        {!user ? (
          <>
            <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
              Register
            </NavLink>
          </>
        ) : (
          <div className="profile-dropdown">
            <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
              👤 {user.name ? user.name.split(" ")[0] : "User"}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={goToProfile}>Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
