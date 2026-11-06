import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export default function AuthToast({ toast, onDismiss }) {
  if (!toast) return null;
  const Icon = toast.type === "error" ? AlertCircle : toast.type === "info" ? Info : CheckCircle2;

  return (
    <div className={`auth-toast auth-toast-${toast.type}`} role={toast.type === "error" ? "alert" : "status"} aria-live={toast.type === "error" ? "assertive" : "polite"}>
      <Icon size={19} aria-hidden="true" />
      <span>{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification"><X size={16} /></button>
    </div>
  );
}
