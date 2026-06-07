import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/retainers")({
  component: () => (
    <EntityListPage
      title="Retainers"
      table="retainers"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "monthly_fee", label: "Monthly fee", type: "number", required: true },
        { key: "start_date", label: "Start", type: "date", required: true },
        { key: "end_date", label: "End", type: "date" },
      ]}
      columns={[
        { key: "client_id", label: "Client" },
        { key: "monthly_fee", label: "Monthly" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
