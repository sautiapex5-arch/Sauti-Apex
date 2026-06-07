import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Folder,
  FileText,
  Receipt,
  CalendarCheck,
  Package,
  UserCircle,
  LifeBuoy,
} from "lucide-react";

const items = [
  { to: "/dashboard", label: "Overview", Icon: LayoutDashboard, exact: true },
  { to: "/dashboard/projects", label: "My Projects", Icon: Folder },
  { to: "/dashboard/consultations", label: "Consultations", Icon: CalendarCheck },
  { to: "/dashboard/invoices", label: "Invoices", Icon: Receipt },
  { to: "/dashboard/documents", label: "Documents", Icon: FileText },
  { to: "/dashboard/packages", label: "Packages & Pricing", Icon: Package },
  { to: "/dashboard/support", label: "Support", Icon: LifeBuoy },
  { to: "/dashboard/profile", label: "Profile", Icon: UserCircle },
];

const darkPalette = {
  "--sidebar": "var(--brand-navy-deep)",
  "--sidebar-foreground": "oklch(0.96 0.012 85)",
  "--sidebar-border": "oklch(1 0 0 / 8%)",
  "--sidebar-accent": "oklch(1 0 0 / 6%)",
  "--sidebar-accent-foreground": "oklch(0.98 0.012 85)",
  "--sidebar-ring": "var(--brand-gold)",
} as React.CSSProperties;

export function ClientSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user } = useAuth();

  const isActive = (to: string, exact?: boolean) =>
    exact ? path === to : path === to || path.startsWith(to + "/");

  const initials = (user?.email ?? "C").slice(0, 1).toUpperCase();

  return (
    <Sidebar collapsible="icon" style={darkPalette}>
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3 px-2 py-3">
          <div className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-brand-gold text-brand-navy font-serif text-base font-bold">
            S
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-serif text-sm font-semibold text-sidebar-foreground">
                Client Portal
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-sidebar-foreground/55">
                SautiApex
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => {
                const active = isActive(it.to, it.exact);
                return (
                  <SidebarMenuItem key={it.to}>
                    <SidebarMenuButton
                      asChild
                      tooltip={it.label}
                      className={`h-10 rounded-md px-3 text-[13px] transition ${
                        active
                          ? "!bg-brand-gold !text-brand-navy font-semibold hover:!bg-brand-gold"
                          : "text-sidebar-foreground/85 hover:bg-white/5 hover:text-sidebar-foreground"
                      }`}
                    >
                      <Link to={it.to}>
                        <it.Icon className="shrink-0" />
                        <span>{it.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="px-2 py-3 flex items-center gap-2.5">
            <div className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-brand-gold text-brand-navy font-semibold text-sm">
              {initials}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-sm font-semibold text-sidebar-foreground truncate">
                {user?.email?.split("@")[0] ?? "Client"}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/55">
                Client
              </div>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center py-3">
            <div className="grid place-items-center h-8 w-8 rounded-full bg-brand-gold text-brand-navy font-semibold text-xs">
              {initials}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
