import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";

const AppointmentForm = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    userId: "",
    symptoms: "",
    doctorId: "",
    doctorType: "",
    date: "",
    time: ""
  });
  const [doctorTypes, setDoctorTypes] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [doctorList, setDoctorList] = useState([]);
  const [doctorAvailability, setDoctorAvailability] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Fixed time zone for consistent date handling
  const timeZone = "America/New_York";
  
  const theme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    setFormData({ ...formData, date: "", time: "" });
  }, [formData.doctorId, formData.doctorType]);

  // Fetch list of admins to get specialties
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

  // Compute unique specialties from the fetched data
  const uniqueSpecialties = Array.from(new Set(doctorTypes.map(item => item.doctorType)));

  // When a specialty is selected, fetch doctors (admins) of that specialty
  useEffect(() => {
    const fetchDoctorsBySpecialty = async () => {
      if (selectedSpecialty) {
        try {
          const res = await axiosInstance.get(`/get-admins-by-doctor-type/${selectedSpecialty}`);
          setDoctorList(res.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        setDoctorList([]);
      }
    };
    fetchDoctorsBySpecialty();
  }, [selectedSpecialty]);

  // When a doctor is selected, fetch full details (including availability)
  useEffect(() => {
    const fetchDoctorAvailability = async () => {
      if (formData.doctorId) {
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

  // Helper function to get the day of week in NY timezone from a date string
  const getDayNameInNewYork = (dateString) => {
    if (!dateString) return null;
    
    // Create a date object from the date string
    // Add a default time to ensure consistent behavior
    const fullDateString = `${dateString}T12:00:00`;
    
    // Format the date specifically to New York timezone to get the correct day
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timeZone,
      weekday: 'long'
    });
    
    // Get the formatted day name
    const dayName = formatter.format(new Date(fullDateString));
    
    return dayName;
  };

  // Update available time slots based on the selected date and doctor's availability
  useEffect(() => {
    if (formData.date && doctorAvailability) {
      // Get the day name in New York timezone
      const dayName = getDayNameInNewYork(formData.date);
      
      // Debug information
      console.log("Selected date:", formData.date);
      console.log("New York day name:", dayName);
      
      // Format the date to see exact NY time for debugging
      const nyDateStr = new Date(formData.date + "T12:00:00").toLocaleString('en-US', {
        timeZone: timeZone,
        dateStyle: 'full',
        timeStyle: 'long'
      });
      console.log("Full NY datetime:", nyDateStr);
      
      console.log("Available days:", doctorAvailability.map(d => d.day));
      
      const dayAvailability = doctorAvailability.find(item => item.day === dayName);
      if (dayAvailability && dayAvailability.slots.length > 0) {
        console.log(`Found slots for ${dayName}:`, dayAvailability.slots);
        setAvailableTimeSlots(dayAvailability.slots);
      } else {
        console.log(`No slots found for ${dayName}`);
        setAvailableTimeSlots([]);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.date, doctorAvailability]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When a specialty is selected, update formData and fetch the doctor list
  const handleSpecialtyChange = (e) => {
    const specialty = e.target.value;
    setSelectedSpecialty(specialty);
    // Update doctorType in formData and clear previous doctor selection
    setFormData({ ...formData, doctorType: specialty, doctorId: "" });
  };

  // When a doctor is selected, update formData with the selected doctor's id
  const handleDoctorChange = (e) => {
    const selectedDoctorId = e.target.value;
    // Find the selected doctor object (which contains the name and specialty)
    const selectedDoctor = doctorList.find(doctor => doctor._id === selectedDoctorId);
    setFormData({
      ...formData,
      doctorId: selectedDoctorId,
      doctorType: selectedDoctor ? selectedDoctor.doctorType : formData.doctorType
    });
  };

  // Fetch existing appointments by user ID so we can check for duplicates
  const getAppointmentsByUserId = async () => {
    try {
      const res = await axiosInstance.get(`/get-appointments/${userId}`);
      setAppointments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointmentsByUserId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check for duplicate appointment for the same date, time, and doctor.
    const duplicate = appointments.find(appt => 
      appt.doctorId?._id === formData.doctorId &&
      appt.date === formData.date &&
      appt.time === formData.time &&
      // Optionally ignore appointments with status "deleted"
      appt.status !== "deleted"
    );

    if (duplicate) {
      setError("You have already booked this slot");
      return;
    }

    const appointmentData = {
      userId: userId,
      symptoms: formData.symptoms,
      doctorId: formData.doctorId,
      doctorType: formData.doctorType,
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
        // Clear form after successful submission
        setFormData({
          userId: "",
          symptoms: "",
          doctorId: "",
          doctorType: "",
          date: "",
          time: ""
        });
        // Optionally refresh the appointments list
        getAppointmentsByUserId();
      }
    } catch (err) {
      setError("Failed to create appointment");
    }
  };

  // Helper function to display current date and time in New York timezone for debugging
  const displayCurrentNewYorkTime = () => {
    const now = new Date();
    const nyTimeStr = now.toLocaleString('en-US', {
      timeZone: timeZone,
      dateStyle: 'full',
      timeStyle: 'long'
    });
    return nyTimeStr;
  };

  return (
    <div
      className={`flex justify-center items-center min-h-[91.5vh] p-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-green-100"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`rounded-lg p-8 shadow-md w-full flex flex-col max-w-xl border ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border border-green-300"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === "dark" ? "text-green-300" : "text-green-700"
          }`}
        >
          Book Appointment
        </h2>
        {/* For debugging - can be removed in production */}
        <p className={`text-xs mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          {/* Current NY time: {displayCurrentNewYorkTime()} */}
        </p>
        
        {error && (
          <p className="text-red-600 text-center mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-center mb-4">
            {success}
          </p>
        )}
        <textarea
          name="symptoms"
          placeholder="Symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className={`w-full p-3 rounded mb-4 border ${
            theme === "dark"
              ? "bg-gray-700 text-gray-100 border-gray-600"
              : "bg-white text-gray-900 border-green-300"
          }`}
        />

        {/* Specialty Dropdown */}
        <select
          name="specialty"
          value={selectedSpecialty}
          onChange={handleSpecialtyChange}
          className={`w-full p-3 rounded mb-4 border ${
            theme === "dark"
              ? "bg-gray-700 text-gray-100 border-gray-600"
              : "bg-white text-gray-900 border-green-300"
          }`}
        >
          <option value="">Select Specialty</option>
          {uniqueSpecialties.map((spec, idx) => (
            <option key={idx} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        {/* Doctor Name Dropdown based on selected specialty */}
        {selectedSpecialty && doctorList.length > 0 && (
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleDoctorChange}
            className={`w-full p-3 rounded mb-4 border ${
              theme === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-white text-gray-900 border-green-300"
            }`}
          >
            <option value="">Select Doctor</option>
            {doctorList.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        )}

        <input
          disabled={!formData.doctorId || !formData.doctorType}
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full p-3 rounded mb-4 border ${
            theme === "dark"
              ? "bg-gray-700 text-gray-100 border-gray-600"
              : "bg-white text-gray-900 border-green-300"
          } ${!formData.doctorId || !formData.doctorType ? "opacity-50 cursor-not-allowed" : ""}`}
        />

        {/* Time Slot Selection */}
        {formData.date &&
          (availableTimeSlots.length > 0 ? (
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full p-3 rounded mb-4 border ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-white text-gray-900 border-green-300"
              }`}
            >
              <option value="">Select Time Slot</option>
              {availableTimeSlots.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500 text-center mb-4">
              Doctor not available on this date
            </p>
          ))}

        <button
          type="submit"
          className={`w-full p-3 rounded transition ${
            theme === "dark"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;