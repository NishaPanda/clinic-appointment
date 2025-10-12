// src/components/DoctorList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './doctor.css';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/doctors');
        setDoctors(response.data); // set the fetched doctors
      } catch (err) {
        alert('Error: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
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
              {/* Navigate to Booking Page */}
              <Link to={`/book/${d._id}`}><button>Book</button></Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
