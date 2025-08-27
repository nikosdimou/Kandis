import { Readable } from "stream"
import type { IncomingMessage } from "http"

export async function toNodeRequest(req: Request): Promise<IncomingMessage> {
  const reader = req.body?.getReader()
  if (!reader) {
    throw new Error("Request body is empty")
  }

  const nodeReq = new Readable({
    async read() {
      const { done, value } = await reader.read()
      if (done) this.push(null)
      else this.push(Buffer.from(value))
    },
  }) as unknown as IncomingMessage

  // copy important props that formidable expects
  nodeReq.headers = Object.fromEntries(req.headers.entries())
  nodeReq.method = req.method

  return nodeReq
}
