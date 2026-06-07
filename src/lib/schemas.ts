import { z } from "zod";

export const ENTITY_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "informal_group", label: "Informal Group / Cooperative" },
  { value: "registered_company", label: "Registered Company" },
  { value: "company_representative", label: "Representative of a Company" },
  { value: "public_institution", label: "Public Institution / NGO" },
  { value: "other", label: "Other" },
] as const;

export const SECTORS = [
  "Agribusiness",
  "Manufacturing",
  "Logistics & Transport",
  "Real Estate & Construction",
  "Health & Wellness",
  "Education & Training",
  "Energy",
  "Tourism & Hospitality",
  "Financial Services",
  "Technology & Digital",
  "Retail & Trade",
  "Creative & Media",
  "Public Sector",
  "Other",
] as const;

export const ENGAGEMENT_AREAS = [
  "Strategic restructuring",
  "Capital / investment readiness",
  "Tendering & procurement",
  "Systems & automation",
  "Leadership / crisis coaching",
  "Grassroots intelligence",
  "Not sure yet",
] as const;

export const PRESSURE_POINTS = [
  "Workflow is fragmented",
  "Governance is unclear",
  "Cash discipline is weak",
  "Team accountability gaps",
  "Compliance pressure",
  "Growth without structure",
  "Stakeholder conflict",
  "Prefer not to say",
] as const;

export const ENTITY_STAGES = ["Idea", "Early", "Operating", "Restructuring", "Scaling"] as const;

export const intakeSchema = z.object({
  entity_type: z.enum([
    "individual",
    "informal_group",
    "registered_company",
    "company_representative",
    "public_institution",
    "other",
  ]),
  display_name: z.string().trim().min(1, "Required").max(120),
  contact_email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  sector: z.string().trim().max(80).optional().or(z.literal("")),
  stage: z.string().trim().max(40).optional().or(z.literal("")),
  engagement_areas: z.array(z.string()).min(1, "Pick at least one area"),
  pressure_points: z.array(z.string()).default([]),
  confidentiality_level: z.enum(["standard", "elevated", "nda_required"]),
  preferred_channel: z.enum(["email", "phone", "whatsapp", "in_person"]),
  contact_window: z.string().max(120).optional().or(z.literal("")),
  abstract_note: z.string().max(500).optional().or(z.literal("")),
});

export type IntakeData = z.infer<typeof intakeSchema>;

export const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "At least 8 characters").max(72),
  display_name: z.string().trim().min(1).max(120),
});
export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(72),
});

export const STAGES: Array<{
  value:
    | "intake"
    | "diagnosis"
    | "stabilization"
    | "structuring"
    | "modernization"
    | "sustainability"
    | "closed";
  label: string;
}> = [
  { value: "intake", label: "Intake" },
  { value: "diagnosis", label: "Diagnosis" },
  { value: "stabilization", label: "Stabilization" },
  { value: "structuring", label: "Structuring" },
  { value: "modernization", label: "Modernization" },
  { value: "sustainability", label: "Sustainability" },
  { value: "closed", label: "Closed" },
];
