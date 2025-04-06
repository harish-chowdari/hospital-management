// Navbar.jsx
import React, { useEffect, useState } from 'react'
import { FaHome, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

const Navbar = () => {
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    window.location.reload()
  }

  return (
    <nav className={`flex sticky top-0 w-full z-50 justify-between items-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} h-[8.5vh] text-white p-4`}>
      <div className="flex h-[8.5vh] items-center gap-1 p-1 px-2 pl-0">
        <img className="h-[5vh] overflow-hidden" src={logo} alt="Logo" />
        <p className="text-green-600 dark:text-green-300 font-bold text-xl">eMAR</p>
      </div>
      <div className="flex items-center gap-4">
        {theme === 'dark' ? (
          <FaSun 
            className="text-yellow-400 text-2xl cursor-pointer hover:text-yellow-500" 
            onClick={toggleTheme} 
          />
        ) : (
          <FaMoon 
            className="text-green-600 text-2xl cursor-pointer hover:text-green-700" 
            onClick={toggleTheme} 
          />
        )}
        
      </div>
    </nav>
  )
}

export default Navbar
