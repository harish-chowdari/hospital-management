import React, { useState } from "react";
import axiosInstance from "../../../admin/src/axios";

const AppointmentForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        symptoms: "",
        doctorType: "",
        date: "",
        time: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        const appointmentData = {
        name: formData.name,
        symptoms: formData.symptoms,
        doctorType: formData.doctorType,
        date: formData.date,
        time: formData.time
        };
        try {
            const res = await axiosInstance.post("create-appointment", appointmentData);
            if(res?.data?.EnterAllDetails) {
                setError(res?.data?.EnterAllDetails);
            }
            if(res?.data?.success) {
                setSuccess("Appointment created successfully");
            }
        } catch (err) {
            setError("Failed to create appointment");
        } 
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-md w-full flex flex-col  max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Appointment</h2>
            {error && <p className="text-red-500 mx-auto mb-4">{error}</p>}
            {success && <p className="text-green-500 mx-auto mb-4">{success}</p>}
                <input
                    type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    name="symptoms"
                    placeholder="Symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    name="doctorType"
                    placeholder="Doctor Type"
                    value={formData.doctorType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                />
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">
                    Submit
                </button>
        </form>
        </div>
    );
};

export default AppointmentForm;
