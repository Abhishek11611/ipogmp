import { getSession } from "../../../features/auth/storage/tokenStorage";
import "./Topbar.css";

interface TopbarProps {
  onLogout: () => void;
}

export default function Topbar({ onLogout }: TopbarProps) {
  const session = getSession();
  const email = session?.email || "Signed in";
  const initial = email.charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar__search" role="search">
        <input
          className="search-input"
          type="search"
          placeholder="Search brands, products, orders…"
          aria-label="Search"
        />
      </div>

      <div className="topbar__actions">
        <button type="button" className="topbar__icon-btn" aria-label="Notifications">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
          </svg>
        </button>

        <div className="topbar__user">
          <span className="topbar__avatar">{initial}</span>
          <span className="topbar__user-meta">
            <span className="topbar__email">{email}</span>
            <span className="topbar__role">Administrator</span>
          </span>
        </div>

        <button type="button" className="topbar__logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
