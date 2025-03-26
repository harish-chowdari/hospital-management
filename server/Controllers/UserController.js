const mongoose = require('mongoose');
const Appointment = require('../Models/AppointmentModel');

const createAppointment = async (req, res) => {
  try {
    const { name, symptoms, date, time, doctorType } = req.body;
    const newAppointment = new Appointment({
        name,
        symptoms,
        date,
        time,
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

module.exports = { createAppointment };
