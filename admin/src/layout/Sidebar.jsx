import React from 'react'
import { FaCalendarAlt, FaListAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import logo from '../assets/logo.png'

const Sidebar = () => {
    const navigate = useNavigate()
    const { adminId } = useParams()
    const location = useLocation()

    const navItems = [
      { label: 'View Appointments', icon: FaListAlt, path: `/home/${adminId}/view-appointments` },
      { label: 'Profile', icon: FaUser, path: `/home/${adminId}/profile` },
    ]

    const handleLogout = () => {
      localStorage.clear();
      navigate("/");
    }

    return (
        <aside className="w-[40vh] flex pt-2 flex-col justify-between h-[91.5vh] mt-[8.5vh] bg-white shadow-lg">
            <nav>
              <ul>
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path
                  return (
                    <li
                      key={index}
                      onClick={() => navigate(item.path)}
                      className={`mb-2 flex items-center cursor-pointer p-3 transition ${
                        isActive
                          ? 'bg-green-200 text-green-700 font-semibold border-l-4 border-green-700'
                          : 'text-gray-500 font-semibold hover:text-green-600 hover:bg-green-100 border-l-4  border-transparent'
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
            
            <button onClick={handleLogout} className="flex pl-4 py-2 hover:bg-green-100 hover:border-l-4 border-l-green-700 cursor-pointer items-center">
              <FaSignOutAlt className="mr-2" />
              <span>Logout</span>
            </button>
        </aside>
    )
}

export default Sidebar
