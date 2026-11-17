"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, createSession, destroySession, rateLimit, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { BOARDS, deleteFiles, deletePost, isBoard, saveFiles } from "@/lib/posts";
import { deleteInquiry, updateInquiry, type InquiryStatus } from "@/lib/inquiries";

export async function login(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? "").trim() || "local";
  if (!rateLimit(`login:${ip}`, 10, 15 * 60 * 1000)) {
    return { error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도해 주세요." };
  }
  if (!checkPassword(String(formData.get("password") ?? ""))) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type PostFormState = { error?: string };

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();
  const board = formData.get("board");
  if (!isBoard(board)) return { error: "잘못된 게시판입니다." };
  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "관리자";
  const pinned = formData.get("pinned") === "on" ? 1 : 0;
  if (!title) return { error: "제목을 입력해 주세요." };
  if (title.length > 200) return { error: "제목은 200자 이내로 입력해 주세요." };

  let postId = id;
  try {
    if (id) {
      const exists = db().prepare("SELECT id FROM posts WHERE id = ? AND board = ?").get(id, board);
      if (!exists) return { error: "게시물을 찾을 수 없습니다." };
      db()
        .prepare("UPDATE posts SET title = ?, content = ?, author = ?, pinned = ?, updated_at = datetime('now','localtime') WHERE id = ?")
        .run(title, content, author, pinned, id);
      deleteFiles(id, formData.getAll("removeFile").map(String));
    } else {
      const info = db()
        .prepare("INSERT INTO posts (board, title, content, author, pinned) VALUES (?, ?, ?, ?, ?)")
        .run(board, title, content, author, pinned);
      postId = Number(info.lastInsertRowid);
    }
    await saveFiles(postId, formData.getAll("files").filter((f): f is File => f instanceof File));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "저장 중 오류가 발생했습니다." };
  }

  revalidatePath(BOARDS[board].path, "layout");
  revalidatePath("/");
  redirect(`/admin/posts?board=${board}`);
}

export async function removePost(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const board = formData.get("board");
  if (!Number.isSafeInteger(id) || !isBoard(board)) return;
  deletePost(id);
  revalidatePath(BOARDS[board].path, "layout");
  revalidatePath("/");
  redirect(`/admin/posts?board=${board}`);
}

export async function saveInquiry(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as InquiryStatus;
  if (!Number.isSafeInteger(id) || !["new", "read", "done"].includes(status)) return;
  updateInquiry(id, status, String(formData.get("memo") ?? "").slice(0, 5000));
  revalidatePath("/admin", "layout");
  redirect("/admin/inquiries");
}

export async function removeInquiry(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id)) return;
  deleteInquiry(id);
  revalidatePath("/admin", "layout");
  redirect("/admin/inquiries");
}
