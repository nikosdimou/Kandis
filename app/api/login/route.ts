import { NextResponse } from "next/server"

// Dummy credentials for demo
const DUMMY_USER = {
  username: "admin@example.com",
  password: "password123",
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (email === DUMMY_USER.username && password === DUMMY_USER.password) {
      // In a real app, generate JWT or session here
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
