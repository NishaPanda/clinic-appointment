import React from 'react';
import PatientProfile from './PatientProfile';
import DoctorProfile from './DoctorProfile';

export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user.role && String(user.role).toLowerCase() === 'doctor') return <DoctorProfile />;
  return <PatientProfile />;
}
