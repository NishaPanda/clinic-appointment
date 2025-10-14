<<<<<<< HEAD

import React, { useState } from 'react';


export default function PatientProfile() {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [name, setName] = useState(storedUser.name || '');
  const [email, setEmail] = useState(storedUser.email || '');
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

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
          .profile-container {
            max-width: 700px;
            margin: 40px auto;
            padding: 30px 40px;
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
            font-size: 1.8rem;
            letter-spacing: 0.5px;
            text-shadow: 0 1px 2px rgba(4, 86, 193, 0.1);
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

          p {
            text-align: center;
            margin-top: 25px;
            font-size: 0.95rem;
            color: #26c6da;
            opacity: 0.9;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media screen and (max-width: 480px) {
            .profile-container {
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
          }
        `}
      </style>

      <div className="profile-container">
        <h2>Patient Profile</h2>

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
          <span className="profile-value">{storedUser.role || 'Patient'}</span>
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
      </div>
=======
import React from 'react';

export default function PatientProfile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};

  return (
    <div style={{ maxWidth: 800, margin: '20px auto' }}>
      <h2>Patient Profile</h2>
      <div><strong>Name:</strong> {user.name || '—'}</div>
      <div><strong>Email:</strong> {user.email || '—'}</div>
      <div><strong>Role:</strong> {user.role || 'patient'}</div>
      <p style={{ marginTop: 12 }}>You can update profile details in future iterations.</p>
>>>>>>> dbb21b57f0b5b611e11e76d7ad1a3861bde1e36b
    </div>
  );
}
