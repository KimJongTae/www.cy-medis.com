import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { UPLOAD_DIR } from "@/lib/db";
import { countDownload, getFile } from "@/lib/posts";

/** 첨부파일 다운로드 (다운로드 횟수 집계) */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const file = getFile(id);
  const filePath = path.join(UPLOAD_DIR, id);
  if (!file || !fs.existsSync(filePath)) return new Response("Not found", { status: 404 });

  countDownload(id);
  const ascii = file.name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream;
  return new Response(stream, {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
