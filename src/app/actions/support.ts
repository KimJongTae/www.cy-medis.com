"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/auth";
import { createInquiry } from "@/lib/inquiries";

export type InquiryState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "phone" | "subject" | "content" | "agree", string>>;
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitInquiry(_prev: InquiryState, formData: FormData): Promise<InquiryState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const values = { name: get("name"), email: get("email"), phone: get("phone"), subject: get("subject"), content: get("content") };

  // 스팸 봇 함정 필드: 사람에게는 보이지 않음
  if (get("website")) return { ok: true };

  const fieldErrors: InquiryState["fieldErrors"] = {};
  if (!values.name || values.name.length > 50) fieldErrors.name = "이름을 입력해 주세요.";
  if (!EMAIL_RE.test(values.email) || values.email.length > 120) fieldErrors.email = "올바른 이메일 주소를 입력해 주세요.";
  if (values.phone && !/^[0-9+\-() ]{7,20}$/.test(values.phone)) fieldErrors.phone = "연락처 형식을 확인해 주세요.";
  if (!values.subject || values.subject.length > 150) fieldErrors.subject = "제목을 입력해 주세요.";
  if (!values.content || values.content.length > 5000) fieldErrors.content = "문의 내용을 입력해 주세요. (5,000자 이내)";
  if (formData.get("agree") !== "on") fieldErrors.agree = "개인정보 수집·이용에 동의해 주세요.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values };

  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "").trim();
  if (!rateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000)) {
    return { error: "짧은 시간에 너무 많은 문의가 접수되었습니다. 잠시 후 다시 시도하시거나 전화로 문의해 주세요.", values };
  }

  createInquiry({ ...values, ip });
  return { ok: true };
}
