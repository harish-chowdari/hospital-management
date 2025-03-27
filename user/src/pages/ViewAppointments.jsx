import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axios";

const ViewAppointments = () => {
  const { userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axiosInstance.get(`/get-appointments/${userId}`);
        setAppointments(res?.data);
      } catch (err) {
        setError("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  if (loading)
    return <div className="p-4 text-center">Loading...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
        My Appointments
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-green-100">
            <tr>
              {/* <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Disease
              </th> */}
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Symptoms
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Date
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Time
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Speciality
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Doctor Name
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-bold text-green-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr onClick={() => { navigate(`/home/${userId}/appointment-details/${appt._id}`)}} key={appt._id} 
                className="hover:bg-green-50 cursor-pointer">
                {/* <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt.name}
                </td> */}
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt.symptoms}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt.date}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt.time}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt.doctorType}
                </td>
                <td className="px-6 py-4 border-b text-sm text-gray-800">
                  {appt?.doctorId?.name}
                </td>
                <td className={`px-6 py-4 border-b border-b-gray-800 text-sm text-gray-800 ${appt.status === "deleted" ? "text-red-600" : appt.status === "Updated" ? "text-yellow-600" : "text-green-600"}`}>
                  {appt?.status?.charAt(0).toUpperCase() + appt?.status?.slice(1) || "Open"}
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
