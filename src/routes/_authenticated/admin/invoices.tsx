import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/invoices")({
  component: () => (
    <EntityListPage
      title="Invoices"
      table="invoices"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "invoice_no", label: "Invoice #" },
        { key: "amount", label: "Amount", type: "number", required: true },
        { key: "vat", label: "VAT", type: "number" },
        { key: "total", label: "Total", type: "number" },
        { key: "due_date", label: "Due", type: "date" },
      ]}
      columns={[
        { key: "invoice_no", label: "#" },
        { key: "total", label: "Total" },
        { key: "status", label: "Status" },
        { key: "due_date", label: "Due" },
      ]}
    />
  ),
});
