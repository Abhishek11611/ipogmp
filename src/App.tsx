import { useState } from "react";
import Login from "./features/auth/pages/login";
import RegisterWizard from "./features/auth/pages/registerWizard";


type Screen = "login" | "register";

const App = () => {
  const [screen, setScreen] = useState<Screen>("login");

  const handleAuthComplete = (accessToken: string) => {
    // TODO: store the token and navigate into the real app once routing exists.
    console.log("Logged in with token:", accessToken);
  };

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      {screen === "login" ? (
        <Login
          onSwitchToRegister={() => setScreen("register")}
          onComplete={handleAuthComplete}
        />
      ) : (
        <RegisterWizard
          onSwitchToLogin={() => setScreen("login")}
          onComplete={handleAuthComplete}
        />
      )}
    </div>
  );
};

export default App;