import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/compliance")({
  component: () => (
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
});
