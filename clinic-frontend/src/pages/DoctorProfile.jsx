import React, { useEffect, useState } from 'react';
import { fetchDoctorAppointments } from '../api';
import dayjs from 'dayjs';

export default function DoctorProfile() {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [name, setName] = useState(storedUser.name || '');
  const [email, setEmail] = useState(storedUser.email || '');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDoctorAppointments()
      .then(setAppointments)
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = () => {
    const updatedUser = { ...storedUser, name, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    window.dispatchEvent(new Event('user-profile-updated'));
    setMessage('Profile updated successfully!');
    setEditing(false);
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div>
      <style>
        {`
          .doctor-profile-container {
            max-width: 850px;
            margin: 40px auto;
            padding: 35px 40px;
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(145deg, #ffffff, #eaf6fc);
            border-radius: 16px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(4, 86, 193, 0.15);
            color: #004d52;
            animation: fadeIn 0.6s ease-in-out;
          }

          h2 {
            text-align: center;
            color: #0456c1;
            margin-bottom: 25px;
            font-size: 1.9rem;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(4, 86, 193, 0.1);
          }

          h3 {
            color: #26c6da;
            margin-top: 25px;
            margin-bottom: 15px;
            font-size: 1.3rem;
            border-bottom: 2px solid rgba(38, 198, 218, 0.3);
            padding-bottom: 4px;
            display: inline-block;
          }

          .profile-field {
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
          }

          .profile-field strong {
            color: #0456c1;
            font-weight: 600;
            width: 120px;
          }

          .profile-value {
            flex: 1;
            text-align: left;
            color: #004d52;
            font-weight: 500;
          }

          .appointments-list {
            margin-top: 15px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .appointment-card {
            background: linear-gradient(145deg, #e0f7fa, #f0fcff);
            border-radius: 10px;
            padding: 14px 18px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border-left: 4px solid #0456c1;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .appointment-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
          }

          .appointment-card strong {
            color: #0456c1;
          }

          .no-appointments {
            color: #004d52;
            font-style: italic;
            text-align: center;
            opacity: 0.85;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media screen and (max-width: 480px) {
            .doctor-profile-container {
              padding: 20px;
              margin: 20px 10px;
            }

            .profile-field {
              flex-direction: column;
              align-items: flex-start;
            }

            .profile-field strong {
              margin-bottom: 5px;
            }

            h2 {
              font-size: 1.6rem;
            }

            h3 {
              font-size: 1.15rem;
            }
          }
        `}
      </style>

      <div className="doctor-profile-container">
        <h2>Doctor Profile</h2>

        <div className="profile-field">
          <strong>Name:</strong>
          {editing ? (
            <span className="profile-input">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </span>
          ) : (
            <span className="profile-value">{name || '—'}</span>
          )}
        </div>

        <div className="profile-field">
          <strong>Email:</strong>
          {editing ? (
            <span className="profile-input">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </span>
          ) : (
            <span className="profile-value">{email || '—'}</span>
          )}
        </div>

        <div className="profile-field">
          <strong>Role:</strong>
          <span className="profile-value">{storedUser.role || 'Doctor'}</span>
        </div>

        <div className="profile-actions" style={{ textAlign: 'center', marginTop: 20 }}>
          {editing ? (
            <>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => { setEditing(false); setName(storedUser.name || ''); setEmail(storedUser.email || ''); }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>

        <div className="profile-message" style={{ textAlign: 'center', color: '#26c6da', marginTop: 18, fontSize: '1rem', minHeight: 24 }}>{message}</div>

        <h3>My Appointments</h3>
        {appointments.length === 0 ? (
          <div className="no-appointments">No appointments yet</div>
        ) : (
          <div className="appointments-list">
            {appointments.map((a) => (
              <div key={a._id} className="appointment-card">
                <div><strong>Patient:</strong> {a.patientName}</div>
                <div>
                  <strong>Date:</strong> {dayjs(a.date).format('YYYY-MM-DD')} at {a.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
