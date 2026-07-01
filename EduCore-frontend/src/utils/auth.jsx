const STORAGE_KEY = "educore_auth";

// Backend role names (roles.nom) -> frontend role names (used by ProtectedRoute/Sidebar).
const ROLE_MAP = {
  admin: "admin",
  formateur: "teacher",
  stagiaire: "student",
};

export function toFrontendRole(backendRoleName) {
  return ROLE_MAP[backendRoleName] ?? null;
}

export function getAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuth({ token, user }) {
  const role = toFrontendRole(user?.role?.nom);
  const auth = { token, user, role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  return auth;
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getToken() {
  return getAuth()?.token ?? null;
}

export function getUser() {
  return getAuth()?.user ?? null;
}

export function getRole() {
  return getAuth()?.role ?? null;
}

export function isAuthenticated() {
  return !!getToken();
}
