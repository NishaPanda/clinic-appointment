import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { fetchDoctorAppointments } from '../api';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [patientsOpen, setPatientsOpen] = useState(false);
  const [nextAppointments, setNextAppointments] = useState([]);
  const navigate = useNavigate();

  // ✅ Check login status from localStorage
  useEffect(() => {
    const checkUser = () => {
      const loggedInUser = localStorage.getItem("user");
      setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
    };

    checkUser(); // Initial check
    window.addEventListener("storage", checkUser);
    window.addEventListener("focus", checkUser);
    window.addEventListener("user-profile-updated", checkUser);
    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("focus", checkUser);
      window.removeEventListener("user-profile-updated", checkUser);
    };
  }, []);

  // If logged in as doctor, fetch upcoming appointments for quick access
  useEffect(() => {
    let mounted = true;
    const userObj = user || (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const isDoctor = userObj && userObj.role && String(userObj.role).toLowerCase() === 'doctor';
    if (isDoctor) {
      fetchDoctorAppointments()
        .then(list => {
          if (!mounted) return;
          // pick next 5 upcoming
          setNextAppointments((list || []).slice(0,5));
        })
        .catch(err => console.error('Failed to load doctor appointments', err));
    } else {
      setNextAppointments([]);
    }
    return () => { mounted = false; };
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.profile-dropdown')) setDropdownOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
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
        {user && user.role && String(user.role).toLowerCase() === 'doctor' ? (
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}> 
            My Patients
          </NavLink>
        ) : (
          <NavLink to="/doctors" className={({ isActive }) => (isActive ? "active" : "")}> 
            Doctors
          </NavLink>
        )}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', }}>
            {user?.role === 'doctor' && (
              <div className="patients-dropdown" onClick={(e) => { e.stopPropagation(); setPatientsOpen(!patientsOpen); }}>
                <div className="patients-icon" style={{ cursor: 'pointer' }}>👥</div>
                <div className="patients-badge">{nextAppointments.length}</div>
                {patientsOpen && (
                  <div className="patients-menu" style={{color: "black"}}>
                    <div className="patients-header">Upcoming Patients</div>
                    {nextAppointments.length === 0 ? (
                      <div className="patient-item">No upcoming appointments</div>
                    ) : (
                      nextAppointments.map(a => (
                        <div key={a._id} className="patient-item" onClick={() => { navigate(`/receipt/${a._id}`); setPatientsOpen(false); }}>
                          <div className="patient-name">{a.patientName || 'Unknown'}</div>
                          <div className="patient-time">{a.date ? a.date.split('T')[0] : ''} {a.time || ''}</div>
                        </div>
                      ))
                    )}
                    <div className="patients-footer"><button onClick={() => { navigate('/profile'); setPatientsOpen(false); }}>View all</button></div>
                  </div>
                )}
              </div>
            )}

            <div className="profile-dropdown">
              <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                👤 {user && user.name ? user.name.split(" ")[0] : "User"}
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={goToProfile}>Profile</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
