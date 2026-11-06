import { useEffect, useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthField from "../components/AuthField.jsx";
import AuthLayout from "../components/AuthLayout.jsx";
import AuthToast from "../components/AuthToast.jsx";
import DemoHumanCheck from "../components/DemoHumanCheck.jsx";
import { validateLogin } from "../utils/loginValidation.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [humanConfirmed, setHumanConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const notify = (type, message) => {
    window.clearTimeout(timer.current);
    setToast({ type, message });
    timer.current = window.setTimeout(() => setToast(null), 4200);
  };

  useEffect(() => {
    try {
      setRemember(localStorage.getItem("campuscode.demoRememberPreference") === "true");
    } catch {
      notify("error", "This browser does not allow access to local storage.");
    }
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const updateField = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin({ ...values, humanConfirmed });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      notify("error", "Check the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    try {
      if (remember) localStorage.setItem("campuscode.demoRememberPreference", "true");
      else localStorage.removeItem("campuscode.demoRememberPreference");
    } catch {
      setLoading(false);
      notify("error", "This browser could not save the demo preference. Please try again.");
      return;
    }

    notify("success", "Demo sign-in accepted. No account was authenticated.");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => navigate("/app", { state: { demoLogin: true } }), 1200);
  };

  const showForgotMessage = () => {
    notify("info", "Password reset is not available in this frontend-only demo.");
  };

  return (
    <AuthLayout
      page="login"
      eyebrow="WELCOME BACK"
      title="Good to see you."
      description="Sign in to continue exploring. This demo accepts any valid email and password of 8 or more characters."
    >
      <form className="auth-form" onSubmit={submit} noValidate>
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
        <AuthField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          value={values.password}
          onChange={updateField}
          error={errors.password}
          trailing={
            <button className="password-toggle" type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
        <div className="auth-options">
          <label className="auth-check">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
            <span className="auth-check-box" aria-hidden="true" />
            <span>Remember me on this device</span>
          </label>
          <button className="text-button" type="button" onClick={showForgotMessage}>Forgot password?</button>
        </div>
        <DemoHumanCheck checked={humanConfirmed} onChange={(event) => {
          setHumanConfirmed(event.target.checked);
          setErrors((current) => ({ ...current, humanConfirmed: undefined }));
        }} error={errors.humanConfirmed} />
        <button className="button button-purple auth-submit" type="submit" disabled={loading}>
          {loading ? <><span className="button-spinner" aria-hidden="true" /> Signing in…</> : <>Sign in to CampusCode <ArrowRight size={17} /></>}
        </button>
        <p className="auth-form-note">No password is checked or saved. The sign-in response is simulated.</p>
      </form>
      <AuthToast toast={toast} onDismiss={() => setToast(null)} />
    </AuthLayout>
  );
}
