// src/components/MyAppointments.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAppointments, fetchDoctors } from '../api';
import dayjs from 'dayjs';
import './appointment.css';

export default function MyAppointments() {
  const [appts, setAppts] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchDoctors()])
      .then(([a, d]) => { setAppts(a); setDoctors(d); })
      .catch(err => alert(err.message));
  }, []);

  function doctorName(id) {
    const d = doctors.find(x => x._id === id);
    return d ? `${d.name} (${d.specialty})` : 'Unknown doctor';
  }

  if (!appts.length) 
    return (
      <div className="appointments-container no-appointments">
        <h3>No appointments yet</h3>
        <p className="small">Book one from Doctors page.</p>
      </div>
    );

  return (
    <div className="appointments-container">
      <h2>My Appointments</h2>
      {appts.map((a, index) => (
        <div
          key={a._id}
          className="appointment-card"
          style={{ animationDelay: `${index * 0.1}s` }} // staggered fade-in
        >
          <div className="appointment-info">
            <div>
              <div className="patient-doctor">{a.patientName} — {doctorName(a.doctorId)}</div>
              <div className="appointment-date">{dayjs(a.date).format('YYYY-MM-DD')} at {a.time}</div>
              <div className="appointment-booked">Booked: {dayjs(a.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            </div>
            <div>
              <Link to={`/receipt/${a._id}`}><button>Receipt</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
