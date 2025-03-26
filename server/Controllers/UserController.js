const mongoose = require('mongoose');
const Appointment = require('../Models/AppointmentModel');

const createAppointment = async (req, res) => {
  try {
    const {userId, name, symptoms, doctorId, date, time, doctorType } = req.body;
    const newAppointment = new Appointment({
        userId,
        name,
        symptoms,
        date,
        time,
        doctorId,
        doctorType
    });
    if(!name || !symptoms || !date || !time || !doctorType) {
        return res.status(200).json({ EnterAllDetails: "Please fill all the fields" });
    }
    const savedAppointment = await newAppointment.save();
    return res.status(201).json({ success: "Appointment created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};


const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const appointments = await Appointment.find({ userId });
    return res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

module.exports = { 
  createAppointment,
  getAppointmentsByUserId 
};
