const mongoose = require("mongoose");

// user
const UserSchema = new mongoose.Schema({
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


module.exports = mongoose.model("User", UserSchema);