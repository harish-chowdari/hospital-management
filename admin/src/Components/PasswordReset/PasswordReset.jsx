import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const PasswordReset = () => {
  const [login, setLogin] = useState({ email: "", otp: "", newPassword: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOTPSent) {
      try {
        setIsLoading(true);
        const res = await axios.post("/send-admin-otp", { email: login.email });

        if (res.data.emailRequire) {
          setErrorMessage("Please enter your email address.");
        } else if (res.data.userNotExist) {
          setErrorMessage("No account found with this email address.");
        } else if (res.data.msg === "OTP sent successfully") {
          alert("OTP has been sent to your email. Please check your inbox.");
          setIsOTPSent(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const res = await axios.post("/update-admin-password", {
          email: login.email,
          otp: login.otp,
          newPassword: login.newPassword,
        });

        if (res.data.otpNotValid) {
          setErrorMessage("Invalid OTP. Please try again.");
        } else if (res.data.otpExpired) {
          setErrorMessage("OTP has expired. Please request a new one.");
        } else if (res.data.updatedPassword) {
          alert("Password updated successfully! You can now log in.");
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErrorMessage("An error occurred while updating the password.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-700 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg w-96 text-center backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset</h2>
        {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}

        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={login.email}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
          required
        />

        {isOTPSent && (
          <>
            <input
              placeholder="Enter OTP"
              type="text"
              name="otp"
              onChange={handleChange}
              value={login.otp}
              className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
              required
            />

            <input
              placeholder="Enter New Password"
              type="password"
              name="newPassword"
              onChange={handleChange}
              value={login.newPassword}
              className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
              required
            />
          </>
        )}

        <button
          type="submit"
          className={`w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition ${
            isLoading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={isLoading}
        >
          {isOTPSent ? "Reset Password" : isLoading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="mt-4 text-gray-700">
          Remember your password?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default PasswordReset;
