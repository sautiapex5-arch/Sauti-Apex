import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
import { HubTabs } from "@/components/admin/HubTabs";

export const Route = createFileRoute("/_authenticated/admin/library")({ component: LibraryHub });

function LibraryHub() {
  return (
    <HubTabs
      defaultValue="packages"
      tabs={[
        {
          value: "packages",
          label: "Packages",
          content: (
            <EntityListPage
              title="Service Packages"
              table="packages"
              fields={[
                { key: "name", label: "Name", required: true },
                { key: "category", label: "Category" },
                { key: "base_price", label: "Base price", type: "number", required: true },
                { key: "currency", label: "Currency" },
                { key: "description", label: "Description", type: "textarea" },
              ]}
              columns={[
                { key: "name", label: "Name" },
                { key: "category", label: "Category" },
                { key: "base_price", label: "Price" },
                { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
              ]}
            />
          ),
        },
        {
          value: "documents",
          label: "Documents",
          content: (
            <EntityListPage
              title="Documents"
              table="documents"
              fields={[
                { key: "file_name", label: "File name", required: true },
                { key: "category", label: "Category", required: true },
                { key: "file_url", label: "File URL", required: true },
                { key: "client_id", label: "Client ID (optional)" },
                { key: "project_id", label: "Project ID (optional)" },
              ]}
              columns={[
                { key: "file_name", label: "File" },
                { key: "category", label: "Category" },
                { key: "uploaded_at", label: "Uploaded" },
              ]}
              orderBy="uploaded_at"
            />
          ),
        },
        {
          value: "reports",
          label: "Reports",
          content: (
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
        },
      ]}
    />
  );
}
