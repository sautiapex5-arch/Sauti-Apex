import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/expenses")({
  component: () => (
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
});
