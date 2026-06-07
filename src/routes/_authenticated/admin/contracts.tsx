import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/contracts")({
  component: () => (
    <EntityListPage
      title="Contracts"
      table="contracts"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "title", label: "Title", required: true },
        { key: "contract_no", label: "Contract #" },
        { key: "value", label: "Value", type: "number" },
        { key: "start_date", label: "Start", type: "date" },
        { key: "end_date", label: "End", type: "date" },
      ]}
      columns={[
        { key: "contract_no", label: "#" },
        { key: "title", label: "Title" },
        { key: "value", label: "Value" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
