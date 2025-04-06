import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axiosInstance from "../axios";

const ViewAppointments = () => {
  const { adminId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const theme = localStorage.getItem("theme") || "light";
  
  // State to track which appointment is being edited
  const [editingId, setEditingId] = useState(null);
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get(`/get-doctor-appointments/${adminId}`);
        setAppointments(res?.data);
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [adminId]);

  const handleDelete = async (appointmentId) => {
    try {
      // Call your backend delete endpoint (which now marks the appointment as deleted)
      await axiosInstance.delete(`/delete-appointment/${appointmentId}`);
      // Remove the deleted appointment from state
      setAppointments(appointments.filter((appt) => appt._id !== appointmentId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditClick = (appt) => {
    setEditingId(appt._id);
    setEditedDate(appt.date);
    setEditedTime(appt.time);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedDate("");
    setEditedTime("");
  };

  const handleSave = async (appointmentId) => {
    // Find the original appointment data
    const original = appointments.find((appt) => appt._id === appointmentId);
    
    // If nothing has changed, exit edit mode without calling the API
    if (original.date === editedDate && original.time === editedTime) {
      handleCancel();
      return;
    }

    try {
      // Update only date and time in the backend
      await axiosInstance.put(`/update-appointment/${appointmentId}`, {
        date: editedDate,
        time: editedTime,
        status: "Updated"
      });
      // Update the local state with the updated appointment
      setAppointments(
        appointments.map((appt) =>
          appt._id === appointmentId ? { ...appt, date: editedDate, time: editedTime } : appt
        )
      );
      handleCancel();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div
      className={`max-w-7xl h-[91.5vh] overflow-y-auto mx-auto p-6 ${
        theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"
      }`}
    >
      <h1
        className={`text-3xl font-bold text-center mb-6 ${
          theme === "dark" ? "text-green-400" : "text-green-600"
        }`}
      >
        My Appointments
      </h1>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full border ${
            theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"
          }`}
        >
          <thead className={`${theme === "dark" ? "bg-green-900" : "bg-green-100"}`}>
            <tr>
              {[
                "Symptoms",
                "Date",
                "Time",
                "Patient Name",
                "Edit",
                "Delete",
                "View Details",
              ].map((heading) => (
                <th
                  key={heading}
                  className={`px-4 py-3 border-b ${
                    theme === "dark" ? "border-gray-700 text-green-300" : "border-gray-200 text-green-700"
                  } text-left text-sm font-bold`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr
                key={appt._id}
                className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-green-50"}`}
              >
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  {appt.symptoms}
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  {editingId === appt._id ? (
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className={`border px-2 py-1 rounded ${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                      }`}
                    />
                  ) : (
                    appt.date
                  )}
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  {editingId === appt._id ? (
                    <input
                      type="time"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className={`border px-2 py-1 rounded ${
                        theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                      }`}
                    />
                  ) : (
                    appt.time
                  )}
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  {appt.userId?.name}
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  {editingId === appt._id ? (
                    <>
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleSave(appt._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        onClick={handleCancel}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(appt)}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(appt._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
                <td className={`px-4 py-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-200"} text-sm`}>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() =>
                      navigate(`/home/${adminId}/appointment-details/${appt._id}`)
                    }
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAppointments;
