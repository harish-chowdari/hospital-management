const mongoose = require("mongoose");

// admin
const AdminSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    otp: {
        type: String 
    },
    otpExpiresAt: {
        type: Date
    }
}, {timestamps: true});


module.exports = mongoose.model("Admin", AdminSchema); 