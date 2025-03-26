const express = require('express');
const router = express.Router();

const { createAppointment, getAppointmentsByUserId } = require('../Controllers/UserController');

router.post('/create-appointment', createAppointment);
router.get('/get-appointments/:userId', getAppointmentsByUserId);

module.exports = router;