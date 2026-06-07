import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
import { HubTabs } from "@/components/admin/HubTabs";

export const Route = createFileRoute("/_authenticated/admin/finance")({ component: FinanceHub });

function FinanceHub() {
  return (
    <HubTabs
      defaultValue="invoices"
      tabs={[
        {
          value: "invoices",
          label: "Invoices",
          content: (
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
        },
        {
          value: "expenses",
          label: "Expenses",
          content: (
            <EntityListPage
              title="Expenses"
              table="expenses"
              fields={[
                { key: "description", label: "Description", required: true },
                { key: "amount", label: "Amount", type: "number", required: true },
                { key: "category", label: "Category" },
                { key: "expense_date", label: "Date", type: "date" },
                { key: "project_id", label: "Project ID" },
              ]}
              columns={[
                { key: "expense_date", label: "Date" },
                { key: "description", label: "Description" },
                { key: "amount", label: "Amount" },
                { key: "category", label: "Category" },
              ]}
            />
          ),
        },
        {
          value: "retainers",
          label: "Retainers",
          content: (
            <EntityListPage
              title="Retainers"
              table="retainers"
              fields={[
                { key: "client_id", label: "Client ID", required: true },
                { key: "monthly_fee", label: "Monthly fee", type: "number", required: true },
                { key: "start_date", label: "Start", type: "date", required: true },
                { key: "end_date", label: "End", type: "date" },
              ]}
              columns={[
                { key: "client_id", label: "Client" },
                { key: "monthly_fee", label: "Monthly" },
                { key: "status", label: "Status" },
              ]}
            />
          ),
        },
      ]}
    />
  );
}
