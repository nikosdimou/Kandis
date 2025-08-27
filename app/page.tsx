"use client"

import { useState, useEffect } from "react"

export default function VideoLandingPage() {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading for ~5 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setLoading(false)
          return 100
        }
        return prev + 1
      })
    }, 50) // 50ms * 100 = ~5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Loading...</h1>
        <div className="w-64 h-6 border rounded overflow-hidden bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-50"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-4">{progress}%</p>
      </div>
    )
  }

  // VIDEO LANDING PAGE
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Welcome to Our Site
        </h1>
        <p className="text-lg md:text-2xl text-white mb-8 max-w-xl">
          Discover amazing content, explore videos, and join our community.
        </p>
        <a
          href="#get-started"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}
