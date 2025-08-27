import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("photo") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Convert file into a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file into public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      filePath: `/uploads/${filename}`,
    })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json({ error: "File upload failed" }, { status: 500 })
  }
}
