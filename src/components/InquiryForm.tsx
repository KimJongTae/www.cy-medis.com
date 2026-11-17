"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions/support";
import { company, privacyConsent } from "@/content/site";

export default function InquiryForm() {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});
  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div role="status" className="rounded-3xl bg-brand-50 px-6 py-16 text-center">
        <p className="text-2xl font-black text-navy-900">문의가 접수되었습니다.</p>
        <p className="mt-3 text-slate-600">
          확인 후 입력하신 이메일 또는 연락처로 빠르게 답변드리겠습니다.
          <br />
          급한 문의는 전화 <a href={`tel:${company.tel}`} className="font-bold text-brand-600">{company.tel}</a> 로 연락 주세요.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-navy-800 px-8 py-3 font-bold text-white hover:bg-brand-600">
          홈으로
        </Link>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-8">
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <fieldset className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100">
        <legend className="sr-only">개인정보 수집·이용 동의</legend>
        <p className="font-bold text-navy-900">개인정보 수집·이용 동의 (필수)</p>
        <dl className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-[90px_1fr]">
          <dt className="font-medium">수집 항목</dt>
          <dd>{privacyConsent.items}</dd>
          <dt className="font-medium">이용 목적</dt>
          <dd>{privacyConsent.purpose}</dd>
          <dt className="font-medium">보유 기간</dt>
          <dd>{privacyConsent.retention}</dd>
        </dl>
        <p className="mt-2 text-xs text-slate-400">동의를 거부할 수 있으나, 거부 시 온라인 문의 접수가 제한됩니다.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 font-medium text-slate-800">
          <input type="checkbox" name="agree" className="size-5 accent-brand-600" aria-invalid={!!err.agree} />
          동의합니다.
        </label>
        {err.agree && <FieldError>{err.agree}</FieldError>}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="이름" name="name" required defaultValue={v.name} error={err.name} autoComplete="name" />
        <Field label="연락처" name="phone" type="tel" defaultValue={v.phone} error={err.phone} autoComplete="tel" placeholder="010-0000-0000" />
        <div className="sm:col-span-2">
          <Field label="이메일" name="email" type="email" required defaultValue={v.email} error={err.email} autoComplete="email" />
        </div>
        <div className="sm:col-span-2">
          <Field label="제목" name="subject" required defaultValue={v.subject} error={err.subject} placeholder="예) 제품 견적 문의" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="content" className="mb-2 block text-sm font-bold text-slate-700">
            문의 내용 <span className="text-brand-600">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            maxLength={5000}
            defaultValue={v.content}
            aria-invalid={!!err.content}
            placeholder="제품명, 수량, 병원/기관명 등을 함께 적어주시면 더 정확히 안내드릴 수 있습니다."
            className="field resize-y"
          />
          {err.content && <FieldError>{err.content}</FieldError>}
        </div>
      </div>

      {/* 스팸 방지용 숨김 필드 */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          웹사이트 <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-600 px-14 py-4 text-lg font-bold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "접수 중…" : "문의 접수"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  ...rest
}: { label: string; name: string; required?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-brand-600">*</span>}
      </label>
      <input id={name} name={name} type="text" aria-invalid={!!error} className="field" {...rest} />
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

const FieldError = ({ children }: { children: React.ReactNode }) => <p className="mt-1.5 text-sm text-red-600">{children}</p>;
