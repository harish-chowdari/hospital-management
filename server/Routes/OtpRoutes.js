const express = require("express");
const { sendOTPEmailForAdmin, updateAdminPassword, sendOTPEmailForUser, updateUserPassword } = require("../Controllers/Otp");
const router = express.Router();


// admin otp
router.post("/send-admin-otp", sendOTPEmailForAdmin);
router.post("/update-admin-password", updateAdminPassword);


// user otp 
router.post("/send-user-otp", sendOTPEmailForUser);
router.post("/update-user-password", updateUserPassword);


 
module.exports = router;
