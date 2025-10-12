// src/components/NavBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div style={{fontWeight:700}}>HealthHub</div>
      <NavLink to="/" className={({isActive})=> isActive ? 'active' : ''}>Home</NavLink>
      <NavLink to="/doctors" className={({isActive})=> isActive ? 'active' : ''}>Doctors</NavLink>
      <NavLink to="/appointments" className={({isActive})=> isActive ? 'active' : ''}>My Appointments</NavLink>
      <NavLink to="/login" className={({isActive})=> isActive ? 'active' : ''}>Login</NavLink>
      <NavLink to="/register" className={({isActive})=> isActive ? 'active' : ''}>Register</NavLink>
      <div style={{marginLeft:'auto', color:'#999', fontSize:13}}>Frontend — Vite React</div>
    </nav>
    //anway is donkey
  );
}
