import "server-only";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { connection } from "next/server";
import { db, UPLOAD_DIR } from "./db";

export const BOARDS = {
  notice: { label: "공지사항", path: "/notice" },
  resources: { label: "자료실", path: "/resources" },
} as const;
export type Board = keyof typeof BOARDS;
export const isBoard = (v: unknown): v is Board => v === "notice" || v === "resources";

export type Post = {
  id: number;
  board: Board;
  title: string;
  content: string;
  author: string;
  pinned: number;
  views: number;
  created_at: string;
  updated_at: string;
};
export type PostListItem = Omit<Post, "content"> & { file_count: number };
export type FileRow = { id: string; post_id: number; name: string; size: number; mime: string; downloads: number; created_at: string };

export const PAGE_SIZE = 15;

export async function listPosts(board: Board, { page = 1, q = "" }: { page?: number; q?: string } = {}) {
  await connection();
  // 검색어의 %, _, \ 는 문자 그대로 검색되도록 이스케이프
  const like = `%${q.replace(/[\\%_]/g, (m) => "\\" + m)}%`;
  const whereSql = q
    ? "p.board = ? AND (p.title LIKE ? ESCAPE '\\' OR p.content LIKE ? ESCAPE '\\')"
    : "p.board = ?";
  const args = q ? [board, like, like] : [board];
  const total = (db().prepare(`SELECT COUNT(*) AS n FROM posts p WHERE ${whereSql}`).get(...args) as { n: number }).n;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  const items = db()
    .prepare(
      `SELECT p.id, p.board, p.title, p.author, p.pinned, p.views, p.created_at, p.updated_at,
              (SELECT COUNT(*) FROM files f WHERE f.post_id = p.id) AS file_count
       FROM posts p WHERE ${whereSql}
       ORDER BY p.pinned DESC, p.id DESC LIMIT ? OFFSET ?`,
    )
    .all(...args, PAGE_SIZE, (current - 1) * PAGE_SIZE) as PostListItem[];
  return { items, total, page: current, pages };
}

export async function latestPosts(board: Board, limit = 4) {
  await connection();
  return db()
    .prepare("SELECT id, board, title, created_at FROM posts WHERE board = ? ORDER BY pinned DESC, id DESC LIMIT ?")
    .all(board, limit) as Pick<Post, "id" | "board" | "title" | "created_at">[];
}

export async function getPost(board: Board, id: number, { countView = false } = {}) {
  await connection();
  if (!Number.isSafeInteger(id)) return null;
  if (countView) db().prepare("UPDATE posts SET views = views + 1 WHERE id = ? AND board = ?").run(id, board);
  const post = db().prepare("SELECT * FROM posts WHERE id = ? AND board = ?").get(id, board) as Post | undefined;
  if (!post) return null;
  const files = db().prepare("SELECT * FROM files WHERE post_id = ? ORDER BY created_at").all(id) as FileRow[];
  const prev = db()
    .prepare("SELECT id, title FROM posts WHERE board = ? AND id < ? ORDER BY id DESC LIMIT 1")
    .get(board, id) as { id: number; title: string } | undefined;
  const next = db()
    .prepare("SELECT id, title FROM posts WHERE board = ? AND id > ? ORDER BY id ASC LIMIT 1")
    .get(board, id) as { id: number; title: string } | undefined;
  // node:sqlite 행은 null-prototype 객체 → 일반 객체로 변환 (클라이언트 컴포넌트 전달 대비)
  return {
    post: { ...post },
    files: files.map((f) => ({ ...f })),
    prev: prev && { ...prev },
    next: next && { ...next },
  };
}

export function getFile(id: string) {
  return db().prepare("SELECT * FROM files WHERE id = ?").get(id) as FileRow | undefined;
}

export function countDownload(id: string) {
  db().prepare("UPDATE files SET downloads = downloads + 1 WHERE id = ?").run(id);
}

export const MAX_FILE_SIZE = 30 * 1024 * 1024;

export async function saveFiles(postId: number, files: File[]) {
  for (const file of files) {
    if (!file || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) throw new Error(`파일이 너무 큽니다 (최대 30MB): ${file.name}`);
    const id = crypto.randomUUID();
    const name = path.basename(file.name).replace(/[\u0000-\u001f\\/:*?"<>|]/g, "_").slice(0, 200) || "file";
    await fs.promises.writeFile(path.join(UPLOAD_DIR, id), Buffer.from(await file.arrayBuffer()));
    db()
      .prepare("INSERT INTO files (id, post_id, name, size, mime, created_at) VALUES (?, ?, ?, ?, ?, datetime('now','localtime'))")
      .run(id, postId, name, file.size, file.type || "application/octet-stream");
  }
}

export function deleteFiles(postId: number, ids: string[]) {
  for (const id of ids) {
    const f = db().prepare("SELECT id FROM files WHERE id = ? AND post_id = ?").get(id, postId);
    if (!f) continue;
    db().prepare("DELETE FROM files WHERE id = ?").run(id);
    fs.rmSync(path.join(UPLOAD_DIR, id), { force: true });
  }
}

export function deletePost(id: number) {
  const files = db().prepare("SELECT id FROM files WHERE post_id = ?").all(id) as { id: string }[];
  db().prepare("DELETE FROM posts WHERE id = ?").run(id);
  for (const f of files) fs.rmSync(path.join(UPLOAD_DIR, f.id), { force: true });
}

export function formatDate(s: string, withTime = false) {
  return withTime ? s.slice(0, 16) : s.slice(0, 10);
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}
