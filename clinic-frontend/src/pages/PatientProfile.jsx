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
    </div>
  );
}
