import { createFileRoute } from "@tanstack/react-router";
import { HubTabs } from "@/components/admin/HubTabs";
import { UsersPage } from "./users";
import { NotificationsPage } from "./notifications";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsHub });

function SettingsHub() {
  return (
    <HubTabs
      defaultValue="users"
      tabs={[
        { value: "users", label: "Users & Roles", content: <UsersPage /> },
        { value: "notifications", label: "Notifications", content: <NotificationsPage /> },
      ]}
    />
  );
}
