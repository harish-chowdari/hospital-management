import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaPlus, FaTrash, FaRegArrowAltCircleLeft } from 'react-icons/fa';

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = localStorage.getItem("theme") || "light";

  // State for prescription modal
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [prescriptionRows, setPrescriptionRows] = useState([
    {
      medicineName: '',
      beforeBreakfast: '', // "true" or "false" as string until converted
      afterBreakfast: '',
      beforeLunch: '',
      afterLunch: '',
      beforeDinner: '',
      afterDinner: '',
      duration: '',
    },
  ]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resAppointment = await axios.get(`/get-appointment/${appointmentId}`);
        setAppointment(resAppointment.data);
        const resResource = await axios.get(`/get-resource/${appointmentId}`);
        setResource(resResource.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  // Validate that a row is complete: all fields must be non-empty.
  const isRowComplete = (row) => {
    return (
      row.medicineName.trim() &&
      row.beforeBreakfast !== '' &&
      row.afterBreakfast !== '' &&
      row.beforeLunch !== '' &&
      row.afterLunch !== '' &&
      row.beforeDinner !== '' &&
      row.afterDinner !== '' &&
      row.duration.trim()
    );
  };

  // Add a new empty row only if the last row is fully filled.
  const addPrescriptionRow = () => {
    const lastRow = prescriptionRows[prescriptionRows.length - 1];
    if (!isRowComplete(lastRow)) {
      setValidationError("Please fill all details in the current row before adding another.");
      return;
    }
    setValidationError("");
    setPrescriptionRows([
      ...prescriptionRows,
      {
        medicineName: '',
        beforeBreakfast: '',
        afterBreakfast: '',
        beforeLunch: '',
        afterLunch: '',
        beforeDinner: '',
        afterDinner: '',
        duration: '',
      },
    ]);
  };

  // Delete the specified row (only allow deletion of the last added row if there is more than one)
  const handleDeleteRow = (index) => {
    if (prescriptionRows.length <= 1) return;
    setPrescriptionRows(prescriptionRows.filter((_, i) => i !== index));
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...prescriptionRows];
    newRows[index][field] = value;
    setPrescriptionRows(newRows);
  };

  const handlePrescriptionSubmit = async () => {
    // Validate all rows before submission.
    for (let i = 0; i < prescriptionRows.length; i++) {
      if (!isRowComplete(prescriptionRows[i])) {
        alert("Please fill all details in all prescription rows before submitting.");
        return;
      }
    }

    try {
      // Convert string booleans to actual booleans before submitting.
      const formattedRows = prescriptionRows.map((row) => ({
        ...row,
        beforeBreakfast: row.beforeBreakfast === "true",
        afterBreakfast: row.afterBreakfast === "true",
        beforeLunch: row.beforeLunch === "true",
        afterLunch: row.afterLunch === "true",
        beforeDinner: row.beforeDinner === "true",
        afterDinner: row.afterDinner === "true",
      }));

      // Submit the prescription details
      await axios.post(`/add-prescription/${appointmentId}`, formattedRows);
      // Update appointment status to "Closed"
      const res = await axios.put(`/update-appointment/${appointmentId}`, { status: "Closed" });
      setAppointment(res.data);
      setShowPrescriptionModal(false);
    } catch (error) {
      console.error("Failed to add prescription", error);
    }
  };

  // Helper to display yes/no using icons
  const displayYesNo = (val) => {
    return val 
      ? <FaCheckCircle className="text-green-600 inline-block" size={18} />
      : <FaTimesCircle className="text-red-600 inline-block" size={18} />;
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (!appointment) {
    return <div className="p-4 text-center">No appointment found.</div>;
  }

  return (
    <div className={`mx-auto p-6 ${theme === "dark" ? "bg-gray-900" : "bg-green-100"} min-h-screen`}>
      {/* Appointment Details Card */}
      <div className={`max-w-3xl mx-auto rounded-lg shadow-lg p-8 relative ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-green-200"}`}>
        <h2 className={`text-3xl font-bold mb-6 text-center ${theme === "dark" ? "text-green-400" : "text-green-800"}`}>
          Appointment Details
        </h2>
        <p className={`mb-2 text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          <span className="font-semibold">Speciality:</span> {appointment.doctorType}
        </p>
        <p className={`mb-2 text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          <span className="font-semibold">Doctor Name:</span> {appointment?.doctorId?.name || "N/A"}
        </p>
        <div className="flex justify-between mb-2">
          <p className={`text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            <span className="font-semibold">Date:</span> {appointment.date}
          </p>
          <p className={`text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            <span className="font-semibold">Time:</span> {appointment.time}
          </p>
        </div>
        <p className={`mb-2 text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          <span className="font-semibold">Symptoms:</span> {appointment.symptoms}
        </p>
        {/* If prescription exists, show a message */}
        {appointment.prescriptionDetails && appointment.prescriptionDetails.length > 0 && (
          <div className="mt-6 text-center">
            <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              Prescription Submitted
            </span>
          </div>
        )}
      </div>

      {/* Resource Details Card */}
      <div className={`mt-8 max-w-3xl mx-auto rounded-lg shadow-lg p-8 ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-green-200"}`}>
        <h3 className={`text-2xl font-semibold mb-4 text-center ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>
          Resource Details
        </h3>
        {resource && resource.quiz && resource.quiz.length > 0 ? (
          <div className="space-y-4">
            {resource.quiz.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 border border-gray-600" : "bg-green-50 border border-green-300"}`}>
                <p className={`font-semibold ${theme === "dark" ? "text-green-300" : "text-green-800"}`}>
                  {`Does patient ${item.question.slice(7)}`}
                </p>
                <p className={`ml-4 text-lg ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                  Answer: <span className="font-medium">
                    {item.answer.charAt(0).toUpperCase() + item.answer.slice(1)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={`text-lg text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            No resources found for this appointment.
          </p>
        )}
      </div>

      {/* Conditional: Add Prescription Button if not already added */}
      {(!appointment.prescriptionDetails || appointment.prescriptionDetails.length === 0) && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowPrescriptionModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Prescription
          </button>
        </div>
      )}

      {/* Prescription Modal Popup */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setShowPrescriptionModal(false)}
          ></div>
          <div className={`p-8 rounded-lg shadow-2xl z-10 max-w-4xl w-full border-t-4 border-green-600 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <h2 className={`text-2xl font-bold mb-4 text-center ${theme === "dark" ? "text-green-400" : "text-green-700"}`}>
              Prescription Details
            </h2>
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    {["Medicine Name", "Before Breakfast", "After Breakfast", "Before Lunch", "After Lunch", "Before Dinner", "After Dinner", "Duration", "Action"].map((heading) => (
                      <th
                        key={heading}
                        className={`border p-2 ${theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-green-100 border-green-300"}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {prescriptionRows.map((row, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        <input
                          type="text"
                          value={row.medicineName}
                          onChange={(e) => handleRowChange(index, 'medicineName', e.target.value)}
                          className={`w-full border rounded p-1 focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                          placeholder="Medicine Name"
                        />
                      </td>
                      {['beforeBreakfast', 'afterBreakfast', 'beforeLunch', 'afterLunch', 'beforeDinner', 'afterDinner'].map((field) => (
                        <td key={field} className="border p-2 text-center">
                          <label className="mr-1 flex items-center">
                            <input
                              type="radio"
                              name={`${field}-${index}`}
                              value="true"
                              checked={row[field] === "true"}
                              onChange={(e) => handleRowChange(index, field, e.target.value)}
                              className="mr-1"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`${field}-${index}`}
                              value="false"
                              checked={row[field] === "false"}
                              onChange={(e) => handleRowChange(index, field, e.target.value)}
                              className="mr-1"
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </td>
                      ))}
                      <td className="border p-2">
                        <input
                          type="text"
                          value={row.duration}
                          onChange={(e) => handleRowChange(index, 'duration', e.target.value)}
                          className={`w-full border rounded p-1 focus:outline-none focus:ring-2 focus:ring-green-400 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"}`}
                          placeholder="e.g., 5 days"
                        />
                      </td>
                      <td className="border p-2 text-center">
                        {index === prescriptionRows.length - 1 && prescriptionRows.length > 1 && (
                          <button
                            onClick={() => handleDeleteRow(index)}
                            className="inline-flex items-center px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                          >
                            <FaTrash className="mr-1" size={14} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {validationError && (
              <p className="text-red-500 mt-2 text-center">{validationError}</p>
            )}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={addPrescriptionRow}
                disabled={!isRowComplete(prescriptionRows[prescriptionRows.length - 1])}
                className={`inline-flex items-center px-4 py-2 ${
                  isRowComplete(prescriptionRows[prescriptionRows.length - 1])
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                } text-white rounded transition`}
              >
                <FaPlus className="mr-2" /> Add More
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setShowPrescriptionModal(false)}
                  className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  <FaRegArrowAltCircleLeft className="mr-1" size={16} /> Cancel
                </button>
                <button
                  onClick={handlePrescriptionSubmit}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Submit Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetails;
