// src/components/MyAppointments.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAppointments, fetchDoctors } from '../api';
import dayjs from 'dayjs';

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

  if (!appts.length) return <div className="card"><h3>No appointments yet</h3><p className="small">Book one from Doctors page.</p></div>;

  return (
    <div>
      <h2>My Appointments</h2>
      {appts.map(a => (
        <div key={a._id} className="card">
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:600}}>{a.patientName} — {doctorName(a.doctorId)}</div>
              <div className="small">{dayjs(a.date).format('YYYY-MM-DD')} at {a.time}</div>
              <div className="small">Booked: {dayjs(a.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8, justifyContent:'center'}}>
              <Link to={`/receipt/${a._id}`}><button>Receipt</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
