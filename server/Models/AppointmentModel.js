const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    doctorType: {
        type: String,
        required: true,
    }
    // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);