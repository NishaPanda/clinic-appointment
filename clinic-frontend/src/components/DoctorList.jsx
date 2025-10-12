// src/components/DoctorList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDoctors } from '../api';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(err => alert('Error: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading doctors...</div>;

  return (
    <div>
      <h2>Doctors</h2>
      {doctors.map(d => (
        <div key={d._id} className="card">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div style={{fontWeight:600}}>{d.name}</div>
              <div className="small">{d.specialty}</div>
            </div>
            <div className="flex">
              <Link to={`/book/${d._id}`}><button>Book</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
