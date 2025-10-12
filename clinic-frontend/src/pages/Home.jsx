// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <div className="card">
        <h2>Welcome to Clinic Appointment System</h2>
        <p className="small">Book doctor visits, view appointments and get receipts.</p>
        <div style={{marginTop:12}}>
          <Link to="/doctors"><button>Find doctors</button></Link>
        </div>
      </div>
      <div className="card" style={{marginTop:100}}>
        <h2>Book Appointments. Save Time. Stay Healthy.</h2>
        <h5>What we offer?</h5>
        <p className="small">Easily manage your healthcare appointments with our intuitive online system. 
        Patients can quickly book appointments with available doctors, view their booking details, and receive instant digital receipts. 
        Doctors can efficiently manage their schedules, track patient appointments, and ensure smooth clinic operations. 
        Our platform simplifies appointment management, reduces waiting times, and enhances the overall healthcare experience.
        </p>

      </div>
    </div>
  );
}
