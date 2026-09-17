import "../styles/Auth.css";
import { clearSession, type StoredSession } from "../storage/tokenStorage";

interface HomeProps {
  session: StoredSession;
  onLogout: () => void;
}

export default function Home({ session, onLogout }: HomeProps) {
  const handleLogout = () => {
    clearSession();
    onLogout();
  };

  return (
    <div className="auth-page auth-page--full">
      <main className="auth-panel">
        <div className="auth-panel__inner">
          <h1 className="auth-panel__title">You're logged in</h1>
          <p className="auth-panel__subtitle">{session.email}</p>

          <div className="auth-field">
            <label>Session expires</label>
            <p className="auth-panel__subtitle">{session.expiresAt}</p>
          </div>

          <button type="button" className="auth-submit" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </main>
    </div>
  );
}