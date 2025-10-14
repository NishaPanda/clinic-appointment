// src/components/Receipt.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAppointmentById, fetchDoctors } from '../api';
import dayjs from 'dayjs';
import './receipt.css';

export default function Receipt() {
  const { id } = useParams();
  const [appt, setAppt] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchAppointmentById(id), fetchDoctors()])
      .then(([appointment, docs]) => {
        setAppt(appointment);
        setDoctors(docs || []);
      })
      .catch(err => {
        console.error('Receipt load error', err);
        setError(err.message || 'Failed to load receipt');
      })
      .finally(() => setLoading(false));
  }, [id]);
  if (loading) return <div className="receipt-card">Loading receipt...</div>;
  if (error) return <div className="receipt-card">Error: {error}</div>;

  if (!appt) return <div className="receipt-card">Appointment not found.</div>;

  const doctor = doctors.find(d => d._id === appt.doctorId) || { name: 'Unknown', specialization: '' };
  // Robust date/time rendering: try to combine date+time first, then fallbacks
  const dateTimeDisplay = (() => {
    try {
      if (appt.date && appt.time) {
        const combined = dayjs(`${appt.date}T${appt.time}`);
        if (combined.isValid()) return combined.format('YYYY-MM-DD [at] h:mm A');
      }
      if (appt.date) {
        const d = dayjs(appt.date);
        if (d.isValid()) return d.format('YYYY-MM-DD');
      }
      if (appt.time) {
        const t = dayjs(appt.time, 'HH:mm');
        if (t.isValid()) return t.format('h:mm A');
      }
    } catch {
      // fall through
    }
    return '—';
  })();

  const emailDisplay = appt.patientEmail || '—';
  const doctorSpecial = doctor.specialization || doctor.specialty || '—';

  return (
    <div className="receipt-card printable">
      <h3>Appointment Receipt</h3>
      <div className="receipt-body">
        <div><strong>Patient:</strong> {appt.patientName || '—'}</div>
        <div><strong>Email:</strong> {emailDisplay}</div>
        <div><strong>Doctor:</strong> {doctor.name} ({doctorSpecial})</div>
        <div>
          <strong>Date & Time:</strong> {dateTimeDisplay}
        </div>
        <div><strong>Reason:</strong> {appt.reason || '—'}</div>
        <div><strong>Booking ID:</strong> {appt._id}</div>
        <div className="small">
          Printed: {dayjs().format('YYYY-MM-DD h:mm A')}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => window.print()}>Print Receipt</button>
      </div>
    </div>
  );
}
