// Navbar.jsx
import React from 'react'
import { FaHome, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    }
  return (
    <nav className="flex sticky top-0 w-full justify-between items-center bg-green-400 text-white p-4">
      <button className="flex cursor-pointer items-center">
        {/* <FaHome className="mr-2" />
        <span>Home</span> */}
      </button>
      <button onClick={handleLogout} className="flex cursor-pointer items-center">
        <FaSignOutAlt className="mr-2" />
        <span>Logout</span>
      </button>
    </nav>
  )
}

export default Navbar
