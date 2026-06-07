import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/consultations")({
  component: () => (
    <EntityListPage
      title="Consultations"
      table="consultations"
      fields={[
        { key: "client_id", label: "Client ID (uuid)", required: true },
        { key: "meeting_date", label: "Meeting date", type: "date", required: true },
        {
          key: "meeting_type",
          label: "Type",
          type: "select",
          options: ["discovery", "followup", "review", "strategy"],
        },
        { key: "location", label: "Location" },
        { key: "notes", label: "Notes", type: "textarea" },
      ]}
      columns={[
        { key: "meeting_date", label: "Date" },
        { key: "meeting_type", label: "Type" },
        { key: "status", label: "Status" },
        { key: "location", label: "Location" },
      ]}
    />
  ),
});
