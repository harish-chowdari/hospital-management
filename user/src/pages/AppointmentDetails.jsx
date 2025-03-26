import React, { useState, useEffect } from 'react'
import axios from '../axios'
import { useParams } from 'react-router-dom'

const AppointmentDetails = () => {
  const { appointmentId } = useParams()
  const userId = localStorage.getItem('userId')
  const [appointment, setAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Check if resource (quiz) already exists
  const [resourceExists, setResourceExists] = useState(false)
  
  // Modal control state
  const [showModal, setShowModal] = useState(false)
  
  // Define multiple feedback questions
  const feedbackQuestions = [
    { id: 1, question: "Do you have obesity?" },
    { id: 2, question: "Do you have low blood pressure?" },
    { id: 3, question: "Do you have high cholesterol?" },
    { id: 4, question: "Do you have diabetes?" },
  ]
  
  // State to hold feedback answers: key = question id, value = "yes" or "no"
  const [feedbackAnswers, setFeedbackAnswers] = useState({})
  const [feedbackSuccess, setFeedbackSuccess] = useState("")
  const [feedbackError, setFeedbackError] = useState("")

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

  // Check if a resource already exists for this appointment
  useEffect(() => {
    const checkResource = async () => {
      try {
        const res = await axios.get(`/get-resource/${appointmentId}`)
        if (res.data && res.data._id) {
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

    // Front-end validation: ensure every question has an answer
    const unanswered = feedbackQuestions.filter(q => !feedbackAnswers[q.id])
    if (unanswered.length > 0) {
      setFeedbackError("Please answer all questions.")
      return
    }

    // Build quiz payload as an array of objects
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
        setFeedbackSuccess("Feedback submitted successfully!")
        setResourceExists(true)
        setTimeout(() => setShowModal(false), 1500)
      } else {
        setFeedbackError(res.data.error || "Failed to submit feedback.")
      }
    } catch (err) {
      setFeedbackError("An error occurred while submitting feedback.")
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

  return (
    <div className=" mx-auto p-6 bg-green-100 min-h-screen">
      {/* Appointment Details */}
      <div className="bg-white max-w-[100vh] mx-auto rounded-lg shadow-lg p-6 mb-8 border border-green-200">
        <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">Appointment Details</h2>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Speciality:</span> {appointment.doctorType}
        </p>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Doctor Name:</span> {appointment?.doctorId?.name || "N/A"}
        </p>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Date:</span> {appointment.date}
        </p>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Time:</span> {appointment.time}
        </p>
        <p className="mb-2 text-lg">
          <span className="font-semibold">Symptoms:</span> {appointment.symptoms}
        </p>
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
            onClick={() => setShowModal(true)}
            className="w-full cursor-pointer max-w-xs bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Give Resource
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white p-8 rounded-lg shadow-xl z-10 max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-6 text-green-700 text-center">Resource</h3>
            <form onSubmit={handleFeedbackSubmit}>
              {feedbackQuestions.map((q) => (
                <div key={q.id} className="mb-6">
                  <p className="text-lg font-medium mb-2">{q.question}</p>
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
                      <span className="text-lg">Yes</span>
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
                      <span className="text-lg">No</span>
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
