// src/api.js
import { API_BASE, USE_MOCK } from './config';

// Simple mock storage using localStorage
const mock = {
  getDoctors: async () => {
    // some sample doctors
    const sample = [
      { _id: 'd1', name: 'Dr. Asha Sharma', specialty: 'General Physician' },
      { _id: 'd2', name: 'Dr. Rohit Kumar', specialty: 'Pediatrician' },
      { _id: 'd3', name: 'Dr. Meera Patel', specialty: 'Dermatologist' },
    ];
    return sample;
  },
  getAppointments: async () => {
    const raw = localStorage.getItem('clinic_appointments');
    return raw ? JSON.parse(raw) : [];
  },
  createAppointment: async (appointment) => {
    const arr = (await mock.getAppointments());
    appointment._id = String(Date.now());
    arr.push(appointment);
    localStorage.setItem('clinic_appointments', JSON.stringify(arr));
    return appointment;
  },
  getAppointmentById: async (id) => {
    const arr = await mock.getAppointments();
    return arr.find(a => a._id === id);
  }
};

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function fetchDoctors() {
  if (USE_MOCK) return mock.getDoctors();
  return safeFetch(`${API_BASE}/doctors`);
}

export async function fetchAppointments() {
  if (USE_MOCK) return mock.getAppointments();
  return safeFetch(`${API_BASE}/appointments`);
}

export async function createAppointment(data) {
  if (USE_MOCK) return mock.createAppointment(data);
  return safeFetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function fetchAppointmentById(id) {
  if (USE_MOCK) return mock.getAppointmentById(id);
  return safeFetch(`${API_BASE}/appointments/${id}`);
}
