import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // Optional: check role matches selected role
      if (res.data.user.role !== role) {
        setError(`You selected role "${role}" but account is "${res.data.user.role}"`);
        return;
      }

      // Store token and redirect
      localStorage.setItem("token", res.data.token);
      alert(`Logged in successfully as ${res.data.user.role}`);
      navigate("/dashboard"); // change to your dashboard route

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
  const buttonStyle = { padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "15px", backgroundColor: "#007bff", color: "#fff" };
  const linkStyle = { color: "#007bff", textDecoration: "none" };

  return (
    <div style={containerStyle}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <label style={labelStyle}>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>

        <label style={labelStyle}>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
        </label>

        <label style={labelStyle}>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
        </label>

        {error && <p style={{ color: "red", fontWeight: 500 }}>{error}</p>}

        <button type="submit" style={buttonStyle}>Login</button>
      </form>
      <p style={{ marginTop: "15px" }}>
        Don't have an account? <Link to="/register" style={linkStyle}>Register</Link>
      </p>
    </div>
  );
}
