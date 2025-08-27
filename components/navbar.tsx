"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react" // optional hamburger icon

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("loggedIn") // clear auth
    router.push("/login") // redirect to login page
  }

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Dimou Intelligence</h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 justify-end items-center bg-transparent">
            <a href="/dashboard" className="hover:text-blue-400 transition">Dashboard</a>
            <a href="/officers" className="hover:text-blue-400 transition">Officers</a>
            <a href="/reports" className="hover:text-blue-400 transition">Reports</a>
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setOpen(!open)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</a>
          <a href="/officers" className="block px-3 py-2 rounded hover:bg-gray-700">Officers</a>
          <a href="/reports" className="block px-3 py-2 rounded hover:bg-gray-700">Reports</a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}
