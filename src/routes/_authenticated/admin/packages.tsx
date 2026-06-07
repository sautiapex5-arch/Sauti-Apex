import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/packages")({
  component: PackagesAdminPage,
});

function PackagesAdminPage() {
  return (
    <div className="space-y-10">
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
      <EntityListPage
        title="Isolated Services"
        table="isolated_services"
        orderBy="order_index"
        fields={[
          { key: "name", label: "Service name", required: true },
          { key: "category", label: "Category", required: true },
          { key: "price_range", label: "Price range" },
          { key: "order_index", label: "Order", type: "number" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
        columns={[
          { key: "name", label: "Service" },
          { key: "category", label: "Category" },
          { key: "price_range", label: "Price" },
          { key: "is_active", label: "Active", render: (r) => (r.is_active ? "Yes" : "No") },
        ]}
        defaults={{ is_active: true }}
      />
    </div>
  );
}
