const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    symptoms: {
        type: String,
    },
    date: {
        type: String,
    },
    time: {
        type: String,
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    doctorType: {
        type: String,
    },
    status: {
        type: String,
    },
    isMailSent: {
        type: Boolean,
        default: false,
    },
    prescriptionDetails: [{
        medicineName: {
            type: String,
        },
        beforeBreakfast: {
            type: Boolean,
        },
        afterBreakfast: {
            type: Boolean,
        },
        beforeLunch: {
            type: Boolean,
        },
        afterLunch: {
            type: Boolean,
        },
        beforeDinner: {
            type: Boolean,
        },
        afterDinner: {
            type: Boolean,
        },
        duration: {
            type: String,
        },
    }]
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);