import { useState, type FormEvent, type ChangeEvent } from "react";

import "../styles/Auth.css";
import { login } from "../api/loginapi";
import { ApiError } from "../api/client";


interface LoginForm {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginProps {
  onSwitchToRegister?: () => void;
  onComplete?: (accessToken: string) => void;
}

export default function Login({ onSwitchToRegister, onComplete }: LoginProps) {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = (): LoginErrors => {
    const next: LoginErrors = {};
    if (!form.email.trim()) {
      next.email = "Enter your email.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) next.password = "Enter your password.";
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setApiError(null);
    setLoading(true);
    try {
      const res = await login(form);
      onComplete?.(res.data.accessToken);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--full">
      <main className="auth-panel">
        <div className="auth-panel__inner">
          {apiError && <p className="auth-api-error">{apiError}</p>}

          <h1 className="auth-panel__title">Welcome back</h1>
          <p className="auth-panel__subtitle">Log in to check on your orders.</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="auth-field__error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange("password")}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && <span className="auth-field__error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="auth-switch">
            New here?{" "}
            <button type="button" className="auth-link" onClick={onSwitchToRegister}>
              Create an account
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}