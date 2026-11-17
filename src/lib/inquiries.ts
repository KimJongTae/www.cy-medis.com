import "server-only";
import { connection } from "next/server";
import { db } from "./db";

export type InquiryStatus = "new" | "read" | "done";
export const STATUS_LABEL: Record<InquiryStatus, string> = { new: "신규", read: "확인", done: "답변완료" };

export type Inquiry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  status: InquiryStatus;
  memo: string;
  ip: string;
  created_at: string;
};

export function createInquiry(i: Pick<Inquiry, "name" | "email" | "phone" | "subject" | "content" | "ip">) {
  db()
    .prepare("INSERT INTO inquiries (name, email, phone, subject, content, ip) VALUES (?, ?, ?, ?, ?, ?)")
    .run(i.name, i.email, i.phone, i.subject, i.content, i.ip);
}

export async function listInquiries(status?: InquiryStatus) {
  await connection();
  return (
    status
      ? db().prepare("SELECT * FROM inquiries WHERE status = ? ORDER BY id DESC").all(status)
      : db().prepare("SELECT * FROM inquiries ORDER BY id DESC").all()
  ) as Inquiry[];
}

export async function getInquiry(id: number) {
  await connection();
  return db().prepare("SELECT * FROM inquiries WHERE id = ?").get(id) as Inquiry | undefined;
}

export async function countByStatus() {
  await connection();
  const rows = db().prepare("SELECT status, COUNT(*) AS n FROM inquiries GROUP BY status").all() as { status: InquiryStatus; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.n])) as Partial<Record<InquiryStatus, number>>;
}

export function updateInquiry(id: number, status: InquiryStatus, memo: string) {
  db().prepare("UPDATE inquiries SET status = ?, memo = ? WHERE id = ?").run(status, memo, id);
}

export function markRead(id: number) {
  db().prepare("UPDATE inquiries SET status = 'read' WHERE id = ? AND status = 'new'").run(id);
}

export function deleteInquiry(id: number) {
  db().prepare("DELETE FROM inquiries WHERE id = ?").run(id);
}
