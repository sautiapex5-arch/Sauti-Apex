import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
import { HubTabs } from "@/components/admin/HubTabs";

export const Route = createFileRoute("/_authenticated/admin/growth")({ component: GrowthHub });

function GrowthHub() {
  return (
    <HubTabs
      defaultValue="tenders"
      tabs={[
        {
          value: "tenders",
          label: "Tenders",
          content: (
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
        },
        {
          value: "investments",
          label: "Investments",
          content: (
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
        },
        {
          value: "compliance",
          label: "Compliance",
          content: (
            <EntityListPage
              title="Compliance Items (catalog)"
              table="compliance_items"
              fields={[
                { key: "name", label: "Name", required: true },
                { key: "category", label: "Category" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "order_index", label: "Order", type: "number" },
              ]}
              columns={[
                { key: "name", label: "Name" },
                { key: "category", label: "Category" },
                { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
              ]}
              orderBy="order_index"
            />
          ),
        },
      ]}
    />
  );
}
