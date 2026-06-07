import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/tenders")({
  component: () => (
    <EntityListPage
      title="Tenders"
      table="tenders"
      fields={[
        { key: "title", label: "Title", required: true },
        { key: "organization", label: "Organization" },
        { key: "reference_no", label: "Reference #" },
        { key: "value_estimate", label: "Value", type: "number" },
        { key: "closing_date", label: "Closing", type: "date" },
        { key: "client_id", label: "Client ID (optional)" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "organization", label: "Org" },
        { key: "closing_date", label: "Closes" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
