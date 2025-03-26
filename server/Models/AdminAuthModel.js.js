const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  doctorType: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiresAt: {
    type: Date,
  },
  // New field for weekly availability
  weeklyAvailability: [
    {
      day: { type: String, required: true },
      slots: [{ type: String }],
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
