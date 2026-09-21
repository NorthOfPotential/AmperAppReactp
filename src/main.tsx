import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./state/AuthContext";
import { PlaylistsProvider } from "./state/PlaylistsContext";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <PlaylistsProvider>
          <App />
        </PlaylistsProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);
