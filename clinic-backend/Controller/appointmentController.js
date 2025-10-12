// controllers/DoctorController.js
const User = require("../Models/Users");
const Appointment = require("../Models/Appointment");

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const { patientId, patientName, patientEmail, date, time, reason } = req.body;

    // Validate input
    if (!patientId || !patientName || !patientEmail || !doctorId || !date || !time) {

      return res.status(400).json({ message: "All fields are required" });
      console.log(patientId, patientName, patientEmail, doctorId, date, time);
    }

    // Find doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      doctorName: doctor.name,
      patient: patientId,
      patientName,
      patientEmail,
      date,
      time,
      reason,
      status: "pending"
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get appointments for logged-in patient
exports.getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.find({ patient: patientId })
      .sort({ date: 1 }) // upcoming first
      .lean(); // plain JS objects
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
