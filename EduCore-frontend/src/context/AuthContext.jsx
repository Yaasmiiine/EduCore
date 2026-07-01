import { createContext, useCallback, useContext, useState } from "react";
import * as authApi from "../api/auth";
import { getAuth, setAuth as persistAuth, clearAuth as clearPersistedAuth } from "../utils/auth.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(() => getAuth());

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    const newAuth = persistAuth({ token: data.token, user: data.user });
    setAuthState(newAuth);
    return newAuth;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    const newAuth = persistAuth({ token: data.token, user: data.user });
    setAuthState(newAuth);
    return newAuth;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Already logging out locally regardless of whether the API call succeeds.
    }
    clearPersistedAuth();
    setAuthState(null);
  }, []);

  const value = {
    user: auth?.user ?? null,
    role: auth?.role ?? null,
    token: auth?.token ?? null,
    isAuthenticated: !!auth?.token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
