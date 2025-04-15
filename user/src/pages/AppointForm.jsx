import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import moment from "moment-timezone";

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
  const timeZone = "America/New_York";
  const theme = localStorage.getItem("theme") || "light";

  useEffect(() => {
    setFormData({ ...formData, date: "", time: "" });
  }, [formData.doctorId, formData.doctorType]);

  useEffect(() => {
    axiosInstance.get("/get-admin-details").then(r => setDoctorTypes(r.data));
  }, []);

  const uniqueSpecialties = [...new Set(doctorTypes.map(d => d.doctorType))];

  useEffect(() => {
    if (!selectedSpecialty) return setDoctorList([]);
    axiosInstance
      .get(`/get-admins-by-doctor-type/${selectedSpecialty}`)
      .then(r => setDoctorList(r.data));
  }, [selectedSpecialty]);

  useEffect(() => {
    if (!formData.doctorId) return setDoctorAvailability(null);
    axiosInstance
      .get(`/get-admin-details/${formData.doctorId}`)
      .then(r => setDoctorAvailability(r.data.weeklyAvailability || []));
  }, [formData.doctorId]);

  const handleDateChange = e => {
    const dateStr = e.target.value;
    const mNY = moment.tz(dateStr, "YYYY-MM-DD", timeZone);
    const isoUS = mNY.format(); 
    console.log("US ISO Date:", isoUS);
    setFormData({ ...formData, date: isoUS });
  };

  const getDayNameInNewYork = isoString =>
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      weekday: "long"
    }).format(new Date(isoString));

  useEffect(() => {
    if (!formData.date || !doctorAvailability) {
      setAvailableTimeSlots([]);
      return;
    }
    const dayName = getDayNameInNewYork(formData.date);
    const slots =
      doctorAvailability.find(a => a.day === dayName)?.slots || [];
    setAvailableTimeSlots(slots);
  }, [formData.date, doctorAvailability]);

  useEffect(() => {
    axiosInstance.get(`/get-appointments/${userId}`).then(r => setAppointments(r.data));
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSpecialtyChange = e => {
    setSelectedSpecialty(e.target.value);
    setFormData({ ...formData, doctorType: e.target.value, doctorId: "" });
  };

  const handleDoctorChange = e => {
    const id = e.target.value;
    const doc = doctorList.find(d => d._id === id);
    setFormData({
      ...formData,
      doctorId: id,
      doctorType: doc?.doctorType || ""
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const dup = appointments.find(a =>
      a.doctorId?._id === formData.doctorId &&
      a.date === formData.date &&
      a.time === formData.time &&
      a.status !== "deleted"
    );
    if (dup) {
      setError("You have already booked this slot");
      return;
    }
    try {
      const res = await axiosInstance.post("create-appointment", {
        userId,
        symptoms: formData.symptoms,
        doctorId: formData.doctorId,
        doctorType: formData.doctorType,
        date: formData.date,
        time: formData.time
      });
      if (res.data.success) {
        setSuccess("Appointment created successfully");
        setFormData({
          userId: "",
          symptoms: "",
          doctorId: "",
          doctorType: "",
          date: "",
          time: ""
        });
        const r2 = await axiosInstance.get(`/get-appointments/${userId}`);
        setAppointments(r2.data);
      } else {
        setError(res.data.EnterAllDetails || "Failed to create appointment");
      }
    } catch {
      setError("Failed to create appointment");
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-[91.5vh] p-4 ${theme==="dark"?"bg-gray-900":"bg-green-100"}`}>
      <form onSubmit={handleSubmit} className={`rounded-lg p-8 shadow-md w-full max-w-xl border ${theme==="dark"?"bg-gray-800 border-gray-700":"bg-white border-green-300"}`}>
        <h2 className={`text-2xl font-bold mb-6 text-center ${theme==="dark"?"text-green-300":"text-green-700"}`}>Book Appointment</h2>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <textarea
          name="symptoms"
          placeholder="Symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          className={`w-full p-3 rounded mb-4 border ${theme==="dark"?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-900 border-green-300"}`}
        />
        <select
          name="specialty"
          value={selectedSpecialty}
          onChange={handleSpecialtyChange}
          className={`w-full p-3 rounded mb-4 border ${theme==="dark"?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-900 border-green-300"}`}
        >
          <option value="">Select Specialty</option>
          {uniqueSpecialties.map((s,i)=><option key={i} value={s}>{s}</option>)}
        </select>
        {doctorList.length>0 && (
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleDoctorChange}
            className={`w-full p-3 rounded mb-4 border ${theme==="dark"?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-900 border-green-300"}`}
          >
            <option value="">Select Doctor</option>
            {doctorList.map(d=> <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
        )}
        <input
          disabled={!formData.doctorId}
          type="date"
          name="date"
          onChange={handleDateChange}
          className={`w-full p-3 rounded mb-4 border ${theme==="dark"?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-900 border-green-300"} ${!formData.doctorId?"opacity-50 cursor-not-allowed":""}`}
        />
        {formData.date && (availableTimeSlots.length>0 ? (
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full p-3 rounded mb-4 border ${theme==="dark"?"bg-gray-700 text-gray-100 border-gray-600":"bg-white text-gray-900 border-green-300"}`}
          >
            <option value="">Select Time Slot</option>
            {availableTimeSlots.map((t,i)=><option key={i} value={t}>{t}</option>)}
          </select>
        ) : (
          <p className="text-red-500 text-center mb-4">Doctor not available on this date</p>
        ))}
        <button type="submit" className="w-full p-3 rounded bg-green-600 hover:bg-green-700 text-white transition">Submit</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
