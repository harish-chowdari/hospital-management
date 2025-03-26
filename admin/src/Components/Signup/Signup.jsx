import React, { useState } from "react";
import axios from "../../axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [signup, setSignup] = useState({
    name: "",
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
  
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-300 to-blue-700 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 rounded-lg p-8 shadow-lg w-96 text-center backdrop-blur-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Signup</h2>
        {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}

        <input
          placeholder="Enter Your Name"
          type="text"
          name="name"
          onChange={handleChange}
          value={signup.name}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
        />
        <input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={handleChange}
          value={signup.email}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
        />
        <input
          placeholder="Enter Your Password"
          type="password"
          name="password"
          onChange={handleChange}
          value={signup.password}
          className="w-full p-3 mb-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white bg-opacity-80"
        />

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Submit
        </button>

        <p className="mt-4 text-gray-700">
          Already have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
