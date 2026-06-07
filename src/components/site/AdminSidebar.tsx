import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  UserCircle,
  Folder,
  UserCog,
  Sparkles,
  Workflow,
  Coins,
  Rocket,
  Library,
  Settings,
  ClipboardCheck,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = { to: string; label: string; Icon: LucideIcon; badge?: number };

const items: Item[] = [
  { to: "/admin", label: "Overview", Icon: LayoutDashboard },
  { to: "/admin/ai-insights", label: "Sauti AI", Icon: Sparkles },
  { to: "/admin/pipeline", label: "Pipeline", Icon: Workflow },
  { to: "/admin/clients", label: "Clients", Icon: UserCircle },
  { to: "/admin/appraisals", label: "Appraisals", Icon: ClipboardCheck },
  { to: "/admin/projects", label: "Projects", Icon: Folder },
  { to: "/admin/documents", label: "Documents", Icon: FileText },
  { to: "/admin/team-management", label: "Team", Icon: UserCog },
  { to: "/admin/finance", label: "Finance", Icon: Coins },
  { to: "/admin/growth", label: "Growth", Icon: Rocket },
  { to: "/admin/library", label: "Library", Icon: Library },
  { to: "/admin/settings", label: "Settings", Icon: Settings },
];

// Dark sidebar palette overrides — override the shadcn sidebar tokens locally
// so the panel reads as a deep navy regardless of app light/dark mode.
const darkPalette = {
  "--sidebar": "var(--brand-navy-deep)",
  "--sidebar-foreground": "oklch(0.96 0.012 85)",
  "--sidebar-border": "oklch(1 0 0 / 8%)",
  "--sidebar-accent": "oklch(1 0 0 / 6%)",
  "--sidebar-accent-foreground": "oklch(0.98 0.012 85)",
  "--sidebar-ring": "var(--brand-gold)",
} as React.CSSProperties;

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { user, roles } = useAuth();
  const isActive = (to: string) =>
    to === "/admin" ? path === "/admin" : path === to || path.startsWith(to + "/");

  const { data: openInsights = 0 } = useQuery({
    queryKey: ["admin-sidebar-insights"],
    queryFn: async () => {
      const { count } = await supabase
        .from("ai_insights")
        .select("id", { count: "exact", head: true })
        .eq("resolved", false);
      return count ?? 0;
    },
  });

  const initials = (user?.email ?? "A").slice(0, 1).toUpperCase();
  const role = roles.includes("admin") ? "Administrator" : (roles[0] ?? "Member");

  return (
    <Sidebar
      collapsible="icon"
      style={
        {
          ...darkPalette,
          "--sidebar-top": "var(--portal-nav-height)",
        } as React.CSSProperties
      }
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3 px-2 py-3">
          <div className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-brand-gold text-brand-navy font-serif text-base font-bold">
            S
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-serif text-sm font-semibold text-sidebar-foreground">
                SautiApex
              </div>
              <div className="text-[9px] tracking-[0.18em] uppercase text-sidebar-foreground/55">
                Amplifying the Voice of Business
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
                const active = isActive(it.to);
                const showBadge = it.to === "/admin/ai-insights" && openInsights > 0;
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
                        {showBadge && !collapsed && (
                          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 text-[10px] font-semibold text-brand-navy">
                            {openInsights}
                          </span>
                        )}
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
          <div className="px-2 py-3">
            <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-sidebar-foreground/45 mb-2">
              Signed in
            </div>
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center h-9 w-9 shrink-0 rounded-full bg-brand-gold text-brand-navy font-semibold text-sm">
                {initials}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.email?.split("@")[0] ?? "Admin"}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/55">
                  {role}
                </div>
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
