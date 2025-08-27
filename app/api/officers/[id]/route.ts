import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import formidable from "formidable"
import fs from "fs-extra"
import path from "path"
import { Readable } from "stream"
import type { IncomingMessage } from "http"

// Disable default body parsing
export const config = { api: { bodyParser: false } }

// Convert Request → Node.js IncomingMessage
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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadDir = path.join(process.cwd(), "/public/uploads")
    await fs.ensureDir(uploadDir)

    const form = formidable({ multiples: false, keepExtensions: true, uploadDir })
    const nodeReq = await toNodeRequest(req)

    return new Promise<NextResponse>((resolve, reject) => {
      form.parse(nodeReq, async (err, fields, files) => {
        if (err) return reject(err)

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name ?? ""
        const email = Array.isArray(fields.email) ? fields.email[0] : fields.email ?? ""
        const photoFile = files.photo as formidable.File | undefined

        // ✅ Safe photo handling
        let photo: string | undefined
        if (photoFile) {
          const filePath = (photoFile as any).filepath || (photoFile as any).path
          if (filePath) photo = `/uploads/${path.basename(filePath)}`
        }

        const data: any = { name, email }
        if (photo) data.photo = photo

        try {
          const officer = await prisma.officers.update({
            where: { id: Number(params.id) },
            data,
          })
          resolve(NextResponse.json(officer))
        } catch (dbErr) {
          console.error("Prisma update error:", dbErr)
          resolve(NextResponse.json({ error: "Update failed" }, { status: 500 }))
        }
      })
    })
  } catch (err) {
    console.error("PUT handler error:", err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.officers.delete({ where: { id: Number(params.id) } })
    return NextResponse.json({ message: "Officer deleted" })
  } catch (err) {
    console.error("DELETE handler error:", err)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
