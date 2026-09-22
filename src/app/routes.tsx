import { createBrowserRouter, Navigate, Outlet, useNavigate } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import RegisterWizard from "../features/auth/pages/registerWizard";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import { getSession } from "../features/auth/storage/tokenStorage";
import DashboardPage from "../features/dashboard/Dashboardpage";
import BrandsPage from "../features/brands/pages/BrandsPage";

// Wraps your existing Login component — unchanged — and turns its
// callback props into real navigation.
function LoginRoute() {
  const navigate = useNavigate();
  return (
    <Login
      onSwitchToRegister={() => navigate("/register")}
      onLoggedIn={() => navigate("/dashboard", { replace: true })}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  return (
    <RegisterWizard
      onSwitchToLogin={() => navigate("/login")}
      onComplete={() => navigate("/dashboard", { replace: true })}
    />
  );
}

// Blocks every admin route if there's no session in storage.
function RequireAuth() {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginRoute /> },
  { path: "/register", element: <RegisterRoute /> },
{
  element: <RequireAuth />,
  children: [
    {
      path: "/",
      element: <AdminLayout />,
      children: [
        { 
          index: true, 
          element: <Navigate to="/dashboard" replace /> 
        },

        { 
          path: "dashboard", 
          element: <DashboardPage /> 
        },

        { 
          path: "brands", 
          element: <BrandsPage /> 
        },
      ],
    },
  ],
},
  { path: "*", element: <Navigate to="/login" replace /> },
]);