import { useState, type FormEvent, type ChangeEvent } from "react";

import "../styles/Auth.css";
import { ApiError } from "../api/client";
import { setPassword, submitPersonalDetails, verifyOtp } from "../api/registrationapi ";

type Step = 1 | 2 | 3 | "done";

interface PersonalForm {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
}

interface PersonalErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  dateOfBirth?: string;
}

interface PasswordForm {
  password: string;
  confirmPassword: string;
}

interface PasswordErrors {
  password?: string;
  confirmPassword?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterWizardProps {
  onSwitchToLogin?: () => void;
  onComplete?: (accessToken: string) => void;
}

export default function RegisterWizard({ onSwitchToLogin, onComplete }: RegisterWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [personal, setPersonal] = useState<PersonalForm>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
  });
  const [personalErrors, setPersonalErrors] = useState<PersonalErrors>({});

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>();

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    password: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const stepIndex = step === "done" ? 3 : step;

  // ---------- step 1: personal details ----------

  const handlePersonalChange =
    (field: keyof PersonalForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setPersonal((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validatePersonal = (): PersonalErrors => {
    const next: PersonalErrors = {};
    if (personal.firstName.trim().length < 1) next.firstName = "Required.";
    if (personal.lastName.trim().length < 1) next.lastName = "Required.";
    if (!personal.email.trim()) {
      next.email = "Enter your email.";
    } else if (!EMAIL_PATTERN.test(personal.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!personal.mobileNumber.trim()) next.mobileNumber = "Enter your mobile number.";
    if (!personal.dateOfBirth) next.dateOfBirth = "Enter your date of birth.";
    return next;
  };

  const handlePersonalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validatePersonal();
    setPersonalErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setApiError(null);
    setLoading(true);
    try {
      const res = await submitPersonalDetails(personal);
      setJourneyId(res.data.journeyId);
      setEmail(personal.email);
      setStep(2);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- step 2: otp ----------

  const handleOtpSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!journeyId) return;

    if (otp.trim().length === 0) {
      setOtpError("Enter the code we sent you.");
      return;
    }
    setOtpError(undefined);
    setApiError(null);
    setLoading(true);
    try {
      await verifyOtp({ journeyId, otp: otp.trim() });
      setStep(3);
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- step 3: password ----------

  const handlePasswordChange =
    (field: keyof PasswordForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validatePassword = (): PasswordErrors => {
    const next: PasswordErrors = {};
    if (passwordForm.password.length < 8) next.password = "Use at least 8 characters.";
    if (passwordForm.confirmPassword !== passwordForm.password) {
      next.confirmPassword = "Passwords don't match.";
    }
    return next;
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!journeyId) return;

    const nextErrors = validatePassword();
    setPasswordErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setApiError(null);
    setLoading(true);
    try {
      await setPassword({
        journeyId,
        password: passwordForm.password,
        confirmPassword: passwordForm.confirmPassword,
      });

      setStep("done");
            setTimeout(() => {
            onSwitchToLogin?.();
            }, 1000);

    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-hero" aria-hidden="true">
        <div className="auth-hero__content">
          <div className="auth-hero__brand">
            <span className="auth-hero__mark">S</span>
            <span className="auth-hero__brand-name">yourstore</span>
          </div>
          <p className="auth-hero__tagline">
            One account. Every order, saved address, and return — in one place.
          </p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel__inner">
          {step !== "done" && (
            <div className="auth-steps" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={
                    "auth-steps__dot " +
                    (n < stepIndex
                      ? "auth-steps__dot--done"
                      : n === stepIndex
                        ? "auth-steps__dot--active"
                        : "")
                  }
                />
              ))}
            </div>
          )}

          {apiError && <p className="auth-api-error">{apiError}</p>}

          {step === 1 && (
            <>
              <h1 className="auth-panel__title">Create your account</h1>
              <p className="auth-panel__subtitle">Step 1 of 3 — your details</p>
              <form className="auth-form" onSubmit={handlePersonalSubmit} noValidate>
                <div className="auth-form__grid">
                  <div className="auth-field">
                    <label htmlFor="firstName">First name</label>
                    <input
                      id="firstName"
                      value={personal.firstName}
                      onChange={handlePersonalChange("firstName")}
                      aria-invalid={Boolean(personalErrors.firstName)}
                    />
                    {personalErrors.firstName && (
                      <span className="auth-field__error">{personalErrors.firstName}</span>
                    )}
                  </div>
                  <div className="auth-field">
                    <label htmlFor="lastName">Last name</label>
                    <input
                      id="lastName"
                      value={personal.lastName}
                      onChange={handlePersonalChange("lastName")}
                      aria-invalid={Boolean(personalErrors.lastName)}
                    />
                    {personalErrors.lastName && (
                      <span className="auth-field__error">{personalErrors.lastName}</span>
                    )}
                  </div>
                </div>

                <div className="auth-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={personal.email}
                    onChange={handlePersonalChange("email")}
                    aria-invalid={Boolean(personalErrors.email)}
                  />
                  {personalErrors.email && (
                    <span className="auth-field__error">{personalErrors.email}</span>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="mobileNumber">Mobile number</label>
                  <input
                    id="mobileNumber"
                    type="tel"
                    value={personal.mobileNumber}
                    onChange={handlePersonalChange("mobileNumber")}
                    aria-invalid={Boolean(personalErrors.mobileNumber)}
                  />
                  {personalErrors.mobileNumber && (
                    <span className="auth-field__error">{personalErrors.mobileNumber}</span>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="dateOfBirth">Date of birth</label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={personal.dateOfBirth}
                    onChange={handlePersonalChange("dateOfBirth")}
                    aria-invalid={Boolean(personalErrors.dateOfBirth)}
                  />
                  {personalErrors.dateOfBirth && (
                    <span className="auth-field__error">{personalErrors.dateOfBirth}</span>
                  )}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? "Please wait…" : "Continue"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="auth-panel__title">Verify your email</h1>
              <p className="auth-panel__subtitle">
                Step 2 of 3 — enter the code sent to {email || "your email"}
              </p>
              <form className="auth-form" onSubmit={handleOtpSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="otp">Verification code</label>
                  <input
                    id="otp"
                    className="auth-otp-input"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    aria-invalid={Boolean(otpError)}
                  />
                  {otpError && <span className="auth-field__error">{otpError}</span>}
                </div>

                <div className="auth-form__actions">
                  <button
                    type="button"
                    className="auth-submit auth-submit--ghost"
                    onClick={() => setStep(1)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Verifying…" : "Verify"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="auth-panel__title">Set a password</h1>
              <p className="auth-panel__subtitle">Step 3 of 3 — last step</p>
              <form className="auth-form" onSubmit={handlePasswordSubmit} noValidate>
                <div className="auth-field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={passwordForm.password}
                    onChange={handlePasswordChange("password")}
                    aria-invalid={Boolean(passwordErrors.password)}
                  />
                  {passwordErrors.password && (
                    <span className="auth-field__error">{passwordErrors.password}</span>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange("confirmPassword")}
                    aria-invalid={Boolean(passwordErrors.confirmPassword)}
                  />
                  {passwordErrors.confirmPassword && (
                    <span className="auth-field__error">{passwordErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="auth-form__actions">
                  <button
                    type="button"
                    className="auth-submit auth-submit--ghost"
                    onClick={() => setStep(2)}
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? "Creating…" : "Create account"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="auth-success">
              <div className="auth-success__icon">✓</div>
              <h1 className="auth-panel__title">You're all set</h1>
              <p className="auth-panel__subtitle">Your account has been created and you're logged in.</p>
            </div>
          )}

          {step !== "done" && (
            <p className="auth-switch">
              Already have an account?{" "}
              <button type="button" className="auth-link" onClick={onSwitchToLogin}>
                Log in
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}