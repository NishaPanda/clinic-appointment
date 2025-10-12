// src/components/MyAppointments.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAppointments, fetchDoctors, fetchDoctorAppointments } from '../api';
import { cancelAppointment } from '../api';
import dayjs from 'dayjs';
import './appointment.css';

export default function MyAppointments() {
  const [appts, setAppts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [processing, setProcessing] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    setLoading(true);
    if (user.role === 'doctor') {
      Promise.all([fetchDoctorAppointments(), fetchDoctors()])
        .then(([a, d]) => { setAppts(a); setDoctors(d); })
        .catch(err => alert(err.message))
        .finally(() => setLoading(false));
    } else {
      Promise.all([fetchAppointments(), fetchDoctors()])
        .then(([a, d]) => { setAppts(a); setDoctors(d); })
        .catch(err => alert(err.message))
        .finally(() => setLoading(false));
    }
  }, [user.role]);

  function doctorName(id) {
    const d = doctors.find(x => x._id === id);
    return d ? `${d.name} (${d.specialization || d.specialty || ''})` : 'Unknown doctor';
  }

  function patientInfo(a) {
    return `${a.patientName || 'Unknown'}${a.patientEmail ? ` (${a.patientEmail})` : ''}`;
  }

  if (loading) return <div className="appointments-container no-appointments">Loading appointments...</div>;

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
              {user.role === 'doctor' ? (
                <div className="patient-doctor">{patientInfo(a)} — Booked with {doctorName(a.doctorId)}</div>
              ) : (
                <div className="patient-doctor">{a.patientName} — {doctorName(a.doctorId)}</div>
              )}
              <div className="appointment-date">{dayjs(a.date).format('YYYY-MM-DD')} at {a.time}</div>
              <div className="appointment-booked">Booked: {dayjs(a.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            </div>
              <div>
                <Link to={`/receipt/${a._id}`}><button>Receipt</button></Link>
                {a.status !== 'cancelled' ? (
                  <button
                    style={{ marginLeft: 8 }}
                    disabled={processing[a._id]}
                    onClick={async () => {
                      if (!confirm('Cancel this appointment?')) return;
                      setProcessing(prev => ({ ...prev, [a._id]: true }));
                      try {
                        await cancelAppointment(a._id);
                        // refresh
                        const newAppts = await fetchAppointments();
                        setAppts(newAppts);
                      } catch (err) {
                        console.error('Cancel error', err);
                        // err.message already contains API Error info from safeFetch
                        alert('Cancel failed: ' + (err.message || 'Unknown error'));
                      } finally {
                        setProcessing(prev => ({ ...prev, [a._id]: false }));
                      }
                    }}
                  >
                    {processing[a._id] ? 'Cancelling...' : 'Cancel'}
                  </button>
                ) : (
                  <span style={{ marginLeft: 8, color: '#888', fontWeight: 600 }}>Cancelled</span>
                )}
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}
