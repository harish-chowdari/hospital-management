const Appointment = require('../Models/AppointmentModel');
const Resource = require("../Models/ResourceModel"); // adjust the path as needed

const createAppointment = async (req, res) => {
  try {
    const {userId, symptoms, doctorId, date, time, doctorType } = req.body;
    const newAppointment = new Appointment({
        userId,
        symptoms,
        date,
        time,
        doctorId,
        doctorType
    });
    if(!symptoms || !date || !time || !doctorType) {
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



const getAppointmentsByDoctorId = async (req, res) => {
  try {
      const { doctorId } = req.params;
      if (!doctorId) {
      return res.status(400).json({ error: "Missing userId" });
      }
      const appointments = await Appointment.find({ doctorId }).populate('userId');
      return res.json(appointments);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointments" });
  }
};


const getAppointmentByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }
    const isExist = await Appointment.findById(appointmentId);
    if (!isExist) {
      return res.status(400).json({ error: "Appointment does not exist" });
    }
    const appointments = await Appointment.findById(appointmentId);
    return res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};





module.exports = { 
  createAppointment,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  getAppointmentByAppointmentId,
};