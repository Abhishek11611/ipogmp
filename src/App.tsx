import { useState } from "react";

import { getSession, type StoredSession } from "./features/auth/storage/tokenStorage";
import RegisterWizard from "./features/auth/pages/registerWizard";
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";

type Screen = "login" | "register";

const App = () => {
  // Restore an existing session on reload so a refresh doesn't log you out.
  const [session, setSession] = useState<StoredSession | null>(() => getSession());
  const [screen, setScreen] = useState<Screen>("login");

  if (session) {
    return <Home session={session} onLogout={() => setSession(null)} />;
  }

  if (screen === "register") {
    return (
      <RegisterWizard
        onSwitchToLogin={() => setScreen("login")}
        onComplete={() => setSession(getSession())}
      />
    );
  }

  return (
    <Login
      onSwitchToRegister={() => setScreen("register")}
      onLoggedIn={() => setSession(getSession())}
    />
  );
};

export default App;