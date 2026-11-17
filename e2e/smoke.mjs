/**
 * 운영 빌드 대상 E2E 스모크 테스트
 *   BASE=http://localhost:3000 ADMIN_PASSWORD=... CHROME_PATH=/usr/bin/google-chrome node e2e/smoke.mjs
 * 테스트 중 만든 문의·게시물은 마지막에 모두 삭제합니다. (빈 테스트용 DATA_DIR 에서 실행 권장)
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PW = process.env.ADMIN_PASSWORD;
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
if (!PW) throw new Error("ADMIN_PASSWORD 환경변수가 필요합니다.");

let failed = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "PASS" : "FAIL"} ${msg}`);
  if (!cond) failed++;
};

const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const p = await browser.newPage();
await p.setViewport({ width: 1280, height: 900 });
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
p.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const text = () => p.evaluate(() => document.body.innerText);
const go = async (url) => {
  await p.goto(BASE + url, { waitUntil: "load" });
  await wait(500);
};
const waitText = (t) => p.waitForFunction((t) => document.body.innerText.includes(t), { timeout: 20000 }, t).catch(() => {});
async function clickNav(sel) {
  const before = p.url();
  await p.click(sel);
  await p.waitForFunction((u) => location.href !== u, { timeout: 20000 }, before).catch(() => {});
  await wait(800);
}

try {
  // 공개 페이지
  for (const url of ["/", "/company/greeting", "/company/history", "/company/organization", "/company/location", "/products", "/notice", "/resources", "/recruit", "/support", "/privacy"]) {
    const res = await p.goto(BASE + url, { waitUntil: "load" });
    ok(res.status() === 200, `page ${url} -> ${res.status()}`);
  }
  const health = await (await fetch(BASE + "/api/health")).json();
  ok(health.ok === true, "api/health ok");

  // 자료실 시드 + 다운로드
  await go("/resources");
  ok((await text()).includes("BIS MONITOR 브로셔"), "resources: seeded brochure listed");
  await clickNav("tbody a");
  const fileHref = await p.$eval('a[href^="/files/"]', (a) => a.getAttribute("href"));
  const dl = await fetch(BASE + fileHref);
  ok(dl.status === 200 && dl.headers.get("content-type") === "application/pdf", "resources: PDF download");

  // 온라인문의
  await go("/support");
  await p.click("button[type=submit]");
  await waitText("개인정보 수집·이용에 동의해 주세요");
  ok((await text()).includes("개인정보 수집·이용에 동의해 주세요"), "inquiry: validation errors");
  await p.click("input[name=agree]");
  await p.type("#name", "테스트고객");
  await p.type("#email", "test@example.com");
  await p.type("#subject", "E2E 견적 문의");
  await p.type("#content", "자동 테스트 문의입니다.\n두 번째 줄");
  await p.click("button[type=submit]");
  await waitText("문의가 접수되었습니다");
  ok((await text()).includes("문의가 접수되었습니다"), "inquiry: submitted");

  // 관리자 로그인
  await go("/admin");
  ok(p.url().endsWith("/admin/login"), "admin: redirect to login");
  await p.type("#password", "wrong-password");
  await p.click("form button");
  await waitText("비밀번호가 올바르지 않습니다");
  ok((await text()).includes("비밀번호가 올바르지 않습니다"), "admin: wrong password rejected");
  await p.$eval("#password", (el) => (el.value = ""));
  await p.type("#password", PW);
  await clickNav("form button");
  ok(new URL(p.url()).pathname === "/admin", "admin: login");
  ok((await text()).includes("E2E 견적 문의"), "admin: inquiry on dashboard");

  // 문의 처리
  await go("/admin/inquiries");
  await clickNav("tbody a");
  ok((await text()).includes("두 번째 줄"), "admin: inquiry detail");
  await p.select("#status", "done");
  await clickNav("button::-p-text(저장)");
  ok((await text()).includes("답변완료"), "admin: inquiry status updated");

  // 공지 작성 (첨부 포함)
  const attach = path.join(os.tmpdir(), "e2e-attach.txt");
  fs.writeFileSync(attach, "첨부 테스트");
  await go("/admin/posts/new?board=notice");
  await p.type("#title", "E2E 공지 테스트");
  await p.type("#content", "공지 본문 https://example.com 링크");
  await p.click("input[name=pinned]");
  await (await p.$("input[type=file]")).uploadFile(attach);
  await clickNav("button::-p-text(공지사항에 등록)");
  ok((await text()).includes("E2E 공지 테스트"), "admin: notice created");

  await go("/notice");
  ok((await text()).includes("E2E 공지 테스트"), "site: notice listed");
  await clickNav("tbody a");
  ok((await text()).includes("e2e-attach.txt") && (await p.$('a[href="https://example.com"]')) !== null, "site: notice detail, attachment, autolink");

  // 수정 → 삭제
  await go("/admin/posts?board=notice");
  await clickNav("tbody a");
  await p.$eval("#title", (el) => (el.value = ""));
  await p.type("#title", "E2E 공지 수정됨");
  await p.click("input[name=removeFile]");
  await clickNav("button::-p-text(수정 저장)");
  ok((await text()).includes("E2E 공지 수정됨"), "admin: notice edited");
  await clickNav("tbody a");
  p.once("dialog", (d) => d.accept());
  await clickNav("button::-p-text(게시물 삭제)");
  ok(!(await text()).includes("E2E 공지"), "admin: notice deleted");

  // 테스트 문의 삭제, 로그아웃
  await go("/admin/inquiries");
  await clickNav("tbody a");
  p.once("dialog", (d) => d.accept());
  await clickNav("button::-p-text(문의 삭제)");
  ok(!(await text()).includes("E2E 견적 문의"), "admin: inquiry deleted");
  await clickNav("button::-p-text(로그아웃)");
  await go("/admin/inquiries");
  ok(p.url().endsWith("/admin/login"), "admin: logout");

  ok(errors.length === 0, `no browser errors ${errors.length ? JSON.stringify(errors) : ""}`);
} catch (e) {
  console.error(e);
  failed++;
} finally {
  await browser.close();
}

console.log(failed ? `\n${failed} test(s) failed` : "\nAll tests passed");
process.exit(failed ? 1 : 0);
