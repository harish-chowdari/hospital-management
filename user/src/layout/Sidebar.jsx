import React from 'react'
import { FaCalendarAlt, FaListAlt } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const userId = localStorage.getItem('userId')

  const navItems = [
    {
      label: 'Book Appointments',
      icon: FaCalendarAlt,
      path: `/home/${userId}/appointment-form`
    },
    {
      label: 'View Appointments',
      icon: FaListAlt,
      path: `/home/${userId}/view-appointments`
    }
  ]

  return (
    <aside className="w-[40vh] h-[100vh] bg-white shadow-lg ">
      <nav>
        <div className='flex h-[8.5vh] items-center gap-1 p-1 px-2 pl-4 '>
          <img className='h-[5vh] overflow-hidden' src={logo} />
          <p className='text-green-600 font-bold text-xl'>eMAR</p>
        </div>
        <ul>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path
            return (
              <li
                key={index}
                onClick={() => navigate(item.path)}
                className={`mb-2 flex items-center cursor-pointer p-3 transition  ${
                  isActive
                    ? 'bg-green-200 text-green-700 font-semibold border-l-4 border-green-700'
                    : 'text-gray-500 font-semibold hover:text-green-600 hover:bg-green-100 border-l-4 border-transparent'
                }`}
              >
                <span className={`mr-2 transition ${isActive ? 'text-green-700' : ' hover:text-green-600'}`}>
                  <item.icon size={20} />
                </span>
                <span>{item.label}</span>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
