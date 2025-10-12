import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate(); // To redirect after successful registration
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState(""); // For doctor
  const [age, setAge] = useState(""); // For patient
  const [gender, setGender] = useState(""); // For patient
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Prepare data according to role
    const data = {
      name,
      email,
      password,
      role,
      specialization: role === "doctor" ? specialization : undefined,
      age: role === "patient" ? age : undefined,
      gender: role === "patient" ? gender : undefined
    };

    try {
      const res = await axios.post("http://localhost:8080/api/auth/register", data, {
        headers: { "Content-Type": "application/json" }
      });

      alert(`Registered successfully as ${res.data.user.role}`);
      // Optionally store token in localStorage
      localStorage.setItem("token", res.data.token);
      navigate("/"); // Redirect to login
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const containerStyle = {
    width: "400px",
    maxWidth: "90%",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#f7f8fc",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center"
  };

  const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
  const labelStyle = { display: "flex", flexDirection: "column", textAlign: "left", fontWeight: 500, color: "#333" };
  const inputStyle = { padding: "10px", marginTop: "5px", fontSize: "14px", borderRadius: "8px", border: "1px solid #ccc", outline: "none" };
  const buttonStyle = { padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "15px", backgroundColor: "#28a745", color: "#fff" };
  const linkStyle = { color: "#007bff", textDecoration: "none" };

  return (
    <div style={containerStyle}>
      <h2>Register</h2>
      <form onSubmit={handleRegister} style={formStyle}>
        <label style={labelStyle}>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>

        <label style={labelStyle}>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
        </label>

        <label style={labelStyle}>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
        </label>

        <label style={labelStyle}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
        </label>

        {role === "doctor" && (
          <label style={labelStyle}>
            Specialization:
            <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} style={inputStyle} required />
          </label>
        )}

        {role === "patient" && (
          <>
            <label style={labelStyle}>
              Age:
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} style={inputStyle} required />
            </label>
            <label style={labelStyle}>
              Gender:
              <select value={gender} onChange={(e) => setGender(e.target.value)} style={inputStyle} required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </>
        )}

        {error && <p style={{ color: "red", fontWeight: 500 }}>{error}</p>}

        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/" style={linkStyle}>Login</Link>
      </p>
    </div>
  );
}
