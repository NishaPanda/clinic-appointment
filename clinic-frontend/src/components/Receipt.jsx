// src/components/Receipt.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAppointmentById, fetchDoctors } from '../api';
import dayjs from 'dayjs';

export default function Receipt() {
  const { id } = useParams();
  const [appt, setAppt] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAppointmentById(id)
      .then(setAppt)
      .catch(err => alert(err.message));
    fetchDoctors().then(setDoctors);
  }, [id]);

  if (!appt) return <div className="card">Loading receipt...</div>;

  const doctor = doctors.find(d => d._id === appt.doctorId) || { name: 'Unknown', specialty: '' };

  return (
    <div className="card">
      <h3>Appointment Receipt</h3>
      <div style={{ marginTop: 10 }}>
        <div><strong>Patient:</strong> {appt.patientName}</div>
        <div><strong>Email:</strong> {appt.patientEmail}</div>
        <div><strong>Doctor:</strong> {doctor.name} ({doctor.specialty})</div>
        <div>
          <strong>Date & Time:</strong> {dayjs(appt.date).format('YYYY-MM-DD')} at {dayjs(appt.time, 'HH:mm').format('h:mm A')}
        </div>
        <div><strong>Reason:</strong> {appt.reason || '—'}</div>
        <div><strong>Booking ID:</strong> {appt._id}</div>
        <div className="small" style={{ marginTop: 10 }}>
          Printed: {dayjs().format('YYYY-MM-DD h:mm A')}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => window.print()}>Print Receipt</button>
      </div>
    </div>
  );
}
