const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    doctorType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);