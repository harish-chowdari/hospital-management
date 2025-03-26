import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
    doctorType: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await axios.post("/admin-signup", { ...signup });

      if (res.data.EnterAllDetails) {
        setErrorMessage(res.data.EnterAllDetails);
      } else if (res.data.AlreadyExist) {
        setErrorMessage(res.data.AlreadyExist);
      } else {
        const adminId = res.data._id;
        localStorage.setItem("adminId", adminId);
        navigate(`/home/${adminId}`);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side image (hidden on small screens) */}
      <div className="hidden md:flex md:w-1/2">
        <img
             src="https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg?semt=ais_hybrid"
             alt="Hospital and Patient"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side signup form */}
      <div className="flex flex-col justify-center items-center md:w-1/2 w-full bg-green-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-white bg-opacity-90 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
            Signup
          </h2>
          {errorMessage && (
            <p className="text-green-800 text-sm text-center mb-3">
              {errorMessage}
            </p>
          )}

          <input
            placeholder="Enter Your Name"
            type="text"
            name="name"
            onChange={handleChange}
            value={signup.name}
            className="w-full p-3 mb-3 border border-green-300 rounded focus:outline-none focus:border-green-500 bg-white bg-opacity-80"
          />

          <select
            name="doctorType"
            required
            onChange={handleChange}
            value={signup.doctorType}
            className="w-full p-3 mb-3 border border-green-300 rounded focus:outline-none focus:border-green-500 bg-white bg-opacity-80"
          >
            <option value="">Select Speciality</option>
            <option value="General">General</option>
            <option value="Specialist">Specialist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Oncologist">Oncologist</option>
            <option value="Gynecologist">Gynecologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="Pulmonologist">Pulmonologist</option>
            <option value="Surgeon">Other</option>
          </select>

          <input
            placeholder="Enter Your Email"
            type="email"
            name="email"
            onChange={handleChange}
            value={signup.email}
            className="w-full p-3 mb-3 border border-green-300 rounded focus:outline-none focus:border-green-500 bg-white bg-opacity-80"
          />

          <input
            placeholder="Enter Your Password"
            type="password"
            name="password"
            onChange={handleChange}
            value={signup.password}
            className="w-full p-3 mb-3 border border-green-300 rounded focus:outline-none focus:border-green-500 bg-white bg-opacity-80"
          />

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Submit
          </button>

          <p className="mt-4 text-center text-green-700">
            Already have an account?{" "}
            <Link to="/" className="text-green-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
