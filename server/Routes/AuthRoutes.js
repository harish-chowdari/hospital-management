const express = require("express");
const router = express.Router();

const { AdminSigUp, AdminLogin, UserSigUp, UserLogin, getAdminDetails, getAdminDetailsById, updateAvailability, getAdminsByDoctorType } = require("../Controllers/AuthenticationController");

// admin
router.post("/admin-signup", AdminSigUp);
router.post("/admin-login", AdminLogin);
router.get("/get-admin-details", getAdminDetails);
router.get("/get-admin-details/:adminId", getAdminDetailsById);
router.get("/get-admins-by-doctor-type/:doctorType", getAdminsByDoctorType);
router.post("/update-availability/:adminId", updateAvailability);


// user
router.post("/user-signup", UserSigUp);
router.post("/user-login", UserLogin); 


module.exports = router;