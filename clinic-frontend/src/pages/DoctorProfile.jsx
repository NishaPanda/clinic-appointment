import React, { useEffect, useState } from 'react';
import { fetchDoctorAppointments } from '../api';
import dayjs from 'dayjs';

export default function DoctorProfile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDoctorAppointments().then(setAppointments).catch(err => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '20px auto' }}>
      <h2>Doctor Profile</h2>
      <div><strong>Name:</strong> {user.name || '—'}</div>
      <div><strong>Email:</strong> {user.email || '—'}</div>
      <div style={{ marginTop: 12 }}>
        <h3>My Appointments</h3>
        {appointments.length === 0 ? <div>No appointments yet</div> : (
          appointments.map(a => (
            <div key={a._id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
              <div><strong>Patient:</strong> {a.patientName}</div>
              <div><strong>Date:</strong> {dayjs(a.date).format('YYYY-MM-DD')} at {a.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
