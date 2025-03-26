const express = require('express');
const router = express.Router();

const { createAppointment } = require('../Controllers/userController');

router.post('/create-appointment', createAppointment);

module.exports = router;