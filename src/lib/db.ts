import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/** 데이터 폴더: DB 파일과 업로드 파일이 저장됩니다. 백업 시 이 폴더만 복사하면 됩니다. */
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), "data"));
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

declare global {
  var __cyDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "site.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      board       TEXT    NOT NULL CHECK (board IN ('notice', 'resources')),
      title       TEXT    NOT NULL,
      content     TEXT    NOT NULL DEFAULT '',
      author      TEXT    NOT NULL DEFAULT '관리자',
      pinned      INTEGER NOT NULL DEFAULT 0,
      views       INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE INDEX IF NOT EXISTS posts_board ON posts (board, pinned DESC, id DESC);

    CREATE TABLE IF NOT EXISTS files (
      id          TEXT    PRIMARY KEY,
      post_id     INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
      name        TEXT    NOT NULL,
      size        INTEGER NOT NULL,
      mime        TEXT    NOT NULL,
      downloads   INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT    NOT NULL DEFAULT '',
      subject     TEXT    NOT NULL,
      content     TEXT    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'done')),
      memo        TEXT    NOT NULL DEFAULT '',
      ip          TEXT    NOT NULL DEFAULT '',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
  seed(db);
  return db;
}

/** 첫 실행 시 기존 홈페이지 자료실 게시물을 옮겨 넣음 */
function seed(db: DatabaseSync) {
  const count = db.prepare("SELECT COUNT(*) AS n FROM posts").get() as { n: number };
  if (count.n > 0) return;
  const seedPdf = path.join(/*turbopackIgnore: true*/ process.cwd(), "seed", "BIS_Advance_monitor_brochure.pdf");
  const info = db
    .prepare("INSERT INTO posts (board, title, content, author, views, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .run("resources", "BIS MONITOR 브로셔", "BIS MONITOR 브로셔", "관리자", 428, "2026-01-14 13:56:31", "2026-01-14 13:56:31");
  if (fs.existsSync(seedPdf)) {
    const id = crypto.randomUUID();
    fs.copyFileSync(seedPdf, path.join(UPLOAD_DIR, id));
    db.prepare("INSERT INTO files (id, post_id, name, size, mime, downloads, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
      id,
      Number(info.lastInsertRowid),
      "BIS Advance monitor 브로셔.pdf",
      fs.statSync(seedPdf).size,
      "application/pdf",
      14,
      "2026-01-14 13:56:31",
    );
  }
}

export function db(): DatabaseSync {
  // 개발 모드 핫리로드 시 연결이 중복 생성되지 않도록 전역에 보관
  globalThis.__cyDb ??= open();
  return globalThis.__cyDb;
}
