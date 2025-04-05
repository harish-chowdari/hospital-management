import React, { useState, useEffect } from 'react'
import axios from '../axios'
import { useParams } from 'react-router-dom'

const AppointmentDetails = () => {
  const { appointmentId } = useParams()
  const userId = localStorage.getItem('userId')
  const [appointment, setAppointment] = useState(null)
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check if resource (feedback/quiz) already exists
  const [resourceExists, setResourceExists] = useState(false)

  // Modal control state for resource submission and prescription viewing
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)

  // Define feedback questions for resource submission
  const feedbackQuestions = [
    { id: 1, question: "Do you have obesity?" },
    { id: 2, question: "Do you have low blood pressure?" },
    { id: 3, question: "Do you have high cholesterol?" },
    { id: 4, question: "Do you have diabetes?" },
  ]

  // State to hold feedback answers
  const [feedbackAnswers, setFeedbackAnswers] = useState({})
  const [feedbackSuccess, setFeedbackSuccess] = useState("")
  const [feedbackError, setFeedbackError] = useState("")

  // Read theme from localStorage
  const theme = localStorage.getItem('theme') || 'light'

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(`/get-appointment/${appointmentId}`)
        setAppointment(res.data)
      } catch (err) {
        setError("Failed to fetch appointment details")
      } finally {
        setLoading(false)
      }
    }
    fetchAppointment()
  }, [appointmentId])

  // Fetch resource details and check if a resource exists for this appointment
  useEffect(() => {
    const checkResource = async () => {
      try {
        const res = await axios.get(`/get-resource/${appointmentId}`)
        if (res.data && res.data._id) {
          setResource(res.data)
          setResourceExists(true)
        }
      } catch (err) {
        setResourceExists(false)
      }
    }
    checkResource()
  }, [appointmentId])
  
  const handleFeedbackChange = (questionId, answer) => {
    setFeedbackAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setFeedbackError("")
    setFeedbackSuccess("")

    // Validate that every question has an answer
    const unanswered = feedbackQuestions.filter(q => !feedbackAnswers[q.id])
    if (unanswered.length > 0) {
      setFeedbackError("Please answer all questions.")
      return
    }

    // Build quiz payload
    const quizPayload = feedbackQuestions.map(q => ({
      question: q.question,
      answer: feedbackAnswers[q.id]
    }))

    try {
      const res = await axios.post(`/create-resourse`, {
        userId,
        appointmentId,
        quiz: quizPayload
      })
      if (res.data.success) {
        setFeedbackSuccess("Resource submitted successfully!")
        setResourceExists(true)
        setResource({ quiz: quizPayload })
        setTimeout(() => setShowResourceModal(false), 1500)
      } else {
        setFeedbackError(res.data.error || "Failed to submit Resource.")
      }
    } catch (err) {
      setFeedbackError("An error occurred while submitting Resource.")
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>
  }

  if (!appointment) {
    return <div className="p-4 text-center">No appointment found.</div>
  }

  // Helper to display yes/no as tick/cross with color
  const displayYesNo = (val) => {
    return val 
      ? <span className="text-green-600 font-bold">✔️</span>
      : <span className="text-red-600 font-bold">❌</span>
  }

  return (
    <div className={`mx-auto p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-green-100'} min-h-screen`}>
      {/* Appointment Details */}
      <div className={`max-w-3xl mx-auto rounded-lg shadow-lg p-6 mb-8 border relative ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border border-green-200'}`}>
        <h2 className={`text-3xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
          Appointment Details
        </h2>
        <p className="mb-2 text-lg">
          <span className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Speciality:</span> <span className={`${theme === 'dark' ? 'text-green-200' : 'text-gray-900'}`}>{appointment?.doctorType}</span> 
        </p>
        <p className="mb-2 text-lg">
          <span className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Doctor Name:</span> <span className={`${theme === 'dark' ? 'text-green-200' : 'text-gray-900'}`}>{appointment?.doctorId?.name || "N/A"}</span>
        </p>
        <p className="mb-2 text-lg">
          <span className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Date:</span> <span className={`${theme === 'dark' ? 'text-green-200' : 'text-gray-900'}`}>{appointment?.date}</span>
        </p>
        <p className="mb-2 text-lg">
          <span className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Time:</span> <span className={`${theme === 'dark' ? 'text-green-200' : 'text-gray-900'}`}>{appointment?.time}</span>
        </p>
        <p className="mb-2 text-lg">
          <span className={`${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Symptoms:</span> <span className={`${theme === 'dark' ? 'text-green-200' : 'text-gray-900'}`}>{appointment?.symptoms}</span>
        </p>
        {/* Show See Prescription button within the appointment details card */}
        {appointment.prescriptionDetails && appointment.prescriptionDetails.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowPrescriptionModal(true)}
              className={`w-full max-w-xs ${theme === 'dark' ? 'bg-green-600' : 'bg-green-600'} text-white py-3 rounded hover:bg-green-700 transition`}
            >
              See Prescription
            </button>
          </div>
        )}
      </div>
      
      {/* Resource (Feedback) Button */}
      <div className="mb-8 text-center">
        {resourceExists ? (
          <button
            className="w-full max-w-xs bg-gray-400 text-white py-3 rounded cursor-not-allowed"
            disabled
          >
            Resource already submitted
          </button>
        ) : (
          <button
            onClick={() => setShowResourceModal(true)}
            className="w-full cursor-pointer max-w-xs bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Give Resource
          </button>
        )}
      </div>

      {/* Submitted Resource Details */}
      {resourceExists && resource && resource.quiz && resource.quiz.length > 0 && (
        <div className={`rounded-lg shadow-xl p-8 border mt-8 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border border-green-200'}`}>
          <h3 className={`text-2xl font-semibold text-center mb-4 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
            Submitted Resource Details
          </h3>
          <div className="space-y-4">
            {resource.quiz.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border border-green-200'}`}>
                <p className={`text-lg font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>{item.question}</p>
                <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                  Answer: <span className="font-medium">
                    {item.answer.charAt(0).toUpperCase() + item.answer.slice(1)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prescription Modal Popup */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setShowPrescriptionModal(false)}
          ></div>
          <div className={`p-8 rounded-lg shadow-2xl z-10 max-w-3xl w-full border-t-4 ${theme === 'dark' ? 'bg-gray-800 border-green-600' : 'bg-white border-t-4 border-green-800'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-green-500' : 'text-green-700'}`}>Prescription Details</h3>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>Medicine Name</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>Before Breakfast</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>After Breakfast</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>Before Lunch</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>After Lunch</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>Before Dinner</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>After Dinner</th>
                  <th className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {appointment.prescriptionDetails.map((pres, index) => (
                  <tr key={index}>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{pres.medicineName}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.beforeBreakfast)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.afterBreakfast)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.beforeLunch)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.afterLunch)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.beforeDinner)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{displayYesNo(pres.afterDinner)}</td>
                    <td className={`border p-2 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-green-600 text-white'}`}>{pres.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Submission Modal */}
      {showResourceModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setShowResourceModal(false)}
          ></div>
          <div className={`p-8 rounded-lg shadow-xl z-10 max-w-lg w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Resource</h3>
            <form onSubmit={handleFeedbackSubmit}>
              {feedbackQuestions.map((q) => (
                <div key={q.id} className="mb-6">
                  <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-700' }`}>{q.question}</p>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value="yes"
                        checked={feedbackAnswers[q.id] === "yes"}
                        onChange={() => handleFeedbackChange(q.id, "yes")}
                        className="mr-2"
                      />
                      <span className={` text-lg ${theme === 'dark' ? 'text-green-300' : 'text-green-700' }`}>Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value="no"
                        checked={feedbackAnswers[q.id] === "no"}
                        onChange={() => handleFeedbackChange(q.id, "no")}
                        className="mr-2"
                      />
                      <span className={` text-lg ${theme === 'dark' ? 'text-green-300' : 'text-green-700' }`}>No</span>
                    </label>
                  </div>
                </div>
              ))}
              <button
                type="submit"
                className="w-full cursor-pointer bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                Submit Resource
              </button>
              {feedbackSuccess && <p className="text-green-600 mt-4 text-center">{feedbackSuccess}</p>}
              {feedbackError && <p className="text-red-500 mt-4 text-center">{feedbackError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppointmentDetails
