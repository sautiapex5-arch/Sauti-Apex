import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
export const Route = createFileRoute("/_authenticated/admin/proposals")({
  component: () => (
    <EntityListPage
      title="Proposals"
      table="proposals"
      fields={[
        { key: "client_id", label: "Client ID", required: true },
        { key: "title", label: "Title", required: true },
        { key: "proposal_no", label: "Proposal #" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "currency", label: "Currency" },
      ]}
      columns={[
        { key: "proposal_no", label: "#" },
        { key: "title", label: "Title" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
      ]}
    />
  ),
});
