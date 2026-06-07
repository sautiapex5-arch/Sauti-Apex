import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves a document's stored reference into a usable URL.
 * - Full http(s) URLs are returned as-is.
 * - Anything else is treated as a path inside the private `documents` bucket
 *   and turned into a short-lived signed URL.
 */
export async function resolveDocumentUrl(fileUrl?: string | null): Promise<string | null> {
  if (!fileUrl) return null;
  if (/^https?:\/\//i.test(fileUrl)) return fileUrl;
  const { data } = await supabase.storage.from("documents").createSignedUrl(fileUrl, 3600);
  return data?.signedUrl ?? null;
}

/** Uploads a file into the documents bucket and returns its storage path. */
export async function uploadProjectFile(projectId: string, file: File): Promise<string> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${projectId}/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("documents").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}
