import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronDown, Home, LayoutDashboard, Search, Shield, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, type ViewMode } from "@/lib/auth-context";
import { SignOutButton } from "./SignOutButton";

export function PortalTopbar({
  title,
  subtitle,
  mode,
}: {
  title: string;
  subtitle: string;
  mode: ViewMode;
}) {
  const { user, hasAdminRole, viewMode, setViewMode } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.email ?? "SA").slice(0, 2).toUpperCase();

  const switchMode = (next: ViewMode) => {
    setViewMode(next);
    navigate({ to: next === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex min-h-[var(--portal-nav-height)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <SidebarTrigger className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-brand-navy">{title}</h1>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="hidden w-full max-w-sm items-center gap-2 rounded-md bg-secondary px-3 py-2 text-muted-foreground lg:flex">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search clients, projects, refs..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-md border border-transparent text-brand-navy hover:border-border hover:bg-secondary"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white">
            3
          </span>
        </button>

        <div className="h-10 w-px bg-border" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-w-0 items-center gap-3 rounded-md px-1.5 py-1 hover:bg-secondary"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-navy text-sm font-bold text-brand-cream">
                {initials}
              </span>
              <span className="hidden min-w-0 text-left sm:block">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {mode === "admin" ? "System Admin" : "Client Portal"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {user?.email ?? "Signed in"}
                </span>
              </span>
              <ChevronDown size={16} className="hidden text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="truncate text-sm">{user?.email ?? "SautiApex user"}</div>
              <div className="mt-1 text-xs font-normal text-muted-foreground">
                {mode === "admin" ? "Administration console" : "Client workspace"}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard">
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/">
                <Home size={15} />
                Public site
              </Link>
            </DropdownMenuItem>
            {hasAdminRole && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => switchMode(viewMode === "admin" ? "client" : "admin")}>
                  {viewMode === "admin" ? <User size={15} /> : <Shield size={15} />}
                  Switch to {viewMode === "admin" ? "client" : "admin"} view
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <SignOutButton className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-secondary" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function PortalFooter() {
  return (
    <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} SautiApex Capital Ventures Limited. All rights reserved.
        </span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-brand-navy">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-brand-navy">
            Terms
          </Link>
          <Link to="/contact" className="hover:text-brand-navy">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
}
