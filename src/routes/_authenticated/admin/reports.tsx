import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/reports")({
  component: () => (
    <EntityListPage
      title="Reports"
      table="reports"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "title", label: "Title", required: true },
        { key: "report_type", label: "Type", required: true },
        { key: "period", label: "Period (e.g. 2026-Q1)" },
        { key: "summary", label: "Summary", type: "textarea" },
        { key: "file_url", label: "File URL" },
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "report_type", label: "Type" },
        { key: "period", label: "Period" },
        { key: "created_at", label: "Created" },
      ]}
    />
  ),
});
