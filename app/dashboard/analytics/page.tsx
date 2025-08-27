"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts"
import { useEffect, useState } from "react"

export default function AnalyticsPage() {
  const [cases, setCases] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/cases")
      .then(res => res.json())
      .then(setCases)
  }, [])

  // Example metrics
  const totalCases = cases.length
  const pendingCases = cases.filter(c => c.status === "Pending").length
  const processedCases = cases.filter(c => c.status === "Processed").length

  // Example chart data
  const pieData = [
    { name: "Pending", value: pendingCases },
    { name: "Processed", value: processedCases },
  ]

  const COLORS = ["#8884d8", "#82ca9d"]

  const barData = cases.reduce((acc: any[], curr) => {
    const existing = acc.find(a => a.officer === curr.officer)
    if (existing) existing.count += 1
    else acc.push({ officer: curr.officer, count: 1 })
    return acc
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Immigration Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-50">
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalCases}</CardContent>
        </Card>

        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle>Pending Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{pendingCases}</CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle>Processed Cases</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{processedCases}</CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Cases by Officer</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="officer" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
