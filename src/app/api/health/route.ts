import { connection } from "next/server";
import { db } from "@/lib/db";

/** 배포 상태 확인용 (Docker HEALTHCHECK, 배포 후 확인) — DB 연결까지 점검 */
export async function GET() {
  await connection();
  try {
    db().prepare("SELECT 1").get();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
