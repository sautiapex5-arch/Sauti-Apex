import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/investments")({
  component: () => (
    <EntityListPage
      title="Investment Opportunities"
      table="investment_opportunities"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "required_amount", label: "Required amount", type: "number" },
        { key: "currency", label: "Currency" },
        { key: "purpose", label: "Purpose", type: "textarea" },
      ]}
      columns={[
        { key: "client_id", label: "Client" },
        { key: "required_amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "readiness_score", label: "Readiness" },
      ]}
    />
  ),
});
