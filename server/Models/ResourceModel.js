const mongoose = require("mongoose");

// user
const ResourceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    },
    quiz: [{
        question: String,
        answer: String
    }]
}, {timestamps: true});


module.exports = mongoose.model("Resource", ResourceSchema);