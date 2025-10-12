import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './NavBar.css';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left Side - Brand */}
      <div className="navbar-brand">
        <span className="brand-health">Health</span>
        <span className="brand-hub">Hub</span>
      </div>

      {/* Hamburger menu for mobile */}
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
        <div className={`line ${isOpen ? 'open' : ''}`}></div>
      </div>

      {/* Center - Main Links */}
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
        <NavLink to="/doctors" className={({ isActive }) => (isActive ? "active" : "")}>Doctors</NavLink>
        <NavLink to="/appointments" className={({ isActive }) => (isActive ? "active" : "")}>My Appointments</NavLink>
      </div>

      {/* Right Side - Auth Links */}
      <div className={`navbar-auth ${isOpen ? 'active' : ''}`}>
        <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>Login</NavLink>
        <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>Register</NavLink>
      </div>
    </nav>
  );
}
