import { createFileRoute } from "@tanstack/react-router";
import { EntityListPage } from "@/components/admin/EntityListPage";
import { HubTabs } from "@/components/admin/HubTabs";

export const Route = createFileRoute("/_authenticated/admin/pipeline")({ component: PipelineHub });

function PipelineHub() {
  return (
    <HubTabs
      defaultValue="leads"
      tabs={[
        {
          value: "leads",
          label: "Leads",
          content: (
            <EntityListPage
              title="Leads"
              table="leads"
              fields={[
                { key: "name", label: "Name", required: true },
                { key: "company", label: "Company" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "source", label: "Source" },
                { key: "notes", label: "Notes", type: "textarea" },
              ]}
              columns={[
                { key: "name", label: "Name" },
                { key: "company", label: "Company" },
                { key: "status", label: "Status" },
                { key: "source", label: "Source" },
              ]}
            />
          ),
        },
        {
          value: "consultations",
          label: "Consultations",
          content: (
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
        },
        {
          value: "proposals",
          label: "Proposals",
          content: (
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
        },

        {
          value: "contracts",
          label: "Contracts",
          content: (
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
        },
      ]}
    />
  );
}
