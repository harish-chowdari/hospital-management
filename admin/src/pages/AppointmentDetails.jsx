import React, { useState, useEffect } from 'react'
import axios from '../axios'
import { useParams } from 'react-router-dom'

const AppointmentDetails = () => {
  const { appointmentId } = useParams()
  const [appointment, setAppointment] = useState(null)
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointment details
        const resAppointment = await axios.get(`/get-appointment/${appointmentId}`)
        setAppointment(resAppointment.data)

        // Fetch resource (quiz) details for this appointment
        const resResource = await axios.get(`/get-resource/${appointmentId}`)
        setResource(resResource.data)
      } catch (err) {
        console.error(err)
        // setError("Failed to fetch appointment or resource details.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [appointmentId])

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
    <div className="mx-auto p-6 bg-green-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-8 border border-green-200">
        <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Appointment Details
        </h2>
        <div className="mb-2">
          <p className="text-lg">
            <span className="font-semibold">Speciality:</span> {appointment.doctorType}
          </p>
        </div>
        <div className="mb-2 flex justify-between">
          <p className="text-lg">
            <span className="font-semibold">Date:</span> {appointment.date}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Time:</span> {appointment.time}
          </p>
        </div>
        <div className="mb-2">
          <p className="text-lg">
            <span className="font-semibold">Symptoms:</span> {appointment.symptoms}
          </p>
        </div>
        <hr className="my-4 border-green-200" />
        <h3 className="text-2xl font-semibold text-green-700 mb-4">
          Resource (Quiz) Details
        </h3>
        {resource && resource.quiz && resource.quiz.length > 0 ? (
          <div className="space-y-4">
            {resource.quiz.map((item, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-300">
                <p className="font-semibold text-green-800">
                  {`Does patient ${item.question.slice(7)}`}
                </p>
                <p className="ml-4 text-lg">
                  Answer:{" "}
                  <span className="font-medium">
                    {item.answer.charAt(0).toUpperCase() + item.answer.slice(1)}
                  </span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600">No resources found for this appointment.</p>
        )}
      </div>
    </div>
  )
}

export default AppointmentDetails
