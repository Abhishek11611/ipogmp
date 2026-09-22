import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { clearSession } from "../../features/auth/storage/tokenStorage";
import "./AdminLayout.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-layout__main">
        <header className="admin-layout__topbar">
          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Log out
          </button>
        </header>
        <div className="admin-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}