"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/admin";
import Logo from "@/components/Logo";

export default function LoginForm() {
  const [state, action, pending] = useActionState<{ error?: string }, FormData>(login, {});
  return (
    <form action={action} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
      <Logo className="mx-auto h-9 w-auto" />
      <h1 className="mt-6 text-center text-lg font-bold text-navy-900">관리자 로그인</h1>
      <label htmlFor="password" className="mt-8 mb-2 block text-sm font-bold text-slate-700">
        비밀번호
      </label>
      <input id="password" name="password" type="password" required autoFocus autoComplete="current-password" className="field" />
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="mt-6 w-full rounded-xl bg-navy-800 py-3.5 font-bold text-white hover:bg-brand-600 disabled:opacity-60">
        {pending ? "확인 중…" : "로그인"}
      </button>
      <Link href="/" className="mt-4 block text-center text-sm text-slate-400 hover:text-slate-600">
        ← 홈페이지로
      </Link>
    </form>
  );
}
