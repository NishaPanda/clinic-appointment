// src/components/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './booking.css';

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

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch doctors
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/doctors', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data);

        // If doctorId is passed via params, auto-select and name
        if (doctorId) {
          const doc = res.data.find(d => d._id === doctorId);
          if (doc) setSelectedDoctorName(doc.name + ' — ' + doc.specialty);
        }

        setLoading(false);
      } catch (err) {
        alert('Failed to fetch doctors: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    // Fetch patient info from localStorage or backend
    const fetchPatientInfo = () => {
      const patientName = localStorage.getItem('userName') || '';
      const patientEmail = localStorage.getItem('userEmail') || '';
      setForm(prev => ({ ...prev, patientName, patientEmail }));
    };

    fetchDoctors();
    fetchPatientInfo();
  }, [doctorId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Update selected doctor name
    if (name === 'doctorId') {
      const doc = doctors.find(d => d._id === value);
      setSelectedDoctorName(doc ? doc.name + ' — ' + doc.specialty : '');
    }
  }

  // Convert 24-hour to 12-hour for display
  const formatTime12 = (time24) => {
    if (!time24) return '';
    const [hourStr, min] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${min} ${ampm}`;
  };

async function handleSubmit(e) {
  e.preventDefault();
  if (!form.patientName || !form.patientEmail || !form.doctorId || !form.date || !form.time) {
    alert('Please fill all required fields.');
    return;
  }

  try {
    const payload = {
      patientId: localStorage.getItem('userId'), // send patient ID
      patientName: form.patientName,
      patientEmail: form.patientEmail,
      date: form.date,
      time: form.time,
      reason: form.reason
    };

    const res = await axios.post(
      `http://localhost:8080/api/appointments/doctors/book/${form.doctorId}`,
      payload
    );

    alert('Appointment booked successfully!');
    navigate(`/receipt/${res.data.appointment._id}`);
  } catch (err) {
    alert('Booking failed: ' + (err.response?.data?.message || err.message));
  }
}


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
              <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>
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
            onClick={() => setForm({ patientName: '', patientEmail: '', doctorId: doctorId || '', date: '', time: '', reason: '' })}
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
