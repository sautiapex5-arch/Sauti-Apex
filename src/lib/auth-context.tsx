import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole =
  | "admin"
  | "super_admin"
  | "ceo"
  | "team"
  | "consultant"
  | "ops_manager"
  | "project_manager"
  | "hr_officer"
  | "finance_officer"
  | "client";
export type ViewMode = "admin" | "client";

export interface AuthState {
  session: Session | null;
  user: User | null;
  roles: AppRole[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTeam: boolean;
  /** What the user is *actually* allowed to do (true admin role) */
  hasAdminRole: boolean;
  /** Current viewing mode — admins can toggle to view as a client */
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);
const VIEW_MODE_KEY = "sautiapex.viewMode";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewModeState] = useState<ViewMode>("admin");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(VIEW_MODE_KEY);
    if (stored === "admin" || stored === "client") setViewModeState(stored);
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (typeof window !== "undefined") window.localStorage.setItem(VIEW_MODE_KEY, mode);
  };

  const loadRoles = async (uid: string | undefined) => {
    if (!uid) {
      setRoles([]);
      return;
    }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as AppRole));
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      // Only refetch roles on real identity changes, not on hourly token refreshes.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setTimeout(() => loadRoles(s?.user?.id), 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      loadRoles(s?.user?.id).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, []);

  const adminRoles: AppRole[] = ["admin", "super_admin", "ceo"];
  const teamRoles: AppRole[] = [
    "team",
    "consultant",
    "ops_manager",
    "project_manager",
    "hr_officer",
    "finance_officer",
  ];
  const hasAdminRole = roles.some((r) => adminRoles.includes(r));
  const effectiveAdmin = hasAdminRole && viewMode === "admin";
  const effectiveTeam = effectiveAdmin || roles.some((r) => teamRoles.includes(r));

  const value: AuthState = {
    session,
    user: session?.user ?? null,
    roles,
    isAuthenticated: !!session?.user,
    isAdmin: effectiveAdmin,
    isTeam: effectiveTeam,
    hasAdminRole,
    viewMode,
    setViewMode,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
    refreshRoles: async () => loadRoles(session?.user?.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
