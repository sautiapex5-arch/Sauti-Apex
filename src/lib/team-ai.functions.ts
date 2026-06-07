import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { runGroqChatCompletion } from "@/lib/groq-ai.server";

type RoleRow = { role: string };

export const polishTeamBio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) =>
    z
      .object({
        full_name: z.string().trim().max(160),
        title: z.string().trim().max(160).optional(),
        bio: z.string().trim().min(10).max(3000),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const allowed = new Set(["admin", "super_admin", "ceo", "hr_officer", "team"]);
    if (!((roles ?? []) as RoleRow[]).some((r) => allowed.has(r.role)))
      throw new Error("Only staff can polish bios.");
    const text = await runGroqChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You polish team bios for SautiApex Capital Ventures Limited. Keep the bio authentic, professional, warm, concise, and credible. Do not invent credentials, degrees, numbers, awards, employers, or facts not provided. Return one polished paragraph only.",
        },
        {
          role: "user",
          content: `Name: ${data.full_name}\nTitle: ${data.title || ""}\nDraft bio: ${data.bio}`,
        },
      ],
      maxTokens: 500,
    });
    return { bio: text.trim() };
  });
