"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, BarChart2, FileText, Users, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Cases", href: "/dashboard/cases", icon: FileText },
  { name: "Officers", href: "/dashboard/officers", icon: Users },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
]

export default function Sidebar() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`h-screen bg-gray-900 text-white transition-all duration-300 
        ${open ? "w-64" : "w-20"} flex flex-col`}>
        
        {/* Toggle */}
        <div className="flex justify-between items-center p-4">
          <span className={`font-bold text-xl transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>
            Immigration
          </span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setOpen(!open)}
            className="text-white"
          >
            <Menu />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 rounded-lg transition"
            >
              <item.icon size={20} />
              {open && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
