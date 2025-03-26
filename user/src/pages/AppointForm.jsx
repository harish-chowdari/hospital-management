import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import axiosInstance from "../../../admin/src/axios";

const AppointmentForm = () => {
    const {userId} = useParams();
    const [formData, setFormData] = useState({
        userId: "",
        name: "",
        symptoms: "",
        doctorId: "",
        doctorType: "",
        date: "",
        time: ""
    });

  const [doctorTypes, setDoctorTypes] = useState([]);
  const [customDoctorType, setCustomDoctorType] = useState("");
  const [doctorAvailability, setDoctorAvailability] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch list of doctors (each with adminId and doctorType)
  useEffect(() => {
    const fetchDoctorTypes = async () => {
      try {
        const res = await axiosInstance.get("/get-admin-details");
        setDoctorTypes(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDoctorTypes();
  }, []);

  // When a doctor is selected (not "Other"), fetch full details including availability
  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (formData.doctorId && formData.doctorId !== "Other") {
        try {
          const res = await axiosInstance.get(`/get-admin-details/${formData.doctorId}`);
          setDoctorAvailability(res.data.weeklyAvailability || []);
        } catch (err) {
          console.log(err);
        }
      } else {
        setDoctorAvailability(null);
      }
    };
    fetchDoctorAvailability();
  }, [formData.doctorId]);

  // Update available time slots based on selected date and doctor's weekly availability
  useEffect(() => {
    if (formData.date && doctorAvailability) {
      const dateObj = new Date(formData.date);
      const dayIndex = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[dayIndex];
      const dayAvailability = doctorAvailability.find(item => item.day === dayName);
      if (dayAvailability && dayAvailability.slots.length > 0) {
        setAvailableTimeSlots(dayAvailability.slots);
      } else {
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.date, doctorAvailability]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "Other") {
      setFormData({ ...formData, doctorId: "Other", doctorType: "" });
    } else {
      const selectedDoctor = doctorTypes.find(dt => dt.adminId === selectedValue);
      setFormData({ 
        ...formData, 
        doctorId: selectedValue, 
        doctorType: selectedDoctor ? selectedDoctor.doctorType : "" 
      });
    }
  };

  const handleCustomDoctorTypeChange = (e) => {
    setCustomDoctorType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const appointmentData = {
        userId: userId,
      name: formData.name,
      symptoms: formData.symptoms,
      // If "Other" is selected, do not send doctorId, use customDoctorType instead
      doctorId: formData.doctorId === "Other" ? undefined : formData.doctorId,
      doctorType: formData.doctorId === "Other" ? customDoctorType : formData.doctorType,
      date: formData.date,
      time: formData.time
    };

    try {
      const res = await axiosInstance.post("create-appointment", appointmentData);
      if (res?.data?.EnterAllDetails) {
        setError(res.data.EnterAllDetails);
      }
      if (res?.data?.success) {
        setSuccess("Appointment created successfully");
      }
    } catch (err) {
      setError("Failed to create appointment");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-lg p-8 shadow-md w-full flex flex-col max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create Appointment</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <input
          type="text"
          name="symptoms"
          placeholder="Symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <select
          name="doctorId"
          value={formData.doctorId}
          onChange={handleDoctorChange}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        >
          <option value="">Select Doctor</option>
          {doctorTypes?.map((dt, index) => (
            <option key={index} value={dt.adminId}>
              {dt.doctorType} (ID: {dt.adminId})
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {formData.doctorId === "Other" && (
          <input
            type="text"
            name="customDoctorType"
            placeholder="Enter Doctor Type"
            value={customDoctorType}
            onChange={handleCustomDoctorTypeChange}
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
        )}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        {formData.date && (
          availableTimeSlots.length > 0 ? (
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mb-4"
            >
              <option value="">Select Time Slot</option>
              {availableTimeSlots?.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded mb-4"
            />
          )
        )}
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
