import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../admin/src/axios";

const Profile = () => {
  const { adminId } = useParams();
  const [admin, setAdmin] = useState(null);
  const [availability, setAvailability] = useState({
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Generate time options in 30 minute intervals from 8:00 AM to 6:00 PM
  const generateTimeOptions = () => {
    const options = [];
    const start = new Date();
    start.setHours(8, 0, 0, 0);
    const end = new Date();
    end.setHours(18, 0, 0, 0);
    let current = new Date(start);
    while (current <= end) {
      options.push(
        current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      current = new Date(current.getTime() + 30 * 60000);
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await axiosInstance.get(`/get-admin-details/${adminId}`);
        const adminData = res.data;
        setAdmin(adminData);
        if (adminData.weeklyAvailability) {
          const newAvailability = {
            Sunday: [],
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
          };
          adminData.weeklyAvailability.forEach((item) => {
            newAvailability[item.day] = item.slots || [];
          });
          setAvailability(newAvailability);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch admin details");
        setLoading(false);
      }
    };
    fetchAdminDetails();
  }, [adminId]);

  // Toggle a time slot for a given day
  const handleCheckboxChange = (day, time) => {
    setAvailability((prev) => {
      const daySlots = prev[day];
      if (daySlots.includes(time)) {
        return { ...prev, [day]: daySlots.filter((t) => t !== time) };
      } else {
        return { ...prev, [day]: [...daySlots, time] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const availabilityArray = Object.entries(availability).map(
      ([day, slots]) => ({
        day,
        slots,
      })
    );
    try {
      const res = await axiosInstance.post(
        `/update-availability/${adminId}`,
        { weeklyAvailability: availabilityArray }
      );
      if (res.data.success) {
        setSuccess("Availability updated successfully");
      } else {
        setError("Failed to update availability");
      }
    } catch (err) {
      setError("Failed to update availability");
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Admin Details */}
      {admin && (
        <div className="bg-white shadow-md rounded p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
          <p className="mb-2">
            <span className="font-semibold">Name:</span> {admin.name}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Email:</span> {admin.email}
          </p>
          <p className="mb-2">
            <span className="font-semibold">Doctor Type:</span> {admin.doctorType}
          </p>
        </div>
      )}
      {/* Availability Update Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Weekly Availability
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {Object.keys(availability).map((day) => (
          <div key={day} className="mb-4">
            <label className="block font-semibold mb-1">{day}:</label>
            <div className="flex flex-wrap">
              {timeOptions.map((time) => (
                <div key={time} className="mr-4 mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={availability[day].includes(time)}
                      onChange={() => handleCheckboxChange(day, time)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm">{time}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default Profile;
