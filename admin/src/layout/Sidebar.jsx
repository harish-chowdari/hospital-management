import React from 'react'
import { FaCalendarAlt, FaListAlt, FaCog } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const {adminId} = useParams()
  return (
    <aside className="w-[40vh] h-[93vh] bg-white text-green-600 p-4 shadow-md">
      <nav>
        <ul>
          <li onClick={() => navigate(`/home/${adminId}/appointment-form`)} className="mb-4 flex items-center hover:text-green-800 cursor-pointer">
            <FaCalendarAlt className="mr-2" />
            <span>Appointment Form</span>
          </li>
          <li onClick={() => navigate(`/home/${adminId}/view-appointments`)} className="mb-4 flex items-center hover:text-green-800 cursor-pointer">
            <FaListAlt className="mr-2" />
            <span>View Appointments</span>
          </li>
          <li className="mb-4 flex items-center hover:text-green-800 cursor-pointer">
            <FaCog className="mr-2" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
