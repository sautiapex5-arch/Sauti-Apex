import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  LayoutDashboard,
  Users,
  UserCircle,
  Target,
  Phone,
  FileText,
  FileSignature,
  Folder,
  Receipt,
  DollarSign,
  Award,
  ShieldCheck,
  TrendingUp,
  Package,
  BarChart3,
  Bot,
  Bell,
  UserCog,
  ChevronRight,
  ClipboardCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Item = { to: string; label: string; Icon: LucideIcon };
type RecentProject = { id: string; project_name: string | null };

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Pipeline",
    items: [
      { to: "/admin/leads", label: "Leads", Icon: Target },
      { to: "/admin/consultations", label: "Consultations", Icon: Phone },
      { to: "/admin/proposals", label: "Proposals", Icon: FileText },
      { to: "/admin/contracts", label: "Contracts", Icon: FileSignature },
    ],
  },
  {
    label: "Delivery",
    items: [
      { to: "/admin/projects", label: "Projects", Icon: Folder },
      { to: "/admin/clients", label: "Clients", Icon: UserCircle },
      { to: "/admin/appraisals", label: "Appraisals", Icon: ClipboardCheck },
      { to: "/admin/team-management", label: "Team", Icon: UserCog },
      { to: "/admin/packages", label: "Packages", Icon: Package },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/admin/invoices", label: "Invoices", Icon: Receipt },
      { to: "/admin/expenses", label: "Expenses", Icon: DollarSign },
      { to: "/admin/retainers", label: "Retainers", Icon: Award },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/admin/tenders", label: "Tenders", Icon: ShieldCheck },
      { to: "/admin/investments", label: "Investments", Icon: TrendingUp },
      { to: "/admin/compliance", label: "Compliance", Icon: ShieldCheck },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/admin/reports", label: "Reports", Icon: BarChart3 },
      { to: "/admin/ai-insights", label: "AI Insights", Icon: Bot },
      { to: "/admin/notifications", label: "Notifications", Icon: Bell },
      { to: "/admin/documents", label: "Documents", Icon: FileText },
    ],
  },
  {
    label: "System",
    items: [{ to: "/admin/users", label: "Users & Roles", Icon: Users }],
  },
];

export function AdminMenu() {
  const { data: recentProjects = [] } = useQuery({
    queryKey: ["admin-menu-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, project_name")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-brand-navy hover:bg-secondary transition">
        <Menu size={16} /> Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem asChild>
          <Link to="/admin" className="flex items-center gap-2">
            <LayoutDashboard size={14} /> Overview
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <UserCircle size={14} /> Client view
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {groups.map((g) => (
          <DropdownMenuSub key={g.label}>
            <DropdownMenuSubTrigger className="flex items-center justify-between">
              <span>{g.label}</span>
              <ChevronRight size={14} />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56">
              {g.items.map((it) => (
                <DropdownMenuItem key={it.to} asChild>
                  <Link to={it.to} className="flex items-center gap-2">
                    <it.Icon size={14} /> {it.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}

        {recentProjects.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Recent projects
            </DropdownMenuLabel>
            {(recentProjects as RecentProject[]).map((p) => (
              <DropdownMenuItem key={p.id} asChild>
                <Link
                  to="/projects/$id"
                  params={{ id: p.id }}
                  className="flex items-center gap-2 text-xs"
                >
                  <Folder size={13} /> {p.project_name}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
