// src/components/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchDoctors, createAppointment, fetchDoctors as fetchDoc } from '../api';
import dayjs from 'dayjs';

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
        if (doctorId && data.some(d => d._id === doctorId) === false) {
          // doctorId may be invalid, still allow selecting
        }
      })
      .catch(err => { alert(err.message); setLoading(false); });
  }, [doctorId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // basic validation
    if (!form.patientName || !form.patientEmail || !form.doctorId || !form.date || !form.time) {
      alert('Please fill all required fields.');
      return;
    }
    // prepare payload
    const payload = {
      patientName: form.patientName,
      patientEmail: form.patientEmail,
      doctorId: form.doctorId,
      date: form.date,
      time: form.time,
      reason: form.reason,
      createdAt: new Date().toISOString()
    };

    try {
      const appt = await createAppointment(payload);
      // redirect to receipt page
      navigate(`/receipt/${appt._id}`);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  }

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h3>Book Appointment</h3>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Patient Full Name *</label>
          <input name="patientName" value={form.patientName} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Patient Email *</label>
          <input name="patientEmail" value={form.patientEmail} onChange={handleChange} type="email" />
        </div>

        <div className="field">
          <label>Select Doctor *</label>
          <select name="doctorId" value={form.doctorId} onChange={handleChange}>
            <option value="">-- choose doctor --</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
          </select>
        </div>

        <div style={{display:'flex', gap:12}}>
          <div className="field" style={{flex:1}}>
            <label>Date *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} />
          </div>
          <div className="field" style={{flex:1}}>
            <label>Time *</label>
            <input name="time" type="time" value={form.time} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label>Reason / Notes</label>
          <textarea name="reason" rows="3" value={form.reason} onChange={handleChange}></textarea>
        </div>

        <div style={{display:'flex', gap:10}}>
          <button type="submit">Confirm Booking</button>
          <button type="button" onClick={()=> { setForm({patientName:'',patientEmail:'',doctorId:'',date:'',time:'',reason:''})}}>Reset</button>
        </div>
      </form>
      <p className="small" style={{marginTop:10}}>
        Tip: after booking you’ll be redirected to a receipt page you can save or print.
      </p>
    </div>
  );
}
