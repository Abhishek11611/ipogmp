import { useState, type FormEvent } from "react";
import "../styles/Auth.css";
import { ApiError } from "../api/client";
import { saveSession } from "../storage/tokenStorage";
import { RecipientType, type TokenResponseDTO } from "../types/auth";
import { sendOtp, verifyOtp, verifyPassword } from "../api/loginapi";

type Tab = "otp" | "password";
type OtpStage = "enterRecipient" | "enterCode";

interface LoginProps {
  onSwitchToRegister?: () => void;
  onLoggedIn?: (session: TokenResponseDTO) => void;
}

export default function Login({ onSwitchToRegister, onLoggedIn }: LoginProps) {
  const [tab, setTab] = useState<Tab>("password");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [recipient, setRecipient] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStage, setOtpStage] = useState<OtpStage>("enterRecipient");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const switchTab = (next: Tab) => {
    if (next === tab) return;
    setTab(next);
    setApiError(null);
    setFieldError(null);
    setPassword("");
    setOtpCode("");
    setOtpStage("enterRecipient");
  };

  // Treat anything with an "@" as email, otherwise phone.
  const recipientType = recipient.includes("@") ? RecipientType.EMAIL : RecipientType.PHONE;

  const handleSuccess = (data: TokenResponseDTO) => {
    saveSession(data);
    onLoggedIn?.(data);
  };

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recipient.trim()) return setFieldError("Enter your email or mobile number.");
    if (!password) return setFieldError("Enter your password.");

    setFieldError(null);
    setApiError(null);
    setLoading(true);
    try {
      const res = await verifyPassword({ recipient: recipient.trim(), password });
      handleSuccess(res.data);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!recipient.trim()) return setFieldError("Enter your email or mobile number.");

    setFieldError(null);
    setApiError(null);
    setLoading(true);
    try {
      await sendOtp({ recipient: recipient.trim(), recipientType });
      setOtpStage("enterCode");
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpCode.trim()) return setFieldError("Enter the code we sent you.");

    setFieldError(null);
    setApiError(null);
    setLoading(true);
    try {
      const res = await verifyOtp({ recipient: recipient.trim(), otpCode: otpCode.trim() });
      handleSuccess(res.data);
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
          <h1 className="auth-panel__title">Log in</h1>
          <p className="auth-panel__subtitle">Welcome back — pick how you'd like to sign in.</p>

          <div className="auth-toggle" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "otp"}
              className={"auth-toggle__item" + (tab === "otp" ? " auth-toggle__item--active" : "")}
              onClick={() => switchTab("otp")}
            >
              With OTP
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "password"}
              className={
                "auth-toggle__item" + (tab === "password" ? " auth-toggle__item--active" : "")
              }
              onClick={() => switchTab("password")}
            >
              With password
            </button>
          </div>

          {apiError && <p className="auth-api-error">{apiError}</p>}

          {tab === "password" && (
            <form className="auth-form" onSubmit={handlePasswordLogin} noValidate>
              <div className="auth-field">
                <label htmlFor="recipient">Email or mobile number</label>
                <input
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  autoComplete="username"
                />
                <span className="auth-field__hint">
                  Mobile number with country code, e.g. 919890989898
                </span>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {fieldError && <span className="auth-field__error">{fieldError}</span>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Logging in…" : "Log in"}
              </button>
            </form>
          )}

          {tab === "otp" && otpStage === "enterRecipient" && (
            <form className="auth-form" onSubmit={handleSendOtp} noValidate>
              <div className="auth-field">
                <label htmlFor="otpRecipient">Email or mobile number</label>
                <input
                  id="otpRecipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  autoComplete="username"
                />
                <span className="auth-field__hint">
                  Mobile number with country code, e.g. 919890989898
                </span>
              </div>

              {fieldError && <span className="auth-field__error">{fieldError}</span>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Sending…" : "Send OTP"}
              </button>
            </form>
          )}

          {tab === "otp" && otpStage === "enterCode" && (
            <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
              <div className="auth-field">
                <label htmlFor="otpCode">Enter the code sent to {recipient}</label>
                <input
                  id="otpCode"
                  className="auth-otp-input"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>

              {fieldError && <span className="auth-field__error">{fieldError}</span>}

              <div className="auth-form__actions">
                <button
                  type="button"
                  className="auth-submit auth-submit--ghost"
                  onClick={() => {
                    setOtpStage("enterRecipient");
                    setOtpCode("");
                    setFieldError(null);
                  }}
                  disabled={loading}
                >
                  Back
                </button>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "Verifying…" : "Verify & log in"}
                </button>
              </div>
            </form>
          )}

          <p className="auth-switch">
            Don't have an account?{" "}
            <button type="button" className="auth-link" onClick={onSwitchToRegister}>
              Register
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}