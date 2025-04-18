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
    return res.status(500).json({ error: "Failed to create appointment" });
  }
};


const getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    const appointments = await Appointment.find({ userId }).populate('doctorId');
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments" });
  }
};



const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      return res.status(400).json({ error: "Missing doctorId" });
    }
    // Only return appointments that are not marked as deleted
    const appointments = await Appointment.find({ doctorId, status: { $ne: "deleted" } }).populate('userId');
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments" });
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
    const appointments = await Appointment.findById(appointmentId).populate("doctorId");
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch appointments" });
  }
};


const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(400).json({ error: "Appointment does not exist" });
    }
    // Instead of deleting, update the status to "deleted"
    appointment.status = "deleted";
    await appointment.save();
    return res.json({ success: "Appointment marked as deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to mark appointment as deleted" });
  }
};


const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }
    const isExist = await Appointment.findById(appointmentId);
    if (!isExist) {
      return res.status(400).json({ error: "Appointment does not exist" });
    }
    const { userId, symptoms, doctorId, date, time, doctorType, status } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { userId, symptoms, doctorId, date, time, doctorType, status }, { new: true });
    return res.json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update appointment" });
  }
};



const addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    if (!appointmentId) {
      return res.status(400).json({ error: "Missing appointmentId" });
    }
    
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    
    // Get prescription data from the request body.
    // It can be a single object or an array of prescription objects.
    const prescriptionData = req.body;
    
    if (!prescriptionData) {
      return res.status(400).json({ error: "No prescription data provided" });
    }
    
    // If prescriptionData is an array, append all; otherwise, push a single prescription.
    if (Array.isArray(prescriptionData)) {
      appointment.prescriptionDetails = appointment.prescriptionDetails.concat(prescriptionData);
    } else {
      appointment.prescriptionDetails.push(prescriptionData);
    }
    
    // Save the updated appointment
    await appointment.save();
    
    return res.status(200).json({
      success: "Prescription added successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error in addPrescription:", error);
    return res.status(500).json({ error: "Failed to add prescription" });
  }
};



// reminderService.js
const nodemailer = require('nodemailer');
const cron = require('node-cron');


// Configure your email transporter (here using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // replace with your email
    pass: process.env.EMAIL_PASSWORD,  // replace with your email password or app password
  },
});


const parseAppointmentDateTime = (dateStr, timeStr) => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period?.toUpperCase() === "PM" && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === "AM" && hours === 12) {
    hours = 0;
  }
  // Create an ISO date string and return a Date object.
  // Example: "2025-03-31T18:00:00"
  const isoString = `${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  console.log(isoString);
  return new Date(isoString);
};

/**
 * Send reminder emails to users 2 hours before the appointment time.
 * This function checks for appointments where isMailSent is false.
 */
const sendAppointmentReminders = async () => {
  try {
    const now = new Date();

    const appointments = await Appointment.find({
      isMailSent: false,
      status: { $ne: "deleted" }
    }).populate('userId', 'email').populate('doctorId', 'name');

    appointments.forEach(async (appointment) => {
      // Parse the appointment's date and time
      const appointmentDateTime = parseAppointmentDateTime(appointment?.date, appointment?.time);

      const diffMs = appointmentDateTime - now;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours <= 2 && diffHours > 0) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: appointment.userId.email,
          subject: 'Appointment Reminder',
          text: `Hello,

          This is a friendly reminder that you have an appointment scheduled on ${appointment?.date} at ${appointment?.time} appointed with ${appointment?.doctorType} Dr. ${appointment?.doctorId?.name}.

          Please be on time.

          Thank you!`
        };

        transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
            // Update appointment to mark the email as sent.
            appointment.isMailSent = true;
            await appointment.save();
          }
        });
      }
    });
  } catch (error) {
    console.error('Error in sendAppointmentReminders:', error);
  }
};


cron.schedule('*/15 * * * * *', () => {
  console.log('Running appointment reminder task...');
  sendAppointmentReminders();
});



module.exports = { 
  createAppointment,
  getAppointmentsByUserId,
  getAppointmentsByDoctorId,
  getAppointmentByAppointmentId,
  deleteAppointment,
  updateAppointment,
  addPrescription
};