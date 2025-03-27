import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import axiosInstance from "../axios";

const ViewAppointments = () => {
  const { adminId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        My Appointments
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Symptoms
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Date
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Time
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Patient Name
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Edit
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-bold text-green-700">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt?._id} className="hover:bg-green-50">
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  {appt?.symptoms}
                </td>
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  {editingId === appt._id ? (
                    <input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    appt?.date
                  )}
                </td>
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  {editingId === appt._id ? (
                    <input
                      type="time"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    appt?.time
                  )}
                </td>
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  {appt?.userId?.name}
                </td>
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  {editingId === appt._id ? (
                    <>
                      <button
                        className="bg-green-500 cursor-pointer text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        onClick={() => handleSave(appt._id)}
                      >
                        <FaSave />
                      </button>
                      <button
                        className="bg-gray-500 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-600"
                        onClick={handleCancel}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(appt)}
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
                <td className="px-4 py-4 border-b text-sm text-gray-800">
                  <button
                    className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDelete(appt._id)}
                  >
                    <FaTrash />
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
