import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import formidable from "formidable"
import fs from "fs-extra"
import path from "path"
import { Readable } from "stream"
import type { IncomingMessage } from "http"

// Required for file uploads
export const config = {
  api: { bodyParser: false },
}

// ✅ Convert Next.js Request → Node.js IncomingMessage (formidable-compatible)
async function toNodeRequest(req: Request): Promise<IncomingMessage> {
  const reader = req.body?.getReader()
  if (!reader) throw new Error("Request body is empty")

  const nodeReq = new Readable({
    async read() {
      const { done, value } = await reader.read()
      if (done) this.push(null)
      else this.push(Buffer.from(value))
    },
  }) as unknown as IncomingMessage

  nodeReq.headers = Object.fromEntries(req.headers.entries())
  nodeReq.method = req.method

  return nodeReq
}

// 📌 POST → Create officer (with file upload)
// 📌 POST → Create officer (with file upload)
export async function POST(req: Request) {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads")
    await fs.ensureDir(uploadDir)

    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir,
    })

    const nodeReq = await toNodeRequest(req)

    return new Promise<NextResponse>((resolve, reject) => {
      form.parse(nodeReq, async (err, fields, files) => {
        if (err) return reject(err)

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name ?? ""
        const email = Array.isArray(fields.email) ? fields.email[0] : fields.email ?? ""
        const photoFileRaw = files.photo as formidable.File | formidable.File[] | undefined

        let photo: string | null = null
        if (photoFileRaw) {
          // handle array vs single
          const file = Array.isArray(photoFileRaw) ? photoFileRaw[0] : photoFileRaw

          // normalize file path property (filepath in v2+, path in v1)
          const tmpPath = (file as any).filepath || (file as any).path
          if (typeof tmpPath !== "string") {
            console.error("Invalid file object:", file)
            return resolve(NextResponse.json({ error: "Invalid file upload" }, { status: 400 }))
          }

          // generate unique filename
          const originalName = file.originalFilename || "file"
          const ext = path.extname(originalName) || ".png"
          const base = path.basename(originalName, ext)
          const uniqueName = `${base}-${Date.now()}${ext}`
          const savePath = path.join(uploadDir, uniqueName)

          // move from tmp → /public/uploads
          await fs.move(tmpPath, savePath, { overwrite: true })

          // public URL to serve in frontend
          photo = `/uploads/${uniqueName}`
        }

        try {
          const officer = await prisma.officers.create({
            data: { name, email, photo },
          })
          resolve(NextResponse.json(officer))
        } catch (dbErr) {
          console.error("Prisma create error:", dbErr)
          resolve(NextResponse.json({ error: "Create failed" }, { status: 500 }))
        }
      })
    })
  } catch (err) {
    console.error("POST /api/officers error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}



// 📌 GET → Fetch all officers
export async function GET() {
  try {
    const officers = await prisma.officers.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(officers)
  } catch (err) {
    console.error("GET /api/officers error:", err)
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 })
  }
}
