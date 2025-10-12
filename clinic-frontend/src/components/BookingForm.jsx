// src/components/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctors, createAppointment } from '../api';
import './booking.css';

export default function BookingForm() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
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
    fetchDoctors()
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(err => { alert(err.message); setLoading(false); });
  }, [doctorId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientName || !form.patientEmail || !form.doctorId || !form.date || !form.time) {
      alert('Please fill all required fields.');
      return;
    }

    const payload = {
      ...form,
      createdAt: new Date().toISOString()
    };

    try {
      const appt = await createAppointment(payload);
      navigate(`/receipt/${appt._id}`);
    } catch (err) {
      alert('Booking failed: ' + err.message);
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
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
          </select>
        </div>

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
          <button type="button" onClick={() => setForm({patientName:'',patientEmail:'',doctorId:'',date:'',time:'',reason:''})}>
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
