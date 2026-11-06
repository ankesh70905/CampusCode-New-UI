import { useId } from "react";

export default function AuthField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  required = true,
  trailing,
  hint,
  ...inputProps
}) {
  const generatedId = useId();
  const id = inputProps.id || generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={`auth-field${error ? " has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          {...inputProps}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={[hint ? hintId : "", error ? errorId : ""].filter(Boolean).join(" ") || undefined}
        />
        {trailing}
      </div>
      {hint && <span className="auth-field-hint" id={hintId}>{hint}</span>}
      {error && <span className="auth-field-error" id={errorId} role="alert">{error}</span>}
    </div>
  );
}
