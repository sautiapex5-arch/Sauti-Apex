import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type RoleRow = { role: string; user_id?: string };

const arrayOfText = z.array(z.string().trim().max(120)).max(30).default([]);

const AppraisalSchema = z.object({
  request_type: z.enum(["account_onboarding", "new_project"]).default("account_onboarding"),
  project_name: z.string().trim().max(160).optional().or(z.literal("")),
  full_name: z.string().trim().min(1).max(160),
  company_name: z.string().trim().max(180).optional().or(z.literal("")),
  contact_person: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  email: z.string().trim().email().max(255),
  physical_address: z.string().trim().max(255).optional().or(z.literal("")),
  industry: z.string().trim().max(120).optional().or(z.literal("")),
  nature_of_business: z.string().trim().max(500).optional().or(z.literal("")),
  years_in_operation: z.number().int().min(0).max(300).nullable().optional(),
  employee_count: z.number().int().min(0).max(1000000).nullable().optional(),
  website_links: z.string().trim().max(500).optional().or(z.literal("")),
  is_registered: z.boolean().nullable().optional(),
  business_structure: z.string().trim().max(80).optional().or(z.literal("")),
  compliance_items: arrayOfText,
  challenges: z.string().trim().max(1500).optional().or(z.literal("")),
  urgent_intervention: z.string().trim().max(1000).optional().or(z.literal("")),
  operational_gaps: z.string().trim().max(1000).optional().or(z.literal("")),
  missing_systems: z.string().trim().max(1000).optional().or(z.literal("")),
  pain_points: arrayOfText,
  short_term_goals: z.string().trim().max(1000).optional().or(z.literal("")),
  long_term_goals: z.string().trim().max(1000).optional().or(z.literal("")),
  objectives: arrayOfText,
  current_systems: arrayOfText,
  required_systems: arrayOfText,
  planning_expansion: z.boolean().nullable().optional(),
  seeking_funding: z.boolean().nullable().optional(),
  tender_experience: z.boolean().nullable().optional(),
  opportunity_interests: arrayOfText,
  expected_outcomes: z.string().trim().max(1500).optional().or(z.literal("")),
  engagement_model: z.string().trim().max(120).optional().or(z.literal("")),
  preferred_budget_range: z.string().trim().max(80).optional().or(z.literal("")),
});

const PublicIntakeSchema = z.object({
  entity_type: z.string().trim().max(80),
  display_name: z.string().trim().min(1).max(120),
  contact_email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  sector: z.string().trim().max(80).optional().or(z.literal("")),
  stage: z.string().trim().max(40).optional().or(z.literal("")),
  engagement_areas: z.array(z.string().max(120)).min(1).max(20),
  pressure_points: z.array(z.string().max(120)).max(20).default([]),
  confidentiality_level: z.string().trim().max(40),
  preferred_channel: z.string().trim().max(40),
  contact_window: z.string().trim().max(120).optional().or(z.literal("")),
  abstract_note: z.string().trim().max(500).optional().or(z.literal("")),
});

function clean<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v])) as T;
}

function priceRecommendation(data: z.infer<typeof AppraisalSchema>) {
  const terms = [
    ...data.objectives,
    ...data.required_systems,
    ...data.opportunity_interests,
    data.challenges ?? "",
    data.urgent_intervention ?? "",
  ]
    .join(" ")
    .toLowerCase();
  if (
    data.seeking_funding ||
    data.planning_expansion ||
    /tender|fund|investment|expansion|procurement|supplier/.test(terms)
  ) {
    return {
      recommended_package: "Scalability, Expansion & Investment Readiness",
      estimated_price_range: "Ksh 250,000 – 5,000,000+",
      pricing_notes:
        "Recommended from the Growth & Expansion structure: final pricing depends on project size, tender/funding complexity, institutional scope, systems requirements, and consultancy duration.",
    };
  }
  if (
    /automation|crm|dashboard|erp|workflow|systems|inventory|attendance|operational|sop|reporting/.test(
      terms,
    ) ||
    data.current_systems.length > 0
  ) {
    return {
      recommended_package: "Operational Modernization & Systems Transformation",
      estimated_price_range: "Ksh 150,000 – 3,500,000+",
      pricing_notes:
        "Recommended from the Structure & Automation package: final pricing depends on system complexity, departments, automation requirements, staff size, data migration, custom software, and duration.",
    };
  }
  return {
    recommended_package: "Startup & Business Formalization",
    estimated_price_range: "Ksh 45,000 – 350,000",
    pricing_notes:
      "Recommended from the Foundation package: final pricing depends on scope, deliverables, compliance needs, branding requirements, and website functionality.",
  };
}

async function ensureClientForUser(
  userId: string,
  email: string,
  displayName: string,
  admin: SupabaseClient<Database>,
) {
  await admin
    .from("profiles")
    .upsert({ id: userId, display_name: displayName, contact_email: email }, { onConflict: "id" });
  await admin
    .from("user_roles")
    .upsert({ user_id: userId, role: "client" }, { onConflict: "user_id,role" });

  const { data: existingClient } = await admin
    .from("clients")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  const clientId =
    existingClient?.id ??
    (
      await admin
        .from("clients")
        .insert({
          company_name: displayName || email.split("@")[0],
          contact_person: displayName || null,
          email,
          status: "active",
          created_by: userId,
        })
        .select("id")
        .single()
    ).data?.id;
  if (clientId) {
    const { data: relation } = await admin
      .from("client_users")
      .select("id")
      .eq("client_id", clientId)
      .eq("user_id", userId)
      .maybeSingle();
    if (!relation)
      await admin
        .from("client_users")
        .insert({ client_id: clientId, user_id: userId, is_primary: true });
  }
  return clientId as string | undefined;
}

export const ensureClientOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const staffRoles = new Set([
      "admin",
      "super_admin",
      "ceo",
      "team",
      "consultant",
      "ops_manager",
      "project_manager",
      "hr_officer",
      "finance_officer",
    ]);
    if (((roles ?? []) as RoleRow[]).some((r) => staffRoles.has(r.role)))
      return { onboardingRequired: false, isStaff: true };

    const claims = context.claims as {
      email?: string;
      name?: string;
      user_metadata?: { display_name?: string };
    };
    const email = String(claims.email ?? "");
    const displayName = String(
      claims.user_metadata?.display_name ?? claims.name ?? email.split("@")[0] ?? "Client",
    );
    const clientId = await ensureClientForUser(context.userId, email, displayName, supabaseAdmin);
    const { count } = await supabaseAdmin
      .from("client_appraisals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", context.userId)
      .eq("request_type", "account_onboarding");
    return { onboardingRequired: (count ?? 0) === 0, isStaff: false, clientId, email, displayName };
  });

export const registerSignupClient = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email().max(255),
        display_name: z.string().trim().min(1).max(120),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existing } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (!existing)
      await supabaseAdmin.from("clients").insert({
        company_name: data.display_name,
        contact_person: data.display_name,
        email: data.email,
        status: "account_created",
      });
    await supabaseAdmin.from("leads").insert({
      name: data.display_name,
      email: data.email,
      company: data.display_name,
      source: "email_signup",
      status: "account_created",
      notes:
        "Client created an email/password portal account and must complete the appraisal intake after login.",
    });
    return { ok: true };
  });

export const submitPublicIntake = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PublicIntakeSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const notes = [
      `Entity type: ${data.entity_type}`,
      data.country || data.city
        ? `Location: ${[data.city, data.country].filter(Boolean).join(", ")}`
        : null,
      data.sector ? `Sector: ${data.sector}` : null,
      data.stage ? `Stage: ${data.stage}` : null,
      `Focus areas: ${data.engagement_areas.join(", ")}`,
      data.pressure_points.length ? `Pressure points: ${data.pressure_points.join(", ")}` : null,
      `Confidentiality: ${data.confidentiality_level}`,
      `Preferred contact: ${data.preferred_channel}${data.contact_window ? ` (${data.contact_window})` : ""}`,
      data.abstract_note ? `\nBrief note: ${data.abstract_note}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    await supabaseAdmin.from("leads").insert({
      name: data.display_name,
      email: data.contact_email,
      phone: data.phone || null,
      company: data.entity_type === "individual" ? null : data.display_name,
      source: "website_intake",
      status: "new",
      notes,
    });
    const { data: existing } = await supabaseAdmin
      .from("clients")
      .select("id")
      .eq("email", data.contact_email)
      .maybeSingle();
    if (!existing)
      await supabaseAdmin.from("clients").insert({
        company_name: data.display_name,
        contact_person: data.display_name,
        email: data.contact_email,
        phone: data.phone || null,
        industry: data.sector || null,
        physical_address: [data.city, data.country].filter(Boolean).join(", ") || null,
        business_type: data.entity_type,
        status: "intake_submitted",
      });
    return { ok: true };
  });

export const submitClientAppraisal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AppraisalSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const clientId = await ensureClientForUser(
      context.userId,
      data.email,
      data.company_name || data.full_name,
      supabaseAdmin,
    );
    const recommendation = priceRecommendation(data);
    const { data: row, error } = await supabaseAdmin
      .from("client_appraisals")
      .insert(
        clean({
          ...data,
          ...recommendation,
          user_id: context.userId,
          client_id: clientId,
          status: "submitted",
        }),
      )
      .select("id")
      .single();
    if (error) throw error;
    if (clientId)
      await supabaseAdmin
        .from("clients")
        .update(
          clean({
            company_name: data.company_name || data.full_name,
            contact_person: data.contact_person || data.full_name,
            email: data.email,
            phone: data.phone,
            industry: data.industry,
            physical_address: data.physical_address,
            business_type: data.nature_of_business,
            years_in_operation: data.years_in_operation,
            employee_count: data.employee_count,
            website: data.website_links,
            status: "appraisal_submitted",
          }),
        )
        .eq("id", clientId);
    const { data: reviewers } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", ["admin", "super_admin", "ceo"]);
    if (reviewers?.length)
      await supabaseAdmin.from("notifications").insert(
        ((reviewers ?? []) as Required<RoleRow>[]).map((r) => ({
          user_id: r.user_id,
          title: "New client appraisal",
          message: `${data.company_name || data.full_name} submitted a pricing appraisal for ${recommendation.recommended_package}.`,
          notification_type: "appraisal",
          link: "/admin/appraisals",
        })),
      );
    return { id: row?.id, ...recommendation };
  });

export const reviewClientAppraisal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        admin_notes: z.string().trim().max(1000).optional().or(z.literal("")),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!((roles ?? []) as RoleRow[]).some((r) => ["admin", "super_admin", "ceo"].includes(r.role)))
      throw new Error("Only admin or CEO can review appraisals.");
    const { data: appraisal, error: loadError } = await supabaseAdmin
      .from("client_appraisals")
      .select("*")
      .eq("id", data.id)
      .single();
    if (loadError) throw loadError;
    let projectId = appraisal.project_id;
    const isFreshApproval = data.decision === "approved" && appraisal.status !== "approved";
    if (data.decision === "approved" && appraisal.client_id && !projectId) {
      const { data: project, error } = await supabaseAdmin
        .from("projects")
        .insert({
          client_id: appraisal.client_id,
          project_name:
            appraisal.project_name ||
            `${appraisal.company_name || appraisal.full_name} Transformation`,
          description:
            appraisal.expected_outcomes || appraisal.challenges || appraisal.pricing_notes,
          status: "planning",
          progress_percent: 0,
          estimated_duration_days: 30,
          manager_id: context.userId,
        })
        .select("id")
        .single();
      if (error) throw error;
      projectId = project?.id;
    }

    // Auto-generate a quotation (proposal record + an invoice the client can see)
    let quotationId: string | undefined;
    if (isFreshApproval && appraisal.client_id) {
      const rangeStr = String(appraisal.estimated_price_range ?? "");
      const digits = rangeStr.replace(/[,\s]/g, "").match(/\d+/);
      const amount = digits ? Number(digits[0]) : 0;
      const vat = Math.round(amount * 0.16);
      const total = amount + vat;
      const quoteTitle = `Quotation — ${
        appraisal.recommended_package ||
        appraisal.project_name ||
        appraisal.company_name ||
        "Engagement"
      }`;
      await supabaseAdmin.from("proposals").insert({
        client_id: appraisal.client_id,
        title: quoteTitle,
        amount: total,
        currency: "KES",
        status: "sent",
        created_by: context.userId,
      });
      const { data: invoice } = await supabaseAdmin
        .from("invoices")
        .insert({
          client_id: appraisal.client_id,
          project_id: projectId,
          amount,
          vat,
          total,
          currency: "KES",
          status: "quotation",
          due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        })
        .select("id")
        .single();
      quotationId = invoice?.id;
    }

    const { error } = await supabaseAdmin
      .from("client_appraisals")
      .update({
        status: data.decision,
        admin_notes: data.admin_notes || null,
        reviewed_by: context.userId,
        reviewed_at: new Date().toISOString(),
        project_id: projectId,
      })
      .eq("id", data.id);
    if (error) throw error;
    await supabaseAdmin.from("notifications").insert({
      user_id: appraisal.user_id,
      title:
        data.decision === "approved"
          ? "Appraisal approved — quotation ready"
          : "Appraisal reviewed",
      message:
        data.decision === "approved"
          ? "Your SautiApex appraisal was approved. A quotation has been prepared — view it under Invoices."
          : "Your SautiApex appraisal was reviewed. The team will follow up with next steps.",
      notification_type: "appraisal",
      link: data.decision === "approved" ? "/dashboard/invoices" : "/dashboard/projects",
    });
    return { ok: true, projectId, quotationId };
  });
