// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import DoctorList from './components/DoctorList';
import BookingForm from './components/BookingForm';
import MyAppointments from './components/MyAppointments';
import Receipt from './components/Receipt';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/book/:doctorId?" element={<BookingForm />} />
          <Route path="/appointments" element={<MyAppointments />} />
          <Route path="/receipt/:id" element={<Receipt />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
