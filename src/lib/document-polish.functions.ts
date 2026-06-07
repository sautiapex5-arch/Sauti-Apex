import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { runGroqChatCompletion } from "@/lib/groq-ai.server";

type RoleRow = { role: string };

const staffRoles = new Set([
  "admin",
  "super_admin",
  "ceo",
  "consultant",
  "ops_manager",
  "project_manager",
  "hr_officer",
  "finance_officer",
  "team",
]);

async function requireStaff(context: { supabase: any; userId: string }, message: string) {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const allowed = ((roles ?? []) as RoleRow[]).some((row) => staffRoles.has(row.role));
  if (!allowed) throw new Error(message);
}

export const polishDocumentText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { text: string; title?: string; tone?: string }) => {
    if (!input || typeof input.text !== "string") {
      throw new Error("Text is required");
    }
    const text = input.text.slice(0, 20000);
    if (text.trim().length < 20)
      throw new Error("Provide at least 20 characters of text to polish.");
    return {
      text,
      title: (input.title ?? "").slice(0, 200),
      tone: (input.tone ?? "professional, authoritative, warm").slice(0, 100),
    };
  })
  .handler(async ({ data, context }) => {
    await requireStaff(context, "Only staff can polish documents.");

    const systemPrompt = `You are an expert editor for SautiApex Capital Ventures Ltd, a strategic consultancy "transforming chaos into structure" for businesses across Africa. Polish the user's document so it is:
- Professional, authentic, and aligned with the SautiApex brand voice (${data.tone}).
- Clear, concise, well-structured (use short paragraphs, headings where helpful).
- Free of grammar, spelling and tone issues.
- Truthful; never invent facts, figures, names or dates that are not present.
- Markdown-formatted output. Preserve all meaningful content and intent.
Return ONLY the polished document text in Markdown, no preface, no commentary.`;

    const polished = await runGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Title: ${data.title || "(untitled)"}\n\nDocument:\n${data.text}`,
        },
      ],
      maxTokens: 3000,
    });
    return { polished };
  });

export const brandDocumentText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { text: string; title?: string; docType?: string }) => {
    if (!input || typeof input.text !== "string") throw new Error("Text is required");
    const text = input.text.slice(0, 20000);
    if (text.trim().length < 20)
      throw new Error("Provide at least 20 characters of text to rebrand.");
    return {
      text,
      title: (input.title ?? "").slice(0, 200),
      docType: (input.docType ?? "official document").slice(0, 80),
    };
  })
  .handler(async ({ data, context }) => {
    await requireStaff(context, "Only staff can rebrand documents.");

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const systemPrompt = `You are the document formatting engine for SautiApex Capital Ventures Ltd, a strategic consultancy "transforming chaos into structure" for businesses across Africa.
Take the user's raw content and re-present it as a formal, branded SautiApex ${data.docType} on a company letterhead, in clean Markdown.

Use EXACTLY this structure:
- A letterhead block at the very top:
  # SAUTIAPEX CAPITAL VENTURES LTD
  *Transforming chaos into structure*
  Nairobi, Kenya - info@sautiapex.co.ke
  ---
- Then: **Date:** ${today}
- Then: **Ref:** SAX-DOC-${new Date().getFullYear()}
- Then a clear document title heading.
- Then the body, well-structured with headings, short paragraphs and bullet/numbered lists where helpful.
- End with a professional sign-off block:
  Yours faithfully,
  **The SautiApex Team**
  SautiApex Capital Ventures Ltd

Rules: Extract and preserve ALL meaningful facts, figures, names and dates from the source; never invent new ones. Improve grammar, tone and clarity. Output ONLY the finished Markdown document, no commentary.`;

    const branded = await runGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Document title: ${data.title || "(untitled)"}\n\nRaw content to rebrand:\n${data.text}`,
        },
      ],
      maxTokens: 3500,
    });
    return { branded };
  });
