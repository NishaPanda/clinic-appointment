// src/components/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './booking.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export default function BookingForm() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [form, setForm] = useState({
    patientName: '',
    patientEmail: '',
    doctorId: doctorId || '',
    date: '',
    time: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);

  // Don't read token/user here (parsing creates a new object each render and can
  // trigger unnecessary effect re-runs). Read them inside effects/handlers.

    // Use a single API base so frontend uses the same backend address everywhere

  useEffect(() => {
    // Read auth info at effect time to avoid object identity changes causing re-renders
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
      alert("Please login first to book an appointment");
      navigate("/login");
      return;
    }

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${API_BASE}/doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data);

        // Auto-select doctor if doctorId param is present
        if (doctorId) {
          const doc = res.data.find(d => d._id === doctorId);
          if (doc) setSelectedDoctorName(doc.name + ' \u2014 ' + (doc.specialization || doc.specialty || ''));
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        alert('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchDoctors();

    // Auto-fill patient info
    if (user) {
      setForm(prev => ({
        ...prev,
        patientName: user.name,
        patientEmail: user.email
      }));
    }
  }, [doctorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'doctorId') {
      const doc = doctors.find(d => d._id === value);
      setSelectedDoctorName(doc ? doc.name + ' — ' + (doc.specialization || doc.specialty || '') : '');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.patientName || !form.patientEmail || !form.doctorId || !form.date || !form.time) {
    alert('Please fill all required fields.');
    return;
  }
  // Read token and user lazily to avoid hook dependency issues
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    alert("Please login first.");
    navigate("/login");
    return;
  }

  try {
    const payload = {
      patientId: user.id,
      patientName: form.patientName,
      patientEmail: form.patientEmail,
      date: form.date,
      time: form.time,
      reason: form.reason
    };

    // Send request using API base so it matches other calls and env var
    const res = await axios.post(
      `${API_BASE}/appointments/doctors/book/${form.doctorId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    alert('Appointment booked successfully!');
    navigate(`/receipt/${res.data.appointment._id}`);
  } catch (err) {
     console.error("Booking error:", err, err.response?.data || err.response?.statusText || 'no response body');
     const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
     alert('Booking failed: ' + serverMsg);
  }
};

  if (loading) return <div className="booking-card">Loading...</div>;

  return (
    <div className="booking-card">
      <h3>Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Patient Full Name *</label>
          <input name="patientName" value={form.patientName} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Patient Email *</label>
          <input name="patientEmail" type="email" value={form.patientEmail} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Select Doctor *</label>
          <select name="doctorId" value={form.doctorId} onChange={handleChange}>
            <option value="">-- choose doctor --</option>
            {doctors.map(d => (
              <option key={d._id} value={d._id}>{d.name} — {d.specialization || d.specialty || ''}</option>
            ))}
          </select>
        </div>

        {selectedDoctorName && <p>Selected Doctor: <strong>{selectedDoctorName}</strong></p>}

        <div className="flex-row date-time">
          <div className="field">
            <label>Date *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Time *</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label>Reason / Notes</label>
          <textarea name="reason" rows="3" value={form.reason} onChange={handleChange}></textarea>
        </div>

        <div className="flex-row buttons">
          <button type="submit">Confirm Booking</button>
          <button
            type="button"
            onClick={() => {
              const user = JSON.parse(localStorage.getItem('user'));
              setForm({
                patientName: user?.name || '',
                patientEmail: user?.email || '',
                doctorId: doctorId || '',
                date: '',
                time: '',
                reason: ''
              });
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <p className="small">
        Tip: after booking you’ll be redirected to a receipt page you can save or print.
      </p>
    </div>
  );
}
