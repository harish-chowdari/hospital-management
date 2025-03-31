const express = require('express');
const router = express.Router();

const { createAppointment, 
    getAppointmentsByUserId, 
    getAppointmentByAppointmentId, 
    getAppointmentsByDoctorId, 
    deleteAppointment, 
    updateAppointment, 
    addPrescription 
} = require('../Controllers/AppointmentController');

router.post('/create-appointment', createAppointment);
router.get('/get-appointments/:userId', getAppointmentsByUserId);
router.get('/get-doctor-appointments/:doctorId', getAppointmentsByDoctorId);
router.get('/get-appointment/:appointmentId', getAppointmentByAppointmentId);
router.put('/update-appointment/:appointmentId', updateAppointment);
router.delete('/delete-appointment/:appointmentId', deleteAppointment);
router.post('/add-prescription/:appointmentId', addPrescription);


module.exports = router;