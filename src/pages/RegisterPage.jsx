import { useEffect, useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthToast from "../components/AuthToast.jsx";
import DemoHumanCheck from "../components/DemoHumanCheck.jsx";
import { getPasswordStrength, validateRegistration } from "../utils/registerValidation.js";

const initialValues = {
  fullName: "",
  email: "",
  accountType: "Student",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({ password: false, confirmPassword: false });
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const strength = getPasswordStrength(values.password);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const notify = (type, message) => {
    window.clearTimeout(timer.current);
    setToast({ type, message });
    timer.current = window.setTimeout(() => setToast(null), 4500);
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const updateCheck = (setter, key) => (event) => {
    setter(event.target.checked);
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const togglePassword = (name) => {
    setVisiblePasswords((current) => ({ ...current, [name]: !current[name] }));
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = validateRegistration({
      ...values,
      humanConfirmed,
      ageConfirmed,
      termsAccepted,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notify("error", "Review the highlighted fields before continuing.");
      return;
    }

    setLoading(true);
    const demoProfile = {
      name: values.fullName.trim(),
      email: values.email.trim(),
      accountType: values.accountType,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("campuscode.demoProfile", JSON.stringify(demoProfile));
    } catch {
      setLoading(false);
      notify("error", "This browser could not save your demo profile. Please try again.");
      return;
    }

    notify("success", "Demo profile saved on this device. No password was stored.");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => navigate("/app", { state: { demoRegistration: true } }), 1400);
  };

  const passwordToggle = (fieldName) => (
    <button className="password-toggle" type="button" onClick={() => togglePassword(fieldName)} aria-label={visiblePasswords[fieldName] ? `Hide ${fieldName === "password" ? "password" : "confirmation"}` : `Show ${fieldName === "password" ? "password" : "confirmation"}`} aria-pressed={visiblePasswords[fieldName]}>
      {visiblePasswords[fieldName] ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <AuthLayout
      page="register"
      eyebrow="MAKE YOURSELF AT HOME"
      title="Start with an idea."
      description="Create a local demo profile to explore the CampusCode experience."
    >
      <form className="auth-form register-form" onSubmit={submit} noValidate>
        <AuthField
          label="Full name"
          name="fullName"
          autoComplete="name"
          placeholder="Your name"
          value={values.fullName}
          onChange={updateField}
          error={errors.fullName}
        />
        <AuthField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@school.edu"
          value={values.email}
          onChange={updateField}
          error={errors.email}
        />
        <div className={`auth-field${errors.accountType ? " has-error" : ""}`}>
          <label htmlFor="accountType">Account type</label>
          <select id="accountType" name="accountType" value={values.accountType} onChange={updateField} required aria-invalid={Boolean(errors.accountType)} aria-describedby={errors.accountType ? "accountType-error" : undefined}>
            <option>Student</option>
            <option>Educator</option>
            <option>Mentor</option>
          </select>
          {errors.accountType && <span className="auth-field-error" id="accountType-error" role="alert">{errors.accountType}</span>}
        </div>
        <div className="register-password-grid">
          <AuthField
            label="Password"
            name="password"
            type={visiblePasswords.password ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={values.password}
            onChange={updateField}
            error={errors.password}
            trailing={passwordToggle("password")}
          />
          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type={visiblePasswords.confirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter it again"
            value={values.confirmPassword}
            onChange={updateField}
            error={errors.confirmPassword}
            trailing={passwordToggle("confirmPassword")}
          />
        </div>
        <div className="password-strength" aria-live="polite">
          <div
            className="strength-meter"
            role="progressbar"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={strength.score}
            aria-valuetext={strength.label}
          >
            {[1, 2, 3].map((level) => <span className={strength.score >= level ? `strength-fill strength-level-${strength.score}` : ""} key={level} />)}
          </div>
          <span>Password strength: <strong>{strength.label}</strong></span>
          <small>Use 8+ characters; a mix of cases, numbers, and symbols adds strength.</small>
        </div>
        <DemoHumanCheck checked={humanConfirmed} onChange={updateCheck(setHumanConfirmed, "humanConfirmed")} error={errors.humanConfirmed} />
        <div className="consent-group">
          <label className={`auth-check consent-check${errors.ageConfirmed ? " has-error" : ""}`}>
            <input type="checkbox" checked={ageConfirmed} onChange={updateCheck(setAgeConfirmed, "ageConfirmed")} aria-invalid={Boolean(errors.ageConfirmed)} aria-describedby={errors.ageConfirmed ? "age-error" : undefined} />
            <span className="auth-check-box" aria-hidden="true" />
            <span>I confirm that I meet the age requirement.</span>
          </label>
          {errors.ageConfirmed && <span className="auth-field-error" id="age-error" role="alert">{errors.ageConfirmed}</span>}
          <label className={`auth-check consent-check${errors.termsAccepted ? " has-error" : ""}`}>
            <input type="checkbox" checked={termsAccepted} onChange={updateCheck(setTermsAccepted, "termsAccepted")} aria-invalid={Boolean(errors.termsAccepted)} aria-describedby={`demo-terms-copy${errors.termsAccepted ? " terms-error" : ""}`} />
            <span className="auth-check-box" aria-hidden="true" />
            <span>I accept the demo terms and understand this is not a real service.</span>
          </label>
          {errors.termsAccepted && <span className="auth-field-error" id="terms-error" role="alert">{errors.termsAccepted}</span>}
          <p className="demo-terms-copy" id="demo-terms-copy">Demo terms: your name, email, and account type stay in this browser only. No password is saved and no email is sent.</p>
        </div>
        <button className="button button-purple auth-submit" type="submit" disabled={loading}>
          {loading ? <><span className="button-spinner" aria-hidden="true" /> Creating demo profile…</> : <>Create demo profile <ArrowRight size={17} /></>}
        </button>
        <p className="auth-form-note">Only your non-sensitive demo profile is saved here. Passwords and verification are never stored or sent.</p>
      </form>
      <AuthToast toast={toast} onDismiss={() => setToast(null)} />
    </AuthLayout>
  );
}
