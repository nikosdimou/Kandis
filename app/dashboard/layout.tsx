"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn")
    if (!loggedIn) {
      router.push("/dashboard") // redirect to login if not authenticated
    } else {
      setAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex h-screen">
      {authenticated && <Sidebar />} {/* sidebar only shows if logged in */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
