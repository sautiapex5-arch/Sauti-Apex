import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { submitClientAppraisal } from "@/lib/onboarding.functions";

const businessStructures = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Company",
  "NGO/CBO",
  "SACCO",
  "Cooperative",
  "Other",
];
const complianceItems = [
  "KRA PIN",
  "Tax Compliance Certificate",
  "Business Permit",
  "AGPO Certificate",
  "VAT Registration",
  "NSSF",
  "SHA/NHIF",
  "Company CR12",
  "Memorandum & Articles",
  "Company Profile",
  "Logo & Branding",
  "Operational Policies",
  "HR Structure",
  "Accounting Systems",
];
const painPoints = [
  "Operational disorder",
  "Financial leakages",
  "Weak coordination",
  "Low sales",
  "Poor structure",
  "Employee conflict",
  "Weak reporting systems",
  "Poor branding",
  "Tendering challenges",
  "Compliance issues",
  "Scaling difficulties",
  "Leadership instability",
];
const objectives = [
  "Startup support",
  "Business formalization",
  "Operational modernization",
  "Automation",
  "Branding",
  "Funding readiness",
  "Tender readiness",
  "Scaling & expansion",
  "Investment structuring",
  "Governance systems",
  "Strategic advisory",
];
const currentSystems = [
  "Manual records",
  "Excel systems",
  "POS systems",
  "ERP systems",
  "CRM systems",
  "Attendance systems",
  "Financial systems",
  "Inventory systems",
  "Websites",
];
const requiredSystems = [
  "Website development",
  "Automation systems",
  "Reporting systems",
  "Dashboard systems",
  "Customer management systems",
  "Workflow systems",
  "Business intelligence systems",
];
const opportunityInterests = [
  "Government tenders",
  "NGO opportunities",
  "County opportunities",
  "Supplier contracts",
  "Strategic partnerships",
];
const engagementModels = [
  "One-time project",
  "Retainer consultancy",
  "Long-term strategic partnership",
  "Operational support",
  "Full systems transformation",
];
const budgetRanges = [
  "Under Ksh 50,000",
  "Ksh 50,000 – 150,000",
  "Ksh 150,000 – 500,000",
  "Above Ksh 500,000",
];

type AppraisalFormState = {
  request_type: "account_onboarding" | "new_project";
  project_name: string;
  full_name: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  physical_address: string;
  industry: string;
  nature_of_business: string;
  years_in_operation: number | null;
  employee_count: number | null;
  website_links: string;
  is_registered: boolean | null;
  business_structure: string;
  compliance_items: string[];
  challenges: string;
  urgent_intervention: string;
  operational_gaps: string;
  missing_systems: string;
  pain_points: string[];
  short_term_goals: string;
  long_term_goals: string;
  objectives: string[];
  current_systems: string[];
  required_systems: string[];
  planning_expansion: boolean | null;
  seeking_funding: boolean | null;
  tender_experience: boolean | null;
  opportunity_interests: string[];
  expected_outcomes: string;
  engagement_model: string;
  preferred_budget_range: string;
};

type Props = {
  defaultEmail?: string;
  defaultName?: string;
  requestType?: "account_onboarding" | "new_project";
  compact?: boolean;
  onSubmitted?: () => void;
};

export function AppraisalForm({
  defaultEmail = "",
  defaultName = "",
  requestType = "account_onboarding",
  compact = false,
  onSubmitted,
}: Props) {
  const submit = useServerFn(submitClientAppraisal);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{
    recommended_package: string;
    estimated_price_range: string;
  } | null>(null);
  const [form, setForm] = useState<AppraisalFormState>({
    request_type: requestType,
    project_name: "",
    full_name: defaultName,
    company_name: "",
    contact_person: defaultName,
    phone: "",
    email: defaultEmail,
    physical_address: "",
    industry: "",
    nature_of_business: "",
    years_in_operation: null,
    employee_count: null,
    website_links: "",
    is_registered: null,
    business_structure: "",
    compliance_items: [],
    challenges: "",
    urgent_intervention: "",
    operational_gaps: "",
    missing_systems: "",
    pain_points: [],
    short_term_goals: "",
    long_term_goals: "",
    objectives: [],
    current_systems: [],
    required_systems: [],
    planning_expansion: null,
    seeking_funding: null,
    tender_experience: null,
    opportunity_interests: [],
    expected_outcomes: "",
    engagement_model: "",
    preferred_budget_range: "",
  });

  const set = <K extends keyof AppraisalFormState>(key: K, value: AppraisalFormState[K]) =>
    setForm((state) => ({ ...state, [key]: value }));

  const toggle = (
    key:
      | "compliance_items"
      | "pain_points"
      | "objectives"
      | "current_systems"
      | "required_systems"
      | "opportunity_interests",
    value: string,
  ) => {
    setForm((state) => ({
      ...state,
      [key]: state[key].includes(value)
        ? state[key].filter((item) => item !== value)
        : [...state[key], value],
    }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.full_name.trim() || !form.email.trim())
      return toast.error("Name and email are required.");
    if (form.request_type === "new_project" && !form.project_name.trim()) {
      return toast.error("Project name is required.");
    }
    setSaving(true);
    try {
      const response = await submit({ data: form });
      setResult(response);
      toast.success("Appraisal submitted for admin review.");
      onSubmitted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit appraisal.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact ? "space-y-6" : "rounded-xl border border-border bg-card p-5 md:p-6 space-y-6"
      }
    >
      <div>
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-gold-deep">
          SautiApex client appraisal
        </div>
        <h2 className="mt-1 font-serif text-2xl text-brand-navy">
          Pricing & engagement assessment
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Crafted from the official SautiApex pricing and client assessment document.
        </p>
      </div>

      {form.request_type === "new_project" && (
        <Field
          label="Project name"
          value={form.project_name}
          onChange={(value) => set("project_name", value)}
          required
        />
      )}

      <Grid>
        <Field
          label="Full name / company name"
          value={form.full_name}
          onChange={(value) => set("full_name", value)}
          required
        />
        <Field
          label="Contact person"
          value={form.contact_person}
          onChange={(value) => set("contact_person", value)}
        />
        <Field
          label="Email address"
          value={form.email}
          onChange={(value) => set("email", value)}
          required
        />
        <Field label="Phone number" value={form.phone} onChange={(value) => set("phone", value)} />
        <Field
          label="Company name"
          value={form.company_name}
          onChange={(value) => set("company_name", value)}
        />
        <Field
          label="Industry / sector"
          value={form.industry}
          onChange={(value) => set("industry", value)}
        />
        <Field
          label="Physical address"
          value={form.physical_address}
          onChange={(value) => set("physical_address", value)}
        />
        <Field
          label="Social media / website links"
          value={form.website_links}
          onChange={(value) => set("website_links", value)}
        />
        <Field
          label="Years in operation"
          type="number"
          value={form.years_in_operation ?? ""}
          onChange={(value) => set("years_in_operation", value === "" ? null : Number(value))}
        />
        <Field
          label="Number of employees"
          type="number"
          value={form.employee_count ?? ""}
          onChange={(value) => set("employee_count", value === "" ? null : Number(value))}
        />
      </Grid>

      <Textarea
        label="Nature of business"
        value={form.nature_of_business}
        onChange={(value) => set("nature_of_business", value)}
      />
      <Bool
        label="Is the business registered?"
        value={form.is_registered}
        onChange={(value) => set("is_registered", value)}
      />
      <Select
        label="Business structure"
        value={form.business_structure}
        onChange={(value) => set("business_structure", value)}
        options={businessStructures}
      />
      <ChipGroup
        label="Current compliance and business assets"
        options={complianceItems}
        selected={form.compliance_items}
        onToggle={(value) => toggle("compliance_items", value)}
      />

      <Grid>
        <Textarea
          label="Major challenges"
          value={form.challenges}
          onChange={(value) => set("challenges", value)}
        />
        <Textarea
          label="Urgent intervention areas"
          value={form.urgent_intervention}
          onChange={(value) => set("urgent_intervention", value)}
        />
        <Textarea
          label="Operational gaps"
          value={form.operational_gaps}
          onChange={(value) => set("operational_gaps", value)}
        />
        <Textarea
          label="Missing systems"
          value={form.missing_systems}
          onChange={(value) => set("missing_systems", value)}
        />
      </Grid>
      <ChipGroup
        label="Business pressure points"
        options={painPoints}
        selected={form.pain_points}
        onToggle={(value) => toggle("pain_points", value)}
      />

      <Grid>
        <Textarea
          label="Short-term goals"
          value={form.short_term_goals}
          onChange={(value) => set("short_term_goals", value)}
        />
        <Textarea
          label="Long-term goals"
          value={form.long_term_goals}
          onChange={(value) => set("long_term_goals", value)}
        />
      </Grid>
      <ChipGroup
        label="Objectives"
        options={objectives}
        selected={form.objectives}
        onToggle={(value) => toggle("objectives", value)}
      />
      <ChipGroup
        label="Current systems"
        options={currentSystems}
        selected={form.current_systems}
        onToggle={(value) => toggle("current_systems", value)}
      />
      <ChipGroup
        label="Required systems"
        options={requiredSystems}
        selected={form.required_systems}
        onToggle={(value) => toggle("required_systems", value)}
      />

      <Grid>
        <Bool
          label="Planning expansion?"
          value={form.planning_expansion}
          onChange={(value) => set("planning_expansion", value)}
        />
        <Bool
          label="Seeking funding/investment?"
          value={form.seeking_funding}
          onChange={(value) => set("seeking_funding", value)}
        />
        <Bool
          label="Applied for tenders before?"
          value={form.tender_experience}
          onChange={(value) => set("tender_experience", value)}
        />
        <Select
          label="Preferred budget range"
          value={form.preferred_budget_range}
          onChange={(value) => set("preferred_budget_range", value)}
          options={budgetRanges}
        />
      </Grid>
      <ChipGroup
        label="Opportunity interests"
        options={opportunityInterests}
        selected={form.opportunity_interests}
        onToggle={(value) => toggle("opportunity_interests", value)}
      />
      <Select
        label="Preferred engagement model"
        value={form.engagement_model}
        onChange={(value) => set("engagement_model", value)}
        options={engagementModels}
      />
      <Textarea
        label="Expected outcomes from SautiApex"
        value={form.expected_outcomes}
        onChange={(value) => set("expected_outcomes", value)}
      />

      {result && (
        <div className="rounded-lg border border-brand-gold/40 bg-brand-cream/40 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-gold-deep">
            Estimated pricing
          </div>
          <div className="mt-1 font-serif text-xl text-brand-navy">
            {result.recommended_package}
          </div>
          <p className="text-sm text-muted-foreground">{result.estimated_price_range}</p>
        </div>
      )}

      <button
        disabled={saving}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-cream hover:bg-brand-navy-deep transition disabled:opacity-50"
      >
        <Send size={14} /> {saving ? "Submitting…" : "Submit appraisal"}
      </button>
    </form>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
      {required && <span className="text-destructive"> *</span>}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm normal-case tracking-normal text-foreground"
      >
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Bool({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="flex gap-2">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-md border px-4 py-2 text-sm ${
              value === option
                ? "bg-brand-navy text-brand-cream border-brand-navy"
                : "bg-background text-foreground border-border"
            }`}
          >
            {option ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selected.includes(option)
                ? "bg-brand-navy text-brand-cream border-brand-navy"
                : "bg-background text-foreground/80 border-border hover:border-brand-gold"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
