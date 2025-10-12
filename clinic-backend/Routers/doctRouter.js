const express = require("express");
const router = express.Router();
const {getDoctors,bookDoctor} = require("../Controller/doctController");
// const authMiddleware = require("../middleware/authMiddleware"); // protects routes

// Get all doctors
router.get("/", getDoctors);

// Book a doctor (protected route)
router.post("/book/:doctorId", bookDoctor);

module.exports = router;
