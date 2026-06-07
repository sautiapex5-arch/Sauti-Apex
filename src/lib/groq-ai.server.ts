const GROQ_CHAT_COMPLETIONS_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type StoredSetting = {
  key: string;
  value: string | null;
};

function clean(value: string | undefined) {
  return value?.trim() || "";
}

async function readStoredGroqSettings() {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await (supabaseAdmin as any)
      .from("app_settings")
      .select("key, value")
      .in("key", ["groq_api_key", "groq_model"]);

    if (error) {
      console.warn("[Groq] Could not load stored AI settings:", error.message);
      return {};
    }

    const rows = (data ?? []) as StoredSetting[];
    return Object.fromEntries(rows.map((row) => [row.key, row.value ?? ""])) as {
      groq_api_key?: string;
      groq_model?: string;
    };
  } catch (error) {
    console.warn("[Groq] Stored AI settings are unavailable:", error);
    return {};
  }
}

export async function getGroqConfig() {
  const stored = await readStoredGroqSettings();
  const apiKey = clean(stored.groq_api_key) || clean(process.env.GROQ_API_KEY);
  const model = clean(stored.groq_model) || clean(process.env.GROQ_MODEL) || DEFAULT_GROQ_MODEL;

  return {
    apiKey,
    model,
    configured: Boolean(apiKey),
    source: clean(stored.groq_api_key) ? "database" : apiKey ? "environment" : "missing",
  };
}

export async function requireGroqConfig() {
  const config = await getGroqConfig();
  if (!config.apiKey) {
    throw new Error(
      "Groq AI is not configured. Admins can tap the admin logo 5 times to add the Groq API key.",
    );
  }
  return config;
}

export async function runGroqChatCompletion({
  messages,
  temperature = 0.35,
  maxTokens = 1800,
}: {
  messages: GroqChatMessage[];
  temperature?: number;
  maxTokens?: number;
}) {
  const { apiKey, model } = await requireGroqConfig();
  const response = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Groq rejected the API key. Update it from the secret admin menu.");
  }
  if (response.status === 429) {
    throw new Error("Groq is rate limiting requests. Please try again in a moment.");
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq AI error: ${response.status} ${text.slice(0, 200)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = json.choices?.[0]?.message?.content;
  const text = typeof content === "string" ? content.trim() : "";
  if (!text) throw new Error("Groq returned no content.");
  return text;
}
