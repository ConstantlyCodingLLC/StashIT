"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [info, setInfo] = useState({
    url: "",
    nextAuthUrl: "",
    databaseUrl: "Checking...",
    nodeEnv: "",
    time: new Date().toISOString(),
  })

  useEffect(() => {
    setInfo({
      url: window.location.href,
      nextAuthUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL || "Not set (public)",
      databaseUrl: "Hidden for security",
      nodeEnv: process.env.NODE_ENV || "Not set",
      time: new Date().toISOString(),
    })

    // Check if we can connect to the API
    fetch("/api/health")
      .then((res) => res.json())
      .catch((err) => console.error("API health check failed:", err))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold">Current URL</h2>
            <p className="font-mono text-sm mt-1">{info.url}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold">Environment</h2>
            <p className="font-mono text-sm mt-1">NODE_ENV: {info.nodeEnv}</p>
            <p className="font-mono text-sm mt-1">NEXTAUTH_URL: {info.nextAuthUrl}</p>
            <p className="font-mono text-sm mt-1">DATABASE_URL: {info.databaseUrl}</p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h2 className="font-semibold">Server Time</h2>
            <p className="font-mono text-sm mt-1">{info.time}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
          <div className="flex flex-wrap gap-4">
            <a href="/" className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200">
              Home
            </a>
            <a href="/login" className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200">
              Login
            </a>
            <a href="/dashboard" className="px-4 py-2 bg-blue-100 rounded hover:bg-blue-200">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
