// routes/doctorRoutes.js
const express = require("express");
const router = express.Router();
const {getDoctors,bookDoctor} = require("../Controller/doctController");
const {getMyAppointments,bookAppointment} = require("../Controller/appointmentController");
// const authMiddleware = require("../middleware/authMiddleware"); // ensures req.user exists

// Get all doctors
router.get("/doctors", getDoctors);

// Book appointment (patient must be logged in)
router.post("/doctors/book/:doctorId", bookAppointment);

// Get my appointments (patient)
router.get("/appointments/me", getMyAppointments);

module.exports = router;
