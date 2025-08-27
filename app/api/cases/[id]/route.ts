import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const caseItem = await prisma.case.findUnique({ where: { id: Number(params.id) } })
  if (!caseItem) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(caseItem)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const updated = await prisma.case.update({
    where: { id: Number(params.id) },
    data,
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.case.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ message: `Case ${params.id} deleted` })
}
