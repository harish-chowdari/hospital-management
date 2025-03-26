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
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [appointmentId])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!appointment) {
    return <div className="p-4">No appointment found.</div>
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Appointment Details</h2>
      <p className="mb-2">
        <span className="font-semibold">Speciality:</span> {appointment.doctorType}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Date:</span> {appointment.date}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Time:</span> {appointment.time}
      </p>
      <p className="mb-2">
        <span className="font-semibold">Symptoms:</span> {appointment.symptoms}
      </p>
      
      <hr className="my-6" />
      
      <h3 className="text-xl font-semibold mb-4">Resource Details</h3>
      {resource && resource?.quiz && resource?.quiz?.length > 0 ? (
        <div>
          {resource?.quiz?.map((item, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">Does patient has {item?.question?.slice(11, item?.question?.length)}</p>
              <p className="ml-4">Answer: {item?.answer?.charAt(0).toUpperCase() + item?.answer?.slice(1)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No resources found for this appointment.</p>
      )}
    </div>
  )
}

export default AppointmentDetails
