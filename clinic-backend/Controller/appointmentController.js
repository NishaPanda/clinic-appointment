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
    const { patientName, patientEmail, date, time, reason } = req.body;

    // Validate input
    if (!req.user?.id || !patientName || !patientEmail || !doctorId || !date || !time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      doctor: doctorId,
      doctorId: doctorId,
      doctorName: doctor.name,
      patient: req.user.id,
      patientName,
      patientEmail,
      date,
      time,
      reason,
      status: "pending"
    });

    await appointment.save();
    // Save reference on user document for quick lookup
    try {
      await User.findByIdAndUpdate(req.user.id, { $push: { appointments: appointment._id } });
    } catch (uErr) {
      console.error('Failed to update user appointments', uErr);
    }

    // Return the saved appointment
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

// Get appointment by id (ensure patient is owner or allow doctors/admins as needed)
exports.getAppointmentById = async (req, res) => {
  try {
    const apptId = req.params.id;
    const appointment = await Appointment.findById(apptId).lean();
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Optional: enforce ownership
    if (req.user && String(appointment.patient) !== String(req.user.id) && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    console.error('getAppointmentById error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get appointments for doctor (logged-in doctor)
exports.getAppointmentsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctor: doctorId })
      .sort({ date: 1 })
      .lean();
    res.status(200).json(appointments);
  } catch (err) {
    console.error('getAppointmentsForDoctor error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Doctor accepts appointment (marks confirmed and generates receipt server-side fields if needed)
exports.acceptAppointment = async (req, res) => {
  try {
    const apptId = req.params.id;
    const appointment = await Appointment.findById(apptId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only the doctor assigned can accept
    if (String(appointment.doctor) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending appointments can be accepted' });
    }

    appointment.status = 'confirmed';
  appointment.confirmedAt = new Date();
  await appointment.save();

    // Optionally, generate receipt or any additional processing here

    res.status(200).json({ message: 'Appointment accepted', appointment });
  } catch (err) {
    console.error('acceptAppointment error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Doctor rejects appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const apptId = req.params.id;
    const appointment = await Appointment.findById(apptId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    if (String(appointment.doctor) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (appointment.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending appointments can be rejected' });
    }

    appointment.status = 'rejected';
  appointment.rejectedAt = new Date();
  await appointment.save();

    res.status(200).json({ message: 'Appointment rejected', appointment });
  } catch (err) {
    console.error('rejectAppointment error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Cancel appointment (patient or doctor can cancel)
exports.cancelAppointment = async (req, res) => {
  try {
    const apptId = req.params.id;
    const appointment = await Appointment.findById(apptId);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Debug logging to diagnose cancel issues
    console.log('Cancel attempt:', { apptId, appointmentPatient: String(appointment.patient), appointmentDoctor: String(appointment.doctor), reqUser: req.user });

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment already cancelled' });
    }

    const userId = req.user?.id;
    const userRole = req.user?.role;
    // Allow patient owner or the doctor to cancel
    if (String(appointment.patient) !== String(userId) && String(appointment.doctor) !== String(userId) && userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (err) {
    console.error('cancelAppointment error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
