const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

const AdminDetails = require("../Models/AdminAuthModel.js.js");
const UserDetails = require("../Models/UserAuthModel.jsx");

dotenv.config();

const sendOTPEmailForAdmin = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ emailRequire: "Email required" });
    }

    try {
        const user = await AdminDetails.findOne({ email: email });
        if (!user) {
            return res.json({ userNotExist: "User does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp.toString(), salt);

        user.otp = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailContent = `
        <h1>OTP Verification</h1>
        <p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong></p>
        <p>Please use this OTP to complete your verification. It is valid for 5 minutes.</p>
        `;

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Verification",
            html: mailContent
        };

        transporter.sendMail(message).then(() => {
            return res.status(201).json({ msg: "OTP sent successfully" });
        }).catch(error => {
            return res.status(500).json({ error });
        });

    } catch (error) {
        return res.status(500).json({ error: "An error occurred while processing the request" });
    }
};

const updateAdminPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(200).json({ allFieldsRequired: "Email, OTP, and new password are required" });
    }

    try {
        const user = await AdminDetails.findOne({ email: email });

        if (!user) {
            return res.status(200).json({ userNotExist: "User not found" });
        }

        const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

        if (!isOtpValid) {
            return res.status(200).json({ otpNotValid: "Invalid OTP" });
        }

        const now = new Date();
        if (user.otpExpiresAt < now) {
            return res.status(200).json({ otpExpired: "OTP has expired" });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        return res.status(200).json({ updatedPassword: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating the password" });
    }
};

const sendOTPEmailForUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ emailRequire: "Email required" });
    }

    try {
        const user = await UserDetails.findOne({ email: email });
        if (!user) {
            return res.json({ userNotExist: "User does not exist" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp.toString(), salt);

        user.otp = hashedOtp;
        user.otpExpiresAt = otpExpiresAt;
        await user.save();

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailContent = `
        <h1>OTP Verification</h1>
        <p>Your One-Time Password (OTP) for verification is: <strong>${otp}</strong></p>
        <p>Please use this OTP to complete your verification. It is valid for 5 minutes.</p>
        `;

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Verification",
            html: mailContent
        };

        transporter.sendMail(message).then(() => {
            return res.status(201).json({ msg: "OTP sent successfully" });
        }).catch(error => {
            return res.status(500).json({ error });
        });

    } catch (error) {
        return res.status(500).json({ error: "An error occurred while processing the request" });
    }
};

const updateUserPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(200).json({ allFieldsRequired: "Email, OTP, and new password are required" });
    }

    try {
        const user = await UserDetails.findOne({ email: email });

        if (!user) {
            return res.status(200).json({ userNotExist: "User not found" });
        }

        const isOtpValid = await bcrypt.compare(otp.toString(), user.otp);

        if (!isOtpValid) {
            return res.status(200).json({ otpNotValid: "Invalid OTP" });
        }

        const now = new Date();
        if (user.otpExpiresAt < now) {
            return res.status(200).json({ otpExpired: "OTP has expired" });
        }

        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        return res.status(200).json({ updatedPassword: "Password updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while updating the password" });
    }
};

module.exports = {
    sendOTPEmailForAdmin,
    updateAdminPassword,
    sendOTPEmailForUser,
    updateUserPassword
};
