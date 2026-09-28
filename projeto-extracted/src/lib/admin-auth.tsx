import { createContext, useContext, useState, ReactNode } from "react";
import { adminLogin } from "@/lib/supabase";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const STORAGE_KEY = "portal_br_admin_auth";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true"
  );

  const login = async (password: string): Promise<boolean> => {
    const ok = await adminLogin(password);
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
