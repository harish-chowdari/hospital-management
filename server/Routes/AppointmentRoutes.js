const express = require('express');
const router = express.Router();

const { createAppointment, getAppointmentsByUserId, getAppointmentByAppointmentId, getAppointmentsByDoctorId } = require('../Controllers/AppointmentController');

router.post('/create-appointment', createAppointment);
router.get('/get-appointments/:userId', getAppointmentsByUserId);
router.get('/get-doctor-appointments/:doctorId', getAppointmentsByDoctorId);
router.get('/get-appointment/:appointmentId', getAppointmentByAppointmentId);


module.exports = router;