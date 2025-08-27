"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const caseStats = [
  { label: "Total Cases", value: 1240 },
  { label: "Pending", value: 320 },
  { label: "Processed", value: 800 },
  { label: "Alerts", value: 120 },
]

const caseTrends = [
  { month: "Jan", cases: 100 },
  { month: "Feb", cases: 200 },
  { month: "Mar", cases: 300 },
  { month: "Apr", cases: 250 },
  { month: "May", cases: 400 },
]

const statusBreakdown = [
  { name: "Pending", value: 320 },
  { name: "Processed", value: 800 },
  { name: "Alerts", value: 120 },
]

const COLORS = ["#0088FE", "#00C49F", "#FF8042"]

export default function DashboardPage() {

  return (
    <div className="p-6 grid gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Immigration Dashboard</h1>
        <Button>Generate Report</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {caseStats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle>{stat.label} </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stat.value} </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md rounded-2xl">
          <CardHeader><CardTitle>Case Trends</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caseTrends}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cases" stroke="#0088FE" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        

        <Card className="shadow-md rounded-2xl">
          <CardHeader><CardTitle>Status Breakdown</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={100}>
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recent Cases</CardTitle>
          <Input placeholder="Search cases..." className="w-64" />
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Case ID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Nationality</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Officer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2">#1023</td>
                <td className="p-2">John Doe</td>
                <td className="p-2">Mexico</td>
                <td className="p-2">Pending</td>
                <td className="p-2">Officer A</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2">#1024</td>
                <td className="p-2">Jane Smith</td>
                <td className="p-2">Canada</td>
                <td className="p-2">Processed</td>
                <td className="p-2">Officer B</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
