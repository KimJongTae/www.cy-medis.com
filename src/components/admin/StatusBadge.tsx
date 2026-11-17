import { STATUS_LABEL, type InquiryStatus } from "@/lib/inquiries";

export default function StatusBadge({ status }: { status: InquiryStatus }) {
  const cls = { new: "bg-sky-400 text-navy-950", read: "bg-slate-200 text-slate-600", done: "bg-emerald-100 text-emerald-700" }[status];
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{STATUS_LABEL[status]}</span>;
}
