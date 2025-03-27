import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";

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
  const [selectedDay, setSelectedDay] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Generate time options in 30-minute intervals from 8:00 AM to 6:00 PM
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

  // Handle changes for the selected day dropdown
  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Toggle a time slot for the selected day
  const handleCheckboxChange = (time) => {
    if (!selectedDay) return;
    setAvailability((prev) => {
      const daySlots = prev[selectedDay];
      if (daySlots.includes(time)) {
        return { ...prev, [selectedDay]: daySlots.filter((t) => t !== time) };
      } else {
        return { ...prev, [selectedDay]: [...daySlots, time] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Convert availability to array format
    const availabilityArray = Object.entries(availability).map(
      ([day, slots]) => ({ day, slots })
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
    <div className="w-full p-6 bg-green-100 min-h-screen">
      {/* Admin Details */}
      {admin && (
        <div className="bg-white shadow-md rounded p-6 mb-8 border border-green-300">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Profile Details</h2>
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
        className="bg-white rounded-lg p-8 shadow-md border border-green-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Update Weekly Availability
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: Day Selection */}
          <div className="md:w-1/3">
            <label className="block font-semibold mb-2 text-green-700">
              Select Day
            </label>
            <select
              value={selectedDay}
              onChange={handleDayChange}
              className="w-full p-3 border border-green-300 rounded"
            >
              <option value="">Select Day</option>
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Right column: Time Slots */}
          <div className="md:w-2/3">
            <label className="block font-semibold mb-2 text-green-700">
              Available Slots
            </label>
            {selectedDay ? (
              <div className="flex flex-wrap">
                {timeOptions.map((time) => (
                  <div key={time} className="mr-4 mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={availability[selectedDay].includes(time)}
                        onChange={() => handleCheckboxChange(time)}
                        className="form-checkbox h-4 w-4 text-green-600"
                      />
                      <span className="ml-2 text-sm">{time}</span>
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Please select a day to view slots.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition mt-6"
        >
          Save Availability
        </button>
      </form>
    </div>
  );
};

export default Profile;
