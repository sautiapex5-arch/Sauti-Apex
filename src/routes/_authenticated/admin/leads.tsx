import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: () => (
    <EntityListPage
      title="Leads"
      table="leads"
      orderBy="created_at"
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "source", label: "Source" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
