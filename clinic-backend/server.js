const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./Routers/authRouter');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To accept JSON data in the body

// Mount Routers
app.use('/api/auth', authRoutes);
// You can add other routes here, e.g., for appointments
// app.use('/api/appointments', appointmentRoutes);

// Simple route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});


const PORT = process.env.PORT || 8080;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);