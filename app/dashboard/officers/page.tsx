"use client"

import { useEffect, useState } from "react"

type Officer = {
  id: number
  name: string
  email: string
  photo?: string | null
}

export default function OfficersPage() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [newOfficer, setNewOfficer] = useState({ name: "", email: "", photo: null as File | null })
  const [preview, setPreview] = useState<string | null>(null)

  // Fetch officers
  const fetchOfficers = async () => {
    try {
      const res = await fetch("/api/officers")
      const data = await res.json()
      setOfficers(data)
    } catch (err) {
      console.error("Fetch officers failed", err)
    }
  }

  useEffect(() => {
    fetchOfficers()
  }, [])

  // Handle file select + preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      setNewOfficer({ ...newOfficer, photo: file })
      setPreview(URL.createObjectURL(file))
    } else {
      setNewOfficer({ ...newOfficer, photo: null })
      setPreview(null)
    }
  }

  // Create officer
  const handleAddOfficer = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", newOfficer.name)
    formData.append("email", newOfficer.email)
    if (newOfficer.photo) formData.append("photo", newOfficer.photo)

    const res = await fetch("/api/officers", { method: "POST", body: formData })
    if (res.ok) {
      const officer = await res.json()
      setOfficers([officer, ...officers])
      setNewOfficer({ name: "", email: "", photo: null })
      setPreview(null)
    } else {
      alert("Upload failed")
    }
  }

  // Delete officer
  const handleDeleteOfficer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this officer?")) return
    const res = await fetch(`/api/officers/${id}`, { method: "DELETE" })
    if (res.ok) {
      setOfficers(officers.filter(o => o.id !== id))
    } else {
      alert("Delete failed")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Officers CRUD</h1>

      {/* Add Officer Form */}
      <form onSubmit={handleAddOfficer} className="flex gap-2 mb-6 items-center">
        <input
          type="text"
          placeholder="Name"
          value={newOfficer.name}
          onChange={e => setNewOfficer({ ...newOfficer, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newOfficer.email}
          onChange={e => setNewOfficer({ ...newOfficer, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
        {preview && (
          <img src={preview} alt="preview" className="w-12 h-12 rounded-full object-cover border" />
        )}
      </form>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {officers.map(officer => (
          <div key={officer.id} className="border p-4 rounded text-center">
            {officer.photo ? (
              <img
                src={officer.photo}
                alt={officer.name}
                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-2" />
            )}
            <h2 className="font-semibold">{officer.name}</h2>
            <p className="text-sm text-gray-500">{officer.email}</p>
            <div className="flex justify-center gap-2 mt-2">
              {/* Delete */}
              <button
                onClick={() => handleDeleteOfficer(officer.id)}
                className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
