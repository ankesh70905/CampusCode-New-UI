import { ShieldCheck } from "lucide-react";

export default function DemoHumanCheck({ checked, onChange, error }) {
  return (
    <div className={`demo-check${error ? " has-error" : ""}`}>
      <label className="demo-check-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "human-check-error" : "human-check-note"}
        />
        <span className="demo-check-box" aria-hidden="true" />
        <span className="demo-check-copy">
          <strong>I’m ready to continue</strong>
          <small id="human-check-note">Demo interaction only — not a security check.</small>
        </span>
        <ShieldCheck className="demo-check-icon" size={22} aria-hidden="true" />
      </label>
      {error && <span className="auth-field-error" id="human-check-error" role="alert">{error}</span>}
    </div>
  );
}
