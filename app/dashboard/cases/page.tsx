"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([])
  const [newCase, setNewCase] = useState({ name: "", nationality: "", status: "", officer: "" })
  const [editId, setEditId] = useState<number | null>(null)

  useEffect(() => {
    fetch("/api/cases")
      .then(res => res.json())
      .then(setCases)
  }, [])

  const handleAdd = async () => {
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCase),
    })
    const data = await res.json()
    setCases([data, ...cases])
    setNewCase({ name: "", nationality: "", status: "", officer: "" })
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/cases/${id}`, { method: "DELETE" })
    setCases(cases.filter(c => c.id !== id))
  }

  const handleUpdate = async (id: number) => {
    const res = await fetch(`/api/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCase),
    })
    const data = await res.json()
    setCases(cases.map(c => (c.id === id ? data : c)))
    setEditId(null)
    setNewCase({ name: "", nationality: "", status: "", officer: "" })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Immigration Cases</h1>

      <div className="flex gap-2 mb-6">
        <Input placeholder="Name" value={newCase.name} onChange={e => setNewCase({ ...newCase, name: e.target.value })} />
        <Input placeholder="Nationality" value={newCase.nationality} onChange={e => setNewCase({ ...newCase, nationality: e.target.value })} />
        <Input placeholder="Status" value={newCase.status} onChange={e => setNewCase({ ...newCase, status: e.target.value })} />
        <Input placeholder="Officer" value={newCase.officer} onChange={e => setNewCase({ ...newCase, officer: e.target.value })} />
        {editId ? (
          <Button onClick={() => handleUpdate(editId)}>Update</Button>
        ) : (
          <Button onClick={handleAdd}>Add</Button>
        )}
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Nationality</th>
            <th className="p-2">Status</th>
            <th className="p-2">Officer</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.nationality}</td>
              <td className="p-2">{c.status}</td>
              <td className="p-2">{c.officer}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" onClick={() => { setEditId(c.id); setNewCase(c) }}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
