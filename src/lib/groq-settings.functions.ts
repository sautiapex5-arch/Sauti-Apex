import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getGroqConfig } from "@/lib/groq-ai.server";

type RoleRow = { role: string };

const adminRoles = new Set(["admin", "super_admin", "ceo"]);

async function requireAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  if (error) throw error;
  if (!((roles ?? []) as RoleRow[]).some((row) => adminRoles.has(row.role))) {
    throw new Error("Only admins can update AI settings.");
  }
  return supabaseAdmin as any;
}

export const getGroqAiSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context.userId);
    const config = await getGroqConfig();
    return {
      configured: config.configured,
      source: config.source,
      model: config.model,
    };
  });

export const saveGroqAiSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        apiKey: z.string().trim().max(300).optional().or(z.literal("")),
        model: z
          .string()
          .trim()
          .min(3)
          .max(120)
          .regex(/^[a-zA-Z0-9._:/-]+$/, "Use a valid Groq model id."),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const admin = await requireAdmin(context.userId);
    const apiKey = data.apiKey?.trim() ?? "";
    const existing = await getGroqConfig();

    if (!apiKey && !existing.configured) {
      throw new Error("Enter a Groq API key before saving.");
    }

    const rows = [
      ...(apiKey ? [{ key: "groq_api_key", value: apiKey, updated_by: context.userId }] : []),
      { key: "groq_model", value: data.model.trim(), updated_by: context.userId },
    ];

    const { error } = await admin.from("app_settings").upsert(rows, { onConflict: "key" });
    if (error) throw error;

    const config = await getGroqConfig();
    return {
      configured: config.configured,
      source: config.source,
      model: config.model,
    };
  });
