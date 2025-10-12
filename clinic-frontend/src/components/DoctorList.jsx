// src/components/DoctorList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctors } from '../api';
import './doctor.css';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(err => alert('Error: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="doctor-card">Loading doctors...</div>;

  return (
    <div className="doctor-container">
      <h2>Doctors</h2>
      {doctors.map(d => (
        <div key={d._id} className="doctor-card">
          <div className="doctor-info">
            <div>
              <div className="doctor-name">{d.name}</div>
              <div className="doctor-specialty">{d.specialty}</div>
            </div>
            <div>
              <Link to={`/book/${d._id}`}><button>Book</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
