const express = require("express");
const router = express.Router();

const { AdminSigUp, AdminLogin, UserSigUp, UserLogin } = require("../Controllers/AuthenticationController");

// admin
router.post("/admin-signup", AdminSigUp);
router.post("/admin-login", AdminLogin);

// user
router.post("/user-signup", UserSigUp);
router.post("/user-login", UserLogin);


module.exports = router;