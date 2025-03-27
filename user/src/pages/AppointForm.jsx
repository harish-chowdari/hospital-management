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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData({ ...formData, date:"", time:"", });
  }, [formData?.doctorId, formData?.doctorType]);

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

  // Update available time slots based on the selected date and doctor's availability
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const appointmentData = {
      userId: userId,
      name: formData.name,
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
      }
    } catch (err) {
      setError("Failed to create appointment");
    }
  };


 

  return (
    <div className="flex justify-center items-center min-h-[91.5vh] bg-green-100 p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-lg p-8 shadow-md w-full flex flex-col max-w-xl border border-green-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Book Appointment</h2>
        {error && <p className="text-green-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <textarea
          type="text"
          name="symptoms"
          placeholder="Symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className="w-full p-3 border border-green-300 rounded mb-4"
        />
        
        {/* Specialty Dropdown */}
        <select
          name="specialty"
          value={selectedSpecialty}
          onChange={handleSpecialtyChange}
          className="w-full p-3 border border-green-300 rounded mb-4"
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
            className="w-full p-3 border border-green-300 rounded mb-4"
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
          className="w-full p-3 border border-green-300 rounded mb-4"
        />

        {/* If a date is selected */}
        {formData.date && (
          availableTimeSlots.length > 0 ? (
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-3 border border-green-300 rounded mb-4"
            >
              <option value="">Select Time Slot</option>
              {availableTimeSlots.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-red-500 text-center mb-4">Doctor not available on this date</p>
          )
        )}
        
        <button 
          type="submit" 
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
