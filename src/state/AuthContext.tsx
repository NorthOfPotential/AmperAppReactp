import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthState = {
  isAuthenticated: boolean;
  isGuest: boolean;
  displayName: string;
  loginAsMember: (displayName: string) => void;
  loginAsGuest: (unlockCode: string) => boolean;
  logOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const STORAGE_KEY = "amper.auth";

interface StoredAuth {
  isAuthenticated: boolean;
  isGuest: boolean;
  displayName: string;
}

function loadStored(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredAuth;
  } catch {
    // ignore corrupt storage
  }
  return { isAuthenticated: false, isGuest: false, displayName: "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredAuth>(loadStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: state.isAuthenticated,
      isGuest: state.isGuest,
      displayName: state.displayName,
      loginAsMember: (displayName: string) =>
        setState({ isAuthenticated: true, isGuest: false, displayName }),
      loginAsGuest: (unlockCode: string) => {
        const trimmed = unlockCode.trim();
        if (!trimmed) return false;
        setState({ isAuthenticated: true, isGuest: true, displayName: "Guest" });
        return true;
      },
      logOut: () => setState({ isAuthenticated: false, isGuest: false, displayName: "" }),
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
